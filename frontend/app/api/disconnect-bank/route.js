import { NextResponse } from "next/server";
import { disconnectBank } from "../../../lib/api/state.js";

const errorResponse = (message, code, status = 400) =>
  NextResponse.json({ success: false, message, error: code }, { status });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body.", "INVALID_BODY");
  }

  const bankId = body?.bankId;
  if (typeof bankId !== "string") {
    return errorResponse("bankId is required.", "INVALID_BANK_ID");
  }

  const bank = disconnectBank(bankId);
  if (!bank) {
    return errorResponse("Bank was not connected.", "BANK_NOT_CONNECTED", 404);
  }

  return NextResponse.json({ success: true, bankName: bank.bankName });
}
