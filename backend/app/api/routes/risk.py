"""Risk and compliance management endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.models import RiskAlert, RiskSeverity
from app.agents.orchestrator import AgentOrchestrator
from app.core.config import settings
import uuid
from datetime import datetime, timezone

router = APIRouter()


@router.get("/alerts")
async def list_risk_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(RiskAlert)
    if severity:
        query = query.where(RiskAlert.severity == severity)
    if status:
        query = query.where(RiskAlert.status == status)

    result = await db.execute(query.order_by(RiskAlert.detected_at.desc()))
    alerts = result.scalars().all()
    return {
        "items": [
            {
                "id": a.id, "risk_type": a.risk_type, "supplier_id": a.supplier_id,
                "severity": a.severity.value if hasattr(a.severity, 'value') else a.severity,
                "title": a.title, "detail": a.detail, "status": a.status,
                "ai_assessment": a.ai_assessment, "probability": a.probability,
                "detected_at": a.detected_at.isoformat() if a.detected_at else None,
            } for a in alerts
        ]
    }


@router.get("/summary")
async def get_risk_summary(db: AsyncSession = Depends(get_db)):
    total = await db.execute(select(func.count(RiskAlert.id)))
    critical = await db.execute(
        select(func.count(RiskAlert.id)).where(RiskAlert.severity == RiskSeverity.critical)
    )
    return {
        "total_alerts": total.scalar() or 0,
        "critical": critical.scalar() or 0,
        "portfolio_risk_score": 24,
        "compliant_suppliers": 114,
        "total_suppliers": 128,
    }


@router.post("/screen/{supplier_id}")
async def run_compliance_screening(supplier_id: str):
    """Run AI compliance screening for a supplier."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("risk_compliance", {
        "supplier_id": supplier_id,
        "name": "Supplier",
        "country": "Unknown",
    })
    return result


@router.post("/alerts")
async def create_risk_alert(
    risk_type: str,
    severity: str,
    title: str,
    detail: Optional[str] = None,
    supplier_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    alert = RiskAlert(
        id=str(uuid.uuid4()),
        risk_type=risk_type,
        severity=severity,
        title=title,
        detail=detail,
        supplier_id=supplier_id,
        status="open",
        probability=0.5,
    )
    db.add(alert)
    await db.commit()
    return {"id": alert.id, "status": "created"}


@router.patch("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RiskAlert).where(RiskAlert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(404, "Alert not found")
    alert.status = "resolved"
    alert.resolved_at = datetime.now(timezone.utc)
    await db.commit()
    return {"id": alert_id, "status": "resolved"}
