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
  Briefcase,
  Heart,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useGoals, Goal } from "@/hooks/useGoals";
import { AddGoalModal } from "@/components/AddGoalModal";
import { AddFundsModal } from "@/components/AddFundsModal";
import { format } from "date-fns";

const iconMap: Record<string, React.ElementType> = {
  Target,
  Plane,
  Home,
  Car,
  GraduationCap,
  PiggyBank,
  Briefcase,
  Heart,
  TrendingUp,
};

const Goals = () => {
  const { goals, loading, getTotals, deleteGoal } = useGoals();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [fundsModalOpen, setFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const { totalSaved, totalTarget } = getTotals();

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleAddFunds = (goal: Goal) => {
    setSelectedGoal(goal);
    setFundsModalOpen(true);
  };

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
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Target className="text-primary-foreground" size={22} />
              </div>
              Financial Goals
            </h1>
            <p className="text-muted-foreground mt-1">Track your progress towards financial milestones</p>
          </div>
          <Button variant="hero" onClick={() => setAddModalOpen(true)}>
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
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{goals.length}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card variant="glass" className="py-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first financial goal</p>
              <Button variant="hero" onClick={() => setAddModalOpen(true)}>
                <Plus size={18} />
                Add Your First Goal
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => {
              const progress = calculateProgress(Number(goal.current_amount), Number(goal.target_amount));
              const remaining = Number(goal.target_amount) - Number(goal.current_amount);
              const IconComponent = iconMap[goal.icon || "Target"] || Target;
              const color = goal.color || "hsl(262, 60%, 58%)";
              
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
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <IconComponent size={24} style={{ color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{goal.name}</h3>
                            {goal.deadline && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar size={14} />
                                <span>Target: {format(new Date(goal.deadline), "MMM yyyy")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {progress}%
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteGoal(goal.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">${Number(goal.current_amount).toLocaleString()}</span>
                          <span className="text-muted-foreground">${Number(goal.target_amount).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className="font-semibold">${remaining.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="font-semibold">{progress}% complete</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        size="sm"
                        onClick={() => handleAddFunds(goal)}
                      >
                        Add Funds
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

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

      <AddGoalModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <AddFundsModal open={fundsModalOpen} onOpenChange={setFundsModalOpen} goal={selectedGoal} />
    </AppLayout>
  );
};

export default Goals;
