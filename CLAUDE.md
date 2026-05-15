# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

The Next.js scaffold and mock data are now on `main`:

- `frontend/` — Next.js 15 App Router project (`frontend/app/layout.jsx`, `frontend/app/page.jsx`, `frontend/app/globals.css`). `package.json` lives here, **not at repo root**.
- `mock-data/` — `bank_a.json`, `bank_b.json`, `bank_c.json`, `fallback_responses.json`.
- `AIssistant_Project_Design_Document.md` — still the source of truth for unbuilt features. §-references throughout this file point to it.

Not yet built: `frontend/app/api/*` routes, `frontend/lib/finance.js`, `frontend/lib/gemini.js`. When the design doc and the code conflict, the design doc wins for unbuilt features; the code wins for built ones.

Also present: `AIssistant - Personal Finance Assistant/` is an **untracked** loose-JSX UI prototype (HTML + `.jsx` files, no build tooling). It is **not** the Next.js project — do not edit it expecting the demo to pick up changes.

## What this project is

AIssistant is a **hackathon demo** of a multi-bank personal finance aggregator for Turkey (TRY only), built by a 4-person student team. It is a Next.js web app that *looks* like a mobile fintech app in a narrow viewport (375–414px) and uses Gemini to explain aggregated financial data.

The product's defining differentiator is **multi-bank aggregation** — not the dashboard, not the AI chat. Any feature that does not reinforce "data from multiple banks combined into one view" is secondary.

## Planned architecture (per the design doc)

- **Single Next.js project, App Router, under `frontend/`.** Backend lives in `frontend/app/api/*` routes — no separate Node server, no CORS layer, no microservices. `cd frontend && npm run dev` starts everything.
- **No database.** State is in-memory on the server and React state on the client. Server restart resets everything; this is intended.
- **Mock data only.** Banks are "connected" by loading `mock-data/bank_a.json`, `mock-data/bank_b.json`, `mock-data/bank_c.json` into in-memory state (the design doc calls this folder `/data/` — the actual folder is `mock-data/`). There is no real bank integration and bank names must stay generic (Bank A/B/C).
- **Finance calculations live in `frontend/lib/finance.js`** as pure functions consumed by API routes. Do not scatter aggregation logic across route handlers or React components.
- **Gemini integration lives in `frontend/lib/gemini.js`** and is only called from API routes (`/api/assistant/chat`, `/api/assistant/advice-preview`). The frontend never talks to Gemini directly.

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

Five branches, one per §6.1 ownership slice, all forked from `main`:

- `main` — integration target. PRs merge here.
- `feature/frontend` — UI screens (Developer A). **Merged** via PR #2.
- `feature/mock-data` — bank JSON + fallback strings. **Merged** via PR #1.
- `feature/api` — `frontend/app/api/*` routes (Developer B). **Stale** — behind `main` by the frontend + mock-data merges; rebase before resuming.
- `feature/ai` — Gemini integration in `frontend/lib/gemini.js` + `/api/assistant/*` (Developer C). **Stale** — same as above.
- `dev` — only the initial commit; treat as unused.

Before starting work on `feature/api` or `feature/ai`: `git checkout <branch> && git rebase main`. Their working tree currently lacks the Next.js scaffold those routes/integrations are supposed to live inside.

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

No test framework is specified in the design doc. If you add tests, scope them to `frontend/lib/finance.js` (the pure calculation functions) where they have the highest value-per-effort.

Environment variables (§6.7): only `GEMINI_API_KEY` in `frontend/.env.local`. There is no other configuration.
