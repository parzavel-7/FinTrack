import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";

const Reports = () => {
  const { transactions, loading, getTotals } = useTransactions();
  const { income, expenses, savings } = getTotals();

  // Calculate monthly data for charts
  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expenses: number }> = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const key = format(date, "MMM");
      months[key] = { income: 0, expenses: 0 };
    }

    transactions.forEach((t) => {
      const monthKey = format(parseISO(t.date), "MMM");
      if (months[monthKey]) {
        if (t.type === "income") {
          months[monthKey].income += Number(t.amount);
        } else {
          months[monthKey].expenses += Number(t.amount);
        }
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }));
  }, [transactions]);

  const savingsData = useMemo(() => {
    return monthlyData.map((m) => ({
      month: m.month,
      savings: m.income - m.expenses,
    }));
  }, [monthlyData]);

  const reportSummary = [
    { label: "Total Income", value: `$${income.toLocaleString()}`, change: "+12%", positive: true, icon: TrendingUp },
    { label: "Total Expenses", value: `$${expenses.toLocaleString()}`, change: "+5%", positive: false, icon: TrendingDown },
    { label: "Net Savings", value: `$${savings.toLocaleString()}`, change: savings >= 0 ? "+18%" : "-10%", positive: savings >= 0, icon: DollarSign },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <h1 className="text-2xl md:text-3xl font-bold">Financial Reports</h1>
            <p className="text-muted-foreground">Detailed analysis of your finances</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar size={18} />
              Last 6 Months
            </Button>
            <Button variant="hero">
              <Download size={18} />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportSummary.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                    <item.icon className={item.positive ? "text-success" : "text-destructive"} size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Income vs Expenses</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-muted-foreground">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">Expenses</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {transactions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No transaction data to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Trend & Quick Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass" className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Savings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {transactions.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={savingsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="savings"
                          stroke="hsl(262, 60%, 58%)"
                          fill="hsl(262, 60%, 58%)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data to display
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="glass" className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Total Transactions", value: transactions.length.toString() },
                  { name: "Income Transactions", value: transactions.filter(t => t.type === "income").length.toString() },
                  { name: "Expense Transactions", value: transactions.filter(t => t.type === "expense").length.toString() },
                  { name: "Average Transaction", value: transactions.length > 0 
                    ? `$${Math.round(transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length)}`
                    : "$0"
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileText className="text-primary" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{report.name}</p>
                    </div>
                    <span className="font-semibold">{report.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
