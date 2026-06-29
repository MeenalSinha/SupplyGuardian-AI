"""Procurement case management endpoints."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.models import ProcurementCase, ProcurementStatus
from app.schemas.schemas import ProcurementCaseCreate, ProcurementCaseResponse
from datetime import datetime, timezone
import uuid

router = APIRouter()


def gen_case_number() -> str:
    from datetime import datetime
    return f"PC-{datetime.now().year}-{str(uuid.uuid4())[:4].upper()}"


@router.get("/cases")
async def list_cases(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(ProcurementCase)
    if status:
        query = query.where(ProcurementCase.status == status)
    if priority:
        query = query.where(ProcurementCase.priority == priority)

    result = await db.execute(query.offset((page - 1) * page_size).limit(page_size))
    cases = result.scalars().all()

    count_result = await db.execute(select(func.count(ProcurementCase.id)))
    total = count_result.scalar()

    return {
        "items": [
            {
                "id": c.id, "case_number": c.case_number, "title": c.title,
                "item": c.item, "quantity": c.quantity, "unit": c.unit,
                "estimated_value": float(c.estimated_value) if c.estimated_value else None,
                "status": c.status.value if hasattr(c.status, 'value') else c.status,
                "priority": c.priority, "ai_summary": c.ai_summary,
                "opened_at": c.opened_at.isoformat() if c.opened_at else None,
            } for c in cases
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/cases", response_model=ProcurementCaseResponse)
async def create_case(payload: ProcurementCaseCreate, db: AsyncSession = Depends(get_db)):
    case = ProcurementCase(
        id=str(uuid.uuid4()),
        case_number=gen_case_number(),
        title=payload.title,
        item=payload.item,
        quantity=payload.quantity,
        unit=payload.unit,
        estimated_value=payload.estimated_value,
        priority=payload.priority,
        status=ProcurementStatus.detected,
        ai_summary=f"AI-created procurement case for {payload.quantity} {payload.unit} of {payload.item}.",
    )
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case


@router.get("/cases/{case_id}")
async def get_case(case_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProcurementCase).where(ProcurementCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
    return case


@router.patch("/cases/{case_id}/status")
async def update_case_status(case_id: str, status: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProcurementCase).where(ProcurementCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")

    case.status = status
    case.updated_at = datetime.now(timezone.utc)
    await db.commit()
    return {"id": case_id, "status": status}


@router.get("/pipeline-summary")
async def get_pipeline_summary(db: AsyncSession = Depends(get_db)):
    """Return kanban column counts."""
    result = await db.execute(
        select(ProcurementCase.status, func.count(ProcurementCase.id))
        .group_by(ProcurementCase.status)
    )
    rows = result.all()
    return {row[0]: row[1] for row in rows}
