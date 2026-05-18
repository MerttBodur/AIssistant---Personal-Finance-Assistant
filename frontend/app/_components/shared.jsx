"use client";

export const BANKS = [
  { id: "bank_a", name: "Bank A", subtitle: "Vadesiz Hesap",   last4: "4821", glyph: "A", color: "#1F4A36", tint: "#E4EDE6" },
  { id: "bank_b", name: "Bank B", subtitle: "Birikim Hesabı",  last4: "7102", glyph: "B", color: "#1F3A5F", tint: "#E1E8F0" },
  { id: "bank_c", name: "Bank C", subtitle: "Kredi Kartı",     last4: "0394", glyph: "C", color: "#7A2E12", tint: "#F2E1DA" },
];

export const STARTER_PROMPTS = [
  "Bu ay neden daha çok harcadım?",
  "Hangi bankada en çok harcıyorum?",
  "Tasarruf oranımı nasıl artırabilirim?",
];

export function formatTry(value) {
  const n = Number(value || 0);
  const amount = Math.abs(n).toLocaleString("tr-TR", { maximumFractionDigits: 0 });
  return `${n < 0 ? "-" : ""}₺${amount}`;
}

export async function requestJson(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function fmtDateDot(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export const icons = {
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
  shield: (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  back: (size = 20) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  edit: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
};

export function StatusBar() {
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

export function ScreenHeader({ eyebrow, title, right }) {
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

export function BankGlyph({ bank, size = 44 }) {
  return (
    <div
      className="bank-glyph"
      style={{
        width: size,
        height: size,
        background: bank.tint,
        color: bank.color,
        borderColor: `${bank.color}33`,
        fontSize: size * 0.45,
      }}
    >
      {bank.glyph}
    </div>
  );
}
