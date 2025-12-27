export type InsightType = "tip" | "warning" | "success" | "info";

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  category: "spending" | "savings" | "goals" | "general";
  actionLabel?: string;
  actionUrl?: string;
}

export interface AIInsightsResponse {
  insights: AIInsight[];
  summary: string;
  timestamp: string;
}

export interface AIInsightsRequestData {
  transactions: any[];
  goals: any[];
  totals: {
    income: number;
    expenses: number;
    savings: number;
  };
}
