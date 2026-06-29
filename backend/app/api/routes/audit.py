"""Audit log endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.models import AuditLog

router = APIRouter()


@router.get("/logs")
async def list_audit_logs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    actor_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    query = select(AuditLog).order_by(AuditLog.created_at.desc())

    if category:
        query = query.where(AuditLog.category == category)
    if actor_type:
        query = query.where(AuditLog.actor_type == actor_type)

    result = await db.execute(query.offset((page - 1) * page_size).limit(page_size))
    logs = result.scalars().all()

    count = await db.execute(select(func.count(AuditLog.id)))
    total = count.scalar() or 0

    return {
        "items": [
            {
                "id": l.id, "log_number": l.log_number, "actor": l.actor,
                "actor_type": l.actor_type, "action": l.action, "detail": l.detail,
                "category": l.category, "case_reference": l.case_reference,
                "created_at": l.created_at.isoformat() if l.created_at else None,
            } for l in logs
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/export")
async def export_audit_logs(db: AsyncSession = Depends(get_db)):
    """Export audit logs as structured data."""
    result = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(1000))
    logs = result.scalars().all()

    return {
        "export_format": "json",
        "total_records": len(logs),
        "exported_at": "2026-03-21T10:00:00Z",
        "records": [
            {
                "id": l.id, "log_number": l.log_number, "actor": l.actor,
                "actor_type": l.actor_type, "action": l.action, "detail": l.detail,
                "category": l.category, "created_at": l.created_at.isoformat() if l.created_at else None,
            } for l in logs
        ],
    }
