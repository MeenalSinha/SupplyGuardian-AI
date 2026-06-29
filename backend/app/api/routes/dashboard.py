"""Dashboard endpoints - KPIs, health scores, summary data."""

from fastapi import APIRouter
from app.schemas.schemas import DashboardKPI

router = APIRouter()


@router.get("/kpis", response_model=DashboardKPI)
async def get_dashboard_kpis():
    """Return main dashboard KPIs."""
    return DashboardKPI(
        total_inventory_value=1248920.0,
        units_in_stock=48920,
        incoming_stock_week=12480,
        active_suppliers=128,
        on_time_delivery_pct=92.6,
        supply_chain_health_score=92.0,
        monthly_savings=84000.0,
        open_procurement_cases=14,
        pending_approvals=3,
        active_negotiations=3,
        critical_alerts=1,
    )


@router.get("/health-score")
async def get_health_score():
    return {
        "score": 92,
        "label": "Healthy",
        "trend": [40, 55, 48, 62, 58, 70, 65, 80, 75, 88, 82, 92],
        "components": {
            "supplier_reliability": 94,
            "inventory_levels": 88,
            "risk_posture": 90,
            "delivery_performance": 93,
            "financial_health": 87,
        }
    }


@router.get("/recent-activity")
async def get_recent_activity():
    return {
        "items": [
            {"type": "negotiation", "message": "VoltX Energy - Round 2 counter-offer submitted", "time": "2m ago"},
            {"type": "alert", "message": "Factory fire risk elevated in Shenzhen region", "time": "3h ago"},
            {"type": "approval", "message": "Contract APR-001 awaiting executive sign-off", "time": "4h ago"},
            {"type": "procurement", "message": "PC-0321 Lithium Battery case opened by AI", "time": "5h ago"},
        ]
    }
