"""Strands AI Agent endpoints — run individual agents or full procurement workflows."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.agents.orchestrator import AgentOrchestrator
from app.schemas.schemas import AgentRunRequest, AgentRunResponse
from app.core.config import settings

router = APIRouter()


@router.get("/")
async def list_agents():
    return {
        "agents": [
            {"name": "planner", "display": "Procurement Planner Agent", "role": "Orchestrator", "status": "active"},
            {"name": "supplier_discovery", "display": "Supplier Research Agent", "role": "Researcher", "status": "active"},
            {"name": "risk_compliance", "display": "Risk & Compliance Agent", "role": "Risk Assessor", "status": "active"},
            {"name": "negotiation", "display": "Negotiation Agent", "role": "Negotiator", "status": "active"},
            {"name": "human_approval", "display": "Approval Center Agent", "role": "Approver", "status": "idle"},
        ]
    }


@router.post("/run")
async def run_agent(request: AgentRunRequest):
    """Run a specific Strands AI agent with provided context."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent(request.agent_name, request.context)
    return AgentRunResponse(
        agent_name=request.agent_name,
        result=result.get("result", {}),
        reasoning=str(result.get("result", {}).get("plan", "Agent completed successfully")),
        confidence=result.get("confidence", 0.95),
        actions_taken=[str(a.get("tool", a)) for a in result.get("actions_taken", [])],
    )


class FullProcurementRequest(BaseModel):
    item: str = "lithium-ion battery cells"
    quantity: int = 10000
    estimated_value: float = 510000.0


@router.post("/workflow/full-procurement")
async def run_full_procurement_workflow(request: FullProcurementRequest):
    """
    Run the complete end-to-end Strands AI procurement workflow.

    This is the Judge Mode endpoint. It:
    1. Calls the Planner Agent
    2. Calls the Research Agent → search_suppliers tool
    3. Calls the Risk Agent → evaluate_supplier_risk for each candidate
    4. Calls the Negotiation Agent → generate_negotiation_counter_offer
    5. Evaluates policy gate (value > $100k → human approval required)
    6. Returns full execution trace with real tool call results

    The execution_trace in the response shows every tool call and result
    in the order they occurred — this is not a pre-scripted animation.
    """
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_full_procurement_workflow(
        item=request.item,
        quantity=request.quantity,
        estimated_value=request.estimated_value,
    )
    return result


@router.post("/workflow/disruption-response")
async def run_disruption_workflow(supplier_id: str, disruption_type: str):
    return {"status": "Disruption response workflow — activate via full-procurement endpoint"}


@router.get("/executive-briefing")
async def get_executive_briefing():
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("executive_advisor", {})
    return result
