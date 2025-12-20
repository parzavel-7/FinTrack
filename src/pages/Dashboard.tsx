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
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import AddTransactionModal from "@/components/AddTransactionModal";
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

const Dashboard = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const summaryCards = [
    {
      title: "Total Income",
      value: "$4,250.00",
      change: "+5%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Total Expenses",
      value: "$1,200.00",
      change: "-2%",
      isPositive: true,
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      title: "Savings Balance",
      value: "$12,500.00",
      goal: "Goal: 80%",
      icon: PiggyBank,
      color: "text-primary",
    },
  ];

  const expenseData = [
    { name: "Week 1", amount: 800 },
    { name: "Week 2", amount: 1200 },
    { name: "Week 3", amount: 900 },
    { name: "Week 4", amount: 1400 },
  ];

  const categoryData = [
    { name: "Housing", value: 40, color: "hsl(262, 60%, 58%)" },
    { name: "Food & Dining", value: 30, color: "hsl(280, 50%, 70%)" },
    { name: "Transport", value: 20, color: "hsl(240, 10%, 50%)" },
    { name: "Others", value: 10, color: "hsl(262, 30%, 40%)" },
  ];

  const recentTransactions = [
    { id: 1, name: "Grocery Store", date: "Today, 10:23 AM", amount: -85.00, icon: ShoppingCart, color: "bg-success/20 text-success" },
    { id: 2, name: "Netflix", date: "Yesterday", amount: -15.99, icon: Film, color: "bg-destructive/20 text-destructive" },
    { id: 3, name: "Freelance Payment", date: "Oct 24, 2023", amount: 450.00, icon: Briefcase, color: "bg-primary/20 text-primary" },
    { id: 4, name: "Uber Ride", date: "Oct 22, 2023", amount: -24.50, icon: Car, color: "bg-warning/20 text-warning" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Hello, Sarah</h1>
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
                      <span className="text-2xl font-bold">$1,200.00</span>
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
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">$1.2k</span>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-medium">{cat.value}%</span>
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
            <Card variant="glow" className="bg-gradient-subtle">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-primary-foreground" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">AI Insight</h3>
                  <p className="text-muted-foreground mt-1">
                    You spent <span className="text-foreground font-medium">15% less</span> on dining out this month compared to your 3-month average. Great job keeping your budget on track!
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
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
                  <Button variant="link" size="sm" className="text-primary">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((tx) => (
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
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)} 
      />
    </AppLayout>
  );
};

export default Dashboard;
