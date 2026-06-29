"""Analytics and reporting endpoints."""

from fastapi import APIRouter
from app.schemas.schemas import AnalyticsSummary

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary():
    return AnalyticsSummary(
        total_savings_6mo=376000.0,
        avg_savings_rate_pct=6.2,
        procurement_cycle_days=8.4,
        supplier_on_time_pct=92.6,
        ai_automation_pct=94.0,
        monthly_spend=[
            {"month": "Oct", "spend": 820000, "savings": 42000},
            {"month": "Nov", "spend": 940000, "savings": 58000},
            {"month": "Dec", "spend": 870000, "savings": 51000},
            {"month": "Jan", "spend": 1020000, "savings": 67000},
            {"month": "Feb", "spend": 1100000, "savings": 74000},
            {"month": "Mar", "spend": 1248920, "savings": 84000},
        ],
        supplier_scores=[
            {"name": "VoltX Energy", "delivery": 96, "quality": 92, "esg": 82, "price": 88},
            {"name": "Nordic Metals", "delivery": 92, "quality": 95, "esg": 94, "price": 72},
            {"name": "CapEx Solutions", "delivery": 98, "quality": 97, "esg": 91, "price": 85},
            {"name": "EuroMetals AG", "delivery": 94, "quality": 91, "esg": 88, "price": 78},
            {"name": "SinoTech Ltd.", "delivery": 85, "quality": 80, "esg": 68, "price": 95},
        ],
        lead_time_trend=[
            {"month": "Oct", "avg": 18}, {"month": "Nov", "avg": 16},
            {"month": "Dec", "avg": 15}, {"month": "Jan", "avg": 13},
            {"month": "Feb", "avg": 11}, {"month": "Mar", "avg": 8.4},
        ],
    )


@router.get("/roi")
async def get_roi_report():
    return {
        "period": "Q1 2026",
        "total_spend": 3238920.0,
        "total_savings": 376000.0,
        "roi_pct": 11.6,
        "cost_avoidance": 842000.0,
        "supplier_consolidation_savings": 124000.0,
        "negotiation_savings": 198000.0,
        "process_efficiency_savings": 54000.0,
        "ai_decisions_count": 1248,
        "human_decisions_count": 76,
        "automation_rate_pct": 94.2,
    }


@router.get("/supplier-performance")
async def get_supplier_performance():
    return {
        "top_performers": [
            {"name": "CapEx Solutions", "score": 95, "on_time": 98, "quality": 97},
            {"name": "VoltX Energy", "score": 92, "on_time": 96, "quality": 92},
            {"name": "Nordic Metals", "score": 90, "on_time": 92, "quality": 95},
        ],
        "underperformers": [
            {"name": "SinoTech Ltd.", "score": 72, "on_time": 85, "quality": 80, "issue": "Risk Alert"},
        ],
        "esg_leaders": [
            {"name": "Nordic Metals", "esg_score": 94},
            {"name": "CapEx Solutions", "esg_score": 91},
            {"name": "EuroMetals AG", "esg_score": 88},
        ],
    }
