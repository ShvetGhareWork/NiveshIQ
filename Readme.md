# NiveshIQ 🪙
### Your Personal AI Financial Advisor — Free. Instant. Built for Every Indian.

<div align="center">

![NiveshIQ Banner](https://via.placeholder.com/900x300/0A0F1E/D4AF37?text=NiveshIQ+%E2%80%94+Investment+Intelligence)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-D4AF37?style=for-the-badge)](https://anthropic.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-14B8A6?style=for-the-badge)](LICENSE)

**Built for ET AI Hackathon 2026 · Problem Statement 9 — AI Money Mentor**

[Live Demo](#) · [Watch Pitch Video](#) · [Architecture Docs](#architecture) · [API Reference](#api-reference)

</div>

---

## The Problem

India has **14 crore+ demat accounts**. Most retail investors are flying blind.

- They don't know their **real returns** (XIRR, not the fake absolute return)
- They own 5 funds that are **72% identical** — paying double fees for the same stocks
- They **miss ₹46,800+** in tax deductions every year
- A qualified financial advisor costs **₹25,000/year** and only serves HNIs

**NiveshIQ solves all of this in under 10 minutes — for free.**

---

## What NiveshIQ Does

> Upload one PDF or Excel. Get the financial clarity that only rich people could afford.

| Service | What It Does | Time |
|---|---|---|
| 📊 **Portfolio X-Ray** | True XIRR, fund overlap heatmap, expense drag, rebalancing plan | 10 seconds |
| 🛡️ **Money Health Score** | 6-dimension financial wellness score across emergency fund, insurance, debt, tax, retirement | 5 minutes |
| 📄 **Tax Wizard** | Old vs new regime comparison, every missed deduction with rupee value | 2 minutes |
| 💍 **Life Event Planner** | Custom action plan for bonus, marriage, new baby, inheritance | 3 minutes |
| ⏰ **FIRE Planner** | Month-by-month SIP roadmap to financial independence | 5 minutes |
| 🏠 **Personal Dashboard** | All your reports, trends, and AI insights saved in one place | Always on |

---

## Demo

<div align="center">

### Portfolio X-Ray — Overlap Heatmap
![Overlap Heatmap](https://via.placeholder.com/700x350/111827/14B8A6?text=Fund+Overlap+Heatmap+Demo)

### Money Health Score
![Health Score](https://via.placeholder.com/700x350/111827/D4AF37?text=Money+Health+Score+Demo)

</div>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│              Next.js 14 · Tailwind · shadcn/ui               │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / streaming
┌──────────────────────────▼──────────────────────────────────┐
│                      FASTAPI BACKEND                          │
│         Orchestrator Agent → routes to specialists            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │Portfolio │ │   Tax    │ │  Health  │ │LifeEvent/FIRE│   │
│  │  Agent   │ │  Agent   │ │  Agent   │ │    Agent     │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘   │
└───────┼────────────┼────────────┼───────────────┼───────────┘
        │            │            │               │
┌───────▼────────────▼────────────▼───────────────▼───────────┐
│                      AI + DATA LAYER                          │
│   Claude Sonnet API · pyxirr · pandas · yfinance · NSE API   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     DATA PERSISTENCE                          │
│          PostgreSQL (Supabase) · Redis Cache                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | SSR framework, routing |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library |
| Recharts + D3.js | Portfolio charts, heatmaps |
| React Hook Form | Quiz and form handling |

### Backend
| Tool | Purpose |
|---|---|
| FastAPI (Python 3.11) | REST API, streaming responses |
| pandas + openpyxl | CAMS Excel / PDF parsing |
| pyxirr | True XIRR calculation |
| LangChain | Agent orchestration |
| Celery + Redis | Async task processing |

### AI Layer
| Tool | Purpose |
|---|---|
| Claude claude-sonnet-4-6 (Anthropic) | Core reasoning, advice generation |
| Anthropic Python SDK | API calls, streaming |
| Custom prompt templates | Per-agent system prompts |

### Data & Infrastructure
| Tool | Purpose |
|---|---|
| PostgreSQL (Supabase) | User data, report history |
| Redis | NAV cache, sessions |
| yfinance / NSE API | Live NAV and price data |
| Vercel | Frontend deployment |
| Railway | Backend + Celery workers |
| Docker | Containerisation |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

```
niveshiq/
│
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── xray/           # Portfolio X-Ray flow
│   │   │   ├── health-score/   # Money Health Score quiz
│   │   │   ├── tax-wizard/     # Tax Wizard
│   │   │   ├── life-event/     # Life Event Planner
│   │   │   ├── fire-planner/   # FIRE roadmap
│   │   │   └── dashboard/      # Authenticated dashboard
│   │   └── components/
│   │       ├── charts/         # Recharts + D3 heatmaps
│   │       ├── ui/             # shadcn/ui components
│   │       └── agents/         # Streaming AI response components
│   │
│   ├── api/                    # FastAPI backend
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── xray.py         # Portfolio X-Ray endpoints
│   │   │   ├── health.py       # Health Score endpoints
│   │   │   ├── tax.py          # Tax Wizard endpoints
│   │   │   └── fire.py         # FIRE Planner endpoints
│   │   └── middleware/
│   │       ├── auth.py         # Supabase auth middleware
│   │       └── audit.py        # Decision audit logging
│   │
│   └── workers/                # Celery async workers
│       ├── xray_worker.py      # Long-running X-Ray analysis
│       └── nav_sync.py         # Daily NAV data refresh
│
├── packages/
│   ├── agents/                 # LangChain agent definitions
│   │   ├── orchestrator.py     # Intent detection + routing
│   │   ├── portfolio_agent.py  # XIRR, overlap, expense drag
│   │   ├── tax_agent.py        # Old vs new regime analysis
│   │   ├── health_agent.py     # 6-dimension scoring
│   │   ├── life_event_agent.py # Event-specific planning
│   │   └── fire_agent.py       # FIRE roadmap generation
│   │
│   ├── parsers/                # File parsing logic
│   │   ├── cams_excel.py       # CAMS Excel parser (pandas)
│   │   ├── cams_pdf.py         # CAMS PDF parser (pdfplumber)
│   │   ├── form16.py           # Form 16 parser
│   │   └── xirr.py             # XIRR calculation (pyxirr)
│   │
│   └── prompts/                # System prompt templates
│       ├── portfolio.txt
│       ├── tax.txt
│       ├── health.txt
│       └── guardrails.txt      # SEBI compliance guardrails
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (or Supabase account)
- Redis
- Anthropic API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/niveshiq.git
cd niveshiq
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Redis
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/niveshiq

# NSE / Market Data
YFINANCE_CACHE_TTL=3600
```

### 3. Install backend dependencies

```bash
cd apps/api
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd apps/web
npm install
```

### 5. Run database migrations

```bash
cd apps/api
alembic upgrade head
```

### 6. Start all services

```bash
# Option A — Docker (recommended)
docker-compose up

# Option B — Manual
# Terminal 1: FastAPI backend
cd apps/api && uvicorn main:app --reload --port 8000

# Terminal 2: Celery worker
cd apps/workers && celery -A xray_worker worker --loglevel=info

# Terminal 3: Next.js frontend
cd apps/web && npm run dev

# Terminal 4: Redis
redis-server
```

### 7. Open the app

```
Frontend  → http://localhost:3000
API docs  → http://localhost:8000/docs
```

---

## API Reference

### Portfolio X-Ray

```http
POST /api/v1/xray/upload
Content-Type: multipart/form-data

file: <CAMS Excel or PDF>
```

**Response:**
```json
{
  "status": "processing",
  "job_id": "xray_abc123",
  "estimated_seconds": 8
}
```

```http
GET /api/v1/xray/results/{job_id}
```

**Response:**
```json
{
  "xirr": 14.3,
  "total_invested": 850000,
  "current_value": 1124000,
  "expense_drag_yearly": 8500,
  "overlap_matrix": { ... },
  "rebalancing_plan": [ ... ],
  "ai_insight": "Your portfolio is 72% overlapping..."
}
```

### Money Health Score

```http
POST /api/v1/health/score
Content-Type: application/json

{
  "monthly_income": 80000,
  "monthly_expenses": 55000,
  "emergency_fund_months": 2,
  "has_term_insurance": false,
  "total_debt_emi": 15000,
  "monthly_investment": 10000,
  "retirement_corpus_target": 30000000
}
```

### Tax Wizard

```http
POST /api/v1/tax/compare
Content-Type: application/json

{
  "gross_salary": 1200000,
  "hra_received": 180000,
  "rent_paid": 240000,
  "section_80c": 100000,
  "section_80d": 0,
  "nps_80ccd": 0
}
```

---

## Screens

| # | Screen | Route | Auth |
|---|---|---|---|
| 01 | Landing / Hero | `/` | Public |
| 02 | How It Works | `/how-it-works` | Public |
| 03 | Login / Sign Up | `/auth` | Public |
| 04 | Portfolio X-Ray Upload | `/xray` | Public |
| 05 | Portfolio X-Ray Results | `/xray/results` | Public |
| 06 | Money Health Quiz | `/health-score` | Public |
| 07 | Money Health Results | `/health-score/results` | Public |
| 08 | Tax Wizard | `/tax-wizard` | Public |
| 09 | Life Event Planner | `/life-event` | Public |
| 10 | FIRE Planner | `/fire-planner` | Public |
| 11 | Dashboard | `/dashboard` | Required |
| 12 | My Reports | `/reports` | Required |
| 13 | Report Detail | `/reports/:id` | Required |
| 14 | Profile & Settings | `/settings` | Required |

---

## Key Differentiators

### What makes NiveshIQ different from just asking ChatGPT

| Feature | ChatGPT / Claude | NiveshIQ |
|---|---|---|
| Reads your actual CAMS file | ❌ No file integration | ✅ Direct Excel/PDF parse |
| Computes true XIRR | ❌ Often incorrect | ✅ pyxirr — mathematically exact |
| Fund overlap heatmap | ❌ Text only | ✅ Interactive visual matrix |
| Live benchmark chart | ❌ No market data | ✅ Real NSE/yfinance data |
| Old vs new tax regime | ❌ Generic advice | ✅ Your exact numbers, live |
| Downloadable PDF report | ❌ Copy-paste only | ✅ One-click branded PDF |
| SEBI-compliant guardrails | ❌ No compliance layer | ✅ Built-in audit log |
| Saves history over time | ❌ No memory | ✅ Full dashboard + history |

---

## Compliance & Guardrails

NiveshIQ takes financial compliance seriously.

- Every AI recommendation includes the mandatory SEBI disclaimer
- No guaranteed return claims — enforced at prompt level
- All tax calculations carry "Consult a CA for final filing" notice
- Every agent decision is logged to an immutable `audit_log` table with timestamp, input hash, and output
- User financial data is processed in-memory and never stored without explicit consent
- Passwords protected by Supabase Auth (bcrypt)
- All API endpoints rate-limited to prevent abuse

---

## Societal Impact

| Metric | Current Reality | NiveshIQ Impact |
|---|---|---|
| Financial advisor access | Only top 5% can afford one | Free for everyone |
| Average expense ratio loss | ₹8,500/yr unnoticed | Surfaced instantly |
| Missed tax deductions | ₹46,800 avg per salaried employee | Flagged and explained |
| XIRR awareness | <2% of retail investors know theirs | Computed in 10 seconds |
| Target users | — | 8–10 crore salaried Indians |

---

## Team

Built with ❤️ for the ET AI Hackathon 2026.

| Name | Role |
|---|---|
| Shvet | Full Stack + AI Agents |
| '' | Frontend + Design |
| '' | Data Engineering + Parsers |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Disclaimer

> NiveshIQ is not a SEBI-registered investment advisor. All analysis, recommendations, and outputs are for educational and informational purposes only. Past performance is not indicative of future returns. Please consult a qualified financial advisor and/or Chartered Accountant before making any investment or tax decisions.

---

<div align="center">

**Built for ET AI Hackathon 2026 · Problem Statement 9**

*Making financial intelligence accessible to every Indian*

⭐ Star this repo if NiveshIQ helps you · [Report a Bug](issues) · [Request a Feature](issues)

</div>