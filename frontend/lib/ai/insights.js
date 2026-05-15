const SUBSCRIPTION_CATEGORIES = new Set([
  "abonelikler",
  "abonelik",
  "subscription",
  "subscriptions",
]);

const dedupKey = (desc, source) =>
  (desc ?? "").trim().toLowerCase() + "::" + source;

const median = (sortedAsc) => {
  const n = sortedAsc.length;
  if (n === 0) return 0;
  if (n % 2 === 1) return sortedAsc[(n - 1) / 2];
  return (sortedAsc[n / 2 - 1] + sortedAsc[n / 2]) / 2;
};

export function categoryBankConcentration(transactions, _summary) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const catTotals = new Map();
  for (const t of expenses) {
    catTotals.set(t.category, (catTotals.get(t.category) ?? 0) + t.amount);
  }

  const top3 = [...catTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const items = top3.map(([category, amount]) => {
    const bankTotals = new Map();
    for (const t of expenses) {
      if (t.category !== category) continue;
      bankTotals.set(t.source, (bankTotals.get(t.source) ?? 0) + t.amount);
    }
    const [dominantBank, dominantAmount] = [...bankTotals.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    return {
      category,
      amount,
      dominantBank,
      bankShare: dominantAmount / amount,
    };
  });

  return { type: "kategori_banka_yogunlugu", items };
}

export function recurringSubscriptions(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const items = new Map();

  // Path A — category match (case-insensitive)
  for (const t of expenses) {
    const cat = (t.category ?? "").trim().toLowerCase();
    if (!SUBSCRIPTION_CATEGORIES.has(cat)) continue;
    const key = dedupKey(t.description, t.source);
    if (items.has(key)) continue;
    items.set(key, {
      description: t.description,
      amount: t.amount,
      source: t.source,
      confidence: "category",
    });
  }

  // Path B — description repeat heuristic (same source, 2+ occurrences, +/-5%)
  const groups = new Map();
  for (const t of expenses) {
    const key = dedupKey(t.description, t.source);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  for (const [key, txs] of groups) {
    if (txs.length < 2) continue;
    if (items.has(key)) continue; // category path already claimed it
    const amounts = txs.map((t) => t.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    if (min <= 0 || max > min * 1.05) continue;
    const t = txs[0];
    items.set(key, {
      description: t.description,
      amount: t.amount,
      source: t.source,
      confidence: "heuristic",
    });
  }

  return { type: "abonelikler", items: [...items.values()] };
}

export function outlierTransactions(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const byCategory = new Map();
  for (const t of expenses) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category).push(t);
  }

  const outliers = [];
  for (const [, txs] of byCategory) {
    const sortedAmounts = txs.map((t) => t.amount).sort((a, b) => a - b);
    const m = median(sortedAmounts);
    if (m <= 0) continue;
    for (const t of txs) {
      if (t.amount >= 3 * m) {
        outliers.push({
          description: t.description,
          amount: t.amount,
          category: t.category,
          source: t.source,
          categoryMedian: m,
        });
      }
    }
  }
  outliers.sort((a, b) => b.amount - a.amount);
  return { type: "olagandisi_harcamalar", items: outliers.slice(0, 2) };
}

export function bankBehaviorProfile(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const grandTotal = expenses.reduce((s, t) => s + t.amount, 0);

  const banks = new Map();
  for (const t of expenses) {
    if (!banks.has(t.source)) {
      banks.set(t.source, { total: 0, byCategory: new Map() });
    }
    const b = banks.get(t.source);
    b.total += t.amount;
    b.byCategory.set(t.category, (b.byCategory.get(t.category) ?? 0) + t.amount);
  }

  const items = [...banks.entries()].map(([bank, { total, byCategory }]) => {
    const dominantCategories = [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat);
    return {
      bank,
      expenses: total,
      expenseShare: grandTotal > 0 ? total / grandTotal : 0,
      dominantCategories,
    };
  });
  items.sort((a, b) => b.expenses - a.expenses);

  return { type: "banka_profili", items };
}

export function computeAllInsights(transactions, summary) {
  return {
    kategori_banka_yogunlugu: categoryBankConcentration(transactions, summary),
    abonelikler: recurringSubscriptions(transactions),
    olagandisi_harcamalar: outlierTransactions(transactions),
    banka_profili: bankBehaviorProfile(transactions),
  };
}
