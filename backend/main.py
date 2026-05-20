"""Fashinsta API — FastAPI entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import feed, products, tryon, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Place for startup tasks (DB warmup, model load checks, etc.)
    yield


app = FastAPI(
    title="Fashinsta API",
    version="0.1.0",
    description="Backend for the Fashinsta social try-on platform.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health() -> dict:
    return {"ok": True, "service": "fashinsta-api", "vton_provider": settings.VTON_PROVIDER}


app.include_router(users.router,    prefix="/api/users",    tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(feed.router,     prefix="/api/feed",     tags=["feed"])
app.include_router(tryon.router,    prefix="/api/tryon",    tags=["tryon"])
