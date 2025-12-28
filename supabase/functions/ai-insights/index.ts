import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactions, goals } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Calculate some metrics to send to AI
    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const categorySpending: Record<string, number> = {};
    transactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        const category = t.category?.name || "Other";
        categorySpending[category] =
          (categorySpending[category] || 0) + Number(t.amount);
      });

    const goalsProgress = goals.map((g: any) => ({
      name: g.name,
      progress: Math.round(
        (Number(g.current_amount) / Number(g.target_amount)) * 100
      ),
      remaining: Number(g.target_amount) - Number(g.current_amount),
    }));

    const systemPrompt = `You are a helpful financial advisor AI. Analyze the user's financial data and provide personalized insights. 
    Be concise, specific, and actionable. Format your response as JSON with the following structure:
    {
      "insights": [
        { "type": "positive|warning|tip", "title": "short title", "description": "detailed advice" }
      ],
      "spendingPatterns": [
        { "category": "name", "status": "good|warning|alert", "advice": "brief advice" }
      ],
      "recommendations": ["actionable recommendation 1", "actionable recommendation 2"],
      "summary": "A 2-3 sentence overall financial health summary"
    }
    
    Provide 3-4 insights, 3 spending patterns, and 4 recommendations.`;

    const userPrompt = `Analyze this financial data:
    
    Total Income: $${totalIncome.toLocaleString()}
    Total Expenses: $${totalExpenses.toLocaleString()}
    Net Savings: $${(totalIncome - totalExpenses).toLocaleString()}
    
    Spending by Category:
    ${Object.entries(categorySpending)
      .map(([cat, amt]) => `- ${cat}: $${amt.toLocaleString()}`)
      .join("\n")}
    
    Goals Progress:
    ${
      goalsProgress.length > 0
        ? goalsProgress
            .map(
              (g: any) =>
                `- ${g.name}: ${
                  g.progress
                }% complete, $${g.remaining.toLocaleString()} remaining`
            )
            .join("\n")
        : "No goals set"
    }
    
    Transaction count: ${transactions.length}`;

    console.log("Sending request to AI provider...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/google/fintrack",
          "X-Title": "FinTrack",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI Response received");

    // Try to parse as JSON, fallback to raw content
    let parsedContent;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonString);
    } catch {
      console.log("Could not parse as JSON, returning raw content");
      parsedContent = {
        summary: content,
        insights: [],
        spendingPatterns: [],
        recommendations: [],
      };
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-insights function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
