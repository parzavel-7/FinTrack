import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Plus,
  Plane,
  Home,
  Car,
  GraduationCap,
  PiggyBank,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

const Goals = () => {
  const goals = [
    {
      id: 1,
      name: "Vacation Fund",
      icon: Plane,
      target: 5000,
      current: 3200,
      deadline: "Dec 2024",
      color: "hsl(262, 60%, 58%)",
      monthlyContribution: 400,
    },
    {
      id: 2,
      name: "Emergency Fund",
      icon: PiggyBank,
      target: 10000,
      current: 7500,
      deadline: "Mar 2025",
      color: "hsl(142, 76%, 36%)",
      monthlyContribution: 500,
    },
    {
      id: 3,
      name: "New Car",
      icon: Car,
      target: 25000,
      current: 8000,
      deadline: "Jun 2025",
      color: "hsl(280, 50%, 70%)",
      monthlyContribution: 800,
    },
    {
      id: 4,
      name: "Home Down Payment",
      icon: Home,
      target: 50000,
      current: 15000,
      deadline: "Dec 2026",
      color: "hsl(45, 93%, 47%)",
      monthlyContribution: 1200,
    },
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const monthlyTotal = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Target className="text-primary-foreground" size={22} />
              </div>
              Financial Goals
            </h1>
            <p className="text-muted-foreground mt-1">Track your progress towards financial milestones</p>
          </div>
          <Button variant="hero">
            <Plus size={18} />
            Add New Goal
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="glass">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                  <DollarSign className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold">${totalSaved.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Target className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Target</p>
                  <p className="text-2xl font-bold">${totalTarget.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                  <TrendingUp className="text-warning" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Contributions</p>
                  <p className="text-2xl font-bold">${monthlyTotal.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = calculateProgress(goal.current, goal.target);
            const remaining = goal.target - goal.current;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card variant="glass" className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <goal.icon size={24} style={{ color: goal.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>Target: {goal.deadline}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-sm font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                      >
                        {progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: goal.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${goal.current.toLocaleString()}</span>
                        <span className="text-muted-foreground">${goal.target.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="font-semibold">${remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                        <p className="font-semibold">${goal.monthlyContribution}/mo</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Add Funds
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap size={20} className="text-primary" />
                Tips for Reaching Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Automate Savings", desc: "Set up automatic transfers on payday" },
                  { title: "Round Up Purchases", desc: "Round up transactions to boost savings" },
                  { title: "Review Monthly", desc: "Adjust contributions based on income changes" },
                ].map((tip, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-medium mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Goals;
