"use client";

import { ScreenHeader, BankGlyph, icons } from "./shared";

export function ConnectionsScreen({ banks, connected, busyId, onConnect, onDisconnect }) {
  return (
    <section className="screen">
      <ScreenHeader eyebrow="Bağlantılar" title="Hesaplar" />
      <p className="screen-copy">
        Banka hesaplarınızı tek bir yerde toplayın. Asistan bağladığınız hesaplar üzerinden çalışır.
      </p>
      <div className="connection-progress">
        {banks.map((bank) => (
          <span
            key={bank.id}
            style={{ background: connected.includes(bank.id) ? bank.color : "var(--line)" }}
          />
        ))}
        <strong>
          {connected.length} / {banks.length}
        </strong>
        <small>banka bağlandı</small>
      </div>
      <div className="bank-card-list">
        {banks.map((bank) => {
          const isConnected = connected.includes(bank.id);
          return (
            <div
              className="bank-card"
              key={bank.id}
              style={{
                borderColor: isConnected ? `${bank.color}55` : "var(--line-soft)",
                background: isConnected ? `${bank.tint}55` : "var(--bg-card)",
              }}
            >
              <BankGlyph bank={bank} />
              <div className="bank-card-body">
                <h2>{bank.name}</h2>
                <p>
                  {bank.subtitle} · ··{bank.last4}
                </p>
              </div>
              <button
                className={isConnected ? "secondary-button" : "connect-button"}
                style={!isConnected ? { background: bank.color } : undefined}
                disabled={busyId === bank.id}
                onClick={() => (isConnected ? onDisconnect(bank.id) : onConnect(bank.id))}
              >
                {busyId === bank.id ? <span className="spinner" /> : isConnected ? "Kaldır" : "Bağla"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="safety-note">
        <span>{icons.shield(14)}</span>
        <span>Bu demo'da gerçek banka bağlantısı yoktur. Bağlandığınızda örnek veriler yüklenir.</span>
      </div>
    </section>
  );
}
