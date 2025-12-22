import { useState, useEffect } from "react";
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIInsight {
  type: "positive" | "warning" | "tip";
  title: string;
  description: string;
}

interface SpendingPattern {
  category: string;
  status: "good" | "warning" | "alert";
  advice: string;
}

interface AIResponse {
  insights: AIInsight[];
  spendingPatterns: SpendingPattern[];
  recommendations: string[];
  summary: string;
}

const AIInsights = () => {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { goals, loading: goalsLoading } = useGoals();
  const { toast } = useToast();
  
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (transactions.length === 0) {
      setError("Add some transactions to get AI insights");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { transactions, goals },
      });

      if (error) throw error;

      setAiData(data);
    } catch (err: any) {
      console.error("Error fetching insights:", err);
      setError(err.message || "Failed to fetch AI insights");
      toast({
        title: "Error",
        description: "Could not fetch AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!transactionsLoading && !goalsLoading && transactions.length > 0 && !aiData) {
      fetchInsights();
    }
  }, [transactionsLoading, goalsLoading, transactions.length]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return TrendingUp;
      case "warning":
        return AlertTriangle;
      case "tip":
        return Lightbulb;
      default:
        return Target;
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-success";
      case "warning":
        return "text-warning";
      case "alert":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const isLoading = transactionsLoading || goalsLoading || loading;

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
          <Button 
            variant="outline" 
            onClick={fetchInsights} 
            disabled={isLoading || transactions.length === 0}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Insights
          </Button>
        </div>

        {isLoading ? (
          <Card variant="glass" className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing your financial data...</p>
            </div>
          </Card>
        ) : error || transactions.length === 0 ? (
          <Card variant="glass" className="py-12">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data to analyze</h3>
              <p className="text-muted-foreground mb-4">
                {error || "Add some transactions to get personalized AI insights"}
              </p>
            </div>
          </Card>
        ) : aiData ? (
          <>
            {/* Main Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiData.insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
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
                            <IconComponent size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
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
                    {aiData.spendingPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <ShoppingCart size={18} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{pattern.category}</span>
                            <span className={`text-xs font-medium uppercase ${getStatusColor(pattern.status)}`}>
                              {pattern.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{pattern.advice}</p>
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
                    {aiData.recommendations.map((rec, index) => (
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
                        {aiData.summary}
                      </p>
                      <div className="flex gap-3 mt-4">
                        <Button variant="hero" size="sm" onClick={fetchInsights}>
                          Refresh Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default AIInsights;
