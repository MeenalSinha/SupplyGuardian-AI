"""Negotiation management endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Negotiation, NegotiationStatus
from app.schemas.schemas import NegotiationCreate, NegotiationCounterOffer
from app.agents.orchestrator import AgentOrchestrator
from app.core.config import settings
from datetime import datetime, timezone
import uuid

router = APIRouter()


@router.get("/")
async def list_negotiations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Negotiation))
    negs = result.scalars().all()
    return {
        "items": [
            {
                "id": n.id, "supplier_id": n.supplier_id, "item": n.item,
                "initial_price": n.initial_price, "current_price": n.current_price,
                "target_price": n.target_price, "current_round": n.current_round,
                "status": n.status.value if hasattr(n.status, 'value') else n.status,
                "progress_pct": n.progress_pct, "messages": n.messages or [],
                "ai_recommendation": n.ai_recommendation,
                "started_at": n.started_at.isoformat() if n.started_at else None,
            } for n in negs
        ]
    }


@router.post("/")
async def create_negotiation(payload: NegotiationCreate, db: AsyncSession = Depends(get_db)):
    neg = Negotiation(
        id=str(uuid.uuid4()),
        supplier_id=payload.supplier_id,
        procurement_case_id=payload.procurement_case_id,
        item=payload.item,
        initial_price=payload.initial_price,
        current_price=payload.initial_price,
        target_price=payload.target_price,
        current_round=1,
        status=NegotiationStatus.active,
        progress_pct=0.0,
        messages=[],
    )
    db.add(neg)
    await db.commit()
    await db.refresh(neg)
    return neg


@router.post("/{neg_id}/ai-counter")
async def ai_counter_offer(neg_id: str, db: AsyncSession = Depends(get_db)):
    """Trigger AI agent to generate the next counter-offer."""
    result = await db.execute(select(Negotiation).where(Negotiation.id == neg_id))
    neg = result.scalar_one_or_none()
    if not neg:
        raise HTTPException(404, "Negotiation not found")

    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    ai_result = await orchestrator.run_agent("negotiation", {
        "item": neg.item,
        "current_price": neg.current_price,
        "target_price": neg.target_price,
        "initial_price": neg.initial_price,
        "current_round": neg.current_round,
        "messages": neg.messages or [],
    })

    ai_data = ai_result.get("result", {})
    new_price = ai_data.get("counter_price", neg.current_price * 0.97)
    message = ai_data.get("negotiation_message", "AI counter-offer submitted.")

    messages = list(neg.messages or [])
    messages.append({"role": "ai", "text": message, "time": datetime.now(timezone.utc).strftime("%H:%M")})

    neg.current_price = new_price
    neg.current_round += 1
    neg.messages = messages
    neg.ai_recommendation = ai_data.get("reasoning", "")
    progress = min(100, ((neg.initial_price - new_price) / (neg.initial_price - neg.target_price)) * 100)
    neg.progress_pct = max(0, progress)
    neg.updated_at = datetime.now(timezone.utc)

    await db.commit()
    return {"negotiation_id": neg_id, "new_price": new_price, "round": neg.current_round, "ai_result": ai_result}


@router.post("/{neg_id}/supplier-response")
async def supplier_response(neg_id: str, offer: NegotiationCounterOffer, db: AsyncSession = Depends(get_db)):
    """Record a supplier's counter-offer."""
    result = await db.execute(select(Negotiation).where(Negotiation.id == neg_id))
    neg = result.scalar_one_or_none()
    if not neg:
        raise HTTPException(404, "Negotiation not found")

    messages = list(neg.messages or [])
    messages.append({
        "role": "supplier",
        "text": f"Supplier offers ${offer.offered_price}/unit. {offer.payment_terms or ''}. {offer.notes or ''}",
        "time": datetime.now(timezone.utc).strftime("%H:%M"),
    })

    neg.current_price = offer.offered_price
    neg.messages = messages
    neg.updated_at = datetime.now(timezone.utc)
    await db.commit()

    return {"negotiation_id": neg_id, "recorded_price": offer.offered_price}


@router.post("/{neg_id}/complete")
async def complete_negotiation(neg_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Negotiation).where(Negotiation.id == neg_id))
    neg = result.scalar_one_or_none()
    if not neg:
        raise HTTPException(404, "Negotiation not found")

    neg.status = NegotiationStatus.completed
    neg.progress_pct = 100.0
    neg.completed_at = datetime.now(timezone.utc)
    await db.commit()

    return {"negotiation_id": neg_id, "status": "completed", "final_price": neg.current_price}
