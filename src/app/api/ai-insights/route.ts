import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { transactions, goals, totals } = data;

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "FinTrack";

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENROUTER_API_KEY not configured. Please add it to your .env.local file.",
        },
        { status: 500 }
      );
    }

    const prompt = `
      As a personal financial advisor, analyze the following financial data and provide 3-5 actionable insights.
      
      Financial Summary:
      - Total Income: $${totals.income}
      - Total Expenses: $${totals.expenses}
      - Current Savings: $${totals.savings}
      
      Goals:
      ${goals
        .map(
          (g: any) =>
            `- ${g.name}: Target $${g.target_amount}, Current $${g.current_amount}, Status: ${g.status}`
        )
        .join("\n")}
      
      Recent Transactions:
      ${transactions
        .slice(0, 10)
        .map(
          (t: any) =>
            `- ${t.date}: ${t.description || "No description"} ($${
              t.amount
            }) - ${t.type}`
        )
        .join("\n")}
      
      Respond STRICTLY in JSON format with the following structure:
      {
        "insights": [
          {
            "id": "unique-id",
            "type": "tip" | "warning" | "success" | "info",
            "title": "Short title",
            "description": "Explanatory text",
            "category": "spending" | "savings" | "goals" | "general",
            "actionLabel": "Optional button text",
            "actionUrl": "Optional relative path"
          }
        ],
        "summary": "A brief overview sentence of the financial health."
      }
    `;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://github.com/google/fintrack",
          "X-Title": appName,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful financial assistant that provides concise, actionable insights in valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText);
      } catch {
        errorDetail = errorText;
      }

      console.error("OpenRouter API Error Status:", response.status);

      const errorMessage =
        typeof errorDetail === "object"
          ? errorDetail.error?.message || JSON.stringify(errorDetail)
          : errorText;

      return NextResponse.json(
        {
          error: "AI provider error",
          details: errorMessage,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result.choices?.[0]?.message?.content) {
      console.error("OpenRouter Response missing content:", result);
      throw new Error("AI provider returned an empty or invalid response.");
    }

    let aiContent;
    try {
      const rawContent = result.choices[0].message.content;
      aiContent = JSON.parse(rawContent);
    } catch (parseError) {
      console.error(
        "Error parsing OpenRouter response content:",
        result.choices[0].message.content
      );
      throw new Error(
        "Failed to parse AI response. The model didn't return valid JSON."
      );
    }

    return NextResponse.json({
      ...aiContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI Insights Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
