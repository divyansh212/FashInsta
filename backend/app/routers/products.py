"""Product catalog endpoints — public read."""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.deps import SbService
from app.schemas.models import Product, ProductCategory

router = APIRouter()


@router.get("", response_model=list[Product])
def list_products(
    sb: SbService,
    category: ProductCategory | None = None,
    q: str | None = Query(None, description="Search in name/brand"),
    limit: int = Query(40, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    query = sb.table("products").select("*").eq("in_stock", True)
    if category:
        query = query.eq("category", category)
    if q:
        query = query.or_(f"name.ilike.%{q}%,brand.ilike.%{q}%")
    res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return res.data or []


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: UUID, sb: SbService):
    res = sb.table("products").select("*").eq("id", str(product_id)).maybe_single().execute()
    if not res.data:
        raise HTTPException(404, "Product not found")
    return res.data
