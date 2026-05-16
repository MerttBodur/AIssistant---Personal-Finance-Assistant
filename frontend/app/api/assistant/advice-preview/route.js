import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { computeAllInsights } from "../../../../lib/ai/insights.js";
import { computeForesight } from "../../../../lib/ai/foresight.js";
import { generateAdvicePreview } from "../../../../lib/ai/gemini.js";

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

  const { financialContext, transactions } = body ?? {};

  if (!financialContext || !Array.isArray(transactions)) {
    return fallbackResponse(fallback.assistantUnavailable + " " + pickGeneric());
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
    const response = await generateAdvicePreview({ financialContext, insights, foresight });
    return NextResponse.json({ success: true, response, source: "gemini" });
  } catch (error) {
    console.log("[assistant/advice-preview] gemini error:", error?.message ?? error);
    return fallbackResponse(fallback.assistantUnavailable + " " + pickGeneric());
  }
}
