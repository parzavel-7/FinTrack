import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCcw, BrainCircuit } from "lucide-react";
import { InsightItem } from "./InsightItem";
import { useAIInsights } from "@/hooks/useAIInsights";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsCardProps {
  data: {
    transactions: any[];
    goals: any[];
    totals: {
      income: number;
      expenses: number;
      savings: number;
    };
  };
}

export function AIInsightsCard({ data }: AIInsightsCardProps) {
  const { insights, loading, error, fetchInsights } = useAIInsights();

  const handleRefresh = () => {
    fetchInsights(data);
  };

  // Initial fetch if no insights
  useState(() => {
    if (!insights && !loading) {
      fetchInsights(data);
    }
  });

  return (
    <Card className="relative overflow-hidden border-2 border-primary/10 shadow-lg">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <BrainCircuit className="w-32 h-32" />
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Financial Insights</CardTitle>
              <CardDescription>
                Smart analysis of your spending and goals
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCcw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Analyzing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && !insights ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl border border-border/50"
              >
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-500 mb-2">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : insights ? (
          <>
            {insights.summary && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-foreground italic">
                  "{insights.summary}"
                </p>
              </div>
            )}

            <div className="grid gap-3">
              {insights.insights.map((insight) => (
                <InsightItem key={insight.id} insight={insight} />
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <Button onClick={handleRefresh}>Generate Initial Insights</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
