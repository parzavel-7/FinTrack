import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: "in_progress" | "reached" | "missed";
  icon: string | null;
  color: string | null;
  user_id: string;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGoals = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching goals",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setGoals(data as Goal[]);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchGoals().finally(() => setLoading(false));

      // Realtime subscription
      const channel = supabase
        .channel('goals-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'goals',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchGoals();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const addGoal = async (goal: Omit<Goal, "id" | "user_id" | "status">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("goals").insert({
      ...goal,
      current_amount: goal.current_amount || 0,
      status: "in_progress",
      user_id: user.id,
    });

    if (error) {
      return { error };
    }

    await fetchGoals();
    return { error: null };
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const { error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id);

    if (error) {
      return { error };
    }

    await fetchGoals();
    return { error: null };
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from("goals").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchGoals();
  };

  const addFundsToGoal = async (id: string, amount: number) => {
    const goal = goals.find((g) => g.id === id); // Updated to use .id
    if (!goal) return { error: new Error("Goal not found") };

    const newAmount = Number(goal.current_amount) + amount;
    return updateGoal(id, { current_amount: newAmount });
  };

  const getTotals = () => {
    const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
    const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
    return { totalSaved, totalTarget };
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addFundsToGoal, // Included in return
    getTotals,      // Included in return
    refetch: fetchGoals,
  };
}
