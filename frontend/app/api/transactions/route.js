import { NextResponse } from "next/server";
import { getAllTransactions } from "../../../lib/api/state.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sourceParam = searchParams.get("source");
  const categoryParam = searchParams.get("category");

  let transactions = getAllTransactions();

  if (sourceParam) {
    const target = sourceParam.replace("_", " ").toLowerCase();
    transactions = transactions.filter(
      (txn) => txn.source.toLowerCase() === target,
    );
  }
  if (categoryParam) {
    transactions = transactions.filter(
      (txn) => txn.category.toLowerCase() === categoryParam.toLowerCase(),
    );
  }

  transactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json({ transactions });
}
