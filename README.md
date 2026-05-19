# AIssistant — Çoklu Banka Kişisel Finans Asistanı

Türkiye'deki kullanıcılar için tasarlanmış, **birden fazla bankadaki harcamaları tek bir ekranda birleştiren** mobil görünümlü bir kişisel finans asistanı. Hackathon kapsamında 2 kişilik bir öğrenci ekibi tarafından geliştirilmiştir.

> ⚠️ **Bu proje BTK Hackathon 2026 için geliştirilmiş bir demodur.** Gerçek banka entegrasyonu, gerçek kullanıcı kimlik doğrulaması veya kalıcı veri tabanı içermez. Tüm banka verileri `mock-data/` klasöründeki JSON dosyalarından yüklenir.

---

## Hakkında

AIssistant; kullanıcının "bağladığı" 3 farklı sahte bankadaki (Bank A / B / C) işlemleri tek panelde toplar, harcamalarını kategori ve banka bazında analiz eder ve Google Gemini destekli bir sohbet arayüzü üzerinden Türkçe öneriler sunar.

Projenin **ayırt edici özelliği** ham LLM sohbeti değil, Gemini'ye gönderilmeden önce hesaplanan **çoklu-banka sinyalleridir**: kategori-banka yoğunlaşması, tekrarlayan abonelikler, aykırı işlemler ve banka bazlı harcama profili. Asistan bu yapılandırılmış bağlamı kullanarak _"Market alışverişlerinin büyük kısmı Bank A'dan geçiyor"_ gibi bankaya özgü içgörüler üretir.

---

## Özellikler

- 🏦 **Çoklu Banka Bağlantısı** — Bank A, B ve C'yi tek tıkla bağla / bağlantıyı kes
- 📊 **Birleşik Gösterge Paneli** — Tüm bankalardaki bakiye, harcama ve kategori dağılımı
- 🤖 **Gemini Destekli Asistan** — Türkçe, harcamalarına özel sohbet
- 🔍 **Önceden Hesaplanmış İçgörüler** — Kategori-banka yoğunlaşması, abonelikler, aykırı harcamalar
- 🛡️ **Güvenli Konuşma Sınırları** — Yatırım/vergi/hukuk tavsiyesi vermez, zarif şekilde reddeder
- 📱 **Mobil Görünüm** — 375–414px genişlikte mobil fintech uygulaması gibi tasarlandı
- 🇹🇷 **Tam Türkçe** — TRY para birimi, Türkçe harcama kategorileri ve metinler

## Önemli Not!!

- Projedeki banka hesaplarına bağlantı uygulama özelliği, kullanıcıdan sadece read-only(sadece okuma) izni alıp bakiye,
harcama geçmişi, abonelikler, faturalar, krediler, taksitler, hesap hareketleri, ödemeler gibi hassas olmayan verileri görüntüleyip hassas olan hiçbir veriye erişim sağlamaz, hesap üzerinde değişiklik yapamaz.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, vanilla CSS (`globals.css`) |
| Backend | Next.js API Routes (ayrı sunucu yok) |
| LLM | Google Gemini (`@google/generative-ai` ^0.21) |
| Dil | JavaScript (JSX) |
| Lint | ESLint 9 + `eslint-config-next` |
| Veri | Statik JSON dosyaları (`mock-data/`) |
| Durum | Bellek-içi `Map` (server) + React state (client) |

> Veritabanı, ayrı backend sunucu, gerçek auth veya gerçek banka API'si **yoktur** — bunlar tasarım dokümanında bilinçli olarak kapsam dışı bırakılmıştır.

---

## Gereksinimler

- **Node.js** 18.17 veya üzeri (Next.js 15 zorunluluğu)
- **npm** 9+ (veya pnpm / yarn — `package-lock.json` npm için yazılı)
- Bir **Google Gemini API anahtarı** — [Google AI Studio](https://aistudio.google.com/app/apikey) üzerinden ücretsiz alınabilir
- **Chrome** (DevTools mobil görünüm modu ile test edilmesi tavsiye edilir)

---

## Kurulum ve Çalıştırma

### 1. Repoyu klonla

```bash
git clone https://github.com/<kullanici>/Personal-Finance-Assistant.git
cd Personal-Finance-Assistant
```

### 2. `frontend/` klasörüne geç

> 🚨 **Önemli:** `package.json` repo kökünde değil, `frontend/` içindedir. Tüm `npm` komutları bu klasörden çalıştırılır.

```bash
cd frontend
```

### 3. Bağımlılıkları yükle

```bash
npm install
```

### 4. Ortam değişkenini ayarla

`frontend/` klasöründe `.env.local` adında bir dosya oluştur ve içine Gemini API anahtarını ekle:

```env
GEMINI_API_KEY=buraya_kendi_anahtarini_yapistir
```

> Bu projenin ihtiyaç duyduğu **tek** ortam değişkeni budur.

### 5. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıdan [http://localhost:3000](http://localhost:3000) adresine git.

> 📱 En iyi deneyim için Chrome DevTools'u aç (`F12`), cihaz araç çubuğunu etkinleştir (`Ctrl+Shift+M`) ve genişliği **375–414px** arasına ayarla. Uygulama mobil görünüme göre tasarlanmıştır.

### 6. (İsteğe bağlı) Production build

```bash
npm run build
npm run start
```

### Demo akışı

1. Açılış / login ekranındaki demo bilgileriyle gir
2. "Banka Bağla" ekranından Bank A, B ve C'yi bağla (her biri 1–2 sn yüklenir)
3. Gösterge panelinde birleştirilmiş bakiye ve kategori dağılımını incele
4. AI asistana _"Market harcamalarım en çok hangi bankada?"_ gibi sorular sor
5. Bir bankanın bağlantısını kesip verinin nasıl değiştiğini gör

---

## Dizin Yapısı

```
Personal-Finance-Assistant/
├── frontend/                          # Next.js 15 projesi — TÜM kod buradan çalışır
│   ├── app/
│   │   ├── api/
│   │   │   ├── assistant/
│   │   │   │   ├── chat/route.js           # Gemini sohbet endpoint
│   │   │   │   └── advice-preview/route.js # Önceden hesaplanmış öneri özeti
│   │   │   ├── connect-bank/route.js       # Banka bağlama
│   │   │   ├── disconnect-bank/route.js    # Banka bağlantısını kesme
│   │   │   ├── transactions/route.js       # Birleşik işlem listesi
│   │   │   └── dashboard/summary/route.js  # Toplu gösterge paneli verisi
│   │   ├── globals.css                # Stil
│   │   ├── layout.jsx                 # Root layout
│   │   └── page.jsx                   # UI giriş noktası
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── gemini.js              # Gemini SDK sarmalayıcısı + sistem promptu
│   │   │   └── insights.js            # Çoklu-banka sinyalleri (kategori yoğunlaşması, abonelikler, aykırılıklar)
│   │   └── api/
│   │       └── state.js               # Bellek-içi bağlı bankalar haritası
│   ├── package.json                   # Bağımlılıklar — npm komutları buradan çalışır
│   └── .env.local                     # Gemini API anahtarı (sen oluşturacaksın)
│
├── mock-data/                         # Sahte banka verileri
│   ├── bank_a.json
│   ├── bank_b.json
│   ├── bank_c.json
│   └── fallback_responses.json        # Gemini başarısız olursa kullanılacak yedek yanıtlar
│
├── docs/
│   └── superpowers/                   # Tasarım planları ve spec'ler
│
├── AIssistant_Project_Design_Document.md   # Ana tasarım dokümanı (kapsam, kısıtlar, demo akışı)
├── CLAUDE.md                          # AI asistan rehberi (proje kuralları)
└── README.md                          # Bu dosya
```

---

## Mimari Notlar

- **Tek Next.js projesi.** Backend ayrı bir sunucu değil; `frontend/app/api/*` altındaki route handler'lardır. `npm run dev` hem frontend'i hem API'yi başlatır.
- **`frontend/lib/` konuya göre bölünmüştür.** `lib/ai/` Gemini ve içgörü hesaplaması, `lib/api/` ise API state'i içindir. Yeni paylaşılan modüller uygun alt klasöre konulmalı.
- **Veri tabanı yok.** Sunucu yeniden başladığında bağlı bankalar sıfırlanır. Bu, tasarım dokümanı §3.3 tarafından bilinçli bir karardır.
- **Sohbet geçmişi kalıcı değildir.** Sayfa yenilenince konuşma sıfırlanır (§4.9).
- **AI güvenlik sınırları** sistem promptunda zorlanır: yatırım, vergi ve hukuk tavsiyesi reddedilir; reddetmeler kısa olur ve asistanın yapabileceklerine yönlendirir (§7).

---

## Branching Stratejisi

| Branch | Amaç |
|--------|------|
| `main` | Yayın hedefi — sadece `dev`'den merge alır |
| `dev` | Entegrasyon branch'i |
| `feature/ai` | Gemini sarmalayıcı, içgörüler, asistan route'ları |
| `feature/api` | Banka bağlantısı, işlemler, gösterge paneli |
| `feature/frontend` | UI kabuğu |
| `feature/mock-data` | Banka JSON dosyaları ve yedek yanıtlar |

Akış: `feature/<konu>` → `dev` → `main`. Detaylar `CLAUDE.md` içinde.

---

## Kısıtlar (Yapılmayacaklar)

Tasarım dokümanı §6.6'da açıkça kapsam dışında bırakılanlar:

- Ayarlar sayfası, hedef sayfası
- Gerçek banka bağlantısı, gerçek kimlik doğrulama
- Veri tabanı veya kalıcı saklama

