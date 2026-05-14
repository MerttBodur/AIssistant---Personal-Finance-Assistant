"use client";

import { useEffect, useMemo, useState } from "react";

const BANKS = [
  {
    id: "bank_a",
    name: "Bank A",
    subtitle: "Vadesiz Hesap",
    last4: "4821",
    glyph: "A",
    color: "#1F4A36",
    tint: "#E4EDE6",
  },
  {
    id: "bank_b",
    name: "Bank B",
    subtitle: "Birikim Hesabi",
    last4: "7102",
    glyph: "B",
    color: "#1F3A5F",
    tint: "#E1E8F0",
  },
  {
    id: "bank_c",
    name: "Bank C",
    subtitle: "Kredi Karti",
    last4: "0394",
    glyph: "C",
    color: "#7A2E12",
    tint: "#F2E1DA",
  },
];

const STARTER_PROMPTS = [
  "Bu ay neden daha cok harcadim?",
  "Hangi bankada en cok harciyorum?",
  "Tasarruf oranimi nasil artirabilirim?",
];

const icons = {
  home: (size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  link: (size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="9" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 9V7a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="14.5" r="1.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  list: (size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  sparkle: (size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="currentColor" />
      <path d="M19 14l0.7 2 2 0.7-2 0.7L19 19.4 18.3 17.4l-2-0.7 2-0.7L19 14z" fill="currentColor" opacity="0.7" />
    </svg>
  ),
  bank: (size = 24) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9.5L12 4l9 5.5V11H3V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 11v7M9 11v7M15 11v7M19 11v7M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  close: (size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  send: (size = 17) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function formatTry(value) {
  const amount = Math.abs(Number(value || 0)).toLocaleString("tr-TR", {
    maximumFractionDigits: 0,
  });
  return `${Number(value || 0) < 0 ? "-" : ""}₺${amount}`;
}

async function requestJson(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("home");
  const [connected, setConnected] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [apiOffline, setApiOffline] = useState(false);

  const connectedBanks = useMemo(
    () => BANKS.filter((bank) => connected.includes(bank.id)),
    [connected],
  );

  const refreshFinancialData = async () => {
    try {
      const [summaryData, transactionData] = await Promise.all([
        requestJson("/api/dashboard/summary"),
        requestJson("/api/transactions"),
      ]);
      setSummary(summaryData);
      setTransactions(transactionData.transactions || transactionData || []);
      setApiOffline(false);
    } catch {
      setSummary(null);
      setTransactions([]);
      setApiOffline(true);
    }
  };

  useEffect(() => {
    if (loggedIn) refreshFinancialData();
  }, [loggedIn]);

  const connectBank = async (bankId) => {
    setBusyId(bankId);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    try {
      await requestJson("/api/connect-bank", {
        method: "POST",
        body: JSON.stringify({ bankId }),
      });
      setConnected((current) => [...new Set([...current, bankId])]);
      await refreshFinancialData();
    } catch {
      setConnected((current) => [...new Set([...current, bankId])]);
      setApiOffline(true);
    } finally {
      setBusyId(null);
    }
  };

  const disconnectBank = async (bankId) => {
    setBusyId(bankId);
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      await requestJson("/api/disconnect-bank", {
        method: "POST",
        body: JSON.stringify({ bankId }),
      });
      await refreshFinancialData();
    } catch {
      setConnected((current) => current.filter((id) => id !== bankId));
      setApiOffline(true);
    } finally {
      setBusyId(null);
    }
  };

  const screen = !loggedIn ? (
    <LoginScreen onLogin={() => setLoggedIn(true)} />
  ) : tab === "connections" ? (
    <ConnectionsScreen
      banks={BANKS}
      connected={connected}
      busyId={busyId}
      onConnect={connectBank}
      onDisconnect={disconnectBank}
    />
  ) : tab === "transactions" ? (
    <TransactionsScreen banks={connectedBanks} transactions={transactions} />
  ) : (
    <DashboardScreen
      connected={connected}
      summary={summary}
      apiOffline={apiOffline}
      onConnectPrompt={() => setTab("connections")}
    />
  );

  return (
    <main className="page-shell">
      <div className="phone-frame">
        <div className="dynamic-island" />
        <StatusBar />
        <div className="phone-screen">
          {screen}
          {loggedIn && (
            <>
              <button className="assistant-fab" aria-label="Asistani ac" onClick={() => setAssistantOpen(true)}>
                <span className="fab-pulse" />
                {icons.sparkle(22)}
              </button>
              <BottomNav tab={tab} onChange={setTab} />
              <AssistantSheet
                open={assistantOpen}
                onClose={() => setAssistantOpen(false)}
                connectedCount={connected.length}
                summary={summary}
              />
            </>
          )}
        </div>
        <div className="home-indicator" />
      </div>
    </main>
  );
}

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div className="status-icons">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [submitting, setSubmitting] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(onLogin, 500);
  };

  return (
    <section className="login-screen">
      <div className="brand-mark">A</div>
      <p className="eyebrow">AIssistant</p>
      <h1>
        Tum hesaplariniz,
        <span> tek bir yerde.</span>
      </h1>
      <p className="login-copy">Bankalarinizi baglayin, finansal durumunuzu tek mobil panoda izleyin.</p>
      <form className="login-form" onSubmit={submit}>
        <label>
          <span>E-posta</span>
          <input defaultValue="demo@aissistant.app" type="email" />
        </label>
        <label>
          <span>Sifre</span>
          <input defaultValue="demo1234" type="password" />
        </label>
        <button className="primary-button" type="submit">
          {submitting ? <span className="spinner" /> : "Giris Yap"}
        </button>
      </form>
      <p className="demo-note">Demo girisi, gercek banka baglantisi yapmaz.</p>
    </section>
  );
}

function DashboardScreen({ connected, summary, apiOffline, onConnectPrompt }) {
  const hasBanks = connected.length > 0;

  if (!hasBanks) {
    return (
      <section className="screen">
        <ScreenHeader eyebrow="14 Mayis - Persembe" title="Merhaba, Demo" />
        <div className="empty-state">
          <div className="empty-icon">{icons.bank(28)}</div>
          <h2>Henuz banka bagli degil</h2>
          <p>En az bir banka hesabi baglandiginda coklu banka panosu burada dolacak.</p>
          <button className="primary-button" onClick={onConnectPrompt}>Banka Bagla</button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <ScreenHeader
        eyebrow="14 Mayis - Persembe"
        title="Merhaba, Demo"
        right={<span className="status-pill">{connected.length} banka bagli</span>}
      />
      <div className="screen-stack">
        <BalanceCard summary={summary} connectedCount={connected.length} />
        <div className="metric-grid">
          <MetricCard label="Gelir" value={summary ? formatTry(summary.monthlyIncome) : "Bekleniyor"} tone="positive" />
          <MetricCard label="Gider" value={summary ? formatTry(summary.monthlyExpenses) : "Bekleniyor"} tone="negative" />
        </div>
        <AdviceCard apiOffline={apiOffline} summary={summary} />
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
      <p>{connectedCount} bankadan gelen veriler birlestirilir.</p>
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

function AdviceCard({ apiOffline, summary }) {
  const text = summary?.advicePreview
    || (apiOffline
      ? "API branch'i entegre edildiginde asistan gorusu burada canli veriden uretilecek."
      : "Bagli hesaplardan gelen harcama oruntuleri burada ozetlenecek.");

  return (
    <div className="advice-card">
      <div>{icons.sparkle(16)} <span>Asistan Gorusu</span></div>
      <p>{text}</p>
    </div>
  );
}

function CategoryCard({ summary }) {
  const categories = summary?.categoryBreakdown || summary?.categories || [];
  return (
    <div className="card">
      <div className="section-title">Kategori Dagilimi</div>
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
        <p className="muted">Banka bazli bakiye ve giderler API entegrasyonu ile gosterilecek.</p>
      ) : banks.map((bank) => (
        <div className="bank-row" key={bank.bank || bank.name}>
          <span>{bank.bank || bank.name}</span>
          <strong>{formatTry(bank.balance)}</strong>
        </div>
      ))}
    </div>
  );
}

function ConnectionsScreen({ banks, connected, busyId, onConnect, onDisconnect }) {
  return (
    <section className="screen">
      <ScreenHeader eyebrow="Baglantilar" title="Hesaplar" />
      <p className="screen-copy">Banka hesaplarinizi tek bir yerde toplayin. Asistan bagladiginiz hesaplar uzerinden calisir.</p>
      <div className="connection-progress">
        {banks.map((bank) => <span key={bank.id} style={{ background: connected.includes(bank.id) ? bank.color : "var(--line)" }} />)}
        <strong>{connected.length} / {banks.length}</strong>
        <small>banka baglandi</small>
      </div>
      <div className="bank-card-list">
        {banks.map((bank) => {
          const isConnected = connected.includes(bank.id);
          return (
            <div className="bank-card" key={bank.id} style={{ borderColor: isConnected ? `${bank.color}55` : "var(--line-soft)" }}>
              <BankGlyph bank={bank} />
              <div className="bank-card-body">
                <h2>{bank.name}</h2>
                <p>{bank.subtitle} - **{bank.last4}</p>
              </div>
              <button
                className={isConnected ? "secondary-button" : "connect-button"}
                style={!isConnected ? { background: bank.color } : undefined}
                disabled={busyId === bank.id}
                onClick={() => isConnected ? onDisconnect(bank.id) : onConnect(bank.id)}
              >
                {busyId === bank.id ? <span className="spinner" /> : isConnected ? "Kaldir" : "Bagla"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TransactionsScreen({ banks, transactions }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all"
    ? transactions
    : transactions.filter((txn) => txn.sourceId === filter || txn.source === banks.find((bank) => bank.id === filter)?.name);

  return (
    <section className="screen">
      <ScreenHeader eyebrow="Mayis 2026" title="Hareketler" />
      <div className="chips">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Hepsi</button>
        {banks.map((bank) => (
          <button key={bank.id} className={filter === bank.id ? "active" : ""} onClick={() => setFilter(bank.id)}>{bank.name}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="empty-list">Bagli bankalardan gelen hareketler burada listelenecek.</p>
      ) : (
        <div className="transaction-list">
          {filtered.map((txn) => (
            <div className="transaction-row" key={txn.id}>
              <div>
                <strong>{txn.description}</strong>
                <span>{txn.category} - {txn.source}</span>
              </div>
              <b className={txn.type === "income" ? "income" : ""}>{txn.type === "income" ? "+" : "-"}{formatTry(txn.amount).replace("-", "")}</b>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AssistantSheet({ open, onClose, connectedCount, summary }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        role: "assistant",
        content: connectedCount > 0
          ? `${connectedCount} bankadan gelen verilerinize bakiyorum. Harcama ve gelir oruntuleriniz hakkinda soru sorabilirsiniz.`
          : "Henuz bagli banka yok. Once Baglantilar ekranindan bir hesap ekleyebilirsiniz.",
      },
    ]);
  }, [open, connectedCount, messages.length]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || thinking) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);
    try {
      const data = await requestJson("/api/assistant/chat", {
        method: "POST",
        body: JSON.stringify({ message: content, chatHistory: nextMessages.slice(-6), financialContext: summary }),
      });
      setMessages((current) => [...current, { role: "assistant", content: data.response || data.message }]);
    } catch {
      setMessages((current) => [...current, {
        role: "assistant",
        content: "Su anda yanit olusturamadim. Pano ozeti ve hareket gecmisi uzerinden harcamalarinizi inceleyebilirsiniz.",
      }]);
    } finally {
      setThinking(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <button className="sheet-backdrop" aria-label="Asistani kapat" onClick={onClose} />
      <section className="assistant-sheet">
        <div className="sheet-handle" />
        <header>
          <div className="assistant-mark">{icons.sparkle(18)}</div>
          <div>
            <h2>Asistan</h2>
            <p>{connectedCount > 0 ? `${connectedCount} banka uzerinden` : "Bagli banka yok"}</p>
          </div>
          <button className="icon-button" onClick={onClose}>{icons.close()}</button>
        </header>
        <div className="messages">
          {messages.map((message, index) => (
            <div className={`message ${message.role}`} key={`${message.role}-${index}`}>{message.content}</div>
          ))}
          {thinking && <div className="message assistant">Dusunuyor...</div>}
          {messages.length === 1 && connectedCount > 0 && (
            <div className="starter-prompts">
              {STARTER_PROMPTS.map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}
            </div>
          )}
        </div>
        <div className="composer">
          <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Finanslariniz hakkinda sorun" />
          <button onClick={() => send()} disabled={!input.trim()}>{icons.send()}</button>
        </div>
      </section>
    </>
  );
}

function BottomNav({ tab, onChange }) {
  const items = [
    { id: "home", label: "Pano", icon: icons.home },
    { id: "connections", label: "Baglantilar", icon: icons.link },
    { id: "transactions", label: "Hareketler", icon: icons.list },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => onChange(item.id)}>
          {item.icon(22)}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function ScreenHeader({ eyebrow, title, right }) {
  return (
    <header className="screen-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {right}
    </header>
  );
}

function BankGlyph({ bank }) {
  return (
    <div className="bank-glyph" style={{ background: bank.tint, color: bank.color, borderColor: `${bank.color}33` }}>
      {bank.glyph}
    </div>
  );
}
