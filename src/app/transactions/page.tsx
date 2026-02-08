"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Film,
  Briefcase,
  Car,
  Zap,
  Heart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/components/AppLayout";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useProfile } from "@/hooks/useProfile";
import { formatCurrency } from "@/lib/utils";

const categoryIcons: Record<string, any> = {
  Shopping: ShoppingCart,
  Entertainment: Film,
  Salary: Briefcase,
  Freelance: Briefcase,
  Transportation: Car,
  "Bills & Utilities": Zap,
  Healthcare: Heart,
  "Food & Dining": ShoppingCart,
};

const Transactions = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const {
    transactions,
    categories,
    loading,
    addTransaction,
    deleteTransaction,
    getTotals,
  } = useTransactions();
  const { profile } = useProfile();
  const currency = profile?.currency || "NPR";
  const totals = getTotals();

  const summaryCards = [
    {
      title: "Total Income",
      value: formatCurrency(totals.income, currency),
      change: "+12%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totals.expenses, currency),
      change: "+5%",
      isPositive: false,
      icon: TrendingDown,
    },
    {
      title: "Net Balance",
      value: formatCurrency(totals.savings, currency),
      change: "+8%",
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || tx.category?.id === categoryFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Manage and view your financial activity
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: Today,{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <card.icon
                        className={
                          card.isPositive ? "text-success" : "text-destructive"
                        }
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-xl font-bold">{card.value}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      card.isPositive
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search by merchant or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] bg-primary text-primary-foreground">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Type: All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card variant="glass">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx, index) => {
                    const Icon =
                      categoryIcons[tx.category?.name || ""] || ShoppingCart;
                    const colorClass =
                      tx.type === "income"
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive";

                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}
                            >
                              <Icon size={18} />
                            </div>
                            <div>
                              <p className="font-medium">
                                {tx.description ||
                                  tx.category?.name ||
                                  "Transaction"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.category?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                            {tx.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${
                              tx.type === "income"
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                tx.type === "income"
                                  ? "bg-success"
                                  : "bg-destructive"
                              }`}
                            />
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span
                            className={`font-semibold ${tx.type === "income" ? "text-success" : "text-foreground"}`}
                          >
                            {tx.type === "income" ? "+" : "-"}
                            {formatCurrency(Number(tx.amount), currency)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteTransaction(tx.id)}
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      {transactions.length === 0
                        ? "No transactions yet. Add your first transaction!"
                        : "No transactions match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                1-{filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {transactions.length}
              </span>{" "}
              transactions
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Floating Add Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={() => setIsTransactionModalOpen(true)}
            className="shadow-xl"
          >
            <Plus size={20} />
            Add Transaction
          </Button>
        </motion.div>
      </div>

      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        categories={categories}
        onSubmit={addTransaction}
      />
    </AppLayout>
  );
};

export default Transactions;
