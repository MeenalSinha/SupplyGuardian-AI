# SupplyGuardian AI
### Autonomous Procurement Operating System — built on the UiPath Platform

> SupplyGuardian AI is an AI-powered procurement operating system that autonomously discovers suppliers, evaluates risk, negotiates contracts, orchestrates human approvals, and executes procurement actions — protecting enterprise supply chains from disruption end-to-end, from inventory shortage detection to purchase order execution in SAP/Oracle.

---

## 1. Project Description

### The Problem

Enterprise procurement teams are reactive by default. Inventory shortages are caught late, supplier risk (sanctions, ESG, cyber, financial) is checked manually or not at all, contract review takes days, and the final mile — creating a vendor in SAP, generating a PO, notifying stakeholders — is still done by hand across disconnected systems (ERP, email, Teams, Salesforce). A single disruption (a port strike, a factory fire, a sanctioned supplier) can sit undetected for days because no single system watches the whole chain: demand, supplier, contract, risk, and execution.

### What SupplyGuardian AI Does

SupplyGuardian AI closes that loop. It is a control tower that:

1. **Detects** inventory shortages and automatically opens a procurement case.
2. **Discovers and scores** suppliers against delivery, quality, ESG, risk, and price.
3. **Negotiates** price and terms autonomously across multiple rounds.
4. **Screens** every supplier for sanctions (OFAC), AML, KYC, and cyber risk.
5. **Reads contracts** — extracting clauses, flagging risk (e.g., uncapped price escalation, short termination notice), and summarizing for a human reviewer.
6. **Routes for human approval** at every financially or legally material decision (Human-in-the-Loop), with AI confidence scores attached to each recommendation.
7. **Executes** the approved decision in the real world: creates the vendor in SAP/Oracle, generates and sends the PO, notifies the team on Teams/Outlook, and updates the CRM — via UiPath robots.
8. **Watches continuously** for disruption (weather, geopolitical, factory, port) and proposes alternative suppliers within minutes of a confirmed event.
9. **Logs everything** — every AI decision, human decision, and robot action — to an immutable audit trail for compliance.

The result, modeled in the included demo dataset, is roughly $376K in sourcing savings and a 94% automation rate across the procurement lifecycle, while keeping a human in the loop for every decision that carries financial or legal risk.

---

## 2. UiPath Components Used

This project utilizes the following UiPath capabilities:

### UiPath Maestro BPMN
- End-to-end procurement orchestration
- BPMN workflow design
- Gateways
- Timers
- Boundary events
- Retry logic
- Compensation paths
- Long-running workflows
- **Where:** `backend/app/services/uipath_service.py` (`UiPathMaestroClient`), `backend/app/api/routes/uipath.py` (`/maestro/*`), `frontend/src/components/procurement/BPMNWorkflow.tsx`, `BPMNEnhanced.tsx`

### UiPath Studio Web
- Workflow development
- BPMN modeling
- Agent orchestration
- Enterprise automation design
- **Where:** `SupplyGuardian AI.uis` (Studio Web project file), `uipath_robot/` (packaged process authored in Studio)

### UiPath AI Agent Activities
Integrated AI agents throughout the procurement lifecycle. Agents include:
- Procurement Need Agent
- Supplier Discovery Agent
- Vendor Intelligence Agent
- Negotiation Agent
- Risk & Compliance Agent
- Disruption Monitoring Agent
- Alternative Supplier Agent
- **Where:** `backend/app/agents/orchestrator.py` (agent implementations), `backend/app/api/routes/agents.py` (agent invocation endpoints) — see **Agent Type** below for how these are implemented and orchestrated.

### UiPath Case Management
Dynamic cases are automatically created for:
- Supplier Compliance Failure
- Sanctions Match
- Contract Exception
- Shipment Delay
- Supplier Bankruptcy
- Factory Fire
- Budget Exception
- Procurement Escalation
- Approval Timeout
- ERP Failure

Each case contains:
- Case ID
- Priority
- Owner
- SLA
- Timeline
- Status
- Comments
- Audit History
- **Where:** `UiPathCaseManagementClient` in `uipath_service.py`, `/api/v1/uipath/cases*` routes, `frontend/src/components/cases/CaseManagement.tsx`

### Human-in-the-Loop
Executive approvals are triggered when:
- Procurement value exceeds threshold
- Supplier risk is high
- Sanctions review required
- New supplier onboarding
- Contract deviation exceeds policy
- Alternative supplier change impacts procurement budget

Every Maestro workflow pauses at a human task before any robot is triggered; the in-app decision drives resume/terminate back into Maestro.
- **Where:** `trigger_human_task` / `resume_workflow` in `uipath_service.py`, `frontend/src/components/approvals/ApprovalCenter.tsx`

### UiPath Robots (RPA)
Simulated enterprise automations include:
- ERP Updates
- Purchase Order Creation
- Supplier Creation
- Outlook Notifications
- Teams Notifications
- Procurement Reporting
- **Where:** `UiPathRPAClient` in `uipath_service.py`, `/api/v1/uipath/rpa/*` routes, `frontend/src/components/shared/RPAPanel.tsx`, `frontend/src/app/rpa/page.tsx`

### UiPath Document Understanding
Extracts structured fields and clauses from uploaded contract/invoice documents (value, dates, payment terms, penalty clauses) and flags risk per clause with confidence scores, feeding the Contract Intelligence screen.
- **Where:** `UiPathDocumentUnderstanding` in `uipath_service.py`, `/api/v1/uipath/document-understanding/*` routes, `frontend/src/components/contracts/ContractIntelligence.tsx`

### Full Orchestration Endpoint
A single entry point that chains Maestro → Case Management → Human Task → (on approval) RPA Robots, demonstrating the complete UiPath-governed procurement loop end-to-end.
- **Where:** `POST /api/v1/uipath/orchestrate/full-procurement` in `uipath.py`

**Note for judges:** the `UiPathMaestroClient`, `UiPathCaseManagementClient`, `UiPathRPAClient`, and `UiPathDocumentUnderstanding` classes ship in **demo mode** by default (no tenant configured), returning realistic, fully-shaped UiPath API responses so the full product experience — including audit trail entries and robot execution results — can be evaluated without provisioning an Orchestrator tenant. Each client method contains the exact call it would make against a live UiPath Orchestrator/Maestro tenant once `UIPATH_TENANT_URL`, `UIPATH_CLIENT_ID`, and `UIPATH_CLIENT_SECRET` are supplied (see Setup below). The one component that runs as a genuine, packaged UiPath Studio process — independent of demo mode — is `uipath_robot/Main.xaml`, which can be opened and run directly in UiPath Studio/Assistant.

---

## 3. Agent Type

**SupplyGuardian AI uses Coded Agents, surfaced into the UiPath process as AI Agent Activities.**

All 13 reasoning agents (Procurement Need, Supplier Discovery, Vendor Intelligence, Autonomous Negotiation, Risk & Compliance, Contract Intelligence, ESG & Sustainability, Market Intelligence, Disruption Prediction, Alternative Supplier, Logistics Optimization, Finance, Executive Advisor) are implemented as Python classes built on **LangGraph** for stateful, multi-step reasoning, calling **OpenAI GPT-4o** for inference, rather than assembled purely from prompts in a no-code canvas. These agents are invoked as the AI Agent Activities steps inside the Maestro BPMN process (see *UiPath AI Agent Activities* above) — each BPMN agent step calls out to the corresponding coded agent for its reasoning, then returns a structured result to the workflow.

- **Location:** `backend/app/agents/orchestrator.py` (agent classes + orchestration logic), invoked via `backend/app/api/routes/agents.py`.
- **Why coded:** the agent ecosystem needs custom multi-round negotiation state, structured risk-scoring logic across 6 dimensions, and tight integration with the FastAPI/PostgreSQL data layer — control that's most naturally expressed in code rather than a no-code canvas.
- **Honest disclosure for judges:** the agent *reasoning* is hand-written Python (Coded Agents), not assembled in UiPath's Agent Builder canvas. What ties them into the UiPath platform is that their invocation points are positioned as AI Agent Activity steps within the Maestro BPMN definition, and their outputs drive the same case/approval/RPA pipeline Maestro governs. If your evaluation criteria require agents specifically authored in Agent Builder's low-code canvas, this submission should be described as **Coded Agents integrated as AI Agent Activities**, not Low-Code Agents.
- Each coded agent runs with a graceful **mock-response fallback** (`BaseAgent._mock_response`) when no `OPENAI_API_KEY` is configured, so the full pipeline can be judged end-to-end without a live LLM key.

**Summary:** Reasoning = Coded Agents (Python/LangGraph/GPT-4o), wired in as AI Agent Activities. Process governance and execution = UiPath Maestro, Case Management, Orchestrator-triggered RPA robots, and one native UiPath Studio workflow.

---

## 4. Setup Instructions (for Judging)

### Prerequisites
- Docker & Docker Compose (recommended path), **or** Node.js 20+, Python 3.12+, PostgreSQL 16, Redis for manual setup
- (Optional) An OpenAI API key — the system runs fully on mock data without one
- (Optional) A UiPath Orchestrator/Maestro tenant + Studio — the system runs fully in demo mode without one
- UiPath Studio (Community or Enterprise) if you want to open/run `uipath_robot/Main.xaml` directly

### Option A — Docker Compose (recommended, fastest path to a running demo)

```bash
# 1. Clone and enter the project
git clone https://github.com/<your-org>/SupplyGuardian-AI.git
cd SupplyGuardian-AI

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. (Optional) add your OpenAI key for live AI reasoning instead of mock responses
#    Edit backend/.env -> OPENAI_API_KEY=sk-...
#    (Optional) add UiPath tenant credentials for live Orchestrator calls
#    Edit backend/.env -> UIPATH_TENANT_URL / UIPATH_CLIENT_ID / UIPATH_CLIENT_SECRET
#    Both are optional — the app runs fully on mock/demo data without them.

# 4. Start the full stack (Postgres + pgvector, Redis, FastAPI backend, Next.js frontend)
docker-compose up -d

# 5. Seed demo data (suppliers, cases, contracts, audit history)
docker-compose exec backend python seed.py

# 6. Open the app
# Frontend:        http://localhost:3000
# Backend API docs: http://localhost:8000/api/docs
```

**Demo login** (created by `seed.py`):
- Email: `j.doe@company.com`
- Password: `password123`

### Option B — Manual Setup (no Docker)

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit DATABASE_URL, OPENAI_API_KEY (optional), UIPATH_* (optional)
alembic upgrade head            # run DB migrations (requires local PostgreSQL 16 + pgvector)
python seed.py                  # load demo suppliers, cases, contracts
uvicorn app.main:app --reload --port 8000
```

**Frontend** (in a second terminal)
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Visit `http://localhost:3000`.

### Verifying the UiPath Integration Specifically

1. **Maestro / Case Management / RPA (demo mode, no tenant needed):**
   Open the API docs at `http://localhost:8000/api/docs`, locate the `uipath` tag, and call `POST /api/v1/uipath/orchestrate/full-procurement` with a sample case to see a Maestro workflow start, a Case Management entry get created, and a human-approval task get raised in one call. Approving a case in the **Approvals** screen in the UI (`/approvals`) triggers the downstream RPA robot calls (`/rpa/create-supplier-sap`, `/rpa/create-purchase-order`, etc.), visible in the **RPA** screen (`/rpa`) and the **Audit & Logs** screen (`/audit`).

2. **Live Orchestrator/Maestro (optional, requires a tenant):**
   Supply `UIPATH_TENANT_URL`, `UIPATH_CLIENT_ID`, and `UIPATH_CLIENT_SECRET` in `backend/.env`. The same client classes in `backend/app/services/uipath_service.py` are structured to call the real UiPath Orchestrator API once these are present (the production branch in each client method).

3. **UiPath Studio Robot (native UiPath, no backend needed):**
   Open `uipath_robot/project.json` in UiPath Studio (or open the `SupplyGuardian AI.uis` project file), or run `uipath_robot/Main.xaml` directly. This is the `SupplyGuardian_PO_Generator` process: it generates a Purchase Order in the ERP and sends a confirmation email when triggered, and can be run/debugged in Studio independently of the web app to verify it as a standalone UiPath artifact.

### Environment Variables Reference

**Backend (`backend/.env`)** — only `DATABASE_URL` is required to boot; everything else is optional and the app degrades gracefully:
```env
DATABASE_URL=postgresql+asyncpg://supplyguardian:supplyguardian@localhost:5432/supplyguardian
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-your-openai-api-key-here      # optional — falls back to mock agent responses
UIPATH_TENANT_URL=https://your-tenant.uipath.com # optional — falls back to UiPath demo-mode responses
UIPATH_CLIENT_ID=your-uipath-client-id
UIPATH_CLIENT_SECRET=your-uipath-client-secret
SECRET_KEY=change-this-to-a-secure-random-string
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### API Documentation
With the backend running:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

---

## Architecture Overview

```
supplyguardian/
├── frontend/            # Next.js 15 + React 19 + TypeScript — dashboard, pipeline, suppliers, negotiations, risk, contracts, approvals, RPA, audit, analytics
├── backend/
│   └── app/
│       ├── agents/      # 13 Coded Agents + orchestrator (LangGraph + GPT-4o)
│       ├── services/    # uipath_service.py — Maestro, Case Management, RPA, Document Understanding clients
│       ├── api/routes/  # REST routes, incl. uipath.py for all UiPath endpoints
│       ├── core/        # config, DB, security
│       └── models/      # SQLAlchemy ORM
├── uipath_robot/        # Native UiPath Studio project — SupplyGuardian_PO_Generator (Main.xaml, project.json)
├── SupplyGuardian AI.uis  # Packaged UiPath Studio project file
└── docker-compose.yml   # One-command local stack
```

## Tech Stack Summary

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, Framer Motion, React Flow, Leaflet, TanStack Query, Zustand, Socket.IO
- **Backend:** FastAPI, SQLAlchemy 2.0 (async), PostgreSQL + pgvector, Redis, LangGraph, OpenAI GPT-4o, Alembic, Celery, WebSockets
- **Automation / Orchestration:** UiPath Maestro, UiPath Case Management, UiPath Orchestrator (RPA robot triggers), UiPath Document Understanding, UiPath Studio (packaged robot)
- **Infrastructure:** Docker Compose, OpenTelemetry, Langfuse, JWT auth

---

## Key Demo Screens

| Screen | Route | What to Look For |
|---|---|---|
| Dashboard | `/dashboard` | Live KPIs, 13-agent activity feed |
| Procurement Pipeline | `/procurement` | Kanban mirrored 1:1 with the Maestro BPMN stages |
| Supplier Discovery | `/suppliers` | AI-scored supplier marketplace (128+ suppliers) |
| Negotiation Center | `/negotiations` | Live AI negotiation thread, round-by-round |
| Risk & Compliance | `/risk` | OFAC/AML/KYC screening, 6-axis risk radar |
| Contract Intelligence | `/contracts` | Document Understanding clause extraction & risk flags |
| Approvals | `/approvals` | Human-in-the-Loop gate that resumes Maestro and fires RPA robots |
| RPA | `/rpa` | Live robot job results (SAP, Outlook, Teams, Salesforce) |
| Disruption Command Center | `/disruption` | Real-time risk events + AI response actions |
| Audit & Logs | `/audit` | Immutable timeline of every AI, human, and robot action |
| Analytics | `/analytics` | ROI report — savings, automation rate, performance trends |

---

## License

This project was built for hackathon/competition submission and evaluation purposes.
