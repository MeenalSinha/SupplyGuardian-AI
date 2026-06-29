"""Supply chain control tower endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Shipment, ShipmentStatus
import uuid

router = APIRouter()


@router.get("/shipments")
async def list_shipments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Shipment))
    shipments = result.scalars().all()
    return {
        "items": [
            {
                "id": s.id, "shipment_number": s.shipment_number,
                "supplier_id": s.supplier_id,
                "origin": f"{s.origin_city}, {s.origin_country}",
                "destination": f"{s.destination_city}, {s.destination_country}",
                "status": s.status.value if hasattr(s.status, 'value') else s.status,
                "value": s.value, "eta_days": s.eta_days, "delay_days": s.delay_days,
                "tracking_number": s.tracking_number,
            } for s in shipments
        ]
    }


@router.get("/factories")
async def list_factories():
    """Return factory status data (mock + DB in production)."""
    return {
        "factories": [
            {"name": "VoltX Energy Plant", "city": "Seoul", "country": "South Korea",
             "status": "Operational", "capacity_pct": 94, "lat": 37.5665, "lng": 126.9780},
            {"name": "Nordic Mining HQ", "city": "Oslo", "country": "Norway",
             "status": "Operational", "capacity_pct": 78, "lat": 59.9139, "lng": 10.7522},
            {"name": "SinoTech Fab", "city": "Shenzhen", "country": "China",
             "status": "Risk Alert", "capacity_pct": 45, "lat": 22.5431, "lng": 114.0579},
            {"name": "CapEx Mfg", "city": "Munich", "country": "Germany",
             "status": "Operational", "capacity_pct": 88, "lat": 48.1351, "lng": 11.5820},
            {"name": "EuroMetals Smelter", "city": "Vienna", "country": "Austria",
             "status": "Maintenance", "capacity_pct": 62, "lat": 48.2082, "lng": 16.3738},
        ]
    }


@router.get("/map-data")
async def get_map_data():
    """Combined map data for supply chain visualization."""
    return {
        "suppliers": [
            {"name": "VoltX Energy", "lat": 37.5665, "lng": 126.9780, "status": "green"},
            {"name": "Nordic Metals", "lat": 59.9139, "lng": 10.7522, "status": "green"},
            {"name": "SinoTech Ltd.", "lat": 22.5431, "lng": 114.0579, "status": "red"},
            {"name": "CapEx Solutions", "lat": 48.1351, "lng": 11.5820, "status": "green"},
            {"name": "EuroMetals AG", "lat": 48.2082, "lng": 16.3738, "status": "amber"},
        ],
        "destinations": [
            {"name": "Los Angeles", "lat": 34.0522, "lng": -118.2437},
            {"name": "Chicago", "lat": 41.8781, "lng": -87.6298},
            {"name": "Hamburg", "lat": 53.5753, "lng": 10.0153},
            {"name": "Vancouver", "lat": 49.2827, "lng": -123.1207},
            {"name": "Rotterdam", "lat": 51.9244, "lng": 4.4777},
        ],
        "active_routes": [
            {"from": "Seoul", "to": "Los Angeles", "status": "in_transit"},
            {"from": "Oslo", "to": "Hamburg", "status": "customs"},
            {"from": "Munich", "to": "Chicago", "status": "in_transit"},
            {"from": "Shenzhen", "to": "Vancouver", "status": "delayed"},
            {"from": "Vienna", "to": "Rotterdam", "status": "delivered"},
        ],
    }
