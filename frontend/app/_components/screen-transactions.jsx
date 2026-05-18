"use client";

import { useMemo, useState } from "react";
import { ScreenHeader, formatTry } from "./shared";

const TODAY_ISO = "2026-05-14";

const RANGES = [
  { id: "all", label: "Tümü",          eyebrow: "Mayıs 2026" },
  { id: "1w",  label: "Son 1 hafta",   eyebrow: "Son 7 gün",  days: 7   },
  { id: "1m",  label: "Son 1 ay",      eyebrow: "Son 1 ay",   days: 30  },
  { id: "3m",  label: "Son 3 ay",      eyebrow: "Son 3 ay",   days: 90  },
  { id: "6m",  label: "Son 6 ay",      eyebrow: "Son 6 ay",   days: 182 },
  { id: "1y",  label: "Son 1 yıl",     eyebrow: "Son 1 yıl",  days: 365 },
];

const CATEGORIES = {
  Food:          { label: "Yiyecek",   color: "#B36A1E" },
  Market:        { label: "Market",    color: "#5C7A29" },
  Transport:     { label: "Ulaşım",    color: "#1F4A36" },
  Subscriptions: { label: "Abonelik",  color: "#7A2E12" },
  Bills:         { label: "Faturalar", color: "#475569" },
  Shopping:      { label: "Alışveriş", color: "#6E3A8A" },
  Rent:          { label: "Kira",      color: "#1F3A5F" },
  Salary:        { label: "Maaş",      color: "#1F4A36" },
  Other:         { label: "Diğer",     color: "#8b8c7f" },
};

const BANK_COLORS = {
  bank_a: "#1F4A36",
  bank_b: "#1F3A5F",
  bank_c: "#7A2E12",
  "Bank A": "#1F4A36",
  "Bank B": "#1F3A5F",
  "Bank C": "#7A2E12",
};

const MONTH_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function categoryMeta(category) {
  return CATEGORIES[category] || { label: category || "Diğer", color: "#8b8c7f" };
}

function cutoffISO(days) {
  if (!days) return null;
  const d = new Date(TODAY_ISO);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function formatGroupHeader(isoDate) {
  const today = new Date(TODAY_ISO);
  const date = new Date(isoDate);
  const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Bugün";
  if (diffDays === 1) return "Dün";
  return `${date.getDate()} ${MONTH_TR[date.getMonth()]}`;
}

export function TransactionsScreen({ banks, transactions }) {
  const [bankFilter, setBankFilter] = useState("all");
  const [rangeId, setRangeId] = useState("all");

  const range = RANGES.find((r) => r.id === rangeId);
  const cutoff = useMemo(() => cutoffISO(range.days), [range.days]);

  const filtered = transactions
    .filter((txn) => {
      if (bankFilter === "all") return true;
      return (
        txn.sourceId === bankFilter ||
        txn.source === banks.find((bank) => bank.id === bankFilter)?.name
      );
    })
    .filter((txn) => (cutoff && txn.date ? txn.date >= cutoff : true));

  const groups = useMemo(() => {
    const byDate = new Map();
    for (const txn of filtered) {
      const key = txn.date || "—";
      if (!byDate.has(key)) byDate.set(key, []);
      byDate.get(key).push(txn);
    }
    return [...byDate.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <section className="screen">
      <ScreenHeader eyebrow={range.eyebrow} title="Hareketler" />
      <div className="chips">
        <button className={bankFilter === "all" ? "active" : ""} onClick={() => setBankFilter("all")}>
          Hepsi
        </button>
        {banks.map((bank) => (
          <button
            key={bank.id}
            className={bankFilter === bank.id ? "active" : ""}
            onClick={() => setBankFilter(bank.id)}
          >
            {bank.name}
          </button>
        ))}
      </div>
      <div className="range-chips">
        {RANGES.map((r) => (
          <button
            key={r.id}
            className={rangeId === r.id ? "active" : ""}
            onClick={() => setRangeId(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-list">Bu zaman aralığında hareket bulunmuyor.</p>
      ) : (
        <div className="txn-groups">
          {groups.map(([date, items]) => (
            <div key={date} className="txn-group">
              <div className="txn-group-header">{formatGroupHeader(date)}</div>
              <div className="txn-list">
                {items.map((txn) => {
                  const cat = categoryMeta(txn.category);
                  const isIncome = txn.type === "income";
                  const bankColor = BANK_COLORS[txn.sourceId] || BANK_COLORS[txn.source] || "#8b8c7f";
                  return (
                    <div className="txn-row" key={txn.id}>
                      <div
                        className="txn-badge"
                        style={{ background: `${cat.color}1f`, color: cat.color }}
                      >
                        {cat.label.charAt(0)}
                      </div>
                      <div className="txn-main">
                        <div className="txn-desc">{txn.description}</div>
                        <div className="txn-meta">
                          <span>{cat.label}</span>
                          <span className="txn-meta-sep">·</span>
                          <span className="txn-bank">
                            <span className="txn-bank-dot" style={{ background: bankColor }} />
                            {txn.source}
                          </span>
                        </div>
                      </div>
                      <b className={isIncome ? "txn-amount income" : "txn-amount"}>
                        {isIncome ? "+" : "-"}
                        {formatTry(txn.amount).replace("-", "")}
                      </b>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
