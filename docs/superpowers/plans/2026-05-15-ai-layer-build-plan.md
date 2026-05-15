# AI Layer — Build Plan

**Source spec:** [2026-05-15-ai-layer-design.md](../specs/2026-05-15-ai-layer-design.md)
**Branch:** `feature/ai` (rebase on `main` first — currently stale, lacks Next.js scaffold)
**Mode:** branch mode (git + GitHub remote present)
**Total steps:** 5
**Estimated PRs:** 1 (`feature/ai` → `main`); hackathon slice is too small for per-step PRs.
**Final diff target:** 4 new files + 2 edited files (no more).

---

## Pre-flight: resolved decisions (from spec §11 Open Items)

| Question | Decision | Rationale |
|---|---|---|
| Does the chat body need `transactions`? | **Yes** — `AssistantSheet` sends `transactions` alongside `financialContext`. | We're already editing `page.jsx` for advice preview; the marginal cost is one fetch-body field. Without it, chat insights are weaker than dashboard insights — that's an incoherent product. |
| Deprecate `apiOffline` prop on `AdviceCard`? | **No, keep as-is.** | Removing is "while we're here" scope creep. The prop drives an offline banner unrelated to advice text. Touching it raises merge conflict risk with `feature/frontend`. |

These decisions are binding for the steps below. Do not relitigate them mid-execution.

---

## Dependency graph

```
Step 1 (setup) ──┐
                 ├─► Step 3 (gemini.js) ──┐
Step 2 (insights.js + tests) ─────────────┼─► Step 4 (routes + frontend wiring) ──► Step 5 (manual verification)
                                          ┘
```

Steps 1 and 2 can run in parallel — Step 2 is pure JS, doesn't need the SDK.

---

## Step 1 — Setup: SDK install + env wiring

**Files touched**
- `frontend/package.json` — add `"@google/generative-ai": "^0.21.0"`
- `frontend/.env.local` — `GEMINI_API_KEY=<user supplies>`
- `frontend/.gitignore` — verify `.env.local` is ignored (Next.js default already covers it; only add if missing)

**Exit criteria**
- [ ] `cd frontend && npm install` completes cleanly.
- [ ] `node -e "require('@google/generative-ai')"` does not throw.
- [ ] `git status` shows `.env.local` as untracked-and-ignored (not staged).

**Anti-overengineering guardrails**
- No `.env.example` file. The spec says `GEMINI_API_KEY` is the only variable; an example file for one variable is noise.
- No startup validation that the key is set. The route layer's fallback hierarchy already handles missing-key gracefully.

**Cold-start context for this step:** This is Day 1 of `feature/ai`. The branch is stale — rebase on `main` first. The Next.js project lives at `frontend/`, not repo root.

---

## Step 2 — `lib/insights.js` (no tests — user override)

> **Test policy override:** User directed "TEST olmayacak" (no tests). Design doc §9 "mandatory unit tests" line is **superseded by user instruction**. Verification happens via manual integration walkthrough in Step 5 only.

**Files touched**
- `frontend/lib/insights.js` *(new)*

**Implementation order** (straight implementation against spec §4.1–§4.4)
1. `categoryBankConcentration(transactions, summary)`
2. `recurringSubscriptions(transactions)`
3. `outlierTransactions(transactions)`
4. `bankBehaviorProfile(transactions)`
5. `computeAllInsights(transactions, summary)` — aggregator

**Anti-overengineering guardrails**
- Plain `Array.prototype` methods + `Map`/`Set`. No `lodash`, no utility lib.
- No try/catch — bad input throws. Route layer is the trust boundary.
- Output shapes match spec §4.1–§4.4 **exactly**. Do not invent extra fields like `id`, `timestamp`, or `confidenceScore`.
- No "configurable" thresholds (`OUTLIER_MULTIPLIER`, `SUBSCRIPTION_TOLERANCE`). Inline `3` and `0.05`. Promote to a const only if a 2nd caller needs to override.

**Exit criteria**
- [ ] `frontend/lib/insights.js` exports all 5 named functions.
- [ ] No external dependencies imported.

**Sanity check (recommended, but optional — not a blocker):** Run the aggregator against `mock-data/bank_a.json` transactions and eyeball the four insight outputs. Useful for tuning the `recurringSubscriptions` heuristic (±5% tolerance, 2+ occurrences) before Step 4 wires it into the routes.

---

## Step 3 — `lib/gemini.js`

**Files touched**
- `frontend/lib/gemini.js` *(new)*

**Exports (exactly these two)**
- `generateChatResponse({ financialContext, insights, chatHistory, userMessage }) -> Promise<string>`
- `generateAdvicePreview({ financialContext, insights }) -> Promise<string>`

**Internal (not exported)**
- `SYSTEM_PROMPT` const (Turkish text from spec §5)
- `buildChatPrompt(...)` / `buildAdvicePrompt(...)` — string builders
- 15-second timeout via `Promise.race` — inline, not a helper file

**Anti-overengineering guardrails**
- One model instance at module load. No factory, no model registry, no per-call construction.
- Both functions **throw** on Gemini failure. The route catches; gemini.js does not swallow.
- No custom error class. `new Error(msg)` is enough.
- No retry / backoff. Spec §6 explicitly chose timeout-then-fallback.
- No `AbortSignal` plumbing. The 15s timeout is sufficient.
- No streaming. The frontend renders the response as a single bubble; streaming adds complexity for no demo value.

**Learning-mode contribution opportunity (for execution time)**
The SYSTEM_PROMPT in spec §5 is the highest-leverage code in this layer — every Gemini reply is shaped by it. Read it carefully before pasting. Specific things worth pausing on:
- Is "yapabilirsiniz/inceleyebilirsiniz" the right register for the target demo audience? (formal vs. semi-formal)
- The "YASAKLI BİR KONU" refusal rule — does it leave room for the assistant to discuss budgeting (which is not investment advice) without tripping the filter?
- "3-5 cümleyi geçme" — strict ceiling, or soft preference? Affects how much detail Gemini will pack into one reply.

Tweaks here change the entire product feel. The contribution is editing the prompt, not writing JS.

**Exit criteria**
- [ ] `import { generateChatResponse, generateAdvicePreview } from "./lib/gemini.js"` resolves.
- [ ] Smoke test with a real API key: `generateAdvicePreview({financialContext, insights})` returns Turkish text within 15s for the `mock-data/bank_a.json` summary.

---

## Step 4 — Two API routes + frontend wiring (the integration step)

**Files touched**
- `frontend/app/api/assistant/chat/route.js` *(new)*
- `frontend/app/api/assistant/advice-preview/route.js` *(new)*
- `frontend/app/page.jsx` *(edit — DashboardScreen state + AssistantSheet chat body)*

**Shared route body (inlined in both files — do NOT extract until a 3rd route exists)**
```
1. Parse JSON body.
2. If !financialContext OR transactions is not an array:
     return 200 { success: true, response: fallback.assistantUnavailable + random genericAdvice, source: "fallback" }
3. If financialContext.connectedBanks === 0 OR transactions.length === 0:
     return 200 { success: true, response: fallback.noBanksConnected, source: "fallback" }
4. insights = computeAllInsights(transactions, financialContext)
5. try:
     response = await generate{Chat,Advice}Response/Preview(...)
     return 200 { success: true, response, source: "gemini" }
   catch (e):
     console.log("[assistant] gemini error:", e)
     return 200 { success: true, response: fallback.assistantUnavailable + " " + random genericAdvice, source: "fallback" }
```

**Frontend edit to `page.jsx` (~12 lines)**
1. Add `const [advicePreview, setAdvicePreview] = useState(null);` in `Home`.
2. After `refreshFinancialData` resolves and `summary?.connectedBanks > 0`, fire-and-forget POST to `/api/assistant/advice-preview`. On any error -> `setAdvicePreview(null)`.
3. Pass `advicePreview` prop -> `DashboardScreen` -> `AdviceCard`. `AdviceCard` prefers `advicePreview` over `summary?.advicePreview`.
4. In `AssistantSheet`'s chat fetch body, add `transactions` field (resolves Open Item 1).

**Anti-overengineering guardrails**
- Status code is **always 200** — even on fallback. The frontend never enters an error path.
- Response envelope is `{ success, response, source }` — exactly those three fields. No request IDs, no timestamps, no model version, no token counts.
- No loading spinner for advice preview. It appears when it appears (fire-and-forget).
- No retry on the frontend if the fetch fails. Falling back to `null` is the design.
- Two route files; some duplication is fine. **Do not** create `lib/route-helpers.js` for two callers.
- Do not change `AdviceCard`'s prop API beyond the prefer-`advicePreview` line. Specifically: leave `apiOffline` alone (per pre-flight decision).

**Exit criteria**
- [ ] `POST /api/assistant/advice-preview` with valid body returns Turkish 1–2 sentence text in <15s.
- [ ] `POST /api/assistant/chat` with `connectedBanks >= 2` returns Turkish reply naming at least one bank.
- [ ] Both routes return fallback (HTTP 200, `source: "fallback"`) when `GEMINI_API_KEY` is removed.
- [ ] Dashboard AdviceCard populates within ~2s of dashboard load.
- [ ] `git diff main...feature/ai --stat` shows 4 new files + 1 edited file (`page.jsx`).

---

## Step 5 — Manual integration verification

**Procedure:** Run the 8-item checklist from spec §9 in Chrome DevTools mobile view (375px).

```
[ ] No banks connected -> assistant opens -> noBanksConnected fallback shown
[ ] 1 bank connected -> ask a spending question -> Gemini reply mentions that bank by name
[ ] 2+ banks connected -> "Hangi bankada en cok harciyorum?" -> cross-bank comparative response
[ ] Forbidden topic: "Bitcoin alayim mi?" -> polite refusal + redirect, no investment advice
[ ] Dashboard load -> AdviceCard populates with 1-2 sentence Gemini text within ~2s
[ ] GEMINI_API_KEY removed/invalid -> all calls fall through to fallback, never raw errors
[ ] Turkish output even when prompted in English ("Tell me my spending") -> still Turkish
[ ] Refresh page -> chat history cleared (no persistence)
```

**Exit criteria**
- [ ] All 8 items pass, OR each failure has a documented follow-up note appended to this plan.
- [ ] The 3-minute demo flow from design doc §1.15 runs without intervention.

If a failure is found that can't be fixed in <15 minutes, **stop, document, and surface** — do not silently patch around it.

---

## Plan-level invariants (verified after every step)

- No new dependencies beyond `@google/generative-ai`.
- No edits to `lib/finance.js`, `lib/state.js`, or any non-assistant route (Dev A / Dev B territory).
- No edits to existing JSON in `mock-data/` (fallback keys already exist — verified during pre-flight).
- Turkish only in user-facing strings; code identifiers stay English.
- Final `git diff main...feature/ai --stat` shows **6 paths** total (4 new, 2 edited if `package.json` counts; 5 if `.env.local` is gitignored as expected).

---

## What I deliberately cut from this plan

Following anti-overengineering review:

| Cut | Why |
|---|---|
| Shared `lib/route-helpers.js` for the two routes | Extract abstraction on the second case, not the first. Two routes is the first case. |
| Custom error class for Gemini failures | `console.log` + fallback works. No caller branches on error kind. |
| Retry / exponential backoff | Spec §6 explicitly chose timeout-then-fallback. |
| Mock-based tests for `gemini.js` / routes | Spec §9 explicitly excludes them. Mocks add scaffolding without catching demo-day failures (which are API-key or network). |
| Deprecate `apiOffline` prop | Out of scope; raises conflict risk with `feature/frontend`. |
| Adversarial-review sub-agent step (blueprint skill's default Phase 4) | A 5-step hackathon slice does not justify dispatching an Opus reviewer. Re-add if scope grows. |
| Per-step PRs | One PR for 6 files. Per-step PRs would be ceremony for this team. |
| Step-per-file granularity | Steps map to value units (insights+tests = one unit), not file count. |

---

## Plan mutation protocol

If during execution you find a step needs to be split, inserted, skipped, reordered, or abandoned:

1. Append a `## Mutation log` entry at the bottom of this file with date, which step, what changed, and why.
2. Do not rewrite earlier sections silently. The audit trail matters.
3. If the mutation would push beyond 6 files, **stop and ask** — that's the scope creep threshold.
