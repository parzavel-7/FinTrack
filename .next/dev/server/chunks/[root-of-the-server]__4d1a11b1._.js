module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/FinTrack/fin_track/src/app/api/ai-insights/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FinTrack$2f$fin_track$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FinTrack/fin_track/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(req) {
    try {
        const data = await req.json();
        const { transactions, goals, totals } = data;
        const apiKey = process.env.OPENROUTER_API_KEY;
        const appName = ("TURBOPACK compile-time value", "FinTrack") || "FinTrack";
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FinTrack$2f$fin_track$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "OpenRouter API key not configured"
            }, {
                status: 500
            });
        }
        const prompt = `
      As a personal financial advisor, analyze the following financial data and provide 3-5 actionable insights.
      
      Financial Summary:
      - Total Income: $${totals.income}
      - Total Expenses: $${totals.expenses}
      - Current Savings: $${totals.savings}
      
      Goals:
      ${goals.map((g)=>`- ${g.name}: Target $${g.target_amount}, Current $${g.current_amount}, Status: ${g.status}`).join('\n')}
      
      Recent Transactions:
      ${transactions.slice(0, 10).map((t)=>`- ${t.date}: ${t.description || 'No description'} ($${t.amount}) - ${t.type}`).join('\n')}
      
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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://github.com/google/fintrack",
                "X-Title": appName,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful financial assistant that provides concise, actionable insights in valid JSON format."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: {
                    type: "json_object"
                }
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorDetail;
            try {
                errorDetail = JSON.parse(errorText);
            } catch  {
                errorDetail = errorText;
            }
            console.error("OpenRouter API Error Status:", response.status);
            console.error("OpenRouter API Error Detail:", errorDetail);
            return __TURBOPACK__imported__module__$5b$project$5d2f$FinTrack$2f$fin_track$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "OpenRouter API error",
                details: errorDetail?.error?.message || "Failed to fetch from OpenRouter"
            }, {
                status: response.status
            });
        }
        const result = await response.json();
        const aiContent = JSON.parse(result.choices[0].message.content);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FinTrack$2f$fin_track$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...aiContent,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("AI Insights Route Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FinTrack$2f$fin_track$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d1a11b1._.js.map