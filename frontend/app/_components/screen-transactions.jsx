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

function cutoffISO(days) {
  if (!days) return null;
  const d = new Date(TODAY_ISO);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
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
        <div className="transaction-list">
          {filtered.map((txn) => (
            <div className="transaction-row" key={txn.id}>
              <div>
                <strong>{txn.description}</strong>
                <span>
                  {txn.category} · {txn.source}
                </span>
              </div>
              <b className={txn.type === "income" ? "income" : ""}>
                {txn.type === "income" ? "+" : "-"}
                {formatTry(txn.amount).replace("-", "")}
              </b>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
