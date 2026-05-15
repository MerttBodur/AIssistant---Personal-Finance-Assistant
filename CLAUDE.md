# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

The full stack lives in `main` once feature branches merge through `dev`:

- `frontend/` — Next.js 15 App Router project. `package.json` lives here, **not at repo root**.
  - `frontend/app/page.jsx`, `frontend/app/layout.jsx`, `frontend/app/globals.css` — UI shell.
  - `frontend/app/api/assistant/{chat,advice-preview}/route.js` — AI endpoints.
  - `frontend/app/api/{connect-bank,disconnect-bank,transactions,dashboard/summary}/route.js` — data/aggregation endpoints.
  - `frontend/lib/ai/` — AI layer modules (`gemini.js` SDK wrapper + system prompt, `insights.js` pre-computed signal: category-bank concentration, recurring subscriptions, outliers, bank behavior profile).
  - `frontend/lib/api/` — API-layer state and shared helpers (`state.js` in-memory connected-banks Map).
- `mock-data/` — `bank_a.json`, `bank_b.json`, `bank_c.json`, `fallback_responses.json`.
- `AIssistant_Project_Design_Document.md` — design source of truth. §-references throughout this file point to it.

There is no `frontend/lib/finance.js`. Aggregation logic is inlined inside `frontend/app/api/dashboard/summary/route.js` — the design doc §3.6 explicitly allows either approach and the inline version was chosen to keep the abstraction surface small. If a future change makes aggregation reusable across routes, extract it into `frontend/lib/api/finance.js` (not the design doc's older `frontend/lib/finance.js` location).

Also present: `AIssistant - Personal Finance Assistant/` is an **untracked** loose-JSX UI prototype (HTML + `.jsx` files, no build tooling). It is **not** the Next.js project — do not edit it expecting the demo to pick up changes.

## What this project is

AIssistant is a **hackathon demo** of a multi-bank personal finance aggregator for Turkey (TRY only), built by a 4-person student team. It is a Next.js web app that *looks* like a mobile fintech app in a narrow viewport (375–414px) and uses Gemini to explain aggregated financial data.

The product's defining differentiator is **multi-bank aggregation** — not the dashboard, not the AI chat. Any feature that does not reinforce "data from multiple banks combined into one view" is secondary.

## Planned architecture (per the design doc)

- **Single Next.js project, App Router, under `frontend/`.** Backend lives in `frontend/app/api/*` routes — no separate Node server, no CORS layer, no microservices. `cd frontend && npm run dev` starts everything. The "AI files should live in their own folder" question comes up periodically — they do, **inside the Next.js project**, under `frontend/lib/ai/`. Moving them outside `frontend/` would either require a separate Node server (which §3.2 forbids) or path-alias gymnastics with zero benefit.
- **`frontend/lib/` is split by concern.** `lib/ai/` holds Gemini and insight pre-computation. `lib/api/` holds API-route state and shared helpers. UI components stay under `frontend/app/`. New shared backend module → choose the matching subfolder; do not drop bare files into `frontend/lib/`.
- **No database.** State is in-memory on the server and React state on the client. Server restart resets everything; this is intended.
- **Mock data only.** Banks are "connected" by loading `mock-data/bank_a.json`, `mock-data/bank_b.json`, `mock-data/bank_c.json` into in-memory state (the design doc calls this folder `/data/` — the actual folder is `mock-data/`). There is no real bank integration and bank names must stay generic (Bank A/B/C).
- **Gemini integration lives in `frontend/lib/ai/gemini.js`** and is only called from API routes (`/api/assistant/chat`, `/api/assistant/advice-preview`). The frontend never talks to Gemini directly. The system prompt forces multi-bank, Turkish-formal, refusal-aware behavior.
- **AI differentiator: `frontend/lib/ai/insights.js`.** Before calling Gemini, the API computes deterministic signals (top-3 category-bank concentration, ±5% recurring subscription detection, 3×-median outliers, per-bank behavior profile) and ships them as structured JSON in the prompt. This is what separates this assistant from raw-LLM chat — the LLM gets pre-extracted multi-bank signal, not raw transaction lists. Never strip this layer without a replacement plan.

The five planned API routes and their response shapes are specified in §3.5. The Gemini prompt structure is specified in §4.3 — every request must include a financial-context block built from the same data the dashboard uses, plus chat history, plus the system prompt with the safety rules.

## Hard constraints — do not violate

These are explicit non-goals in the design doc. If a session tempts you to add them, stop.

- **No database.** Not Postgres, MongoDB, Supabase, Firebase, or SQLite (§3.3).
- **No real auth.** Login is a hardcoded visual gate with demo credentials (§1.7).
- **No chat history persistence.** Conversation lives in component state for the session only and clears on refresh (§4.9).
- **No separate backend server.** Everything is Next.js API routes (§3.2).
- **No real bank APIs.** Bank connection is simulated with a 1–2s loading animation that loads a JSON file (§1.2, §2.6).
- **No investment, trading, legal, or tax advice from the assistant.** §1.13, §4.7, and all of §7 enumerate the wording rules. The system prompt in §4.3 must enforce these.
- **No previous-month comparison, anomaly detection, settings page, goals/budget page, transaction detail view, or CSV upload UI.** Explicitly cut in §6.6.

## Assistant safety boundaries (the AI feature itself)

Section 7 is the canonical reference when editing the Gemini system prompt or assistant response handling. Key points:

- Refusals must be **brief and redirect to what the assistant can do** (review spending, compare across banks, suggest habit changes).
- The assistant should **reference specific source banks by name** ("Most food spending comes from Bank A") — this is the differentiator from a generic finance chatbot.
- When data is missing or no banks are connected, the assistant must say so rather than fabricate analysis (§4.8).
- Gemini failures must fall back to **pre-cached generic advice strings** stored in `mock-data/fallback_responses.json` (§4.8, §6.5). Never surface raw API errors to the user.

## Branching strategy

Per-concern feature branches integrate through `dev`, then `dev` flows to `main`. **Never commit AI work onto `feature/api` or API work onto `feature/ai`** — the branches exist to keep the two concerns auditable and reviewable on their own.

- `main` — release target. Only receives merges from `dev`.
- `dev` — integration branch. Both feature branches merge here first.
- `feature/ai` — Gemini wrapper, insight pre-computation, assistant routes. Touches `frontend/lib/ai/**` and `frontend/app/api/assistant/**`.
- `feature/api` — bank connect/disconnect, transactions, dashboard summary. Touches `frontend/lib/api/**` and `frontend/app/api/{connect-bank,disconnect-bank,transactions,dashboard}/**`.
- `feature/frontend` — UI shell. **Merged** via PR #2 historically; reopen for further UI-only changes.
- `feature/mock-data` — bank JSON + fallback strings. **Merged** via PR #1.

**Required flow for every change:**

1. Identify the concern (AI vs. API vs. UI vs. mock-data).
2. Check out the matching feature branch and rebase it onto `main`: `git checkout feature/<concern> && git rebase main`.
3. Implement, commit on that branch.
4. Merge into `dev`: `git checkout dev && git merge feature/<concern>`.
5. Merge `dev` into `main`: `git checkout main && git merge dev`.

If a change genuinely spans concerns (e.g., a contract change between AI and API), split it into two commits on the two branches and land them through `dev` in order. CLAUDE.md updates and other repo-wide docs may travel on whichever feature branch already carries the substantive change.

## Scope discipline

The design doc commits to a 4-day build (§6.2) and a 4-person team with non-overlapping screen ownership (§6.1). When asked to add features:

1. Check §6.6 first — the feature may have been explicitly cut.
2. If a request would require shared files between Developer A and Developer B (per §6.1), flag the merge-conflict risk before implementing.
3. The MVP success condition (§1.15) is a 3-minute demo flow. Anything that doesn't show up in that flow is polish, not priority.

## Demo target environment

- Browser: Chrome with DevTools device toolbar (mobile view, 375–414px width).
- Deployment: localhost. Vercel is optional for the presentation.
- Currency: TRY only. No multi-currency handling.
- Locale: Turkish spending patterns in mock data (market alışverişi, maaş, kira, etc.).

## Commands

Run from `frontend/` (where `package.json` lives):

- `npm install` — first time only
- `npm run dev` — starts Next.js dev server on `localhost:3000` (frontend + API routes)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — Next.js ESLint

No test framework is wired up and the project deliberately ships without tests for the hackathon — verify changes by running `npm run dev` and exercising the demo flow in the mobile-view browser.

Environment variables (§6.7): only `GEMINI_API_KEY` in `frontend/.env.local`. There is no other configuration.
