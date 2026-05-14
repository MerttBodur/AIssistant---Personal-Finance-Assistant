# AIssistant — Project Design Document v2

## AI-Powered Personal Finance Aggregator

**Project type:** Hackathon demo
**Team:** 4 students (1 leader/AI developer, 1 content researcher, 2 developers)
**Target region:** Turkey
**Currency:** TRY (single currency)
**AI model:** Gemini API
**Platform:** Responsive web-app (mobile-look, runs in browser)
**Deployment:** Localhost demo, optional Vercel for presentation

---

# Section 1 — Product & User Flow

## 1.1 Product Definition

AIssistant is a standalone personal finance aggregator that connects to multiple bank accounts and uses AI to help users understand their unified financial picture.

The user connects their bank accounts (Bank A, Bank B, Bank C) through the app. AIssistant pulls transaction and balance data from those accounts, aggregates it into one dashboard, and provides AI-powered financial explanations and advice.

The product answers one core question: "What is happening across all my money, and what should I pay attention to?"

AIssistant is not an extension inside an existing bank app. It is an independent product that sits above the user's bank accounts and provides a combined financial view with AI-driven insights.

## 1.2 Demo Reality

For the hackathon demo, real bank API connections do not exist.

The demo uses mock CSV/JSON data that loads when the user "connects" a bank through the UI. The app behaves as if the data came from a real bank connection. The user sees the bank connection flow, clicks connect, a loading animation plays, and the dashboard populates with pre-built financial data.

This means:

- Bank connections are simulated through mock data loading
- The bank connection page shows Bank A, Bank B, Bank C as available institutions
- No real bank names are used
- No real API calls are made to any bank
- The demo proves the product concept, not the integration layer

The demo must be convincing enough to show what the real product would feel like, without building actual bank infrastructure.

## 1.3 What AIssistant Does

AIssistant performs four functions:

**Aggregate:** Combine financial data from multiple bank accounts into one unified view. The user should not need to switch between bank apps to understand their total financial position.

**Summarize:** Show clear financial summaries including total balance across accounts, monthly income, monthly expenses, category breakdown, and monthly financial status.

**Explain:** Use AI to explain what the financial data means. The assistant answers questions like "Why did I spend more this month?" or "Which account has the most expenses?" using the user's actual aggregated data.

**Advise:** Suggest practical, safe personal finance habit improvements. The assistant may say "You may consider reducing delivery spending" but must never say "You should invest in this stock."

## 1.4 What AIssistant Does Not Do

AIssistant must not:

- Give investment advice or recommend stocks, crypto, funds, or financial products
- Automate transactions, move money, or pay bills
- Give legal, tax, or compliance advice
- Guarantee savings or financial improvement
- Present predictions as certain outcomes
- Act as a portfolio manager or trading assistant

These boundaries apply to the AI assistant, the dashboard, and all product messaging. The product is a finance guide, not a financial advisor.

## 1.5 MVP User Flow

The user journey for the demo:

1. User opens the app in browser
2. Fake login screen appears
3. User logs in with demo credentials
4. Dashboard loads (empty state — no banks connected yet)
5. User navigates to Bank Connections page
6. User sees Bank A, Bank B, Bank C as available connections
7. User clicks "Connect" on Bank A
8. Loading animation plays (simulating API handshake)
9. Bank A data loads into the system
10. User returns to dashboard
11. Dashboard now shows financial data from Bank A
12. User connects Bank B (optional, shows aggregation)
13. Dashboard updates with combined data from both banks
14. AI advice preview appears near the financial summary
15. User clicks assistant icon
16. Assistant popup opens
17. User asks a question about their finances
18. Assistant responds using aggregated financial context
19. User explores transactions, sees data from multiple accounts labeled by source bank

This flow demonstrates the core product value: multi-bank aggregation + AI-powered financial understanding.

## 1.6 MVP Screens

The demo requires five screens or interface areas:

1. **Login Page** — Fake login, demo credentials only
2. **Dashboard** — Aggregated financial summary, charts, AI advice preview, assistant icon
3. **Bank Connections Page** — List of available banks, connect/disconnect buttons, connection status
4. **Transaction History** — Unified transaction list from all connected banks, filterable by bank source
5. **Assistant Chat Popup** — Chat interface, contextual AI responses, follow-up support

Screens that are **cut from the demo:**

- Settings page (not needed for hackathon)
- Goals/Budget page (nice-to-have, build only if time permits)
- Individual account detail pages
- Profile/account management

## 1.7 Login Page

The login page exists to make the demo feel like a real product. It does not implement real authentication.

Requirements:

- Email and password fields (hardcoded demo credentials)
- Login button that redirects to dashboard
- Clean, professional fintech appearance
- No registration flow
- No forgot password flow
- No real session management

The login page should take less than 30 minutes to build. It is a visual gate, not a security system.

## 1.8 Dashboard

The dashboard is the central screen. It shows the user's aggregated financial situation at a glance.

Required dashboard elements:

**Top area — Key metrics:**
- Total balance across all connected accounts
- Monthly income (aggregated)
- Monthly expenses (aggregated)
- Number of connected banks

**Middle area — Analysis:**
- Category breakdown chart (pie or bar)
- Monthly income vs expenses chart
- Per-bank balance breakdown (shows which bank holds what)

**AI Advice area:**
- Short AI-generated insight near the financial summary
- Example: "Your food spending across all accounts increased this month. You may review delivery orders from Bank A."

**Assistant access:**
- Floating chat icon (bottom-right)
- Opens the assistant popup when clicked

The dashboard must answer these questions immediately:

- How much money do I have total?
- How much did I earn and spend this month?
- Which categories are eating my money?
- Which bank account is most active?
- What does the AI assistant think I should know?

## 1.9 Bank Connections Page

This page is new and central to the product's identity. It is what makes AIssistant different from a single-bank finance app.

Required elements:

- List of available banks: Bank A, Bank B, Bank C
- Each bank shows a card with: bank name, connection status (Connected / Not Connected), Connect or Disconnect button
- When user clicks Connect: a loading animation plays for 1-2 seconds, then the status changes to Connected and the mock data loads
- A brief explanation text: "Connect your bank accounts to see your full financial picture in one place."
- Visual indicator of how many banks are connected

The Bank Connections page tells the product story. Even though the demo uses mock data, this page makes it clear that AIssistant's value comes from aggregation across multiple financial sources.

When a bank is "connected," the corresponding mock JSON/CSV data file loads into the application state. When "disconnected," that bank's data is removed from the aggregated view.

## 1.10 Transaction History

The transaction history shows a unified list of all transactions from all connected banks.

Required fields per transaction:

- Date
- Description
- Amount
- Category (Food, Transport, Rent, Salary, etc.)
- Type (income or expense)
- Source bank (Bank A, Bank B, etc.)

The source bank field is critical. It shows that transactions come from different accounts and are combined into one view. This is the aggregation proof.

Optional features (build if time permits):

- Filter by bank source
- Filter by category
- Sort by date or amount
- Simple search

## 1.11 Assistant Chat Popup

The assistant popup opens when the user clicks the chat icon from the dashboard.

Requirements:

- Chat-style interface with message bubbles
- User message input field
- Assistant response display
- Conversation persists while popup is open (temporary, in-memory only)
- Closes without losing conversation during the session
- Feels like part of the dashboard, not a separate product

The assistant is aware of the user's aggregated financial context. It knows which banks are connected, what the total spending looks like, which categories are highest, and can reference specific bank sources when relevant.

Example interaction:

> **User:** Why did I spend more this month?
>
> **Assistant:** Your monthly expenses increased mainly because food and shopping were higher than usual. Most of the increase comes from Bank A transactions. You may review recent food purchases and set a weekly spending limit.

## 1.12 Assistant Behavior

The assistant has four responsibilities:

**1. Explain dashboard data** — Tell the user what the numbers mean.

> "Your expenses are higher than last month mainly because transportation spending from Bank A increased."

**2. Analyze patterns** — Identify simple patterns in income, spending, and savings.

> "Your savings rate is lower this month because expenses increased faster than income."

**3. Give improvement advice** — Suggest practical actions.

> "You can reduce recurring subscription costs by reviewing unused services across your connected accounts."

**4. Answer follow-up questions** — Respond to user questions using financial context.

> User: "Which bank has the most expenses?"
> Assistant: "Bank A accounts for 65% of your total expenses this month, mainly from food and shopping categories."

## 1.13 Assistant Limitations

The assistant must not:

- Give investment, trading, or portfolio advice
- Recommend stocks, crypto, funds, or financial products
- Automate transactions or move money
- Guarantee savings or financial improvement
- Give legal or tax advice
- Present predictions as certain outcomes

Correct wording examples:

- "You may consider reducing entertainment spending."
- "Your food spending increased this month compared to your usual pattern."
- "It may help to review subscriptions across all connected accounts."

Incorrect wording examples:

- "You should invest in this stock."
- "This plan will guarantee savings."
- "I will automatically move your money."

## 1.14 What Makes AIssistant Different

AIssistant is not a chatbot and not a single-bank dashboard.

It is different because:

- It aggregates data from multiple bank accounts into one view
- The AI assistant understands the user's complete financial picture, not just one account
- It can compare spending and income patterns across banks
- The dashboard shows a unified financial summary that no single bank app provides
- The assistant gives advice based on the whole picture, not a partial view

A single bank app shows only its own data. AIssistant shows everything in one place and explains it with AI.

## 1.15 MVP Success Condition

The demo is successful if the user can:

1. Log in
2. Navigate to Bank Connections
3. Connect at least one bank
4. See dashboard populate with financial data
5. Connect a second bank and see the dashboard aggregate both
6. Read AI advice on the dashboard
7. Open the assistant and ask a question
8. Receive a contextual, safe, AI-generated response

Strong demo scenario:

User logs in → Connects Bank A → Dashboard shows Bank A data → Connects Bank B → Dashboard now shows combined data → AI advice says "Your total food spending across both accounts is high this month" → User opens assistant → Asks "Which bank should I watch?" → Assistant explains which account drives most spending → Assistant suggests a practical improvement.

This scenario proves the product concept in under 3 minutes.

---

# Section 2 — Frontend

## 2.1 Purpose

This section defines the frontend structure for the hackathon demo.

The frontend must produce a responsive, mobile-looking web app that runs in the browser. It should feel like a fintech mobile app opened on a phone screen, but it runs as a standard Next.js web application.

## 2.2 Technology

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts or Chart.js (whichever the developers prefer)
- **Data:** Mock JSON files loaded on "bank connection"
- **AI responses:** Fetched from Next.js API routes that call Gemini

## 2.3 Mobile-First Responsive Design

The UI must be designed for a narrow viewport (375-414px width) as the primary experience. This simulates a mobile app in the browser.

Approach:

- Use Chrome DevTools device toolbar for development and demo
- Design all components for a single-column mobile layout first
- Desktop/wide screen is secondary and does not need special attention
- Use a max-width container (e.g., 430px centered) on wide screens to maintain the mobile feel

The jury opens localhost in Chrome, presses F12, switches to mobile view, and the app looks like a native mobile finance app. This is the target experience.

## 2.4 Screen Structure

The app uses a bottom navigation bar (like a mobile app) with three tabs:

1. **Dashboard** (home icon) — Default screen after login
2. **Connections** (link/bank icon) — Bank Connections page
3. **Transactions** (list icon) — Transaction history

The assistant chat icon floats above the bottom nav bar (bottom-right).

The login page is a separate route with no navigation bar.

## 2.5 Dashboard Screen — Frontend Details

Layout (top to bottom, single column):

1. **Header area:** "Welcome, [name]" with current month label
2. **Connected banks indicator:** "3 banks connected" or "No banks connected — tap Connections to get started"
3. **Balance card:** Total balance across all connected banks, large number, prominent
4. **Income/Expense row:** Two side-by-side cards showing monthly income and monthly expenses
5. **Category chart:** Pie chart or horizontal bar chart showing expense categories
6. **Per-bank breakdown:** Small cards or list showing balance per connected bank (Bank A: ₺X, Bank B: ₺Y)
7. **AI advice card:** A styled card showing the AI-generated financial insight
8. **Floating assistant icon:** Fixed position bottom-right, above the nav bar

If no banks are connected, the dashboard shows an empty state with a prompt to visit the Connections page.

## 2.6 Bank Connections Screen — Frontend Details

Layout (top to bottom):

1. **Header:** "Bank Connections"
2. **Explanation text:** "Connect your bank accounts to see all your finances in one place."
3. **Bank cards:** One card per bank (Bank A, Bank B, Bank C), each showing:
   - Bank name and a generic bank icon
   - Connection status badge (Connected / Not Connected)
   - Connect or Disconnect button
4. **Connection count:** "2 of 3 banks connected"

When user taps Connect:

- Button changes to a loading spinner
- After 1-2 seconds, status changes to "Connected"
- A success toast or animation appears briefly
- The corresponding mock data file loads into application state

When user taps Disconnect:

- Bank's data is removed from state
- Status reverts to "Not Connected"
- Dashboard updates accordingly

## 2.7 Transaction History Screen — Frontend Details

Layout:

1. **Header:** "Transactions"
2. **Filter chips (optional):** "All", "Bank A", "Bank B", "Bank C" — filter by source
3. **Transaction list:** Scrollable list of transaction cards, each showing:
   - Date (left)
   - Description + category tag (center)
   - Amount with color (green for income, red for expense) (right)
   - Source bank label (small text, e.g., "Bank A")

Transactions should be sorted by date (newest first).

## 2.8 Assistant Chat Popup — Frontend Details

Opens as an overlay/modal from the bottom (like a mobile chat sheet).

Layout:

1. **Header:** "AIssistant" with a close button
2. **Chat area:** Scrollable message list with user messages (right-aligned) and assistant messages (left-aligned)
3. **Input area:** Text input field with send button at the bottom

Behavior:

- Messages persist in component state while popup is open
- Closing and reopening the popup within the same session preserves the conversation
- Refreshing the page clears the conversation (no persistence needed)
- While waiting for Gemini response, show a typing indicator

## 2.9 Login Page — Frontend Details

Simple centered card layout:

1. App name and logo/icon at the top
2. Email input field (pre-filled with demo email)
3. Password input field (pre-filled with demo password or dots)
4. Login button
5. Optional: brief product tagline below the logo

Login button navigates to the dashboard. No validation logic beyond checking the fields are not empty. The demo credentials can be hardcoded.

## 2.10 Visual Style

The app should look like a modern fintech mobile app.

Style direction:

- Clean, minimal interface
- White or light gray background
- Accent color for primary actions (blue or green, finance-appropriate)
- Rounded cards with subtle shadows
- Clear typography hierarchy
- Finance-appropriate iconography
- Professional but not corporate — friendly fintech tone

The app must not look like: a desktop admin panel, a trading terminal, a generic chatbot, or a banking backend system.

## 2.11 Mock Data in Frontend

The frontend loads mock JSON data when a bank is "connected."

Data files:

- `bank_a_transactions.json` — Transactions for Bank A
- `bank_b_transactions.json` — Transactions for Bank B
- `bank_c_transactions.json` — Transactions for Bank C

Each file contains an array of transaction objects. When a bank is connected, its transactions are added to the global state. When disconnected, they are removed. The dashboard and transaction history always reflect the current set of connected banks.

The content researcher is responsible for creating realistic Turkish spending patterns in these files. Examples: market purchases, rent payments, salary deposits, transportation costs, subscription services, utility bills.

## 2.12 Frontend Success Condition

The frontend succeeds if:

- The app looks like a fintech mobile app in the browser
- The user can log in, connect banks, view aggregated data, and chat with the assistant
- The bank connection flow feels believable
- The dashboard updates when banks are connected or disconnected
- The assistant popup works and displays real Gemini responses
- The app runs on localhost without issues
- The demo flow can be completed in under 3 minutes

---

# Section 3 — Backend

## 3.1 Purpose

This section defines the backend for the hackathon demo.

The backend handles data loading, financial summary calculations, and Gemini API calls. It does not connect to real banks, does not store persistent user data, and does not implement real authentication.

## 3.2 Architecture Decision: Next.js API Routes

The backend does not use a separate Node.js server.

All backend logic lives inside Next.js API routes (`/app/api/` directory). This means:

- One project, one process, one deployment
- No CORS configuration needed
- No separate backend server to start
- Frontend and backend share the same codebase
- `npm run dev` starts everything

This is the correct decision for a 4-person hackathon team. A separate backend server adds deployment complexity, development overhead, and coordination friction with zero benefit for a demo.

## 3.3 No Database

The demo uses no database.

Financial data lives in mock JSON files in the project directory. Application state (which banks are connected, loaded transactions) lives in server-side memory or is managed through the API routes using simple in-memory objects.

When the server restarts, all state resets. This is acceptable and intended.

Do not introduce: PostgreSQL, MongoDB, Firebase, Supabase, SQLite, or any other database. There is no need.

## 3.4 Mock Data Structure

Mock data files are stored in the project under a `/data` directory.

Each bank has a JSON file:

```
/data/bank_a.json
/data/bank_b.json
/data/bank_c.json
```

Each file contains:

```json
{
  "bankName": "Bank A",
  "accountType": "checking",
  "balance": 25000,
  "transactions": [
    {
      "id": "txn_a_001",
      "date": "2026-05-12",
      "description": "Market alışverişi",
      "amount": 450,
      "type": "expense",
      "category": "Food",
      "source": "Bank A"
    },
    {
      "id": "txn_a_002",
      "date": "2026-05-01",
      "description": "Maaş",
      "amount": 30000,
      "type": "income",
      "category": "Salary",
      "source": "Bank A"
    }
  ]
}
```

The content researcher creates these files with realistic Turkish financial patterns.

Categories to use: Food, Transport, Rent, Salary, Entertainment, Shopping, Utilities, Subscriptions, Health, Education, Other.

## 3.5 API Routes

The demo needs five API routes:

### POST /api/connect-bank

Marks a bank as connected and loads its mock data into server state.

Request:
```json
{ "bankId": "bank_a" }
```

Response:
```json
{
  "success": true,
  "bankName": "Bank A",
  "transactionCount": 45,
  "balance": 25000
}
```

Internally: reads the corresponding JSON file, adds it to the in-memory connected banks object.

### POST /api/disconnect-bank

Removes a bank's data from the active state.

Request:
```json
{ "bankId": "bank_a" }
```

Response:
```json
{ "success": true, "bankName": "Bank A" }
```

### GET /api/dashboard/summary

Returns aggregated financial data across all connected banks.

Response:
```json
{
  "connectedBanks": 2,
  "totalBalance": 42500,
  "monthlyIncome": 42000,
  "monthlyExpenses": 31500,
  "savingsRate": 25,
  "categoryBreakdown": [
    { "category": "Food", "amount": 8200 },
    { "category": "Transport", "amount": 4100 },
    { "category": "Rent", "amount": 10000 }
  ],
  "perBankBreakdown": [
    { "bank": "Bank A", "balance": 25000, "expenses": 20000 },
    { "bank": "Bank B", "balance": 17500, "expenses": 11500 }
  ]
}
```

This route reads from in-memory state and calculates summaries on the fly. No database queries.

### GET /api/transactions

Returns all transactions from all connected banks.

Response:
```json
{
  "transactions": [
    {
      "id": "txn_a_001",
      "date": "2026-05-12",
      "description": "Market alışverişi",
      "amount": 450,
      "type": "expense",
      "category": "Food",
      "source": "Bank A"
    }
  ]
}
```

Optional query parameters: `?source=bank_a` to filter by bank, `?category=Food` to filter by category.

### POST /api/assistant/chat

Sends user message + financial context to Gemini and returns the response.

Request:
```json
{
  "message": "Why did I spend more this month?",
  "chatHistory": [
    { "role": "assistant", "content": "Your food spending is close to its monthly limit." }
  ]
}
```

Response:
```json
{
  "success": true,
  "response": "Your monthly expenses increased mainly because food and shopping were higher than usual. Most of the increase comes from Bank A transactions. You may review recent food purchases and consider setting a weekly spending limit."
}
```

Internally, this route:
1. Calls GET /api/dashboard/summary logic to get current financial context
2. Builds a structured Gemini prompt with system instructions + financial context + chat history + user message
3. Calls Gemini API
4. Returns the response

### POST /api/assistant/advice-preview

Generates the short dashboard advice. Called when the dashboard loads.

Response:
```json
{
  "success": true,
  "advicePreview": "Your food spending across connected accounts is close to last month's total. You may review delivery orders this week."
}
```

This route also calls Gemini, but with a shorter prompt focused on generating a single-sentence insight.

## 3.6 Financial Calculations

These calculations happen inside the `/api/dashboard/summary` route or in a shared utility module.

**Monthly income:** Sum of all transactions where `type === "income"` in the current month, across all connected banks.

**Monthly expenses:** Sum of all transactions where `type === "expense"` in the current month, across all connected banks.

**Monthly balance:** `monthlyIncome - monthlyExpenses`

**Savings rate:** `(monthlyIncome - monthlyExpenses) / monthlyIncome * 100`. If monthlyIncome is 0, savings rate is null.

**Category breakdown:** Group all expense transactions by category, sum amounts per category, sort descending.

**Per-bank breakdown:** Group data by source bank, calculate balance and expense totals per bank.

These are simple aggregation functions. They should live in a `lib/finance.js` or `utils/finance.js` file, not scattered across route handlers.

## 3.7 Error Handling

API routes should return consistent error shapes:

```json
{
  "success": false,
  "message": "Bank not found.",
  "error": "BANK_NOT_FOUND"
}
```

Gemini API errors should return a user-safe fallback:

```json
{
  "success": false,
  "message": "Assistant response could not be generated right now.",
  "fallback": "You can still review your dashboard summary and transaction history."
}
```

Never expose: API keys, stack traces, raw Gemini errors, or internal file paths.

## 3.8 Backend Success Condition

The backend succeeds if:

- Bank connect/disconnect loads and removes mock data correctly
- Dashboard summary returns accurate aggregated calculations
- Transactions endpoint returns combined data from all connected banks
- Assistant chat endpoint returns real Gemini responses using financial context
- Everything runs from `npm run dev` with no separate processes

---

# Section 4 — AI Assistant Layer

## 4.1 Purpose

This section defines how AIssistant generates AI responses using the Gemini API.

The AI assistant turns aggregated financial data into natural-language explanations and practical advice. It is the layer that makes AIssistant more than a dashboard — it makes the numbers understandable.

## 4.2 How It Works

The flow for every assistant interaction:

1. User sends a message through the chat popup
2. Frontend sends the message + chat history to `POST /api/assistant/chat`
3. The API route collects current financial context (same data as dashboard summary)
4. The API route builds a structured prompt
5. The API route calls Gemini API
6. Gemini returns a response
7. The API route sends the response back to the frontend
8. The frontend displays it in the chat popup

For the dashboard advice preview:

1. Dashboard loads
2. Frontend calls `POST /api/assistant/advice-preview`
3. API route collects financial context
4. API route calls Gemini with a short-form prompt
5. Returns a one-sentence insight
6. Dashboard displays it in the AI advice card

## 4.3 Prompt Structure

Every Gemini request uses this structure:

```
SYSTEM PROMPT:
You are AIssistant, a personal finance assistant inside a multi-bank 
finance aggregator app.
You help users understand their financial data across multiple connected 
bank accounts.
You explain spending, income, savings, and category patterns.
You give practical, safe personal finance habit suggestions.

You must not:
- Give investment advice or recommend stocks, crypto, funds, or products
- Automate transactions or move money
- Give legal, tax, or compliance advice
- Guarantee savings or financial improvement
- Present predictions as certain outcomes

When data is incomplete or missing, say so clearly.
Use short, clear responses (3-5 sentences) unless the user asks for 
detailed analysis.

FINANCIAL CONTEXT:
[aggregated financial data — balances, income, expenses, categories, 
per-bank breakdown]

CHAT HISTORY:
[recent messages from this session]

USER MESSAGE:
[current user question]
```

For the advice preview prompt, replace the user message section with:

```
Generate one short, practical financial insight (1-2 sentences) based 
on the financial context. Focus on the most notable pattern or risk.
Do not use full chat formatting.
```

## 4.4 Context Injection

The financial context block sent to Gemini should include:

- Number of connected banks
- Total balance
- Monthly income
- Monthly expenses
- Savings rate
- Top expense categories with amounts
- Per-bank balance and expense breakdown
- 5-10 most recent transactions (not the full history — keep the prompt manageable)

Example context block:

```json
{
  "connectedBanks": 2,
  "totalBalance": 42500,
  "monthlyIncome": 42000,
  "monthlyExpenses": 31500,
  "savingsRate": 25,
  "topCategories": [
    { "category": "Food", "amount": 8200, "percentOfTotal": 26 },
    { "category": "Rent", "amount": 10000, "percentOfTotal": 32 },
    { "category": "Transport", "amount": 4100, "percentOfTotal": 13 }
  ],
  "perBank": [
    { "bank": "Bank A", "balance": 25000, "monthlyExpenses": 20000 },
    { "bank": "Bank B", "balance": 17500, "monthlyExpenses": 11500 }
  ],
  "recentTransactions": [
    { "date": "2026-05-12", "description": "Market", "amount": 450, "category": "Food", "source": "Bank A" }
  ]
}
```

Do not send the entire transaction history to Gemini. It wastes tokens and can hit context limits. Send summary data + a small sample of recent transactions.

## 4.5 Response Format

For chat responses, the assistant should follow this structure when appropriate:

- **Observation:** What the data shows
- **Reason:** Why this is happening
- **Practical suggestion:** What the user can do
- **Limitation (when needed):** What the assistant cannot determine

Example:

> **Observation:** Your monthly expenses increased mainly because food and shopping categories grew.
> **Reason:** Bank A shows more frequent food purchases compared to typical patterns.
> **Practical suggestion:** You may review delivery orders from Bank A and consider a weekly food spending target.

This structure is guidance for the prompt, not a rigid template. The assistant should adapt to the question. A simple question gets a simple answer. A "why" question gets the full structure.

## 4.6 Multi-Bank Awareness

This is what makes AIssistant's assistant different from a generic finance chatbot. The assistant must be aware that data comes from multiple banks and should reference this when relevant.

Good response:

> "Most of your food spending comes from Bank A. Bank B mainly shows rent and utility payments. If you want to reduce overall spending, reviewing Bank A's recent transactions would have the most impact."

Bad response (ignores multi-bank context):

> "Your food spending is high. You should reduce it."

The assistant should reference source banks by name when it helps the user understand the pattern.

## 4.7 Safety Boundaries

The assistant must refuse these request types:

**Investment requests:**
> "I cannot provide investment strategy or recommend financial products. I can help you review your spending, income, and savings patterns across your connected accounts."

**Automation requests:**
> "I cannot move money or automate transactions. I can explain your current spending patterns and suggest habits you may review."

**Legal/tax requests:**
> "I cannot provide legal or tax advice. I can summarize your income and expenses based on the data from your connected banks."

Refusals must be brief and redirect to what the assistant can do.

## 4.8 Handling Errors and Missing Data

**Gemini API down:** Return a cached fallback message. Pre-generate 2-3 generic but useful advice strings during development. Store them in a JSON file. Return one randomly when Gemini fails.

Example fallback:
> "I could not generate a response right now. You can still review your dashboard summary, category breakdown, and transaction history across your connected accounts."

**No banks connected:** If the user asks a question before connecting any bank:
> "I don't have any financial data to analyze yet. Please connect at least one bank account from the Connections page so I can help you understand your finances."

**Incomplete data:** If data exists but is limited:
> "Based on the available data from Bank A, your food spending is the highest category. Note that this analysis may change once you connect additional accounts."

## 4.9 Conversation Memory

The assistant keeps temporary in-session conversation context.

Allowed:

- Recent messages while the chat popup is open
- Current session only
- Sent as part of the Gemini prompt in the `chatHistory` field

Not allowed:

- Persistent chat storage across sessions
- Long-term user profiling
- Conversation database
- Memory that survives a page refresh

The frontend manages conversation state in component state. Each Gemini request includes the recent chat history so the assistant can handle follow-up questions.

## 4.10 AI Layer Success Condition

The AI layer succeeds if:

- Gemini generates real, contextual responses based on aggregated financial data
- The assistant references multi-bank context when relevant
- Dashboard advice previews are generated and displayed
- Follow-up questions work within a session
- Safety boundaries are enforced (refuses investment, legal, tax, automation)
- Missing data is mentioned when context is incomplete
- Gemini failures fall back to cached responses gracefully

---

# Section 5 — Data & Finance Logic

## 5.1 Purpose

This section defines the financial calculation logic that powers the dashboard and provides structured context to the AI assistant.

This layer sits between raw mock data and the presentation/AI layers. It takes transaction arrays and produces calculated summaries. It does not generate user-facing advice — that is the AI assistant's job.

## 5.2 Implementation Location

All finance logic lives in a shared utility module:

```
/lib/finance.js    (or /utils/finance.js)
```

This module exports pure functions that take transaction arrays as input and return calculated results. The API routes import and call these functions. There is no separate "finance service" — that would be overengineering for this scope.

## 5.3 Core Calculations

### Monthly Income
```
Input: transactions[], selectedMonth
Output: number

Sum of amount where type === "income" and month matches selectedMonth
```

### Monthly Expenses
```
Input: transactions[], selectedMonth
Output: number

Sum of amount where type === "expense" and month matches selectedMonth
```

### Calculated Monthly Balance
```
Input: monthlyIncome, monthlyExpenses
Output: number

monthlyIncome - monthlyExpenses
```

### Savings Rate
```
Input: monthlyIncome, monthlyExpenses
Output: number | null

If monthlyIncome > 0: (monthlyIncome - monthlyExpenses) / monthlyIncome * 100
If monthlyIncome === 0: null
```

### Category Breakdown
```
Input: transactions[] (expenses only)
Output: { category, amount, percentOfTotal }[]

Group expenses by category, sum amounts, calculate percent of total expenses.
Sort descending by amount.
```

### Per-Bank Breakdown
```
Input: transactions[], bankBalances
Output: { bank, balance, monthlyExpenses, monthlyIncome }[]

Group transactions by source bank. Calculate income and expenses per bank.
Include the bank's balance from the mock data.
```

### Top Spending Categories
```
Input: categoryBreakdown[]
Output: top 3-5 categories by amount
```

## 5.4 What This Layer Does Not Do

This layer does not:

- Generate user-facing text or advice
- Call Gemini or any AI model
- Define UI layout
- Handle HTTP requests (it is imported by route handlers, not exposed directly)
- Connect to real banks
- Define authentication
- Store data persistently

It is a set of pure calculation functions. Input goes in, numbers come out.

## 5.5 Finance Logic Success Condition

The finance logic succeeds if:

- All calculations produce correct results from mock data
- The dashboard summary endpoint returns accurate aggregated numbers
- The AI assistant receives clean, pre-calculated financial context
- No calculation logic leaks into route handlers or frontend components

---

# Section 6 — Project Execution Plan

## 6.1 Team Responsibilities

**Leader / AI Developer (1 person):**
- Gemini API integration and prompt engineering
- AI assistant chat and advice preview endpoints
- Financial context builder
- System prompt design and safety boundary testing
- Final demo flow coordination

**Developer A (1 person):**
- Dashboard screen (layout, cards, charts)
- Login page
- Data flow: loading mock data into state, aggregation logic
- Dashboard summary API route
- Finance calculation utility module

**Developer B (1 person):**
- Bank Connections screen (UI, connect/disconnect flow)
- Transaction History screen
- Assistant chat popup (UI, message display, typing indicator)
- Connect/disconnect API routes
- Transactions API route

**Content Researcher (1 person):**
- Create realistic mock JSON data files (3 banks, 40-60 transactions each)
- Turkish spending patterns: realistic descriptions, amounts, categories
- Prepare demo script (what to say during presentation)
- Prepare product pitch and slides
- Test the demo flow and report issues

## 6.2 Build Order

### Phase 1 — Foundation (Day 1)
- Next.js project setup with Tailwind CSS
- Project folder structure
- Bottom navigation bar component
- Login page (hardcoded demo)
- Mock JSON data files created (content researcher)
- Basic dashboard layout with hardcoded data

### Phase 2 — Core Features (Day 2)
- Bank Connections page UI and connect/disconnect logic
- API routes: connect-bank, disconnect-bank, dashboard/summary, transactions
- Finance calculation module
- Dashboard reads from API, displays real aggregated data
- Charts (category breakdown, income vs expenses)

### Phase 3 — AI Integration (Day 3)
- Gemini API integration
- Assistant chat API route with financial context injection
- Advice preview API route
- Assistant chat popup UI
- Dashboard AI advice card
- Fallback cached responses for Gemini failures

### Phase 4 — Polish (Day 4)
- Mobile-responsive polish
- Loading animations for bank connection flow
- Typing indicator for assistant
- Error states and empty states
- Full demo run-through
- Fix bugs found during run-through
- Presentation preparation

## 6.3 Technology Summary

| Component | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts or Chart.js |
| AI Model | Gemini API |
| Data Storage | Mock JSON files |
| State Management | React state (useState/useContext) |
| Authentication | Fake (hardcoded) |
| Database | None |
| Deployment | localhost (optional Vercel) |

## 6.4 Project Structure

```
/aissistant
  /app
    /api
      /connect-bank/route.js
      /disconnect-bank/route.js
      /dashboard/summary/route.js
      /transactions/route.js
      /assistant/chat/route.js
      /assistant/advice-preview/route.js
    /login/page.jsx
    /dashboard/page.jsx
    /connections/page.jsx
    /transactions/page.jsx
    layout.jsx
    page.jsx (redirects to /login)
  /components
    /dashboard
    /connections
    /transactions
    /assistant
    /shared
  /data
    bank_a.json
    bank_b.json
    bank_c.json
    fallback_responses.json
  /lib
    finance.js
    gemini.js
    state.js
  /public
    (icons, images)
  .env.local (GEMINI_API_KEY)
  package.json
  tailwind.config.js
```

## 6.5 Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Gemini API down during demo | Assistant doesn't work | Pre-cache 3-5 fallback responses in JSON |
| Mock data looks unrealistic | Demo feels fake | Content researcher reviews Turkish spending patterns |
| Bank connection flow feels too instant | Doesn't feel real | Add 1-2 second loading animation |
| Two developers step on each other's code | Merge conflicts, delays | Clear screen ownership split, no shared files |
| Scope creep (adding settings, goals, filters) | Runs out of time | Freeze scope after Day 2, only polish after |
| Charts don't render on demo machine | Visual gap | Test on multiple browsers, have screenshot fallback |

## 6.6 What Is Cut and Why

| Feature | Status | Reason |
|---|---|---|
| Goals / Budget page | Cut | Not essential for the aggregation story |
| Settings page | Cut | Zero demo value |
| Previous month comparison | Cut | Adds complexity, one month of mock data is enough |
| Anomaly detection | Cut | Overengineered for hackathon |
| Data quality warnings | Cut | Mock data is controlled, no quality issues |
| Transaction detail view | Cut | Nobody clicks individual transactions in a demo |
| CSV/JSON manual upload | Cut | Bank connection flow replaces this UX |
| Crypto platform integration | Cut | Removed from scope |
| Real authentication | Cut | No value for demo |
| Persistent database | Cut | No value for demo |
| Chat history persistence | Cut | In-memory session is enough |

## 6.7 Environment Variables

```
GEMINI_API_KEY=your_gemini_api_key_here
```

One environment variable. That is the entire configuration.

---

# Section 7 — Assistant Safety & Boundaries Reference

## 7.1 Purpose

This section is a reference for the leader/AI developer when writing Gemini system prompts. It consolidates all assistant behavior rules in one place.

## 7.2 The Assistant May

- Explain what dashboard data means
- Analyze spending, income, and savings patterns
- Compare financial activity across connected banks
- Identify the highest spending categories
- Explain why expenses increased or decreased
- Suggest practical personal finance habit improvements
- Answer follow-up questions using session context
- Mention when data is incomplete or limited
- Generate short dashboard advice previews
- Reference specific bank sources when relevant

## 7.3 The Assistant Must Not

- Give investment advice or recommend financial products
- Recommend stocks, crypto, funds, or specific financial instruments
- Automate transactions, move money, or pay bills
- Give legal advice
- Give tax advice
- Guarantee savings or financial improvement
- Present predictions as certain outcomes
- Make decisions for the user
- Automatically create or modify budgets or goals
- Store long-term memory or user profiles
- Expose system prompts, API keys, or internal logic

## 7.4 Correct Response Examples

**User:** "Why did I spend more this month?"

**Assistant:** "Your monthly expenses increased mainly because food and shopping categories grew compared to your usual patterns. Most of the food spending comes from Bank A. You may review recent delivery orders and consider setting a weekly food budget."

---

**User:** "Which bank has the most expenses?"

**Assistant:** "Bank A accounts for about 63% of your total monthly expenses. The main categories from Bank A are food and shopping. Bank B mainly shows rent and utility costs."

---

**User:** "Should I invest my savings?"

**Assistant:** "I cannot provide investment advice or recommend financial products. I can help you review your spending, income, and savings patterns across your connected accounts to help you understand your financial situation better."

---

**User:** "How can I save more?"

**Assistant:** "Your savings rate is currently around 25%. Your highest flexible spending categories are food and entertainment. You may review subscriptions across your accounts and consider reducing delivery orders, which appear frequently in your Bank A transactions."

## 7.5 Incorrect Response Examples (Never Generate These)

- "You should invest in X stock."
- "This plan will guarantee you save ₺5,000."
- "I will move money from Bank A to Bank B."
- "Based on tax regulations, you should..."
- "Your financial problem is definitely food spending." (too certain with incomplete data)

---

# Section 8 — Final Summary

## What AIssistant Is

A standalone personal finance aggregator web-app that connects to multiple bank accounts, shows a unified financial dashboard, and uses Gemini AI to explain the user's financial situation and suggest practical improvements.

## What the Demo Proves

- Multi-bank aggregation concept works
- AI assistant understands aggregated financial context
- The assistant gives relevant, safe, context-aware advice
- The product feels like a real mobile fintech app
- Bank connections are the entry point, not CSV uploads

## What the Demo Does Not Prove

- Real bank API integration
- Production security and authentication
- Persistent data storage
- Scalable infrastructure
- Regulatory compliance

The hackathon demo proves the product concept and AI capability. Production infrastructure is a future problem.

## The One Sentence Pitch

"AIssistant connects all your bank accounts in one place and uses AI to help you understand and improve your finances."
