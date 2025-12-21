import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  DollarSign,
  ShoppingCart,
  Coffee,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

const AIInsights = () => {
  const insights = [
    {
      type: "positive",
      icon: TrendingUp,
      title: "Great job on groceries!",
      description: "You spent 20% less on groceries this month compared to your 3-month average. Keep up the smart shopping!",
      action: "View Details",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Dining spending alert",
      description: "You've used 85% of your dining budget with 10 days left. Consider cooking at home more often.",
      action: "Adjust Budget",
    },
    {
      type: "tip",
      icon: Lightbulb,
      title: "Savings opportunity",
      description: "Based on your spending patterns, you could save an extra $150/month by reducing subscription services.",
      action: "See How",
    },
    {
      type: "positive",
      icon: Target,
      title: "Emergency fund on track",
      description: "At your current rate, you'll reach your $10,000 emergency fund goal by December 2024.",
      action: "View Progress",
    },
  ];

  const spendingPatterns = [
    { category: "Food & Dining", current: 450, average: 520, icon: Coffee, trend: "down" },
    { category: "Shopping", current: 280, average: 250, icon: ShoppingCart, trend: "up" },
    { category: "Utilities", current: 120, average: 115, icon: Zap, trend: "up" },
  ];

  const recommendations = [
    "Consider switching to a no-fee credit card to save $95/year",
    "Your car insurance renews next month - shop around for better rates",
    "Set up automatic transfers of $200 to savings each payday",
    "Cancel unused gym membership to save $49/month",
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-success/30 bg-success/5";
      case "warning":
        return "border-warning/30 bg-warning/5";
      case "tip":
        return "border-primary/30 bg-primary/5";
      default:
        return "border-border";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-success/20 text-success";
      case "warning":
        return "bg-warning/20 text-warning";
      case "tip":
        return "bg-primary/20 text-primary";
      default:
        return "bg-secondary text-foreground";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="text-primary-foreground" size={22} />
              </div>
              AI Insights
            </h1>
            <p className="text-muted-foreground mt-1">Personalized financial intelligence powered by AI</p>
          </div>
          <Button variant="outline">
            Refresh Insights
          </Button>
        </div>

        {/* Main Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border ${getInsightColor(insight.type)}`}>
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(insight.type)}`}>
                      <insight.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      <Button variant="link" size="sm" className="px-0 mt-2 text-primary">
                        {insight.action} →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Spending Patterns & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Patterns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Spending Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {spendingPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <pattern.icon size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{pattern.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">${pattern.current}</span>
                          <span className="text-xs text-muted-foreground">avg: ${pattern.average}</span>
                          {pattern.trend === "down" ? (
                            <TrendingDown size={14} className="text-success" />
                          ) : (
                            <TrendingUp size={14} className="text-destructive" />
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pattern.current <= pattern.average ? "bg-success" : "bg-warning"
                          }`}
                          style={{ width: `${Math.min((pattern.current / pattern.average) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Smart Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb size={20} className="text-primary" />
                  <CardTitle className="text-lg">Smart Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <DollarSign size={12} className="text-primary" />
                    </div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glow" className="bg-gradient-subtle">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-primary-foreground" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Monthly AI Summary</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    Overall, you're doing well financially this month. Your total spending is <span className="text-foreground font-medium">8% below</span> your monthly average, 
                    and you're on track to save an extra <span className="text-success font-medium">$320</span> compared to last month. 
                    Focus on reducing dining expenses and consider the recommendations above to optimize your finances further.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button variant="hero" size="sm">Get Detailed Analysis</Button>
                    <Button variant="outline" size="sm">Share Report</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AIInsights;
