import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { computeAllInsights } from "../../../../lib/ai/insights.js";
import { computeForesight } from "../../../../lib/ai/foresight.js";
import { generateChatResponse, shouldPreFilter } from "../../../../lib/ai/gemini.js";

const fallback = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "..", "mock-data", "fallback_responses.json"),
    "utf8"
  )
);

const pickGeneric = () =>
  fallback.genericAdvice[Math.floor(Math.random() * fallback.genericAdvice.length)];

const fallbackResponse = (response) =>
  NextResponse.json({ success: true, response, source: "fallback" });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fallbackResponse(fallback.assistantUnavailable + " " + pickGeneric());
  }

  const { message, chatHistory, financialContext, transactions } = body ?? {};

  if (typeof message !== "string" || !message.trim() || !financialContext || !Array.isArray(transactions)) {
    return fallbackResponse(fallback.assistantUnavailable + " " + pickGeneric());
  }

  if (shouldPreFilter(message)) {
    return NextResponse.json({
      success: true,
      response: fallback.refusalRedirect,
      source: "regex_refusal",
    });
  }

  if (financialContext.connectedBanks === 0 || transactions.length === 0) {
    return fallbackResponse(fallback.noBanksConnected);
  }

  try {
    const insights = computeAllInsights(transactions, financialContext);
    const foresight = computeForesight({
      summary: financialContext,
      transactions,
      upcomingPayments: financialContext.upcomingPayments ?? [],
    });
    const parsed = await generateChatResponse({
      financialContext,
      insights,
      foresight,
      chatHistory: Array.isArray(chatHistory) ? chatHistory : [],
      userMessage: message,
    });
    const source = parsed.decision === "refuse" ? "gemini_refusal" : "gemini";
    return NextResponse.json({ success: true, response: parsed.response, source });
  } catch (error) {
    console.log("[assistant/chat] gemini error:", error?.message ?? error);
    return fallbackResponse(fallback.assistantUnavailable + " " + pickGeneric());
  }
}
