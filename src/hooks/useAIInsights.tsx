import { useState, useCallback, useEffect } from "react";
import { AIInsightsResponse, AIInsightsRequestData } from "@/lib/ai-insights-types";

export function useAIInsights() {
  const [insights, setInsights] = useState<AIInsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async (data: AIInsightsRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Failed to fetch AI insights");
      }

      const result = await response.json();
      setInsights(result);
      
      // Cache insights in localStorage for faster subsequent loads
      localStorage.setItem("fintrack_ai_insights", JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
      
    } catch (err: any) {
      console.error("AI Insights Error:", err);
      setError(err.message || "Something went wrong fetching insights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load cached insights on mount
    const cached = localStorage.getItem("fintrack_ai_insights");
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Only use cache if it's less than 6 hours old
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        setInsights(data);
      }
    }
  }, []);

  return {
    insights,
    loading,
    error,
    fetchInsights,
  };
}
