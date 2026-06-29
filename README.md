# SupplyGuardian AI
## Autonomous Procurement Operating System

> An AI-powered procurement OS that autonomously discovers suppliers, evaluates risk, negotiates contracts, orchestrates approvals, executes procurement, and continuously protects enterprise supply chains from disruption.

---

## Architecture Overview

```
supplyguardian/
├── frontend/          # Next.js 15 + React 19 + TypeScript
│   └── src/
│       ├── app/       # App Router pages (dashboard, procurement, suppliers, ...)
│       ├── components/ # UI components organized by domain
│       ├── lib/       # API client, utilities
│       └── hooks/     # React hooks (useWebSocket, etc.)
├── backend/           # FastAPI + Python
│   └── app/
│       ├── agents/    # 13 AI agents + orchestrator
│       ├── api/       # REST API routes
│       ├── core/      # Config, DB, security
│       ├── models/    # SQLAlchemy ORM models
│       └── schemas/   # Pydantic request/response schemas
├── docker-compose.yml # Full stack local dev
└── docs/             # Architecture diagrams
```

---

## Tech Stack

### Frontend
- **Next.js 15** + **React 19** + **TypeScript**
- **Tailwind CSS** — custom dark gold design system
- **Recharts** — data visualizations
- **Framer Motion** — animations
- **React Flow** — agent orchestration diagrams
- **Leaflet** — supply chain world map
- **TanStack Query** — server state management
- **Zustand** — client state
- **Socket.IO Client** — real-time updates

### Backend
- **FastAPI** — async REST API
- **SQLAlchemy 2.0** async ORM
- **PostgreSQL** + **pgvector** — relational DB with vector search
- **Redis** — caching and pub/sub
- **LangGraph** — stateful agent workflows
- **OpenAI GPT-4o** — all 13 AI agents
- **Alembic** — database migrations
- **Celery** — background task queue
- **WebSocket** — real-time event streaming

### Infrastructure
- **Docker Compose** — local development
- **OpenTelemetry** — observability
- **Langfuse** — LLM observability
- **JWT** — authentication

---

## AI Agent Ecosystem (13 Agents)

| Agent | Responsibility |
|---|---|
| Procurement Need Agent | Detects inventory shortages, triggers cases |
| Supplier Discovery Agent | Searches global supplier databases |
| Vendor Intelligence Agent | Evaluates supplier reputation and performance |
| Autonomous Negotiation Agent | Multi-round price and terms negotiation |
| Risk & Compliance Agent | OFAC sanctions, AML, KYC, cybersecurity |
| Contract Intelligence Agent | Contract analysis, clause extraction, risk |
| ESG & Sustainability Agent | Carbon footprint, ethical sourcing |
| Market Intelligence Agent | Commodity prices, currency, tariffs |
| Disruption Prediction Agent | Weather, geopolitical, factory, port risks |
| Alternative Supplier Agent | Emergency backup supplier identification |
| Logistics Optimization Agent | Route and carrier optimization |
| Finance Agent | Budget validation, cash flow analysis |
| Executive Advisor Agent | C-suite briefings and recommendations |

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis (or use Docker)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and enter directory
cd supplyguardian

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Add your OpenAI API key to backend/.env
# OPENAI_API_KEY=sk-...

# Start all services
docker-compose up -d

# Seed demo data
docker-compose exec backend python seed.py

# Visit http://localhost:3000
```

### Option 2: Manual Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, OPENAI_API_KEY, etc.

# Run database migrations
alembic upgrade head

# Seed demo data
python seed.py

# Start API server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Start dev server
npm run dev

# Visit http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/supplyguardian
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-your-key
SECRET_KEY=your-jwt-secret
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

---

## Demo Login

After seeding:
- **Email:** j.doe@company.com
- **Password:** password123

---

## Key Features

### Dashboard
- Live KPI cards: inventory value, supplier count, savings, health score
- Hero banner with incoming stock metrics
- March report: KPI table, sales goal progress, inventory distribution
- Recent procurement cases, active negotiations, risk alerts
- 13-agent ecosystem live activity panel

### Procurement Pipeline
- Kanban board with 7 stages: Detected → Supplier Discovery → Negotiation → Risk Review → Approval → Executing → Completed
- Case creation, drag-and-drop (add to full build)
- Pipeline value summary, critical case highlighting

### Supplier Discovery
- Search and filter 128+ suppliers
- Detailed scorecards: delivery, quality, ESG, risk, price
- One-click negotiate, risk screen, full profile
- AI-powered discovery via SupplierDiscoveryAgent

### Negotiation Center
- Live AI negotiation thread with VoltX Energy, Nordic Metals, SinoTech
- Round tracking, price progression, counter-offer history
- AI thinking indicator with real-time streaming
- Approve & Sign workflow trigger

### Risk & Compliance
- OFAC sanctions screening, AML, KYC dashboards
- Risk radar chart across 6 dimensions
- Compliance check progress bars for all suppliers
- Alert severity: Critical, High, Medium, Low

### Contract Intelligence
- AI clause analysis: Force Majeure, Termination, Price Escalation, SLA
- Risk highlighting (green/amber/red)
- AI contract summary and revision recommendations
- Document upload and analysis

### Approvals (Human-in-the-Loop)
- Pending approval queue with urgency indicators
- AI confidence scores per decision
- Approve / Reject / Escalate with comment thread
- Auto-trigger UiPath robot on approval

### Supply Chain Control Tower
- Global map with supplier dots, shipping routes, port status
- Factory capacity monitoring
- Live shipment tracking with status
- Disruption overlays

### Disruption Command Center
- Real-time risk score with trend chart
- Active event cards (factory fire, port strike, geopolitical)
- AI response actions per event
- Simulation mode for scenario planning

### Audit & Logs
- Immutable timeline of all AI, human, RPA, and external actions
- Filter by category, actor type, search
- Exportable audit reports for compliance

### Analytics
- 6-month savings vs spend area chart
- Lead time trend line chart
- Supplier performance scorecard bar chart
- ROI report: $376K savings, 94% automation rate

---

## UiPath Integration Points

The system integrates with UiPath at key execution points:

1. **Contract approval** → UiPath robot creates supplier in ERP (SAP/Oracle)
2. **Purchase order approval** → Robot generates PO, sends to supplier via email
3. **Shipment triggered** → Robot updates tracking in Salesforce
4. **Disruption confirmed** → Robot sends Teams/Outlook notification to stakeholders
5. **Alternative supplier selected** → Robot onboards new supplier in ERP

UiPath Maestro BPMN stages mirror the Kanban pipeline stages.

---

## Folder Structure

```
frontend/src/
├── app/
│   ├── dashboard/page.tsx
│   ├── procurement/page.tsx
│   ├── suppliers/page.tsx
│   ├── negotiations/page.tsx
│   ├── risk/page.tsx
│   ├── contracts/page.tsx
│   ├── supply-chain/page.tsx
│   ├── disruption/page.tsx
│   ├── approvals/page.tsx
│   ├── analytics/page.tsx
│   └── audit/page.tsx
├── components/
│   ├── shared/         (Sidebar, TopNav, AppLayout, Providers)
│   ├── dashboard/      (HeroBanner, KPICards, MarchReport, AgentActivity, ...)
│   ├── procurement/    (ProcurementKanban)
│   ├── suppliers/      (SupplierMarketplace)
│   ├── negotiations/   (NegotiationCenter)
│   ├── risk/           (RiskDashboard)
│   ├── contracts/      (ContractIntelligence)
│   ├── supply-chain/   (SupplyChainMap)
│   ├── disruption/     (DisruptionCenter)
│   ├── approvals/      (ApprovalCenter)
│   ├── analytics/      (AnalyticsDashboard)
│   └── audit/          (AuditLog)
├── lib/
│   └── api.ts          (Centralized API client)
└── hooks/
    └── useWebSocket.ts

backend/app/
├── main.py             (FastAPI app entry point)
├── core/
│   ├── config.py       (Settings)
│   ├── database.py     (Async SQLAlchemy)
│   └── security.py     (JWT auth)
├── models/
│   └── models.py       (All ORM models)
├── schemas/
│   └── schemas.py      (All Pydantic schemas)
├── agents/
│   └── orchestrator.py (All 13 AI agents + orchestration)
└── api/routes/
    ├── auth.py
    ├── dashboard.py
    ├── procurement.py
    ├── suppliers.py
    ├── negotiations.py
    ├── risk.py
    ├── contracts.py
    ├── approvals.py
    ├── agents.py
    ├── supply_chain.py
    ├── disruption.py
    ├── audit.py
    ├── analytics.py
    └── websocket.py
```
