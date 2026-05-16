const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (iso) => new Date(iso + "T00:00:00Z");

function borcSiralama(upcomingPayments, totalBalance, now) {
  const items = upcomingPayments
    .map((p) => ({
      description: p.description,
      amount: p.amount,
      source: p.source,
      dueDate: p.due_date,
      daysUntil: Math.round((parseDate(p.due_date) - now) / DAY_MS),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  let kalanLikit = totalBalance;
  for (const item of items) {
    item.likitKarsiliyorMu = kalanLikit >= item.amount;
    kalanLikit -= item.amount;
    item.kalanLikit = kalanLikit;
  }

  return { type: "borc_siralama", items };
}

function cashflowRunway(transactions, totalBalance, now) {
  const son30Gun = transactions.filter((t) => {
    if (t.type !== "expense") return false;
    const age = (now - parseDate(t.date)) / DAY_MS;
    return age >= 0 && age <= 30;
  });

  const aylikOrtalamaGider = son30Gun.reduce((s, t) => s + t.amount, 0);

  if (aylikOrtalamaGider === 0) {
    return {
      type: "cashflow_runway",
      likit: totalBalance,
      aylikOrtalamaGider: 0,
      ayCinsindenSure: null,
      tukenmeTarihi: null,
    };
  }

  const ayCinsindenSure = Math.round((totalBalance / aylikOrtalamaGider) * 10) / 10;
  const tukenmeTarihi = new Date(now.getTime() + ayCinsindenSure * 30 * DAY_MS)
    .toISOString()
    .slice(0, 10);

  return {
    type: "cashflow_runway",
    likit: totalBalance,
    aylikOrtalamaGider,
    ayCinsindenSure,
    tukenmeTarihi,
  };
}

export function computeForesight({ summary, transactions, upcomingPayments }) {
  const now = new Date();
  const totalBalance = summary?.totalBalance ?? 0;
  return {
    borc_siralama: borcSiralama(upcomingPayments ?? [], totalBalance, now),
    cashflow_runway: cashflowRunway(transactions ?? [], totalBalance, now),
  };
}
