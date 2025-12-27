import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string;
  created_at: string;
  category_id: string | null;
  category?: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  type: "income" | "expense";
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        category:categories(id, name, icon, color)
      `)
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTransactions(data as Transaction[]);
  };

  const fetchCategories = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCategories(data as Category[]);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchTransactions(), fetchCategories()]).finally(() => {
        setLoading(false);
      });

      // Realtime subscription
      const channel = supabase
        .channel('transactions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Realtime change received!', payload);
            fetchTransactions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const addTransaction = async (transaction: {
    amount: number;
    type: "income" | "expense";
    category_id: string;
    date: string;
    description?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("transactions").insert({
      ...transaction,
      user_id: user.id,
    });

    if (error) {
      return { error };
    }

    await fetchTransactions();
    return { error: null };
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting transaction",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchTransactions();
  };

  const getTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return { income, expenses, savings: income - expenses };
  };

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    deleteTransaction,
    getTotals,
    refetch: fetchTransactions,
  };
}
