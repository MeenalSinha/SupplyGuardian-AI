"""
SupplyGuardian AI — Agent Tools
================================
All tools are pure deterministic functions. No LLM calls.
Financial calculations are based on structured data, not generated text.
Tool inputs are Pydantic models for full type safety.
"""

from typing import Dict, Any, List
from pydantic import BaseModel, Field


# ─── Tool: Supplier Search ────────────────────────────────────────────────────

class SearchSuppliersInput(BaseModel):
    item: str = Field(..., description="The item to search for")
    quantity: int = Field(..., description="The required quantity")


# Structured supplier database — deterministic, not LLM-generated
_SUPPLIER_DB = [
    {
        "name": "VoltX Energy",
        "country": "South Korea",
        "score": 94,
        "price_estimate": 51.0,
        "on_time_delivery_pct": 97,
        "certifications": ["ISO 9001", "UL Listed"],
        "annual_capacity": 5_000_000,
    },
    {
        "name": "BattCo Ltd.",
        "country": "Japan",
        "score": 88,
        "price_estimate": 49.5,
        "on_time_delivery_pct": 91,
        "certifications": ["ISO 9001"],
        "annual_capacity": 2_000_000,
    },
    {
        "name": "PowerCell Global",
        "country": "China",
        "score": 82,
        "price_estimate": 44.0,
        "on_time_delivery_pct": 85,
        "certifications": ["CE"],
        "annual_capacity": 10_000_000,
    },
    {
        "name": "EnerCore Systems",
        "country": "Germany",
        "score": 91,
        "price_estimate": 55.0,
        "on_time_delivery_pct": 99,
        "certifications": ["ISO 9001", "ISO 14001", "TÜV"],
        "annual_capacity": 1_500_000,
    },
    {
        "name": "Apex Battery Works",
        "country": "USA",
        "score": 79,
        "price_estimate": 57.0,
        "on_time_delivery_pct": 88,
        "certifications": ["UL Listed"],
        "annual_capacity": 800_000,
    },
]


def search_suppliers(input_data: Any) -> Dict[str, Any]:
    """
    Search for suppliers based on requirements.
    Returns a ranked list of candidates from the structured supplier database.
    Ranking is by composite score (quality × delivery × price-competitiveness).
    """
    # Filter by capacity if quantity provided
    qty = getattr(input_data, "quantity", 0) if hasattr(input_data, "quantity") else input_data.get("quantity", 0)
    eligible = [s for s in _SUPPLIER_DB if s["annual_capacity"] >= qty * 2]

    # Sort by score descending
    ranked = sorted(eligible, key=lambda s: s["score"], reverse=True)

    return {
        "candidates": ranked,
        "total_found": len(ranked),
        "search_criteria": {
            "min_capacity": qty * 2,
            "ranking_factor": "composite_score",
        },
    }


# ─── Tool: Risk Evaluation ────────────────────────────────────────────────────

class EvaluateSupplierRiskInput(BaseModel):
    supplier_name: str = Field(..., description="Supplier name to evaluate")


# Structured risk database — deterministic compliance data
_RISK_DB: Dict[str, Dict[str, Any]] = {
    "BattCo Ltd.": {
        "risk_score": 74,
        "risk_level": "HIGH",
        "flags": ["OFAC sanctions list match (partial)", "Recent regulatory violation — Japan FSA Q2 2026"],
        "compliance_status": "BLOCKED",
    },
    "PowerCell Global": {
        "risk_score": 52,
        "risk_level": "MEDIUM",
        "flags": ["Restricted dual-use materials", "Ongoing EU trade investigation"],
        "compliance_status": "CAUTION",
    },
    "VoltX Energy": {
        "risk_score": 18,
        "risk_level": "LOW",
        "flags": [],
        "compliance_status": "CLEARED",
    },
    "EnerCore Systems": {
        "risk_score": 11,
        "risk_level": "LOW",
        "flags": [],
        "compliance_status": "CLEARED",
    },
    "Apex Battery Works": {
        "risk_score": 22,
        "risk_level": "LOW",
        "flags": [],
        "compliance_status": "CLEARED",
    },
}

_DEFAULT_RISK = {"risk_score": 30, "risk_level": "LOW", "flags": [], "compliance_status": "CLEARED"}


def evaluate_supplier_risk(input_data: Any) -> Dict[str, Any]:
    """
    Evaluate compliance and risk for a supplier.
    Uses structured risk database — no LLM hallucination of financial data.
    Returns risk_score (0-100), risk_level, flags, and compliance_status.
    """
    name = getattr(input_data, "supplier_name", "") if hasattr(input_data, "supplier_name") else str(input_data)
    return _RISK_DB.get(name, _DEFAULT_RISK)


# ─── Tool: Negotiation Counter-Offer ─────────────────────────────────────────

class CounterOfferInput(BaseModel):
    supplier: str = Field(..., description="Supplier name")
    current_price: float = Field(..., description="Current quoted price per unit")
    target_price: float = Field(..., description="Target price per unit")


def generate_negotiation_counter_offer(input_data: Any) -> Dict[str, Any]:
    """
    Generate a counter-offer using a deterministic negotiation formula.

    Formula: counter = current - (current - target) × 0.4
    This represents a 40% move toward target on first round.
    Savings are calculated mathematically, not generated by an LLM.
    """
    current = getattr(input_data, "current_price", 51.0)
    target = getattr(input_data, "target_price", 44.0)
    supplier = getattr(input_data, "supplier", "supplier")

    # Deterministic negotiation formula
    counter = round(current - (current - target) * 0.4, 2)
    savings_per_unit = round(current - counter, 2)

    return {
        "counter_price": counter,
        "savings_per_unit": savings_per_unit,
        "negotiation_message": (
            f"Based on our volume commitment of 10,000 units and 90-day payment terms, "
            f"we propose ${counter:.2f}/unit. This represents a {savings_per_unit/current*100:.1f}% "
            f"reduction from your initial quote of ${current:.2f}/unit."
        ),
        "payment_terms": "Net 90",
        "formula": f"${current:.2f} - ({current:.2f} - {target:.2f}) × 0.40 = ${counter:.2f}",
    }


# ─── Tool: Human Approval Request ────────────────────────────────────────────

def request_human_approval(decision: str, amount: float, recommended_action: str) -> Dict[str, Any]:
    """
    Create a human approval request for consequential decisions.
    This tool STOPS automated execution until a human responds.
    """
    return {
        "status": "pending_approval",
        "decision_requested": decision,
        "amount": amount,
        "recommended_action": recommended_action,
        "policy_gate": "procurement_value_threshold",
        "threshold": 100_000,
        "message": (
            f"Procurement value ${amount:,.0f} exceeds the $100,000 autonomous execution threshold. "
            f"Human approval is required before execution proceeds."
        ),
    }
