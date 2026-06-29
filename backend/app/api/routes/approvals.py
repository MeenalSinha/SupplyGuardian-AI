"""Human-in-the-loop approval endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Approval, ApprovalStatus
from app.schemas.schemas import ApprovalDecision
from datetime import datetime, timezone

router = APIRouter()


@router.get("/")
async def list_approvals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Approval).order_by(Approval.created_at.desc()))
    approvals = result.scalars().all()
    return {
        "items": [
            {
                "id": a.id, "approval_type": a.approval_type, "title": a.title,
                "value": a.value, "risk_level": a.risk_level, "reason": a.reason,
                "ai_recommendation": a.ai_recommendation, "ai_confidence": a.ai_confidence,
                "requested_by": a.requested_by,
                "status": a.status.value if hasattr(a.status, 'value') else a.status,
                "deadline": a.deadline.isoformat() if a.deadline else None,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            } for a in approvals
        ]
    }


@router.get("/pending-count")
async def pending_count(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func
    result = await db.execute(
        select(func.count(Approval.id)).where(Approval.status == ApprovalStatus.pending)
    )
    return {"pending": result.scalar() or 0}


@router.post("/{approval_id}/decide")
async def decide_approval(
    approval_id: str,
    decision: ApprovalDecision,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Approval).where(Approval.id == approval_id))
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(404, "Approval not found")

    if decision.decision == "approved":
        approval.status = ApprovalStatus.approved
    elif decision.decision == "rejected":
        approval.status = ApprovalStatus.rejected
    elif decision.decision == "escalated":
        approval.status = ApprovalStatus.escalated
    else:
        raise HTTPException(400, "Invalid decision")

    approval.comments = decision.comments
    approval.approved_by = "j.doe@company.com"
    approval.decided_at = datetime.now(timezone.utc)
    approval.updated_at = datetime.now(timezone.utc)

    await db.commit()

    # Trigger UiPath robot if approved (mocked)
    robot_triggered = decision.decision == "approved"

    return {
        "approval_id": approval_id,
        "decision": decision.decision,
        "robot_triggered": robot_triggered,
        "message": "UiPath robot execution queued." if robot_triggered else "Request rejected. Agents notified.",
    }
