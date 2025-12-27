"use client";

import AppLayout from "@/components/AppLayout";
import { AIInsightsCard } from "@/components/AIInsightsCard";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AIInsightsPage() {
  const { transactions, loading: txLoading, getTotals } = useTransactions();
  const { goals, loading: goalsLoading } = useGoals();
  const totals = getTotals();

  const loading = txLoading || goalsLoading;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-primary" />
              AI Financial Insights
            </h1>
            <p className="text-muted-foreground">
              Deep analysis of your financial data using advanced AI.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AIInsightsCard
              data={{
                transactions,
                goals,
                totals: {
                  income: totals.income,
                  expenses: totals.expenses,
                  savings: totals.savings,
                },
              }}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-3">
            <h3 className="font-semibold text-lg">How it works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our AI analyzes your transaction history, spending categories, and
              financial goals to identify patterns and opportunities you might
              have missed.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Identifies unusual spending spikes</li>
              <li>Suggests budget optimizations</li>
              <li>Predicts goal achievement timelines</li>
              <li>Provides personalized savings tips</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-3">
            <h3 className="font-semibold text-lg">Privacy & Security</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your financial data is encrypted and only shared with the AI model
              for analysis. We don't store your data on AI servers, and it's
              never used for training.
            </p>
            <div className="pt-2">
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                Zero Data Retention Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
