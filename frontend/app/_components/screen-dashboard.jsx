"use client";

import { ScreenHeader, icons, formatTry } from "./shared";

export function DashboardScreen({ connected, summary, advicePreview, apiOffline, onConnectPrompt }) {
  const hasBanks = connected.length > 0;

  if (!hasBanks) {
    return (
      <section className="screen">
        <ScreenHeader eyebrow="14 Mayıs - Perşembe" title="Merhaba" />
        <div className="empty-state">
          <div className="empty-icon">{icons.bank(28)}</div>
          <h2>Henüz banka bağlı değil</h2>
          <p>En az bir banka hesabı bağlandığında çoklu banka panosu burada dolacak.</p>
          <button className="primary-button" onClick={onConnectPrompt}>Banka Bağla</button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <ScreenHeader
        eyebrow="14 Mayıs - Perşembe"
        title="Merhaba"
        right={<span className="status-pill">{connected.length} banka bağlı</span>}
      />
      <div className="screen-stack">
        <BalanceCard summary={summary} connectedCount={connected.length} />
        <div className="metric-grid">
          <MetricCard label="Gelir" value={summary ? formatTry(summary.monthlyIncome) : "Bekleniyor"} tone="positive" />
          <MetricCard label="Gider" value={summary ? formatTry(summary.monthlyExpenses) : "Bekleniyor"} tone="negative" />
        </div>
        <AdviceCard apiOffline={apiOffline} summary={summary} advicePreview={advicePreview} />
        <CategoryCard summary={summary} />
        <BankBreakdown summary={summary} />
      </div>
    </section>
  );
}

function BalanceCard({ summary, connectedCount }) {
  return (
    <div className="balance-card">
      <span>Toplam Bakiye</span>
      <strong>{summary ? formatTry(summary.totalBalance) : "API bekleniyor"}</strong>
      <p>{connectedCount} bankadan gelen veriler birleştirilir.</p>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <div className="card metric-card">
      <span className={tone}>{label}</span>
      <strong>{value}</strong>
      <small>Bu ay</small>
    </div>
  );
}

function AdviceCard({ apiOffline, summary, advicePreview }) {
  const text =
    advicePreview ||
    summary?.advicePreview ||
    (apiOffline
      ? "API branch'i entegre edildiğinde asistan görüşü burada canlı veriden üretilecek."
      : "Bağlı hesaplardan gelen harcama örüntüleri burada özetlenecek.");

  return (
    <div className="advice-card">
      <div>{icons.sparkle(16)} <span>Asistan Görüşü</span></div>
      <p>{text}</p>
    </div>
  );
}

function CategoryCard({ summary }) {
  const categories = summary?.categoryBreakdown || summary?.categories || [];
  return (
    <div className="card">
      <div className="section-title">Kategori Dağılımı</div>
      {categories.length === 0 ? (
        <p className="muted">Harcama kategorileri API verisiyle dolacak.</p>
      ) : (
        <div className="category-list">
          {categories.slice(0, 5).map((category) => (
            <div className="category-row" key={category.category || category.label}>
              <span>{category.label || category.category}</span>
              <strong>{formatTry(category.amount)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BankBreakdown({ summary }) {
  const banks = summary?.perBank || summary?.bankBreakdown || [];
  return (
    <div className="card">
      <div className="section-title">Bankalar</div>
      {banks.length === 0 ? (
        <p className="muted">Banka bazlı bakiye ve giderler API entegrasyonu ile gösterilecek.</p>
      ) : (
        banks.map((bank) => (
          <div className="bank-row" key={bank.bank || bank.name}>
            <span>{bank.bank || bank.name}</span>
            <strong>{formatTry(bank.balance)}</strong>
          </div>
        ))
      )}
    </div>
  );
}
