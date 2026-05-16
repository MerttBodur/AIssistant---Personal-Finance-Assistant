import { NextResponse } from "next/server";
import { getConnectedBanks } from "../../../../lib/api/state.js";

const monthKey = (isoDate) => isoDate.slice(0, 7);

function pickCurrentMonth(transactions) {
  if (transactions.length === 0) return null;
  const months = transactions.map((t) => monthKey(t.date)).sort();
  return months[months.length - 1];
}

function aggregateSummary(banks) {
  const transactions = banks.flatMap((b) => b.transactions);
  const currentMonth = pickCurrentMonth(transactions);

  const monthTxns = currentMonth
    ? transactions.filter((t) => monthKey(t.date) === currentMonth)
    : [];

  const totalBalance = banks.reduce((sum, b) => sum + b.balance, 0);

  let monthlyIncome = 0;
  let monthlyExpenses = 0;
  for (const t of monthTxns) {
    if (t.type === "income") monthlyIncome += t.amount;
    else if (t.type === "expense") monthlyExpenses += t.amount;
  }

  const savingsRate =
    monthlyIncome > 0
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : null;

  const categoryMap = new Map();
  for (const t of monthTxns) {
    if (t.type !== "expense") continue;
    categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
  }
  const categoryBreakdown = [...categoryMap.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentOfTotal:
        monthlyExpenses > 0
          ? Math.round((amount / monthlyExpenses) * 100)
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const perBankBreakdown = banks.map((b) => {
    const monthForBank = b.transactions.filter(
      (t) => monthKey(t.date) === currentMonth,
    );
    const expenses = monthForBank
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const income = monthForBank
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    return {
      bank: b.bankName,
      balance: b.balance,
      monthlyExpenses: expenses,
      monthlyIncome: income,
    };
  });

  const upcomingPayments = banks.flatMap((b) => b.upcoming_payments ?? []);

  return {
    connectedBanks: banks.length,
    currentMonth,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    categoryBreakdown,
    perBank: perBankBreakdown,
    upcomingPayments,
  };
}

export async function GET() {
  const banks = getConnectedBanks();
  if (banks.length === 0) {
    return NextResponse.json({
      connectedBanks: 0,
      currentMonth: null,
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      savingsRate: null,
      categoryBreakdown: [],
      perBank: [],
      upcomingPayments: [],
    });
  }
  return NextResponse.json(aggregateSummary(banks));
}
