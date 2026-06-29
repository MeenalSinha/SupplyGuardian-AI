"""WebSocket endpoints for real-time agent updates and notifications."""

import asyncio
import json
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import structlog

logger = structlog.get_logger()
router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        logger.info("ws_connected", total=len(self.active))

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, message: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


@router.websocket("/live")
async def websocket_live(websocket: WebSocket):
    """Real-time feed of agent activity and alerts."""
    await manager.connect(websocket)

    # Simulated event stream
    events = [
        {"type": "agent_update", "agent": "Disruption Prediction Agent", "status": "active",
         "task": "Monitoring Shenzhen factory fire risk - probability 94%"},
        {"type": "alert", "severity": "critical", "message": "Factory fire detected - SinoTech capacity at 45%"},
        {"type": "agent_update", "agent": "Alternative Supplier Agent", "status": "active",
         "task": "Identifying backup suppliers for Battery Cells"},
        {"type": "negotiation_update", "supplier": "VoltX Energy", "round": 2,
         "current_price": 48.0, "progress": 60},
        {"type": "approval_request", "id": "APR-001", "title": "Battery Cell Supply Contract",
         "value": "$2,400,000", "urgency": "high"},
        {"type": "shipment_update", "shipment": "SHP-004", "status": "delayed",
         "reason": "Port congestion Shenzhen", "new_eta": "+3 days"},
        {"type": "agent_update", "agent": "Market Intelligence Agent", "status": "active",
         "task": "Lithium prices up 8.4% - locking in VoltX contract recommended"},
        {"type": "health_update", "score": 92, "label": "Healthy"},
    ]

    try:
        idx = 0
        while True:
            event = events[idx % len(events)]
            event["timestamp"] = datetime.utcnow().isoformat()
            await websocket.send_json(event)
            idx += 1
            await asyncio.sleep(4)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("ws_disconnected", total=len(manager.active))


@router.websocket("/notifications")
async def websocket_notifications(websocket: WebSocket):
    """Push notifications for approvals, alerts, agent decisions."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back with ack
            await websocket.send_json({"ack": True, "received": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
