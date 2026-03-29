<div align="center">

# ◈ NIVESHIQ ◈
## *Cinematic Financial Intelligence for the Modern Indian Investor*

```
  ███╗   ██╗██╗██╗   ██╗███████╗███████╗██╗  ██╗██╗ ██████╗
  ████╗  ██║██║██║   ██║██╔════╝██╔════╝██║  ██║██║██╔═══██╗
  ██╔██╗ ██║██║██║   ██║█████╗  ███████╗███████║██║██║   ██║
  ██║╚██╗██║██║╚██╗ ██╔╝██╔══╝  ╚════██║██╔══██║██║██║▄▄ ██║
  ██║ ╚████║██║ ╚████╔╝ ███████╗███████║██║  ██║██║╚██████╔╝
  ╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝ ╚══▀▀═╝
```

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Claude AI](https://img.shields.io/badge/Anthropic-Claude_3.5_Sonnet-D4AF37?style=for-the-badge)](https://anthropic.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

**🏆 Built for ET AI Hackathon 2026 · Problem Statement 9 — AI Money Mentor**

> *"Your money deserves an X-Ray."*

[🔴 Live Platform](https://niveshiq-tau.vercel.app) · [📖 API Docs](#api-reference) · [🏗️ Architecture](#system-architecture) · [🖥️ All Modules](#dashboard-modules)

</div>

---

## 🎯 The Problem Statement

India has **14 crore+ active demat accounts**. The vast majority of retail investors are flying completely blind:

| Pain Point | Reality | Annual Cost to Investor |
|---|---|---|
| **Unknown real returns** | 96% don't know their XIRR (only absolute %) | Misallocated wealth |
| **Fund overlap** | 5 funds that are 72% identical — paying double fees | ₹8,500+ in drag |
| **Missed tax deductions** | ₹46,800 average unused deduction headroom | ₹10,000–22,000 in excess tax |
| **No access to advisors** | Certified advisors cost ₹25,000+/yr, serve only HNIs | Zero personalized guidance |
| **Behaviour bias** | Panic selling, trend chasing, no goal alignment | Negative alpha |

**NiveshIQ solves all of this in under 10 minutes — for free — with institutional-grade AI analytics.**

---

## 🌌 What is NiveshIQ?

NiveshIQ is a full-stack, AI-powered financial intelligence platform built on the "Cinematic Intelligence" philosophy — transforming raw, fragmented financial data into high-fidelity, actionable insights through a beautifully designed dark-mode dashboard.

It is **not** a broker. It is **not** a fund distributor. It is the honest, conflict-free **X-Ray machine** for your money — showing you exactly what is hidden beneath the surface.

### Core Design Philosophy: *Cinematic Intelligence*
- **Dark Theme**: Deep navy (`#0A0F1E`) with gold (`#D4AF37`) accents
- **Lenis Smooth Scroll**: Silky 60fps page transitions
- **Mobile-First**: Card-based architecture optimized for high-density mobile displays
- **Film Noir Vocabulary**: Modules are "Intelligence Nodes," data is "Artifacts," analysis is a "Dossier"

---

## 🛠️ Dashboard Modules — Complete Reference

The NiveshIQ dashboard is the authenticated command center. It consists of **9 core intelligence modules** accessible via the collapsible sidebar.

---

### 🏠 MODULE 1: Overview (Command Center)
**Route**: `/dashboard`  
**Access**: Authenticated users only

The master command center. The first view after login — a real-time synthesis of your entire financial universe.

**What it shows:**
- **NAMASKAR greeting** with the user's name, personalized to the operator
- **Financial Vitality Gauge** — an animated arc gauge (0–100) showing your overall money health score, sourced from the latest Money Health Diagnostic
- **Performance vs Benchmark Chart** — a line chart comparing your portfolio's scan history against a synthetic benchmark (NIFTY 50 proxy), rendered with Recharts `XirrvsBenchmarkLine`
- **Portfolio Value Metric Card** — animated `CountUp` display of total current value (live NAV synced from backend)
- **Portfolio Risk Score** — risk level from `1–10`, labeled (e.g., "Aggressive," "Conservative")
- **Asset Allocation Treemap** — a D3-powered treemap grouping your holdings by fund category (Equity, Debt, Liquid, etc.), showing proportional exposure at a glance
- **6D Hexagonal Radar Analysis** — a six-dimension radar chart plotting: Risk, Return, Diversification, Tax Efficiency, Cashflow, and Asset Quality
- **Real-time Oracle Nudges** — AI-generated alerts (e.g., "Approaching ₹1.5L ELSS limit," "72% overlap in Small Cap funds")
- **Vault Analysis History Table** — a scrollable table of all past portfolio scans with date, total value, and ARCHIVED status badge

**Data Sources**: `GET /api/portfolio`, `GET /api/portfolio/all`, `GET /api/health/all`

---

### 📊 MODULE 2: Portfolio X-Ray
**Route**: `/dashboard/portfolio`  
**Access**: Authenticated users only

The core diagnostic engine. Upload your CAMS Consolidated Account Statement and receive a complete deep-tissue analysis of your mutual fund portfolio.

**Features:**
- **PDF/Password-Protected Upload** — Supports CAMS PDFs with password for protected statements
- **XIRR Calculation** — Mathematically exact time-weighted internal rate of return using `pyxirr`, not the misleading absolute return
- **Summary Cards** (4-up grid):
  - Total Invested Amount
  - Current Portfolio Value
  - Absolute Returns (₹ and %)
  - XIRR (Annualized True Return)
- **Holdings Table** (Desktop) / **Holdings Cards** (Mobile):
  - Fund name, folio number, scheme type
  - Units held, purchase NAV, current NAV
  - Current value, absolute gain/loss
  - Sortable by any column
- **Asset Allocation Ring Chart** — A high-contrast gold-and-slate donut chart showing Equity/Debt/Hybrid/Liquid splits with a centered percentage label
- **Fund Overlap Detection** — Flags when multiple funds hold the same underlying stocks (e.g., Reliance Industries appearing in 3 of your 5 funds)
- **Expense Ratio Drag** — Shows how much of your returns are silently eroded by fund management fees (Regular vs Direct plan projection)
- **Re-Simulate Button** — Re-runs analysis with latest NAV data from NSE
- **Benchmark Comparison** — Plots your XIRR against NIFTY 50 TRI over equivalent periods
- **AI Insight Panel** — Claude-generated paragraph explaining your portfolio's key risks and opportunities in plain language

**Mobile Architecture**: Touch-optimized card cards replace wide tables. Sort controls have 44px minimum tap targets.

**Data Flow**:
```
User → Upload PDF → POST /api/extractor → PDF Parser (pdfplumber/pandas) → 
MongoDB (holdings stored) → GET /api/portfolio → Frontend renders
```

---

### 🛡️ MODULE 3: Money Health Diagnostic
**Route**: `/dashboard/health`  
**Access**: Authenticated users only

A 5-minute, 6-dimension financial health quiz that produces a Vitality Score (0–100) and a prioritized, ranked action list.

**Three Phases:**

**Phase 1 — INTRO**: Fullscreen splash with "INITIALIZE SCAN →" CTA and "THE 5-MINUTE ORACLE SCAN" copy.

**Phase 2 — QUIZ** (6 steps, animated transitions):

| Step | Dimension | What It Measures |
|---|---|---|
| 1 | 🛡️ Emergency Fund | Months of expenses covered in liquid assets |
| 2 | 🏥 Insurance | Life cover as a multiple of annual income |
| 3 | 💳 Debt | EMI-to-income ratio |
| 4 | 🐷 Savings Rate | % of monthly income saved/invested |
| 5 | 📊 Portfolio Quality | Asset allocation sophistication |
| 6 | 👨‍👩‍👧 Legacy Planning | Nominees + Will registration status |

Each step has 4 options scored `[5, 25-35, 65-75, 100]`. Animated `ChevronLeft`/`ChevronRight` navigation.

**Phase 3 — VITALITY REPORT**:
- **Unified Vitality Gauge** — Animated SVG arc gauge with grade labels: EXCELLENT (85+), STRONG (70+), MODERATE (50+), WEAK (30+), CRITICAL (<30)
- **6D Radar Chart** — Hexagonal radar (Recharts RadarChart) plotting all 6 dimension scores simultaneously
- **Ranked Action Cards** — Color-coded by severity:
  - 🔴 CRITICAL (red border-left) — e.g., "No life insurance detected"
  - 🟡 ACTION NEEDED (amber) — e.g., "Savings rate below 15%"
  - 🟢 HEALTHY (green) — Dimensions meeting targets
- **Retake / Portfolio X-Ray →** CTAs

**Scoring Logic**:
```
Total Score = average(all 6 dimension scores)
Dimension Score = selected option value (5 / 25-35 / 65-75 / 100)
```

Results are **saved to backend** (`POST /api/health`) and surface on the main dashboard gauge.

---

### 📈 MODULE 4: Quantum Analytics
**Route**: `/dashboard/analytics`  
**Access**: Authenticated users only

The highest-density intelligence layer. Full deep-dive into portfolio performance, tax optimization, fund overlap, and sector allocation — all synthesized into actionable "Protocol" cards.

**4 Top Metric Cards:**
- **Portfolio Alpha (XIRR%)** — Compared to Nifty 50 benchmark, with up/down trend indicator
- **Capital Persistence (₹ in Lakhs)** — Total liquidated asset valuation
- **Tax Delta Output (₹k saved)** — Annual fiscal savings from regime optimization
- **Overlap Density (count)** — Inter-fund correlation mapping risk score

**6 Chart Sections:**

| Chart | Description |
|---|---|
| **Fund Overlap Heatmap** | Matrix visualization of common stock holdings between top 5 funds. Critical Synergy alert when similar stocks are detected |
| **Expense Ratio Drag Projection** | 20-year line chart comparing Direct vs Regular plan wealth trajectory — showing exact rupee cost of staying in regular plans |
| **Old vs New Regime Bar** | Side-by-side tax liability comparison based on your actual income and deductions |
| **Deduction Utilization** | Bar charts for 80C, 80D, and NPS (80CCD1B) showing used vs remaining limit |
| **Sector Treemap** | Dynamic sector allocation map (Equity/Infra/IT/Consumer etc.) |
| **Detailed Performance Benchmarking** | 6-month portfolio vs benchmark line chart |

**AI Oracle Briefing** (3 insight cards):
- 🟡 **Fiscal Shield Protocol** — "Pivot to New Regime" or "Redeploy ELSS Capital" based on tax data
- 🟢 **Sector Capture Protocol** — Sector rotation opportunity detection
- 🔵 **Cost Neutrality Protocol** — Expense ratio purge recommendation with exact ₹ savings over 10 years

**Live Asset Persistence Matrix** — Full sortable fund-by-fund table with allocation bars.

**Data Sources**: `GET /api/portfolio`, `GET /api/tax/history`

---

### 📡 MODULE 5: Market Oracle
**Route**: `/dashboard/market`  
**Access**: Authenticated users only

Real-time intelligence feed from the National Stock Exchange of India. Auto-refreshes every 60 seconds.

**Features:**
- **NSE Market Status** — Live green/red dot indicator (Open/Closed) with last updated timestamp
- **Primary Indices Grid** (3 cards):
  - NIFTY 50 — Benchmark blue-chip index
  - NIFTY BANK — Banking sector health indicator
  - NIFTY IT — Technology sector pulse
- **Market Hawks** — Top gainers by price change %, with symbol, series, last price, and % change in emerald
- **Market Bears** — Top losers, with rose/red display
- **Sector Rotation Panel** — 10-sector grid showing all major sectoral indices (Auto, Pharma, FMCG, Infra, etc.) with live % change
- **Stock Search** — Full-text search navigate to `/dashboard/market/search`
- **Manual Refresh** — Spinning refresh icon triggers new API call

**Data Sources**: `GET /api/market/indices`, `GET /api/market/status`, `GET /api/market/gainers-losers`

> **Disclaimer shown in-page**: Data streamed via NSE relay, delayed by at least 15 minutes. For educational purposes only.

---

### 💍 MODULE 6: Life Event Planner
**Route**: `/dashboard/life-planner`  
**Access**: Authenticated users only

Strategic action planning for major life events. Input a specific financial trigger and receive a structured, tax-optimized deployment strategy.

**4 Life Events:**

| Event | Icon | Color | Strategy Focus |
|---|---|---|---|
| GOT A BONUS | 🎁 Gift | Gold | Lumpsum deployment into growth nodes |
| GETTING MARRIED | 💎 Gem | Emerald | Wedding corpus + joint financial planning |
| NEW BABY | 👶 Baby | Blue | Education corpus, insurance gap analysis |
| INHERITANCE | 💼 Briefcase | Purple | Estate optimization, tax-efficient transfer |

**Action Plan Analysis Panel** (appears on event selection):
- Amount input field with ₹ prefix — enter the event corpus
- 3 Strategic Pillars:
  - **Lumpsum Deployment / Event Capitalization** — Dynamic description based on amount entered
  - **Tax Shielding** — Section 54/54EC protocol reference
  - **Liquidity Lock** — 20% debt-safe architecture allocation
- **Strategic Breakdown** — 3 progress bars:
  - 60% Long-Term Investment (gold)
  - 30% Debt Repayment (emerald)
  - 10% Life Celebration (blue)
- **EXECUTE STRATEGY** button — saves to backend and shows confirmation notification

**Goal Performance Grid:**
- **Goal Progress Rings** (GoalProgressRing component) — circular progress indicators for each financial goal (Emergency Fund, Wedding, House, etc.)
- **Add New Goal** card — with name, target, and SIP fields
- **SIP Allocation Waterfall** chart — bar chart of monthly SIP distribution across goals
- **Corpus Growth Matrix** chart — projected growth curve (estimated)
- **Target Milestones Timeline** — year-by-year milestone tracker with colored status dots

**Data Sources**: `GET /api/life-planner/latest`, `POST /api/life-planner`

---

### 📄 MODULE 7: Tax Oracle (Tax Wizard)
**Route**: `/dashboard/tax-wizard`  
**Access**: Authenticated users only

Precision tax regime comparison and optimization engine. Enter your income and deductions — get a definitive verdict.

**Two Phases:**

**Phase 1 — WIZARD FORM** (WizardForm component):
Collects critical tax inputs:

| Input Category | Fields |
|---|---|
| **Income** | Gross Salary, HRA Received, LTA, Other Allowances |
| **Old Regime Deductions** | 80C (ELSS, PPF, LIC), 80D (Health Insurance), Home Loan Principal, Home Loan Interest, NPS 80CCD(1B), Gratuity |
| **House Rent** | Rent Paid, City Type (Metro/Non-Metro) |
| **Other Income** | FD Interest, Capital Gains (STCG/LTCG) |

**Phase 2 — TAX VERDICT** (TaxVerdict component):
- **Dual Regime Comparison** — Side-by-side: Old Regime Tax vs New Regime Tax
- **Delta Savings** — Exact rupee difference between regimes highlighted in gold
- **Verdict Banner** — "OPTIMIZE: NEW REGIME" or "OPTIMIZE: OLD REGIME"
- **Deduction Gap Analysis** — Unused 80C capacity, unfilled 80D budget, NPS opportunity
- **Actionable Recommendations** — Specific steps to maximize tax savings (e.g., "Invest ₹X,XXX in ELSS to exhaust 80C limit")
- **Re-calculate** — Modify inputs and re-run the analysis
- **Notification** — "Tax Oracle Synthesis Complete" pushed to notification bell

**Underlying Logic**: `useTaxCalculator` hook — handles Old Regime (slabs: 2.5L / 5L / 10L with all deductions) and New Regime (slabs: 3L / 6L / 9L / 12L / 15L) computation client-side.

**Data Sources**: `POST /api/tax` (saves result to history for analytics module)

---

### 🗄️ MODULE 8: Reports Vault
**Route**: `/dashboard/reports`  
**Access**: Authenticated users only

The permanent intelligence archive. Every analysis ever run is stored here as a searchable, filterable "Intelligence Dossier."

**Desktop View — Archived Reports Table:**
| Column | Description |
|---|---|
| Date | Analysis timestamp (DD MMM YYYY) |
| Type | PORTFOLIO X-RAY / HEALTH VITALITY / TAX ORACLE |
| Total Value | Portfolio value at time of scan |
| XIRR | Annualized return at scan time |
| Risk Score | Portfolio risk level (1–10) |
| Actions | View PDF · Download CSV · Delete |

**Mobile View — Intelligence Node Cards:**
Each report surfaces as a card with:
- Color-coded type badge (Gold = Portfolio, Teal = Health, Blue = Tax)
- Key metrics summary
- Touch-optimized action buttons (View / Download / Delete)

**Features:**
- **Search** — Filter by report type, date, or value
- **Sort** — By date (newest/oldest), value (high/low), XIRR
- **Archive Sections** — Reports grouped by module type (Portfolio Archive / Health Archive / Tax Archive)
- **Re-simulate** — Re-run the analysis with current market data
- **PDF Download** — Server-rendered branded PDF of the full dossier
- **Delete** — Soft-delete with confirmation

**Empty States**: When no reports exist, each archive section shows a high-contrast "No Intel Detected" empty state with a CTA to the relevant module.

**Data Sources**: `GET /api/portfolio/all`, `GET /api/health/all`, `GET /api/tax/history`

---

### ⏰ MODULE 9: FIRE Protocol (Exit Planner)
**Route**: `/dashboard/fire`  
**Access**: Authenticated users only

Financial Independence, Retire Early. An interactive simulation engine that computes your personalized wealth escape velocity.

**Input Parameters (Left Column):**

| Parameter | Control | Range |
|---|---|---|
| Current Age | Range slider | 18–70 |
| Target Retirement Age | Range slider | Current Age+1 to 85 |
| Monthly Expenses | Number input | ₹ amount |
| Existing Corpus (Savings) | Number input | ₹ amount |
| Inflation Rate | Number input | % (default 6%) |
| Pre-Retirement Return | Number input | % (default 12%) |
| Post-Retirement Return | Number input | % (default 8%) |
| Safe Withdrawal Rate (SWR) | Built-in | Default 4% |

**Calculated Results (Right Column):**

| Metric | Formula |
|---|---|
| **Target FIRE Corpus** | `Annual Future Expenses ÷ SWR%` |
| **Monthly SIP Required** | Standard FV/PMT calculation adjusted for existing corpus |
| **Inflation-Adjusted Retirement Expenses** | `Current Expenses × (1+inflation)^yearsToRetire` |

**Capital Trajectory Chart (AreaChart):**
- X-Axis: User age (`currentAge` to `retireAge + 20`)
- Y-Axis: Portfolio corpus in ₹ Crore
- Gold gradient area fill with animated path
- **EXIT NODE** reference line (dashed gold) at retirement age
- Withdrawal phase shown as corpus drawdown curve post-retirement

**Insight Footer (3 cards):**
- **Asset Shift** — Suggested equity-to-debt glide path (80/20 → 40/60 at retirement)
- **Stability Check** — SWR sustainability analysis (35+ year corpus longevity)
- **Inflation Hedge** — Inflation assumption callout

**CTAs:**
- **LOCK EXIT STRATEGY** — Saves to backend (POST /api/fire) with success animation (shield icon, emerald background)
- **EXPORT PDF BLUEPRINT** — Triggers `window.print()` for print-to-PDF

**Data Sources**: `POST /api/fire`

---

### ⚙️ MODULE 10: Settings (Oracle Configuration)
**Route**: `/dashboard/settings`  
**Access**: Authenticated users only

Single-page, anchor-scrolling settings hub. Top navigation shows anchor links (Account, Notifications, Privacy, Data, About) that update the URL hash and highlight as you scroll.

**5 Sections (IntersectionObserver-driven active state):**

**1. PROFILE CONFIGURATION** (`#account`)
- Avatar card with first-letter monogram in gold gradient
- Editable fields: Legal Name, Secure Phone
- Read-only fields: E-mail Archive, Citizenship
- `UPDATE BIOMETRICS` button (stylistic)
- `COMMIT CHANGES` saves name + phone to backend via `updateUser()`

**2. INTELLIGENCE FEED CONFIG** (`#notifications`)
Toggle switches (custom animated pill UI) for:
- MARKET ANOMALY ALERTS — Extreme volatility / black-swan events
- PORTFOLIO REBALANCING — Drift alerts when allocation shifts >5%
- TAX COMPLIANCE UPDATES — Quarterly advance tax reminders
- ORACLE INTELLIGENCE FEED — Daily synthesized insights

**3. SECURITY PROTOCOLS** (`#privacy`)
- AES-256 Quad-Layer encryption status display
- Hardware Key 2FA status
- ⚠️ **TERMINATE ALL DATA VAULTS** — Irreversible data purge button (red, requires confirmation)

**4. DATA ARCHIVE & EXPORT PORTAL** (`#data`)
- **Portfolio Protocol (CSV)** — Exports full transaction history
- **Tax Ledger (JSON)** — Exports tax history in audit-compatible format

**5. ABOUT NIVESHIQ ORACLE v4.0** (`#about`)
- Build version: `NODE_V26_RELEASE`
- Security: `AES-256 QUANTUM-SAFE`
- Platform philosophy copy

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                                   │
│   Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Lenis Scroll │
│   Recharts · D3.js · Lucide Icons · React Hook Form                     │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTPS REST / Streaming
┌──────────────────────────────▼──────────────────────────────────────────┐
│                        FASTAPI BACKEND (Python 3.11)                     │
│  /api/portfolio · /api/health · /api/tax · /api/fire · /api/market      │
│  /api/life-planner · /api/extractor · /api/chat                         │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Portfolio   │  │  Tax Oracle  │  │    Health    │  │ Market Data │ │
│  │   Service    │  │   Service    │  │   Service    │  │   Service   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────┘
          │                 │                 │                 │
┌─────────▼─────────────────▼─────────────────▼─────────────────▼────────┐
│                        AI + DATA LAYER                                   │
│   Anthropic Claude 3.5 Sonnet · PyXIRR · Pandas · pdfplumber · yfinance │
│   NSE Unofficial API · Google OAuth 2.0                                  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                       DATA PERSISTENCE                                   │
│   MongoDB Atlas (User data, reports, health scans, tax history)          │
│   JWT Authentication (oracle_token)                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Full Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14 (App Router) | SSR, routing, layout, API calls |
| **TypeScript** | 5.x | Type safety across all components |
| **Tailwind CSS** | 3.x | Utility-first design system |
| **Framer Motion** | Latest | Page transitions, AnimatePresence, motion components |
| **Lenis** | `lenis/react` | Butter-smooth scroll engine (global wrapper) |
| **Recharts** | 2.x | AreaChart, RadarChart, BarChart, LineChart |
| **D3.js** | 7.x | Custom Treemap, Overlap Heatmap |
| **Lucide React** | Latest | All icons (Shield, TrendingUp, Flame, etc.) |
| **React CountUp** | Custom component | Animated number reveals for dashboard metrics |
| **Google Fonts** | Barlow Condensed | Primary display font for all headings |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.110 | REST API framework, async endpoints |
| **Python** | 3.11 | Core language |
| **Pydantic** | v2 | Request/response validation |
| **pdfplumber** | Latest | CAMS PDF parsing (password-protected) |
| **pandas** | Latest | Transaction data manipulation |
| **pyxirr** | Latest | Mathematically exact XIRR computation |
| **pymongo** | Latest | MongoDB driver |
| **python-jose** | Latest | JWT token generation/validation |
| **passlib** | Latest | Password hashing (bcrypt) |
| **google-auth-library** | Latest | Google OAuth 2.0 token verification |
| **httpx** | Latest | Async HTTP client for NSE API calls |

### AI Layer
| Technology | Purpose |
|---|---|
| **Anthropic Claude 3.5 Sonnet** | Core reasoning, portfolio analysis, health advice generation |
| **Anthropic Python SDK** | Streaming and non-streaming API calls |
| **Custom System Prompts** | Per-module behavioral guardrails (SEBI compliance enforced) |

### Infrastructure
| Service | Role |
|---|---|
| **Vercel** | Frontend deployment (CDN, edge functions) |
| **Railway** | Backend FastAPI server deployment |
| **MongoDB Atlas** | Cloud database (users, portfolios, health scans, tax records) |
| **Google OAuth** | Authentication (sign-in with Google) |

---

## 🗂️ Project Structure

```
NiveshIQ/
│
├── apps/
│   ├── web/                              # Next.js 14 Frontend
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout with LenisProvider
│   │   │   ├── page.tsx                 # Landing page (Hero, Intelligence, Process, Strategy, Pricing)
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx       # Google OAuth login
│   │   │   │   └── signup/page.tsx      # Account creation
│   │   │   └── dashboard/
│   │   │       ├── page.tsx             # Overview (Command Center)
│   │   │       ├── portfolio/page.tsx   # Portfolio X-Ray
│   │   │       ├── health/page.tsx      # Money Health Diagnostic
│   │   │       ├── analytics/page.tsx   # Quantum Analytics
│   │   │       ├── market/page.tsx      # Market Oracle
│   │   │       │   └── search/          # Stock Search
│   │   │       ├── life-planner/page.tsx # Life Event Planner
│   │   │       ├── tax-wizard/          # Tax Oracle
│   │   │       │   ├── page.tsx
│   │   │       │   ├── WizardForm.tsx   # Income/deduction input form
│   │   │       │   └── TaxVerdict.tsx   # Results display
│   │   │       ├── reports/page.tsx     # Intelligence Vault
│   │   │       ├── fire/page.tsx        # FIRE Protocol
│   │   │       ├── settings/page.tsx    # Oracle Configuration
│   │   │       ├── analytics/
│   │   │       │   └── dossier/         # Full PDF dossier download
│   │   │       └── notifications/       # Full notification feed
│   │   │
│   │   ├── components/
│   │   │   ├── navigation/
│   │   │   │   ├── DashboardSidebar.tsx # Collapsible sidebar with all module links
│   │   │   │   └── TopNav.tsx           # Sticky top bar + mobile drawer + notification bell
│   │   │   ├── charts/
│   │   │   │   ├── MoneyHealthGauge.tsx # SVG arc gauge (0–100)
│   │   │   │   ├── HexagonalRadar.tsx   # 6D Recharts radar chart
│   │   │   │   ├── PortfolioTreemap.tsx # D3 treemap
│   │   │   │   ├── XirrvsBenchmarkLine.tsx # Area line chart
│   │   │   │   ├── OverlapHeatmap.tsx   # Fund overlap matrix
│   │   │   │   ├── ExpenseRatioDragChart.tsx # Drag projection chart
│   │   │   │   ├── TaxRegimeComparisonBar.tsx # Old vs New bar chart
│   │   │   │   ├── DeductionUtilisationBars.tsx # 80C/80D/NPS bars
│   │   │   │   ├── GoalProgressRing.tsx # Circular goal progress
│   │   │   │   └── SIPWaterfall.tsx     # SIP allocation waterfall
│   │   │   ├── shared/
│   │   │   │   ├── MetricCard.tsx       # Reusable stat card with trend indicator
│   │   │   │   └── AIBadge.tsx          # "AI Oracle Active" badge component
│   │   │   └── SmoothScroll.tsx         # Global Lenis provider wrapper
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              # JWT auth, Google OAuth, user state
│   │   │   ├── useTaxCalculator.ts     # Client-side tax calculation engine
│   │   │   └── useDashboardTour.ts     # Guided product tour with tooltips
│   │   │
│   │   ├── contexts/
│   │   │   └── NotificationContext.tsx # Real-time notification feed
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                  # API_BASE_URL config (env-aware)
│   │   │
│   │   └── public/
│   │       ├── logo.png                # NiveshIQ logo (transparent)
│   │       ├── oracle-sphere.png       # Login page visual
│   │       └── login-oracle.png        # Auth background
│   │
│   └── api/                            # FastAPI Backend
│       ├── main.py                     # App entry, CORS config, router mounting
│       ├── routes/
│       │   ├── portfolio.py            # /api/portfolio, /api/portfolio/all
│       │   ├── extractor.py            # /api/extractor (PDF parsing)
│       │   ├── health.py               # /api/health, /api/health/all
│       │   ├── tax.py                  # /api/tax, /api/tax/history
│       │   ├── fire.py                 # /api/fire
│       │   ├── life_planner.py         # /api/life-planner
│       │   ├── market.py               # /api/market/*
│       │   ├── auth.py                 # /api/auth/google, /api/auth/me
│       │   └── chat.py                 # /api/chat (AI streaming)
│       ├── models/
│       │   ├── user.py                 # User schema
│       │   ├── portfolio.py            # Portfolio/Holdings schemas
│       │   └── tax.py                  # TaxInput/TaxResult schemas
│       └── services/
│           ├── ai_service.py           # Anthropic Claude calls
│           ├── pdf_parser.py           # CAMS PDF extraction
│           └── tax_calculator.py       # Server-side tax computation
│
└── packages/
    └── types/                          # Shared TypeScript types (TaxInput, etc.)
```

---

## 🔌 API Reference

### Authentication
```http
POST /api/auth/google
Content-Type: application/json
Body: { "token": "<google_id_token>" }
Response: { "token": "<jwt>", "user": { "name", "email", "id" } }
```

```http
GET /api/auth/me
Authorization: Bearer <jwt>
Response: { "id", "name", "email", "phoneNumber", "settings" }
```

### Portfolio X-Ray
```http
POST /api/extractor
Content-Type: multipart/form-data
Body: file=<cams_pdf>, password=<optional_pdf_password>
Authorization: Bearer <jwt>
Response: {
  "success": true,
  "data": {
    "holdings": [...],
    "summary": { "totalInvested", "totalValue", "absoluteReturn" },
    "insights": { "metrics": { "xirr", "riskScore", "overlapCount", "expenseRatioDrag" } }
  }
}
```

```http
GET /api/portfolio
Authorization: Bearer <jwt>
Response: { "success": true, "data": <latest_portfolio_scan> }

GET /api/portfolio/all
Authorization: Bearer <jwt>
Response: { "success": true, "data": [<scan_1>, <scan_2>, ...] }
```

### Money Health
```http
POST /api/health
Authorization: Bearer <jwt>
Body: { "quizAnswers": [...], "scores": [...], "totalScore": 72 }

GET /api/health/all
Authorization: Bearer <jwt>
Response: { "success": true, "data": [<health_scan_1>, ...] }
```

### Tax Engine
```http
POST /api/tax
Authorization: Bearer <jwt>
Body: {
  "grossSalary": 1200000,
  "hra": 180000,
  "rentPaid": 240000,
  "sec80C": 150000,
  "sec80D_self": 25000,
  "sec80D_parents": 50000,
  "sec80CCD1B": 50000,
  "homeLoanInterest": 200000
}
Response: {
  "result": {
    "old": { "totalTax": 95000, "breakdown": [...] },
    "new": { "totalTax": 72000, "breakdown": [...] },
    "deltaTax": 23000,
    "verdict": "new",
    "recommendations": [...]
  }
}
```

### FIRE Protocol
```http
POST /api/fire
Authorization: Bearer <jwt>
Body: {
  "inputs": { "currentAge", "retireAge", "monthlyExpenses", "currentSavings", "inflation", "preRetReturn", "postRetReturn" },
  "results": { "targetCorpus", "sipRequired", "futureMonthlyExpenses", "yearsToRetire" }
}
```

### Market Data
```http
GET /api/market/indices       → All NSE indices with OHLC data
GET /api/market/status        → NSE market open/closed status
GET /api/market/gainers-losers → Top gainers and losers
```

### Life Planner
```http
POST /api/life-planner
Authorization: Bearer <jwt>
Body: { "eventType": "bonus", "inputData": { "amount": "500000" }, "goals": [...] }

GET /api/life-planner/latest
Authorization: Bearer <jwt>
Response: { "success": true, "data": <latest_plan> }
```

---

## 💳 Pricing Tiers

| Feature | Standard Operator | Vault Access (Pro) |
|---|---|---|
| Portfolio X-Ray (profiles) | 1 | Unlimited |
| XIRR Calculation | ✅ | ✅ Priority |
| Money Health Diagnostic | ✅ | ✅ |
| Tax Oracle | Basic | Advanced + Harvesting |
| Market Oracle | ✅ | ✅ |
| Life Event Planner | ✅ | ✅ |
| FIRE Protocol | ✅ | ✅ |
| Reports Archive | 30 days | Lifetime |
| Analytics Deep Dive | ✅ | ✅ |
| Data Export (PDF/CSV/JSON) | PDF only | All formats |
| **Cost** | **₹0 / Lifetime** | **₹999 / Year** |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (or local MongoDB)
- Anthropic API Key
- Google OAuth Client ID

### Installation

```bash
# 1. Clone
git clone https://github.com/yourusername/niveshiq.git
cd NiveshIQ

# 2. Frontend Setup
cd apps/web
npm install
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID
npm run dev

# 3. Backend Setup
cd ../api
pip install -r requirements.txt
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, MONGODB_URL, GOOGLE_CLIENT_ID, SECRET_KEY
uvicorn main:app --reload --port 8000
```

### Environment Variables

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Backend** (`apps/api/.env`):
```env
ANTHROPIC_API_KEY=sk-ant-...
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/niveshiq
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
SECRET_KEY=your_jwt_secret_key_256bit
ALLOWED_ORIGINS=http://localhost:3000,https://niveshiq-tau.vercel.app
```

---

## 🌐 Landing Page

The public-facing landing page (`/`) features:
- **Animated Golden Orb** — SVG spiral traces with radial gradient core, pulsing rings
- **Infinite Ticker** — Scrolling mutual fund returns (AXIS BLUECHIP, SBI SMALL CAP, etc.)
- **INTELLIGENCE Section** — 3 stat cards: "₹0 advisor fees," "10 seconds," "XIRR not guesswork"
- **HOW IT WORKS** — 4-phase alternating desktop timeline + stacked mobile cards
- **STRATEGY Section** — Tax Harvesting, Asset Rebalancing, Geometric Growth cards
- **PRICING Section** — Standard Operator (₹0) vs Vault Access (₹999/yr)
- **CTA Section** — Gold gradient "Ready to see the truth?" with UPLOAD button
- **Lenis smooth scroll navigation** — Click nav links for buttery smooth 2s scroll-to-section

---

## ⚖️ Compliance & Guardrails

NiveshIQ is built with financial responsibility at its core:

- **SEBI Disclaimer** — Every AI output includes mandatory "Not SEBI-registered investment advice" footer
- **No Return Guarantees** — Enforced at prompt level; Claude is instructed never to guarantee returns
- **Tax Calculation Notice** — "Consult a CA for final filing" on all tax outputs
- **Educational Purpose** — All market data served with "for educational purposes only" disclaimer
- **Data Minimization** — Financial PDFs processed in-memory; raw data not logged
- **JWT Security** — Token stored in localStorage as `oracle_token`, sent via Bearer header
- **Google OAuth** — No password storage; all auth via Google Identity Services
- **AES-256 Display** — Platform communicates encryption standards to users

---

## 📊 Societal Impact

| Metric | Status Quo | NiveshIQ Solution |
|---|---|---|
| Financial advisor access | Only top 5% can afford one (₹25,000+/yr) | Free for all 14 crore investors |
| XIRR awareness | <2% of retail investors know their true returns | Computed in 10 seconds |
| Expense ratio drag | ₹8,500/yr silently lost per average portfolio | Surfaced with exact 10-year projection |
| Tax deduction usage | ₹46,800 average unclaimed per salaried taxpayer | Full deduction gap analysis with rupee values |
| Emergency fund coverage | 73% of Indians have <1 month coverage | Flagged as CRITICAL with specific action steps |
| Life insurance adequacy | 68% are underinsured relative to income | Calculated gap with exact policy recommendation |
| Target users | — | 8–10 crore salaried Indians |

---

## 👥 Team

Built with ❤️ for the **ET AI Hackathon 2026** · Problem Statement 9: AI Money Mentor

| Member | Stack |
|---|---|
| Shvet | Full Stack · AI Agents · Backend Architecture |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for ET AI Hackathon 2026 · Problem Statement 9**

*Making institutional-grade financial intelligence accessible to every Indian.*

⭐ Star this repo if NiveshIQ helps you reach Financial Independence.

---

> **DISCLAIMER**: NiveshIQ is not a SEBI-registered investment advisor. All analysis, recommendations, and outputs are for educational and informational purposes only. Past performance is not indicative of future returns. Please consult a qualified financial advisor and/or Chartered Accountant before making any investment or tax decisions.

</div>