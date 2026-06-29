"""Pydantic schemas for SupplyGuardian AI API."""

from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ─── Auth ────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "user"


# ─── Supplier ────────────────────────────────────────────────────────────────

class SupplierBase(BaseModel):
    name: str
    country: str
    category: str
    status: str = "under_review"
    rating: float = 0.0
    delivery_score: float = 0.0
    esg_score: float = 0.0
    risk_score: float = 50.0
    price_per_unit: Optional[str] = None
    lead_time_days: int = 14
    annual_revenue: Optional[str] = None
    certifications: List[str] = []


class SupplierCreate(SupplierBase):
    pass


class SupplierResponse(SupplierBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SupplierListResponse(BaseModel):
    items: List[SupplierResponse]
    total: int
    page: int
    page_size: int


# ─── Procurement ─────────────────────────────────────────────────────────────

class ProcurementCaseCreate(BaseModel):
    title: str
    item: str
    quantity: int = 1
    unit: str = "units"
    estimated_value: Optional[float] = None
    priority: str = "medium"


class ProcurementCaseResponse(BaseModel):
    id: str
    case_number: str
    title: str
    item: str
    quantity: int
    unit: str
    estimated_value: Optional[float]
    status: str
    priority: str
    supplier_id: Optional[str]
    ai_summary: Optional[str]
    opened_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Negotiation ─────────────────────────────────────────────────────────────

class NegotiationMessage(BaseModel):
    role: str  # ai, supplier
    text: str
    time: str


class NegotiationCreate(BaseModel):
    supplier_id: str
    item: str
    initial_price: float
    target_price: float
    procurement_case_id: Optional[str] = None


class NegotiationResponse(BaseModel):
    id: str
    supplier_id: str
    item: str
    initial_price: float
    current_price: float
    target_price: float
    current_round: int
    status: str
    progress_pct: float
    messages: List[Dict[str, Any]]
    ai_recommendation: Optional[str]
    started_at: datetime

    class Config:
        from_attributes = True


class NegotiationCounterOffer(BaseModel):
    offered_price: float
    payment_terms: Optional[str] = None
    notes: Optional[str] = None


# ─── Risk ────────────────────────────────────────────────────────────────────

class RiskAlertResponse(BaseModel):
    id: str
    risk_type: str
    supplier_id: Optional[str]
    severity: str
    title: str
    detail: Optional[str]
    status: str
    ai_assessment: Optional[str]
    probability: float
    detected_at: datetime

    class Config:
        from_attributes = True


# ─── Contract ────────────────────────────────────────────────────────────────

class ContractCreate(BaseModel):
    supplier_id: str
    contract_type: str
    total_value: Optional[float] = None
    expires_at: Optional[datetime] = None


class ContractResponse(BaseModel):
    id: str
    contract_number: str
    supplier_id: str
    contract_type: str
    total_value: Optional[float]
    status: str
    risk_score: float
    ai_summary: Optional[str]
    clauses: List[Dict[str, Any]]
    expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Approval ────────────────────────────────────────────────────────────────

class ApprovalDecision(BaseModel):
    decision: str  # approved, rejected, escalated
    comments: Optional[str] = None


class ApprovalResponse(BaseModel):
    id: str
    approval_type: str
    title: str
    value: Optional[str]
    risk_level: str
    reason: Optional[str]
    ai_recommendation: Optional[str]
    ai_confidence: float
    requested_by: Optional[str]
    status: str
    deadline: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Agent ───────────────────────────────────────────────────────────────────

class AgentStateResponse(BaseModel):
    id: str
    agent_name: str
    status: str
    current_task: Optional[str]
    last_action: Optional[str]
    updated_at: datetime

    class Config:
        from_attributes = True


class AgentRunRequest(BaseModel):
    agent_name: str
    context: Dict[str, Any] = {}


class AgentRunResponse(BaseModel):
    agent_name: str
    result: Dict[str, Any]
    reasoning: str
    confidence: float
    actions_taken: List[str]


# ─── Dashboard ───────────────────────────────────────────────────────────────

class DashboardKPI(BaseModel):
    total_inventory_value: float
    units_in_stock: int
    incoming_stock_week: int
    active_suppliers: int
    on_time_delivery_pct: float
    supply_chain_health_score: float
    monthly_savings: float
    open_procurement_cases: int
    pending_approvals: int
    active_negotiations: int
    critical_alerts: int


# ─── Disruption ──────────────────────────────────────────────────────────────

class DisruptionEventResponse(BaseModel):
    id: str
    event_type: str
    severity: str
    title: str
    location: Optional[str]
    description: Optional[str]
    probability: float
    affected_suppliers: List[str]
    ai_response: Optional[str]
    status: str
    detected_at: datetime

    class Config:
        from_attributes = True


# ─── Audit ───────────────────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    id: str
    log_number: str
    actor: str
    actor_type: str
    action: str
    detail: Optional[str]
    category: Optional[str]
    case_reference: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Analytics ───────────────────────────────────────────────────────────────

class AnalyticsSummary(BaseModel):
    total_savings_6mo: float
    avg_savings_rate_pct: float
    procurement_cycle_days: float
    supplier_on_time_pct: float
    ai_automation_pct: float
    monthly_spend: List[Dict[str, Any]]
    supplier_scores: List[Dict[str, Any]]
    lead_time_trend: List[Dict[str, Any]]
