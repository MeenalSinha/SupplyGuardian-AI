"""Contract intelligence endpoints."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Contract, ContractStatus
from app.agents.orchestrator import AgentOrchestrator
from app.core.config import settings
import uuid

router = APIRouter()


@router.get("/")
async def list_contracts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contract))
    contracts = result.scalars().all()
    return {
        "items": [
            {
                "id": c.id, "contract_number": c.contract_number, "supplier_id": c.supplier_id,
                "contract_type": c.contract_type,
                "total_value": float(c.total_value) if c.total_value else None,
                "status": c.status.value if hasattr(c.status, 'value') else c.status,
                "risk_score": c.risk_score, "ai_summary": c.ai_summary,
                "clauses": c.clauses or [], "documents": c.documents or [],
                "expires_at": c.expires_at.isoformat() if c.expires_at else None,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            } for c in contracts
        ]
    }


@router.get("/{contract_id}")
async def get_contract(contract_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Contract not found")
    return c


@router.post("/analyze")
async def analyze_contract_text(contract_text: str):
    """AI analysis of contract text."""
    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("contract_intelligence", {
        "contract_text": contract_text
    })
    return result


@router.post("/upload-analyze")
async def upload_and_analyze(file: UploadFile = File(...)):
    """Upload contract PDF/DOCX and get AI analysis."""
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")[:5000]

    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("contract_intelligence", {
        "contract_text": text,
        "filename": file.filename,
    })
    return result
