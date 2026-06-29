"""SQLAlchemy ORM models for SupplyGuardian AI."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Float, Integer, Boolean, DateTime, Text,
    ForeignKey, Enum as SAEnum, JSON, DECIMAL
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


def gen_uuid():
    return str(uuid.uuid4())


# ─── Enums ───────────────────────────────────────────────────────────────────

class ProcurementStatus(str, enum.Enum):
    detected = "detected"
    supplier_discovery = "supplier_discovery"
    negotiation = "negotiation"
    risk_review = "risk_review"
    approval = "approval"
    executing = "executing"
    completed = "completed"
    cancelled = "cancelled"


class SupplierStatus(str, enum.Enum):
    preferred = "preferred"
    approved = "approved"
    under_review = "under_review"
    risk_flagged = "risk_flagged"
    blacklisted = "blacklisted"


class RiskSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class ApprovalStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    escalated = "escalated"


class NegotiationStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    completed = "completed"
    failed = "failed"


class ContractStatus(str, enum.Enum):
    draft = "draft"
    under_review = "under_review"
    active = "active"
    expiring_soon = "expiring_soon"
    expired = "expired"
    terminated = "terminated"


class ShipmentStatus(str, enum.Enum):
    created = "created"
    in_transit = "in_transit"
    customs = "customs"
    delayed = "delayed"
    delivered = "delivered"


# ─── Models ──────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(SAEnum(SupplierStatus), default=SupplierStatus.under_review)
    rating = Column(Float, default=0.0)
    delivery_score = Column(Float, default=0.0)
    esg_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=50.0)
    price_per_unit = Column(String)
    lead_time_days = Column(Integer, default=14)
    annual_revenue = Column(String)
    certifications = Column(JSON, default=list)
    contact_email = Column(String)
    contact_phone = Column(String)
    address = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    procurement_cases = relationship("ProcurementCase", back_populates="supplier")
    negotiations = relationship("Negotiation", back_populates="supplier")
    contracts = relationship("Contract", back_populates="supplier")
    risk_alerts = relationship("RiskAlert", back_populates="supplier")


class ProcurementCase(Base):
    __tablename__ = "procurement_cases"

    id = Column(String, primary_key=True, default=gen_uuid)
    case_number = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    item = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    unit = Column(String, default="units")
    estimated_value = Column(DECIMAL(15, 2))
    status = Column(SAEnum(ProcurementStatus), default=ProcurementStatus.detected)
    priority = Column(String, default="medium")  # low, medium, high, critical
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=True)
    created_by = Column(String, default="system")
    ai_summary = Column(Text)
    metadata_ = Column("metadata", JSON, default=dict)
    opened_at = Column(DateTime(timezone=True), default=utcnow)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    supplier = relationship("Supplier", back_populates="procurement_cases")
    approvals = relationship("Approval", back_populates="procurement_case")
    audit_logs = relationship("AuditLog", back_populates="procurement_case")


class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(String, primary_key=True, default=gen_uuid)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=False)
    procurement_case_id = Column(String, ForeignKey("procurement_cases.id"), nullable=True)
    item = Column(String, nullable=False)
    initial_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    target_price = Column(Float, nullable=False)
    current_round = Column(Integer, default=1)
    status = Column(SAEnum(NegotiationStatus), default=NegotiationStatus.active)
    progress_pct = Column(Float, default=0.0)
    messages = Column(JSON, default=list)
    summary = Column(Text)
    ai_recommendation = Column(Text)
    started_at = Column(DateTime(timezone=True), default=utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    supplier = relationship("Supplier", back_populates="negotiations")


class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    id = Column(String, primary_key=True, default=gen_uuid)
    risk_type = Column(String, nullable=False)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=True)
    severity = Column(SAEnum(RiskSeverity), default=RiskSeverity.medium)
    title = Column(String, nullable=False)
    detail = Column(Text)
    status = Column(String, default="open")
    ai_assessment = Column(Text)
    probability = Column(Float, default=0.0)
    detected_at = Column(DateTime(timezone=True), default=utcnow)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    supplier = relationship("Supplier", back_populates="risk_alerts")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String, primary_key=True, default=gen_uuid)
    contract_number = Column(String, unique=True, nullable=False, index=True)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=False)
    contract_type = Column(String, nullable=False)
    total_value = Column(DECIMAL(15, 2))
    status = Column(SAEnum(ContractStatus), default=ContractStatus.draft)
    risk_score = Column(Float, default=0.0)
    ai_summary = Column(Text)
    clauses = Column(JSON, default=list)
    documents = Column(JSON, default=list)
    signed_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    supplier = relationship("Supplier", back_populates="contracts")


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String, primary_key=True, default=gen_uuid)
    approval_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    procurement_case_id = Column(String, ForeignKey("procurement_cases.id"), nullable=True)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=True)
    value = Column(String)
    risk_level = Column(String, default="low")
    reason = Column(Text)
    ai_recommendation = Column(Text)
    ai_confidence = Column(Float, default=0.0)
    requested_by = Column(String)
    status = Column(SAEnum(ApprovalStatus), default=ApprovalStatus.pending)
    approved_by = Column(String, nullable=True)
    comments = Column(Text)
    deadline = Column(DateTime(timezone=True), nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    procurement_case = relationship("ProcurementCase", back_populates="approvals")


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True, default=gen_uuid)
    shipment_number = Column(String, unique=True, nullable=False)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=True)
    origin_city = Column(String)
    origin_country = Column(String)
    destination_city = Column(String)
    destination_country = Column(String)
    status = Column(SAEnum(ShipmentStatus), default=ShipmentStatus.created)
    value = Column(String)
    eta_days = Column(Integer)
    delay_days = Column(Integer, default=0)
    tracking_number = Column(String)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class DisruptionEvent(Base):
    __tablename__ = "disruption_events"

    id = Column(String, primary_key=True, default=gen_uuid)
    event_type = Column(String, nullable=False)
    severity = Column(SAEnum(RiskSeverity), default=RiskSeverity.medium)
    title = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    probability = Column(Float, default=0.0)
    affected_suppliers = Column(JSON, default=list)
    ai_response = Column(Text)
    status = Column(String, default="active")
    detected_at = Column(DateTime(timezone=True), default=utcnow)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    log_number = Column(String, unique=True, nullable=False)
    actor = Column(String, nullable=False)
    actor_type = Column(String, nullable=False)  # ai, human, rpa, external
    action = Column(String, nullable=False)
    detail = Column(Text)
    category = Column(String)
    procurement_case_id = Column(String, ForeignKey("procurement_cases.id"), nullable=True)
    case_reference = Column(String)
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    procurement_case = relationship("ProcurementCase", back_populates="audit_logs")


class AgentState(Base):
    __tablename__ = "agent_states"

    id = Column(String, primary_key=True, default=gen_uuid)
    agent_name = Column(String, nullable=False, index=True)
    status = Column(String, default="idle")  # active, idle, alert, error
    current_task = Column(Text)
    last_action = Column(Text)
    metadata_ = Column("metadata", JSON, default=dict)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
