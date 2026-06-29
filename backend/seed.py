"""
Seed script - populates the database with realistic demo data.
Run: python seed.py
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings
from app.models.models import (
    Base, User, Supplier, ProcurementCase, Negotiation, RiskAlert,
    Contract, Approval, Shipment, DisruptionEvent, AuditLog, AgentState,
    ProcurementStatus, SupplierStatus, RiskSeverity, ApprovalStatus,
    NegotiationStatus, ContractStatus, ShipmentStatus,
)
from app.core.security import hash_password
from datetime import datetime, timedelta, timezone
import uuid


def utcnow():
    return datetime.now(timezone.utc)


def uid():
    return str(uuid.uuid4())


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as db:
        print("Seeding users...")
        admin = User(
            id=uid(), email="j.doe@company.com", full_name="J. Doe",
            hashed_password=hash_password("password123"), role="procurement_director", is_active=True,
        )
        db.add(admin)

        print("Seeding suppliers...")
        suppliers_data = [
            {"name": "VoltX Energy", "country": "South Korea", "category": "Battery Cells",
             "status": SupplierStatus.preferred, "rating": 4.8, "delivery_score": 96.0,
             "esg_score": 82.0, "risk_score": 12.0, "price_per_unit": "$48/unit",
             "lead_time_days": 14, "annual_revenue": "$2.4B",
             "certifications": ["ISO 9001", "ISO 14001"], "latitude": 37.5665, "longitude": 126.9780},
            {"name": "Nordic Metals", "country": "Norway", "category": "Rare Earth Materials",
             "status": SupplierStatus.approved, "rating": 4.6, "delivery_score": 92.0,
             "esg_score": 94.0, "risk_score": 8.0, "price_per_unit": "$124/kg",
             "lead_time_days": 21, "annual_revenue": "$890M",
             "certifications": ["ISO 9001", "RoHS", "REACH"], "latitude": 59.9139, "longitude": 10.7522},
            {"name": "SinoTech Ltd.", "country": "China", "category": "Semiconductors",
             "status": SupplierStatus.risk_flagged, "rating": 4.2, "delivery_score": 85.0,
             "esg_score": 68.0, "risk_score": 38.0, "price_per_unit": "$2.4/unit",
             "lead_time_days": 28, "annual_revenue": "$5.1B",
             "certifications": ["ISO 9001"], "latitude": 22.5431, "longitude": 114.0579},
            {"name": "Global Parts Ltd.", "country": "Taiwan", "category": "PCB Components",
             "status": SupplierStatus.risk_flagged, "rating": 4.5, "delivery_score": 90.0,
             "esg_score": 75.0, "risk_score": 42.0, "price_per_unit": "$0.82/unit",
             "lead_time_days": 18, "annual_revenue": "$1.2B",
             "certifications": ["ISO 9001", "IPC-A-610"], "latitude": 25.0330, "longitude": 121.5654},
            {"name": "CapEx Solutions", "country": "Germany", "category": "Capacitors",
             "status": SupplierStatus.preferred, "rating": 4.9, "delivery_score": 98.0,
             "esg_score": 91.0, "risk_score": 5.0, "price_per_unit": "$0.34/unit",
             "lead_time_days": 10, "annual_revenue": "$670M",
             "certifications": ["ISO 9001", "ISO 14001", "IATF"], "latitude": 48.1351, "longitude": 11.5820},
            {"name": "EuroMetals AG", "country": "Austria", "category": "Steel Alloy",
             "status": SupplierStatus.approved, "rating": 4.7, "delivery_score": 94.0,
             "esg_score": 88.0, "risk_score": 9.0, "price_per_unit": "$1.84/kg",
             "lead_time_days": 12, "annual_revenue": "$3.2B",
             "certifications": ["ISO 9001", "ISO 14001"], "latitude": 48.2082, "longitude": 16.3738},
        ]

        supplier_ids = {}
        for sd in suppliers_data:
            s = Supplier(id=uid(), **sd)
            db.add(s)
            supplier_ids[sd["name"]] = s.id
        await db.flush()

        print("Seeding procurement cases...")
        cases_data = [
            {"case_number": "PC-2026-0321", "title": "Lithium Battery Shortage",
             "item": "Lithium Batteries", "quantity": 50000, "unit": "units",
             "estimated_value": 128000, "status": ProcurementStatus.negotiation,
             "priority": "critical", "ai_summary": "Critical shortage detected. 12% stock remaining vs 20% threshold."},
            {"case_number": "PC-2026-0318", "title": "PCB Component Sourcing",
             "item": "PCB Components", "quantity": 100000, "unit": "units",
             "estimated_value": 74200, "status": ProcurementStatus.supplier_discovery,
             "priority": "high", "ai_summary": "6 candidate suppliers identified. Evaluation in progress."},
            {"case_number": "PC-2026-0315", "title": "Copper Wire Supply",
             "item": "Copper Wire", "quantity": 5000, "unit": "kg",
             "estimated_value": 42800, "status": ProcurementStatus.risk_review,
             "priority": "medium", "ai_summary": "Risk review triggered due to country exposure."},
            {"case_number": "PC-2026-0312", "title": "Cooling Systems Restock",
             "item": "Cooling Systems", "quantity": 200, "unit": "units",
             "estimated_value": 95500, "status": ProcurementStatus.completed,
             "priority": "medium", "ai_summary": "Successfully completed. Delivered on time."},
        ]

        case_ids = []
        for cd in cases_data:
            c = ProcurementCase(id=uid(), **cd)
            db.add(c)
            case_ids.append(c.id)
        await db.flush()

        print("Seeding negotiations...")
        neg_voltx = Negotiation(
            id=uid(), supplier_id=supplier_ids["VoltX Energy"],
            procurement_case_id=case_ids[0],
            item="Battery Cells", initial_price=55.0, current_price=48.0,
            target_price=44.0, current_round=2, status=NegotiationStatus.active,
            progress_pct=60.0,
            messages=[
                {"role": "ai", "text": "Opening negotiation. Initial offer: $55/unit.", "time": "09:00"},
                {"role": "supplier", "text": "$52/unit for 30K+ units with 60-day terms.", "time": "09:14"},
                {"role": "ai", "text": "Counter: $49/unit, 45-day terms, quality guarantee.", "time": "09:22"},
                {"role": "supplier", "text": "Accept $49, request 50-day terms. Delivery in 14 days.", "time": "10:05"},
                {"role": "ai", "text": "Round 2: $48/unit, 48-day terms, 2% discount next order.", "time": "10:18"},
            ],
            ai_recommendation="Price trending toward target. Recommend one more round to reach $46/unit.",
        )
        db.add(neg_voltx)

        print("Seeding risk alerts...")
        risk_alerts_data = [
            {"risk_type": "Sanctions", "supplier_id": None, "severity": RiskSeverity.critical,
             "title": "OFAC SDN match - AsiaTrade Co.", "status": "open",
             "detail": "78% confidence match on OFAC SDN list. Engagement blocked pending review.",
             "probability": 0.78, "ai_assessment": "Do not engage. Escalate to legal immediately."},
            {"risk_type": "Geo-Political", "supplier_id": supplier_ids["Global Parts Ltd."],
             "severity": RiskSeverity.high, "title": "Taiwan Strait escalation risk",
             "status": "monitoring",
             "detail": "Military tension elevated. Supply disruption probability 42%.",
             "probability": 0.42, "ai_assessment": "Diversify. Pre-qualify 2 alternative PCB suppliers."},
            {"risk_type": "Financial", "supplier_id": None, "severity": RiskSeverity.medium,
             "title": "MicroParts Inc. financial distress", "status": "under_review",
             "detail": "Q4 revenue -18%. Cash flow ratio below 1.0.", "probability": 0.35,
             "ai_assessment": "Request audited financials. Consider reducing order exposure."},
        ]

        for ra in risk_alerts_data:
            db.add(RiskAlert(id=uid(), **ra))

        print("Seeding contracts...")
        contracts_data = [
            {"contract_number": "CTR-001", "supplier_id": supplier_ids["VoltX Energy"],
             "contract_type": "Supply Agreement", "total_value": 2400000,
             "status": ContractStatus.under_review, "risk_score": 18.0,
             "ai_summary": "Two moderate risk clauses. Termination notice and price escalation need revision.",
             "expires_at": utcnow() + timedelta(days=285)},
            {"contract_number": "CTR-002", "supplier_id": supplier_ids["Nordic Metals"],
             "contract_type": "Framework Agreement", "total_value": 1800000,
             "status": ContractStatus.active, "risk_score": 9.0,
             "ai_summary": "Low risk. Standard terms. Well-structured with comprehensive force majeure.",
             "expires_at": utcnow() + timedelta(days=460)},
            {"contract_number": "CTR-003", "supplier_id": supplier_ids["CapEx Solutions"],
             "contract_type": "Purchase Order", "total_value": 67800,
             "status": ContractStatus.active, "risk_score": 4.0,
             "ai_summary": "Minimal risk. Short-term PO with standard commercial terms.",
             "expires_at": utcnow() + timedelta(days=10)},
            {"contract_number": "CTR-004", "supplier_id": supplier_ids["EuroMetals AG"],
             "contract_type": "Supply Agreement", "total_value": 145000,
             "status": ContractStatus.expiring_soon, "risk_score": 22.0,
             "ai_summary": "Expiring in 25 days. Begin renewal negotiation immediately.",
             "expires_at": utcnow() + timedelta(days=25)},
        ]

        for cd in contracts_data:
            db.add(Contract(id=uid(), **cd))

        print("Seeding approvals...")
        approvals_data = [
            {"approval_type": "Contract Approval", "title": "Battery Cell Supply Contract - VoltX Energy",
             "value": "$2,400,000", "risk_level": "low", "status": ApprovalStatus.pending,
             "reason": "High-value contract exceeds $500K automated approval threshold.",
             "ai_recommendation": "Recommend approval. Supplier 4.8/5 rating, 13% below market price.",
             "ai_confidence": 0.94, "requested_by": "Negotiation Agent"},
            {"approval_type": "Supplier Exception", "title": "Sanctions Exception - AsiaTrade Co.",
             "value": "$890,000", "risk_level": "critical", "status": ApprovalStatus.pending,
             "reason": "OFAC SDN partial match (78%) requires executive review.",
             "ai_recommendation": "Do NOT approve. Legal review required. Explore alternatives.",
             "ai_confidence": 0.22, "requested_by": "Risk & Compliance Agent"},
            {"approval_type": "Budget Increase", "title": "Alternative Supplier Budget Override",
             "value": "$180,000 additional", "risk_level": "medium", "status": ApprovalStatus.pending,
             "reason": "Disruption scenario: factory fire requires 15% budget increase.",
             "ai_recommendation": "Recommend approval. Cost of delay $2.1M vs $180K premium.",
             "ai_confidence": 0.87, "requested_by": "Disruption Prediction Agent"},
        ]

        for ad in approvals_data:
            db.add(Approval(id=uid(), deadline=utcnow() + timedelta(days=2), **ad))

        print("Seeding shipments...")
        shipments_data = [
            {"shipment_number": "SHP-001", "supplier_id": supplier_ids["VoltX Energy"],
             "origin_city": "Seoul", "origin_country": "South Korea",
             "destination_city": "Los Angeles", "destination_country": "USA",
             "status": ShipmentStatus.in_transit, "value": "$128K", "eta_days": 5, "delay_days": 0},
            {"shipment_number": "SHP-002", "supplier_id": supplier_ids["Nordic Metals"],
             "origin_city": "Oslo", "origin_country": "Norway",
             "destination_city": "Hamburg", "destination_country": "Germany",
             "status": ShipmentStatus.customs, "value": "$180K", "eta_days": 2, "delay_days": 0},
            {"shipment_number": "SHP-003", "supplier_id": supplier_ids["CapEx Solutions"],
             "origin_city": "Munich", "origin_country": "Germany",
             "destination_city": "Chicago", "destination_country": "USA",
             "status": ShipmentStatus.in_transit, "value": "$67K", "eta_days": 8, "delay_days": 0},
            {"shipment_number": "SHP-004", "supplier_id": supplier_ids["SinoTech Ltd."],
             "origin_city": "Shenzhen", "origin_country": "China",
             "destination_city": "Vancouver", "destination_country": "Canada",
             "status": ShipmentStatus.delayed, "value": "$220K", "eta_days": 11, "delay_days": 3},
            {"shipment_number": "SHP-005", "supplier_id": supplier_ids["EuroMetals AG"],
             "origin_city": "Vienna", "origin_country": "Austria",
             "destination_city": "Rotterdam", "destination_country": "Netherlands",
             "status": ShipmentStatus.delivered, "value": "$145K", "eta_days": 0, "delay_days": 0},
        ]

        for sd in shipments_data:
            db.add(Shipment(id=uid(), **sd))

        print("Seeding disruption events...")
        events_data = [
            {"event_type": "Factory Fire", "severity": RiskSeverity.critical,
             "title": "Factory fire at Shenzhen Industrial Zone",
             "location": "Shenzhen, China", "probability": 0.94,
             "affected_suppliers": ["SinoTech Ltd.", "Global Parts Ltd."],
             "description": "Major fire at SinoTech primary facility. 45% capacity reduction for 30+ days.",
             "ai_response": "Alternative suppliers identified. TaipeiTech Corp contacted. Negotiation initiated.",
             "status": "active"},
            {"event_type": "Port Strike", "severity": RiskSeverity.high,
             "title": "Dockworkers strike at Port of Rotterdam",
             "location": "Rotterdam, Netherlands", "probability": 0.87,
             "affected_suppliers": ["EuroMetals AG", "Nordic Metals"],
             "description": "Dockworkers union strike. Estimated 7-10 day disruption.",
             "ai_response": "Rerouting via Hamburg port. Delay reduced to 3 days.",
             "status": "active"},
            {"event_type": "Geopolitical", "severity": RiskSeverity.medium,
             "title": "Taiwan Strait tension escalation",
             "location": "Taiwan Strait", "probability": 0.62,
             "affected_suppliers": ["Global Parts Ltd."],
             "description": "Military exercises increasing. Potential supply disruption risk.",
             "ai_response": "3 alternative PCB suppliers pre-qualified and ready.",
             "status": "monitoring"},
        ]

        for ed in events_data:
            db.add(DisruptionEvent(id=uid(), **ed))

        print("Seeding audit logs...")
        audit_logs = [
            {"log_number": "AUD-0892", "actor": "Negotiation Agent", "actor_type": "ai",
             "action": "Counter-offer submitted", "category": "Negotiation",
             "detail": "VoltX Energy - $48/unit, 48-day terms, Round 2.", "case_reference": "NEG-001"},
            {"log_number": "AUD-0891", "actor": "Risk & Compliance Agent", "actor_type": "ai",
             "action": "OFAC sanction match flagged", "category": "Compliance",
             "detail": "AsiaTrade Co. - 78% SDN match. Escalated to human review.", "case_reference": "APR-002"},
            {"log_number": "AUD-0890", "actor": "Supplier Discovery Agent", "actor_type": "ai",
             "action": "Supplier ranking completed", "category": "Discovery",
             "detail": "14 suppliers evaluated. Top 3 selected.", "case_reference": "PC-2026-0321"},
            {"log_number": "AUD-0889", "actor": "Procurement Need Agent", "actor_type": "ai",
             "action": "Case created", "category": "Procurement",
             "detail": "Lithium battery inventory at 12%. Case PC-2026-0321 opened.", "case_reference": "PC-2026-0321"},
            {"log_number": "AUD-0888", "actor": "Disruption Prediction Agent", "actor_type": "ai",
             "action": "Disruption alert raised", "category": "Disruption",
             "detail": "Factory fire risk elevated in Shenzhen. SinoTech capacity 45%.", "case_reference": "EVT-001"},
            {"log_number": "AUD-0887", "actor": "J. Doe (Human)", "actor_type": "human",
             "action": "Budget increase approved", "category": "Approval",
             "detail": "Approved $180K emergency sourcing budget. Nordic Metals backup.", "case_reference": "APR-003"},
            {"log_number": "AUD-0886", "actor": "UiPath Robot", "actor_type": "rpa",
             "action": "Purchase order created in SAP", "category": "Execution",
             "detail": "PO-2026-1204 created. CapEx Solutions, 200K capacitors, $67,800.", "case_reference": "PC-2026-0312"},
        ]

        for al in audit_logs:
            db.add(AuditLog(id=uid(), **al))

        print("Seeding agent states...")
        agent_states = [
            {"agent_name": "Procurement Need Agent", "status": "active",
             "current_task": "Monitoring lithium battery inventory levels",
             "last_action": "Inventory scan completed. 12% stock remaining."},
            {"agent_name": "Supplier Discovery Agent", "status": "active",
             "current_task": "Searching 847 supplier databases globally",
             "last_action": "14 candidates found for Battery Cells."},
            {"agent_name": "Negotiation Agent", "status": "active",
             "current_task": "Round 2 negotiation with VoltX Energy",
             "last_action": "Counter-offer $48/unit submitted."},
            {"agent_name": "Risk & Compliance Agent", "status": "alert",
             "current_task": "OFAC match flagged - AsiaTrade Co.",
             "last_action": "78% SDN match. Escalated to human."},
            {"agent_name": "Disruption Prediction Agent", "status": "alert",
             "current_task": "Factory fire risk elevated in Shenzhen",
             "last_action": "Risk probability 94%. Alternative agent notified."},
            {"agent_name": "Alternative Supplier Agent", "status": "active",
             "current_task": "Identifying backup lithium suppliers",
             "last_action": "TaipeiTech Corp identified as primary alternative."},
            {"agent_name": "Market Intelligence Agent", "status": "active",
             "current_task": "Monitoring lithium commodity prices",
             "last_action": "Lithium price up 8.4%. Lock-in recommendation sent."},
            {"agent_name": "ESG Agent", "status": "active",
             "current_task": "ESG assessment for 12 suppliers",
             "last_action": "VoltX Energy ESG score: 82/100."},
        ]

        for ags in agent_states:
            db.add(AgentState(id=uid(), **ags))

        await db.commit()
        print("Seed completed successfully.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
