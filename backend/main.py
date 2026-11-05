
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import (
    dashboard,
    mapping,
    growth,
    infrastructure,
    predictions,
    scenario,
)

app = FastAPI(
    title="METRIX API",
    description="AI-Powered Data-Driven City Planning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    dashboard.router,
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

app.include_router(
    mapping.router,
    prefix="/api/mapping",
    tags=["City Mapping"]
)

app.include_router(
    growth.router,
    prefix="/api/growth",
    tags=["Growth Analysis"]
)

app.include_router(
    infrastructure.router,
    prefix="/api/infrastructure",
    tags=["Infrastructure"]
)

app.include_router(
    predictions.router,
    prefix="/api/predictions",
    tags=["AI Predictions"]
)

app.include_router(
    scenario.router,
    prefix="/api/scenario",
    tags=["Scenario Planning"]
)


@app.get("/")
def home():
    return {
        "application": "METRIX",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "METRIX"
    }
