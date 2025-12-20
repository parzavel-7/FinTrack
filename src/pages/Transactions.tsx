import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import AddTransactionModal from "@/components/AddTransactionModal";

const categoryIcons: Record<string, any> = {
  shopping: ShoppingCart,
  entertainment: Film,
  income: Briefcase,
  transport: Car,
  utilities: Zap,
  health: Heart,
};

const categoryColors: Record<string, string> = {
  shopping: "bg-success/20 text-success",
  entertainment: "bg-destructive/20 text-destructive",
  income: "bg-primary/20 text-primary",
  transport: "bg-warning/20 text-warning",
  utilities: "bg-accent/20 text-accent",
  health: "bg-pink-500/20 text-pink-500",
};

const transactions = [
  { id: 1, name: "Netflix Subscription", description: "Premium Plan", category: "entertainment", date: "Oct 24, 2023", status: "Completed", amount: -15.99 },
  { id: 2, name: "Salary Deposit", description: "Tech Corp Inc.", category: "income", date: "Oct 20, 2023", status: "Completed", amount: 3200.00 },
  { id: 3, name: "Whole Foods Market", description: "Weekly Groceries", category: "shopping", date: "Oct 18, 2023", status: "Pending", amount: -142.80 },
  { id: 4, name: "Gym Membership", description: "Monthly Fee", category: "health", date: "Oct 15, 2023", status: "Completed", amount: -45.00 },
  { id: 5, name: "Electric Bill", description: "Utility", category: "utilities", date: "Oct 12, 2023", status: "Completed", amount: -85.50 },
];

const Transactions = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const summaryCards = [
    { title: "Total Income", value: "$12,450.00", change: "+12%", isPositive: true, icon: TrendingUp },
    { title: "Total Expenses", value: "$8,200.00", change: "+5%", isPositive: false, icon: TrendingDown },
    { title: "Net Balance", value: "$4,250.00", change: "+8%", isPositive: true, icon: TrendingUp },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Manage and view your financial activity</p>
          </div>
          <p className="text-sm text-muted-foreground">Last updated: Today, 10:42 AM</p>
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
                      <card.icon className={card.isPositive ? "text-success" : "text-destructive"} size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.title}</p>
                      <p className="text-xl font-bold">{card.value}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by merchant or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
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
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => {
                  const Icon = categoryIcons[tx.category] || ShoppingCart;
                  const colorClass = categoryColors[tx.category] || "bg-secondary text-foreground";
                  
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
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-medium">{tx.name}</p>
                            <p className="text-xs text-muted-foreground">{tx.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground capitalize">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{tx.date}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          tx.status === "Completed" ? "text-success" : "text-warning"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === "Completed" ? "bg-success" : "bg-warning"
                          }`} />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-semibold ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-5</span> of <span className="font-medium text-foreground">128</span> transactions
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button variant="outline" size="sm">
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
      />
    </AppLayout>
  );
};

export default Transactions;
