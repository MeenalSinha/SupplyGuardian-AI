"""
SupplyGuardian AI - FastAPI Backend
Autonomous Procurement Operating System
"""

import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import structlog

from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import (
    uipath,
    auth, dashboard, procurement, suppliers,
    negotiations, risk, contracts, approvals,
    agents, supply_chain, disruption, audit, analytics, websocket
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    logger.info("SupplyGuardian AI starting up", version="1.0.0")
    # Initialize DB tables (in production use alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized")
    yield
    logger.info("SupplyGuardian AI shutting down")
    await engine.dispose()


app = FastAPI(
    title="SupplyGuardian AI API",
    description="Autonomous Procurement Operating System - AI-powered supply chain intelligence",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(
        "request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=round(duration * 1000, 2),
    )
    return response


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(procurement.router, prefix="/api/v1/procurement", tags=["Procurement"])
app.include_router(suppliers.router, prefix="/api/v1/suppliers", tags=["Suppliers"])
app.include_router(negotiations.router, prefix="/api/v1/negotiations", tags=["Negotiations"])
app.include_router(risk.router, prefix="/api/v1/risk", tags=["Risk"])
app.include_router(contracts.router, prefix="/api/v1/contracts", tags=["Contracts"])
app.include_router(approvals.router, prefix="/api/v1/approvals", tags=["Approvals"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(supply_chain.router, prefix="/api/v1/supply-chain", tags=["Supply Chain"])
app.include_router(disruption.router, prefix="/api/v1/disruption", tags=["Disruption"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(uipath.router, prefix="/api/v1/uipath", tags=["UiPath"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "SupplyGuardian AI",
        "timestamp": time.time(),
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )
