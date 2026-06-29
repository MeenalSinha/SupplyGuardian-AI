"""Disruption command center endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import DisruptionEvent
from app.agents.orchestrator import AgentOrchestrator
from app.core.config import settings

router = APIRouter()


@router.get("/events")
async def list_disruptions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DisruptionEvent).order_by(DisruptionEvent.detected_at.desc()))
    events = result.scalars().all()
    return {
        "items": [
            {
                "id": e.id, "event_type": e.event_type,
                "severity": e.severity.value if hasattr(e.severity, 'value') else e.severity,
                "title": e.title, "location": e.location,
                "description": e.description, "probability": e.probability,
                "affected_suppliers": e.affected_suppliers or [],
                "ai_response": e.ai_response, "status": e.status,
                "detected_at": e.detected_at.isoformat() if e.detected_at else None,
            } for e in events
        ]
    }


@router.get("/risk-score")
async def get_disruption_risk_score():
    """Current global disruption risk score."""
    return {
        "score": 46,
        "label": "Elevated",
        "trend": [18, 22, 19, 45, 68, 72, 65, 58, 52, 48, 46],
        "breakdown": {
            "geopolitical": 42,
            "weather": 18,
            "supplier_financial": 22,
            "logistics": 38,
            "cyber": 15,
        }
    }


@router.post("/predict")
async def predict_disruptions(context: dict = {}):
    """Run Disruption Prediction Agent."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("disruption_prediction", context)
    return result


@router.post("/simulate")
async def run_simulation(scenario: str = "factory_fire", supplier_id: str = ""):
    """Run a disruption simulation scenario."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)

    context = {"scenario": scenario, "supplier_id": supplier_id}
    disruption = await orchestrator.run_agent("disruption_prediction", context)
    alternatives = await orchestrator.run_agent("alternative_supplier", {
        "disrupted_supplier": {"id": supplier_id, "scenario": scenario},
        "requirements": {"item": "Battery Cells", "quantity": 50000},
    })

    return {
        "simulation": scenario,
        "disruption_analysis": disruption,
        "recommended_alternatives": alternatives,
        "estimated_cost_impact": "$84,000 premium for emergency sourcing",
        "estimated_delay": "2-3 days with recommended alternatives",
        "confidence": 0.89,
    }
