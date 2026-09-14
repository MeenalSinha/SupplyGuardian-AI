# SupplyGuardian AI

> **An autonomous procurement agent that does the repetitive sourcing work for procurement professionals, while humans retain control over consequential decisions.**

---

## The Problem

Global procurement professionals spend 60–80% of their time on repeatable, data-intensive tasks: finding suppliers, comparing quotes, screening for compliance, and iterating on price negotiations. This leaves little time for strategic decision-making while supply chain risks accumulate.

## The Solution

**SupplyGuardian AI** is an autonomous procurement agent. It handles the entire sourcing workflow autonomously — from supplier discovery to risk screening to price negotiation — then **stops and asks for human approval** at consequential decision points.

**The winning loop:**
```
Goal → Research → Risk Screen → Negotiate → Human Approval → Execute
```

## Why This Is a Real Agent (Not a Chatbot)

This is not an LLM wrapper or a scripted dashboard. It is a multi-agent system where:

1. **A Planner Agent** receives the procurement goal and delegates sub-tasks
2. **A Research Agent** calls the `search_suppliers` tool → returns a ranked candidate list
3. **A Risk & Compliance Agent** calls `evaluate_supplier_risk` for *every* candidate → filters HIGH-risk suppliers using deterministic compliance data
4. **A Negotiation Agent** calls `generate_negotiation_counter_offer` → uses a real formula (`current - (current - target) × 0.40`) to produce a defensible counter-price
5. **A Policy Engine** deterministically evaluates whether the purchase exceeds the $100,000 autonomous-execution threshold
6. **If yes** → creates a human approval request with full evidence; execution is blocked until approved

Tool outputs flow forward between agents. The trace shown in the UI comes directly from the backend execution log — it is not a pre-scripted animation.

## Strands Agents SDK

The agent layer is built on the **Strands Agents SDK** (`strands==0.1.0`), using the Strands `Agent` and `Tool` interface. In the current demo configuration, tool selection is deterministic (by agent role) making it reliable without requiring LLM API keys from judges. The architecture is designed so that switching to LLM-driven tool selection (production mode) requires only setting `USE_REAL_LLM=true` and providing API credentials.

## Agent Architecture

| Agent | Role | Tool |
|---|---|---|
| Procurement Planner | Orchestrator | All tools |
| Supplier Research Agent | Researcher | `search_suppliers` |
| Risk & Compliance Agent | Risk Assessor | `evaluate_supplier_risk` |
| Negotiation Agent | Negotiator | `generate_negotiation_counter_offer` |
| Approval Center Agent | Escalator | `request_human_approval` |

## Human-in-the-Loop (Non-Negotiable)

- If `procurement_value > $100,000` → **execution stops, human approval required**
- If `supplier_risk == HIGH` → **supplier is blocked, agent selects next best option**
- Humans see: Supplier name, Risk score, Negotiated total, Calculated savings, Policy reason
- Humans do NOT see: Raw LLM chain-of-thought or internal reasoning

## UiPath Maestro

The architecture separates *Intelligence* (Strands Agents) from *Execution* (UiPath):
- **Strands Agents** — reasoning, planning, tool selection
- **UiPath Maestro** — governed workflow orchestration after approval
- **UiPath Robots** — deterministic ERP actions (PO generation, supplier creation in SAP)

> In the hackathon Judge Mode, UiPath execution is **simulated** and clearly labelled as such. The `uipath_service.py` backend service contains the full API integration structure (Maestro, Case Management, RPA) for production deployment.

## Running Locally (Judge Mode)

**Requirements:** Python 3.11, Node.js 18+

```bash
# Backend (requires Python 3.11)
cd backend
py -3.11 -m venv venv311
.\venv311\Scripts\activate        # Windows
# source venv311/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> **Note:** The backend requires PostgreSQL for full functionality. For Judge Mode demo, procurement workflow endpoints (`/api/v1/agents/workflow/full-procurement`) work without a database — they run the pure agent workflow. The `/api/health` endpoint will confirm backend is running.

```bash
# Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

**Judge Mode Demo:**
1. Open the dashboard
2. Click **"START AGENT — Judge Mode Demo"**
3. Watch the live execution trace populate with real backend tool call results
4. When the approval gate triggers, click **APPROVE**
5. Observe the simulated UiPath execution confirmation

## What the Demo Proves

- "The agent found **5 suppliers**, eliminated **2** because of compliance risk (BattCo: OFAC match, PowerCell: EU trade investigation), negotiated the preferred supplier from the initial quote down using a **deterministic formula**, and then stopped because the purchase exceeded the **$100,000 autonomous execution threshold**."
- The $X savings figure shown is **calculated** from `(initial_unit_price - counter_price) × quantity`, not generated by an LLM.

## Built With

| Layer | Technology |
|---|---|
| Agent Intelligence | Strands Agents SDK |
| Backend API | FastAPI (Python) |
| Frontend | Next.js 14, Tailwind CSS, TypeScript |
| Database | PostgreSQL + SQLAlchemy (async) |
| Workflow Governance | UiPath Maestro (simulated in demo) |
| Observability | structlog, OpenTelemetry |

## Limitations & Honesty

- **Strands in demo mode**: Tool selection is deterministic by agent role, not LLM-driven. Setting `USE_REAL_LLM=true` enables the real Strands SDK path with a connected LLM.
- **UiPath**: Integration is demonstrated through a realistic simulation layer. No live UiPath tenant is required for the demo.
- **Supplier data**: The supplier database is structured demo data. Financial figures (prices, savings) are calculated from this data — not hallucinated.
- **AWS Bedrock**: Listed as a production target for the LLM backend. Not required for the demo.
