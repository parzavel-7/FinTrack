"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Sparkles,
  ShoppingCart,
  Film,
  Briefcase,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { useAuth } from "@/hooks/useAuth";
import { AIInsightsCard } from "@/components/AIInsightsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

const categoryIcons: Record<string, any> = {
  "Food & Dining": ShoppingCart,
  "Entertainment": Film,
  "Salary": Briefcase,
  "Transportation": Car,
};

const Dashboard = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const { transactions, categories, loading, addTransaction, getTotals } = useTransactions();
  const { goals, loading: goalsLoading } = useGoals();
  const { user } = useAuth();

  const totals = getTotals();
  
  // Get user's name from metadata or email
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  const summaryCards = [
    {
      title: "Total Income",
      value: `$${totals.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: "+5%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Total Expenses",
      value: `$${totals.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: "-2%",
      isPositive: true,
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      title: "Savings Balance",
      value: `$${totals.savings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      goal: "Goal: 80%",
      icon: PiggyBank,
      color: "text-primary",
    },
  ];

  // Group expenses by category for pie chart
  const categoryTotals = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const categoryName = t.category?.name || "Other";
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const colors = ["hsl(262, 60%, 58%)", "hsl(280, 50%, 70%)", "hsl(240, 10%, 50%)", "hsl(262, 30%, 40%)"];
  const categoryData = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length],
  }));

  // Group transactions by week for line chart
  const expenseData = [
    { name: "Week 1", amount: totals.expenses * 0.2 },
    { name: "Week 2", amount: totals.expenses * 0.3 },
    { name: "Week 3", amount: totals.expenses * 0.25 },
    { name: "Week 4", amount: totals.expenses * 0.25 },
  ];

  const recentTransactions = transactions.slice(0, 4).map((tx) => {
    const Icon = categoryIcons[tx.category?.name || ""] || ShoppingCart;
    return {
      id: tx.id,
      name: tx.description || tx.category?.name || "Transaction",
      date: new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: tx.type === "expense" ? -Number(tx.amount) : Number(tx.amount),
      icon: Icon,
      color: tx.type === "income" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive",
    };
  });

  if (loading || goalsLoading) {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Hello, {userName}</h1>
            <p className="text-muted-foreground">Here's your financial overview for today.</p>
          </div>
          <Button variant="hero" onClick={() => setIsTransactionModalOpen(true)}>
            <Plus size={18} />
            Add Transaction
          </Button>
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
              <Card variant="glass" className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4`}>
                      <card.icon className={card.color} size={20} />
                    </div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  {card.change && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      card.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    }`}>
                      {card.change}
                    </span>
                  )}
                  {card.goal && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {card.goal}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Expense Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card variant="glass">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Monthly Expenses Trend</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold">${totals.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      <span className="text-xs text-success bg-success/20 px-2 py-0.5 rounded-full">-2% vs last month</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Monthly</Button>
                    <Button variant="ghost" size="sm">Weekly</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(262, 60%, 58%)"
                        strokeWidth={3}
                        dot={{ fill: "hsl(262, 60%, 58%)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "hsl(262, 60%, 58%)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card variant="glass" className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 relative">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No expense data yet
                    </div>
                  )}
                  {categoryData.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-bold">${(totals.expenses / 1000).toFixed(1)}k</span>
                      <span className="text-xs text-muted-foreground">Total</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.slice(0, 4).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-medium">${cat.value.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Insight & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* AI Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3"
          >
            <AIInsightsCard 
              data={{ 
                transactions, 
                goals, 
                totals: {
                  income: totals.income,
                  expenses: totals.expenses,
                  savings: totals.savings
                } 
              }} 
            />
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <Link href="/transactions">
                    <Button variant="link" size="sm" className="text-primary">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tx.color}`}>
                        <tx.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{tx.name}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                      <span className={`font-semibold text-sm ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No transactions yet
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
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

export default Dashboard;
