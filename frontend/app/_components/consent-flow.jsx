"use client";

import { useEffect, useState } from "react";
import { BankGlyph, fmtDateDot, icons } from "./shared";

const CONSENT_PERMISSIONS = [
  "Temel Hesap Bilgisi",
  "Ayrıntılı Hesap Bilgisi",
  "Bakiye Bilgisi",
  "Anlık Bakiye Bildirimi",
  "Temel İşlem Bilgisi",
  "Ayrıntılı İşlem Bilgisi",
  "Düzenli Ödeme ve Abonelik Bilgisi",
];

const TODAY = new Date("2026-05-14");

const DURATION_PRESETS = [
  { label: "3 ay",  months: 3  },
  { label: "6 ay",  months: 6  },
  { label: "1 yıl", months: 12 },
  { label: "2 yıl", months: 24 },
];

export function BankConsentFlow({ bank, onCancel, onComplete }) {
  const [step, setStep] = useState("form"); // form | doc | verifying | success
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const defaultEnd = new Date(TODAY);
  defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);
  const [accessEnd, setAccessEnd] = useState(defaultEnd);

  const queryStart = new Date(TODAY);
  queryStart.setFullYear(queryStart.getFullYear() - 1);

  const accent = bank.color;

  if (step === "doc") {
    return (
      <KVKKDocPage
        bank={bank}
        accent={accent}
        onAccept={() => {
          setKvkkAccepted(true);
          setStep("form");
        }}
        onCancel={() => setStep("form")}
      />
    );
  }
  if (step === "verifying") {
    return <VerifyingStep bank={bank} accent={accent} onDone={() => setStep("success")} />;
  }
  if (step === "success") {
    return <SuccessStep bank={bank} accent={accent} onDone={onComplete} />;
  }

  return (
    <div className="consent-overlay fade-in">
      <ConsentHeader
        eyebrow="Açık Bankacılık"
        title={`${bank.name} Hesap Bağlantısı`}
        onBack={onCancel}
        accent={accent}
      />
      <div className="consent-body">
        <p className="consent-lead">
          Gerçekleştireceğiniz işleminizin detaylarını kontrol edip, işleminizi onaylayınız.
        </p>

        <FieldRow label="BANKA ADI" value={bank.name} />

        <div className="field">
          <div className="field-label">İZİNLER</div>
          <div className="permissions-card">
            {CONSENT_PERMISSIONS.map((p) => (
              <div className="permission-row" key={p}>
                <span className="permission-dot" style={{ background: accent }} />
                <span>{p}</span>
              </div>
            ))}
            <div className="permission-note">
              Yalnızca okuma erişimi. Para transferi veya kart işlemi yetkisi <b>verilmez</b>.
            </div>
          </div>
        </div>

        <FieldRow
          label="ERİŞİMİN GEÇERLİ OLDUĞU SON TARİH"
          value={fmtDateDot(accessEnd)}
          monospace
          onEdit={() => setShowDurationPicker(true)}
        />
        <FieldRow
          label="İŞLEM SORGULAMA BAŞLANGIÇ ZAMANI"
          value={fmtDateDot(queryStart)}
          monospace
        />
        <FieldRow
          label="İŞLEM SORGULAMA BİTİŞ ZAMANI"
          value={fmtDateDot(accessEnd)}
          monospace
        />

        <label
          className="kvkk-row"
          style={{
            background: kvkkAccepted ? `${bank.tint}99` : "var(--bg-card)",
            borderColor: kvkkAccepted ? `${accent}55` : "var(--line)",
          }}
        >
          <Checkbox checked={kvkkAccepted} onToggle={() => setKvkkAccepted((v) => !v)} accent={accent} />
          <div className="kvkk-text">
            <span
              className="kvkk-link"
              style={{ textDecorationColor: accent }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setStep("doc");
              }}
            >
              Kişisel Verilerin Korunması Kanununa ilişkin Aydınlatma Metni
            </span>{" "}
            tarafımca okunmuş, anlaşılmış ve kabul edilmiştir.
            <span style={{ color: accent, marginLeft: 4 }}>*</span>
          </div>
        </label>

        <div className="consent-helper">
          <span style={{ flexShrink: 0, marginTop: 1 }}>{icons.shield(12)}</span>
          <span>
            Bu işlem BDDK denetimindeki Açık Bankacılık altyapısı üzerinden gerçekleştirilir.
            İzni dilediğiniz zaman <b>Bağlantılar</b> ekranından geri çekebilirsiniz.
          </span>
        </div>
      </div>

      <ConsentFooter
        primary={{
          label: "ONAYLA",
          onClick: () => setStep("verifying"),
        }}
        primaryDisabled={!kvkkAccepted}
        secondary={{ label: "İPTAL ET", onClick: onCancel }}
        accent={accent}
      />

      {showDurationPicker && (
        <DurationPopover
          onPick={(d) => {
            setAccessEnd(d);
            setShowDurationPicker(false);
          }}
          onClose={() => setShowDurationPicker(false)}
        />
      )}
    </div>
  );
}

function ConsentHeader({ title, eyebrow, onBack, accent }) {
  return (
    <div className="consent-header">
      <button onClick={onBack} aria-label="Geri" className="consent-back">
        {icons.back()}
      </button>
      <div className="consent-header-text">
        {eyebrow && (
          <div className="consent-eyebrow" style={accent ? { color: accent } : undefined}>
            {eyebrow}
          </div>
        )}
        <div className="consent-title">{title}</div>
      </div>
    </div>
  );
}

function ConsentFooter({ primary, secondary, accent, primaryDisabled }) {
  return (
    <div className="consent-footer">
      <button
        type="button"
        onClick={primary.onClick}
        disabled={primaryDisabled}
        className="consent-primary"
        style={{
          background: primaryDisabled ? "var(--line)" : accent || "var(--ink)",
          color: primaryDisabled ? "var(--ink-3)" : "#fff",
        }}
      >
        {primary.label}
      </button>
      {secondary && (
        <button type="button" onClick={secondary.onClick} className="consent-secondary">
          {secondary.label}
        </button>
      )}
    </div>
  );
}

function FieldRow({ label, value, monospace = false, onEdit }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <button
        type="button"
        onClick={onEdit}
        disabled={!onEdit}
        className="field-value"
        style={{ cursor: onEdit ? "pointer" : "default" }}
      >
        <span className={monospace ? "field-value-text mono" : "field-value-text"}>{value}</span>
        {onEdit && <span className="field-edit">{icons.edit(16)}</span>}
      </button>
    </div>
  );
}

function Checkbox({ checked, onToggle, accent }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      role="checkbox"
      aria-checked={checked}
      className="kvkk-checkbox"
      style={{
        borderColor: checked ? accent : "var(--line)",
        background: checked ? accent : "var(--bg-card)",
      }}
    >
      {checked && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M4 12l5 5 11-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function DurationPopover({ onPick, onClose }) {
  return (
    <div className="consent-modal-backdrop" onClick={onClose}>
      <div className="consent-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="consent-sheet-title">Erişim Süresi</div>
        <div className="duration-list">
          {DURATION_PRESETS.map((opt) => {
            const end = new Date(TODAY);
            end.setMonth(end.getMonth() + opt.months);
            return (
              <button key={opt.label} className="duration-option" onClick={() => onPick(end)}>
                <span>{opt.label}</span>
                <span className="mono duration-date">{fmtDateDot(end)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KVKKDocPage({ bank, onAccept, onCancel, accent }) {
  return (
    <div className="consent-overlay fade-in" style={{ zIndex: 95 }}>
      <ConsentHeader
        eyebrow="Sözleşme Onayı"
        title="Kişisel Verilerin Korunması Aydınlatma Metni"
        onBack={onCancel}
        accent={accent}
      />
      <div className="consent-body">
        <div className="kvkk-doc">
          <div className="kvkk-doc-title">KİŞİSEL VERİLERİN KORUNMASI AYDINLATMA METNİ</div>
          <p>
            AIssistant tarafından sunulan Hesap Bilgisi Hizmeti kapsamında, 6698 sayılı Kişisel
            Verilerin Korunması Kanunu (&quot;Kanun&quot;) uyarınca veri sorumlusu sıfatıyla,
            &quot;Veri Sorumlusunun Aydınlatma Yükümlülüğü&quot; başlıklı 10. maddesi uyarınca
            sizleri bilgilendirmek isteriz.
          </p>
          <p>
            Açık bankacılık, finansal sistemdeki verilerin standart uygulama programlama
            arayüzleri aracılığıyla müşterinin açık rızası dahilinde üçüncü taraf hizmet
            sağlayıcıların erişimine açılmasıdır.
          </p>
          <h4>1. Kişisel Verilerin İşlenme Amacı</h4>
          <p>
            AIssistant tarafından, hesap bilgisi hizmeti almak için seçmiş olduğunuz{" "}
            <b>{bank.name}</b> nezdindeki hesaplarınızdan elde edilen kişisel verileriniz; 6493
            sayılı Ödeme ve Menkul Kıymet Mutabakat Sistemleri, Ödeme Hizmetleri ve Elektronik
            Para Kuruluşları Hakkında Kanun ile Yönetmelik&apos;te belirtilen açık bankacılık
            hizmetlerinin sunulabilmesi amacıyla, sınırlı olarak işlenmektedir.
          </p>
          <h4>2. Kişisel Verilerinizin Aktarımı</h4>
          <p>
            Kişisel verileriniz; Kanun&apos;un kişisel verilerin aktarılmasına ilişkin hükümleri
            kapsamında, sınırlı ve ölçülü bir şekilde ve gerektiği takdirde mevzuatın çizdiği
            çerçeve dahilinde BDDK, SPK, TCMB, MASAK, TBB Risk Merkezi, Maliye Bakanlığı gibi
            kamu kurum ve kuruluşlarına aktarılabilmektedir.
          </p>
          <h4>3. Kişisel Verilerinizin Saklanması</h4>
          <p>
            Kişisel verileriniz, işleme amaçlarının gerektirdiği süreler boyunca saklanabilmektedir.
            Erişim süresi sona erdiğinde veya açık rızanızı geri çektiğinizde verileriniz silinmekte,
            yok edilmekte veya anonim hale getirilmektedir.
          </p>
          <h4>4. Kişisel Verisi İşlenen İlgili Kişinin Hakları</h4>
          <p>6698 Sayılı Kanun kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,</li>
            <li>Kanundaki şartlar çerçevesinde silinmesini veya yok edilmesini isteme.</li>
          </ul>
          <p className="kvkk-doc-footer">
            Bu belge 10451811360 kimlik numaralı kullanıcı tarafından 18.05.2026 tarihinde dijital
            olarak onaylanmıştır.
          </p>
        </div>
      </div>
      <ConsentFooter
        primary={{ label: "ONAYLIYORUM, DEVAM ET", onClick: onAccept }}
        secondary={{ label: "VAZGEÇ", onClick: onCancel }}
        accent={accent}
      />
    </div>
  );
}

function VerifyingStep({ bank, accent, onDone }) {
  const STEPS = [
    "Banka ile güvenli bağlantı kuruluyor…",
    "İzinler kaydediliyor…",
    "Hesaplar senkronize ediliyor…",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setIdx(1), 800);
    const t2 = setTimeout(() => setIdx(2), 1500);
    const t3 = setTimeout(onDone, 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div className="consent-overlay verifying-step fade-in">
      <div className="verifying-ring">
        <div className="verifying-pulse" style={{ borderColor: accent }} />
        <div className="verifying-glyph" style={{ background: accent }}>
          {bank.glyph}
        </div>
      </div>
      <div className="verifying-name">{bank.name}</div>
      <div className="verifying-steps">
        {STEPS.map((s, i) => (
          <div className="verifying-step-row" key={s} style={{ opacity: i <= idx ? 1 : 0.35 }}>
            {i < idx ? (
              <span style={{ color: accent, display: "flex" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : i === idx ? (
              <span className="spinner spinner-dark" style={{ borderTopColor: accent }} />
            ) : (
              <span className="verifying-pending" />
            )}
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessStep({ bank, accent, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="consent-overlay success-step fade-in">
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke={accent || "var(--accent)"}
          strokeWidth="2.5"
          style={{ strokeDasharray: 264, strokeDashoffset: 264, animation: "drawRing 600ms ease-out forwards" }}
        />
        <path
          d="M28 50l14 14 26-26"
          stroke={accent || "var(--accent)"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 70, strokeDashoffset: 70, animation: "drawCheck 420ms 480ms ease-out forwards" }}
        />
      </svg>
      <div className="success-text">
        <div className="success-title">Bağlantı Kuruldu</div>
        <div className="success-sub">
          <b>{bank.name}</b> hesabınız AIssistant&apos;a bağlandı.
        </div>
      </div>
    </div>
  );
}

export function DisconnectConfirm({ bank, onCancel, onConfirm }) {
  return (
    <div className="consent-modal-backdrop" onClick={onCancel}>
      <div className="consent-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="disconnect-head">
          <BankGlyph bank={bank} size={40} />
          <div>
            <div className="disconnect-eyebrow">Bağlantıyı Kaldır</div>
            <div className="disconnect-title">{bank.name}</div>
          </div>
        </div>
        <p className="disconnect-body">
          Bu bankaya ait <b>verilen tüm izinler iptal edilecek</b> ve AIssistant&apos;taki hesap
          geçmişi, işlemler ve asistan içgörüleri silinecek. Bu işlem geri alınamaz.
        </p>
        <ul className="disconnect-list">
          <li>
            <span>✕</span>Hesap bakiyesi ve işlemler
          </li>
          <li>
            <span>✕</span>Asistanın bu hesaba dair önerileri
          </li>
          <li>
            <span>✕</span>Kategori ve harcama analizi
          </li>
        </ul>
        <div className="consent-footer-inline">
          <button type="button" onClick={onConfirm} className="disconnect-confirm">
            EVET, KALDIR
          </button>
          <button type="button" onClick={onCancel} className="consent-secondary">
            VAZGEÇ
          </button>
        </div>
      </div>
    </div>
  );
}
