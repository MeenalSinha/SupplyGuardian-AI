"""AI Agent endpoints - run individual agents or full workflows."""

from fastapi import APIRouter, HTTPException
from app.agents.orchestrator import AgentOrchestrator
from app.schemas.schemas import AgentRunRequest, AgentRunResponse
from app.core.config import settings

router = APIRouter()

AGENT_NAMES = [
    "procurement_need", "supplier_discovery", "vendor_intelligence",
    "negotiation", "risk_compliance", "contract_intelligence",
    "esg", "market_intelligence", "disruption_prediction",
    "alternative_supplier", "logistics", "finance", "executive_advisor",
]


@router.get("/")
async def list_agents():
    return {
        "agents": [
            {"name": "procurement_need", "display": "Procurement Need Agent", "status": "active"},
            {"name": "supplier_discovery", "display": "Supplier Discovery Agent", "status": "active"},
            {"name": "vendor_intelligence", "display": "Vendor Intelligence Agent", "status": "idle"},
            {"name": "negotiation", "display": "Autonomous Negotiation Agent", "status": "active"},
            {"name": "risk_compliance", "display": "Risk & Compliance Agent", "status": "alert"},
            {"name": "contract_intelligence", "display": "Contract Intelligence Agent", "status": "idle"},
            {"name": "esg", "display": "ESG & Sustainability Agent", "status": "active"},
            {"name": "market_intelligence", "display": "Market Intelligence Agent", "status": "active"},
            {"name": "disruption_prediction", "display": "Disruption Prediction Agent", "status": "alert"},
            {"name": "alternative_supplier", "display": "Alternative Supplier Agent", "status": "active"},
            {"name": "logistics", "display": "Logistics Optimization Agent", "status": "idle"},
            {"name": "finance", "display": "Finance Agent", "status": "idle"},
            {"name": "executive_advisor", "display": "Executive Advisor Agent", "status": "idle"},
        ]
    }


@router.post("/run")
async def run_agent(request: AgentRunRequest):
    """Run a specific AI agent with provided context."""
    if request.agent_name not in AGENT_NAMES:
        raise HTTPException(400, f"Unknown agent: {request.agent_name}. Valid agents: {AGENT_NAMES}")

    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent(request.agent_name, request.context)

    return AgentRunResponse(
        agent_name=request.agent_name,
        result=result.get("result", {}),
        reasoning=str(result.get("result", {}).get("reasoning", "Agent completed successfully")),
        confidence=result.get("confidence", 0.85),
        actions_taken=result.get("actions_taken", []),
    )


@router.post("/workflow/full-procurement")
async def run_full_procurement_workflow(
    item: str,
    quantity: int = 1,
    estimated_value: float = 0.0,
):
    """Run the complete end-to-end AI procurement workflow."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_full_procurement_workflow(item, quantity, estimated_value)
    return result


@router.post("/workflow/disruption-response")
async def run_disruption_workflow(supplier_id: str, disruption_type: str):
    """Run the disruption response workflow: predict + find alternatives + optimize logistics."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)

    context = {"supplier_id": supplier_id, "disruption_type": disruption_type}

    disruption = await orchestrator.run_agent("disruption_prediction", context)
    alternatives = await orchestrator.run_agent("alternative_supplier", {
        "disrupted_supplier": {"id": supplier_id},
        "requirements": context,
    })
    logistics = await orchestrator.run_agent("logistics", context)
    briefing = await orchestrator.run_agent("executive_advisor", {
        "disruption": disruption.get("result", {}),
        "alternatives": alternatives.get("result", {}),
    })

    return {
        "workflow": "disruption_response",
        "steps": {
            "disruption_analysis": disruption,
            "alternative_suppliers": alternatives,
            "logistics_optimization": logistics,
            "executive_briefing": briefing,
        }
    }


@router.get("/executive-briefing")
async def get_executive_briefing():
    """Generate a real-time executive briefing from the Executive Advisor Agent."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("executive_advisor", {
        "supply_health_score": 92,
        "pending_approvals": 3,
        "critical_alerts": 1,
        "active_negotiations": 3,
        "monthly_savings": 84000,
        "open_disruptions": 1,
    })
    return result
