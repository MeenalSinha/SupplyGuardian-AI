"""Supplier management and discovery endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.core.database import get_db
from app.models.models import Supplier
from app.schemas.schemas import SupplierCreate, SupplierResponse
import uuid

router = APIRouter()


@router.get("/")
async def list_suppliers(
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Supplier)
    if search:
        query = query.where(
            or_(
                Supplier.name.ilike(f"%{search}%"),
                Supplier.category.ilike(f"%{search}%"),
                Supplier.country.ilike(f"%{search}%"),
            )
        )
    if status:
        query = query.where(Supplier.status == status)
    if category:
        query = query.where(Supplier.category.ilike(f"%{category}%"))

    result = await db.execute(query.offset((page - 1) * page_size).limit(page_size))
    suppliers = result.scalars().all()

    count_result = await db.execute(select(func.count(Supplier.id)))
    total = count_result.scalar()

    return {
        "items": [
            {
                "id": s.id, "name": s.name, "country": s.country, "category": s.category,
                "status": s.status.value if hasattr(s.status, 'value') else s.status,
                "rating": s.rating, "delivery_score": s.delivery_score,
                "esg_score": s.esg_score, "risk_score": s.risk_score,
                "price_per_unit": s.price_per_unit, "lead_time_days": s.lead_time_days,
                "annual_revenue": s.annual_revenue, "certifications": s.certifications or [],
            } for s in suppliers
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/", response_model=SupplierResponse)
async def create_supplier(payload: SupplierCreate, db: AsyncSession = Depends(get_db)):
    supplier = Supplier(id=str(uuid.uuid4()), **payload.model_dump())
    db.add(supplier)
    await db.commit()
    await db.refresh(supplier)
    return supplier


@router.get("/{supplier_id}")
async def get_supplier(supplier_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Supplier).where(Supplier.id == supplier_id))
    s = result.scalar_one_or_none()
    if not s:
        raise HTTPException(404, "Supplier not found")
    return s


@router.get("/{supplier_id}/score")
async def get_supplier_score(supplier_id: str, db: AsyncSession = Depends(get_db)):
    """Return detailed supplier scorecard."""
    result = await db.execute(select(Supplier).where(Supplier.id == supplier_id))
    s = result.scalar_one_or_none()
    if not s:
        raise HTTPException(404, "Supplier not found")

    return {
        "supplier_id": s.id,
        "name": s.name,
        "overall_score": round((s.rating * 10 + s.delivery_score + s.esg_score + (100 - s.risk_score)) / 4, 1),
        "dimensions": {
            "rating": s.rating,
            "delivery": s.delivery_score,
            "esg": s.esg_score,
            "risk": s.risk_score,
        },
    }


@router.post("/discover")
async def discover_suppliers(
    item: str = Query(...),
    quantity: int = Query(1),
    target_price: Optional[float] = Query(None),
):
    """AI-powered supplier discovery - triggers SupplierDiscoveryAgent."""
    from app.agents.orchestrator import AgentOrchestrator
    from app.core.config import settings

    orchestrator = AgentOrchestrator(openai_api_key=settings.OPENAI_API_KEY)
    result = await orchestrator.run_agent("supplier_discovery", {
        "item": item,
        "quantity": quantity,
        "target_price": target_price,
    })
    return result
