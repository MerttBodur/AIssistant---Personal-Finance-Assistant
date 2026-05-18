"use client";

import { useState } from "react";

const PRECONNECT_PRESETS = [
  { value: "none",  label: "Hiçbiri (boş pano)" },
  { value: "a",     label: "Sadece Bank A" },
  { value: "a,b",   label: "Bank A + B" },
  { value: "a,b,c", label: "Üç banka da bağlı" },
];

const ID_MAP = { a: "bank_a", b: "bank_b", c: "bank_c" };

export function preconnectToIds(value) {
  if (value === "none") return [];
  return value
    .split(",")
    .filter(Boolean)
    .map((k) => ID_MAP[k])
    .filter(Boolean);
}

export function TweaksPanel({ tweaks, onChange, onPreviewConsent, onOpenAssistant }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="tweaks-toggle" onClick={() => setOpen(true)} aria-label="Demo tweaks">
        ⚙
      </button>
    );
  }

  return (
    <div className="tweaks-panel">
      <header>
        <strong>Demo Tweaks</strong>
        <button onClick={() => setOpen(false)} aria-label="Kapat">
          ✕
        </button>
      </header>

      <Section label="Başlangıç">
        <Row label="Açılış ekranı">
          <select
            value={tweaks.startScreen}
            onChange={(e) => onChange({ startScreen: e.target.value })}
          >
            <option value="login">Giriş</option>
            <option value="home">Pano</option>
          </select>
        </Row>
        <Row label="Önceden bağlı">
          <select
            value={tweaks.preConnected}
            onChange={(e) => onChange({ preConnected: e.target.value })}
          >
            {PRECONNECT_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Row>
      </Section>

      <Section label="Görünüm">
        <Toggle
          label="Asistan butonu (FAB)"
          value={tweaks.showFab}
          onChange={(v) => onChange({ showFab: v })}
        />
      </Section>

      <Section label="Açık Bankacılık Akışı">
        <Toggle
          label="KVKK onay akışını atla"
          value={tweaks.skipConsent}
          onChange={(v) => onChange({ skipConsent: v })}
        />
        <button className="tweaks-button" onClick={() => onPreviewConsent("bank_a")}>
          Onay akışını önizle (Bank A)
        </button>
      </Section>

      <button className="tweaks-button" onClick={onOpenAssistant}>
        Asistanı aç
      </button>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="tweaks-section">
      <div className="tweaks-section-label">{label}</div>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <label className="tweaks-row">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="tweaks-row">
      <span>{label}</span>
      <button
        type="button"
        className={`tweaks-toggle-switch ${value ? "on" : ""}`}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </label>
  );
}
