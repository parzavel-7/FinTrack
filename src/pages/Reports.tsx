import { motion } from "framer-motion";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
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

const Reports = () => {
  const monthlyData = [
    { month: "Jan", income: 4200, expenses: 2800 },
    { month: "Feb", income: 3800, expenses: 3100 },
    { month: "Mar", income: 4500, expenses: 2900 },
    { month: "Apr", income: 4800, expenses: 3200 },
    { month: "May", income: 5200, expenses: 3500 },
    { month: "Jun", income: 4900, expenses: 3000 },
  ];

  const savingsData = [
    { month: "Jan", savings: 1400 },
    { month: "Feb", savings: 700 },
    { month: "Mar", savings: 1600 },
    { month: "Apr", savings: 1600 },
    { month: "May", savings: 1700 },
    { month: "Jun", savings: 1900 },
  ];

  const reportSummary = [
    { label: "Total Income", value: "$27,400", change: "+12%", positive: true, icon: TrendingUp },
    { label: "Total Expenses", value: "$18,500", change: "+5%", positive: false, icon: TrendingDown },
    { label: "Net Savings", value: "$8,900", change: "+18%", positive: true, icon: DollarSign },
  ];

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
              Jan - Jun 2024
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
                      <span className={`text-xs font-medium ${item.positive ? "text-success" : "text-destructive"}`}>
                        {item.change}
                      </span>
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
                <CardTitle className="text-lg">Quick Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Monthly Summary - June 2024", date: "Generated today" },
                  { name: "Q2 Financial Overview", date: "Generated Jun 30" },
                  { name: "Tax Report 2024", date: "Generated Jun 15" },
                  { name: "Expense Breakdown - May", date: "Generated Jun 1" },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileText className="text-primary" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
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
