"""Try-on endpoints — wraps the VTON service."""
from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from app.deps import CurrentUserDep, SbService
from app.schemas.models import TryOn, TryOnRequest
from app.services.tryon_service import run_tryon

router = APIRouter()


async def _process_tryon(tryon_id: str, person_url: str, garment_url: str, sb) -> None:
    """Background worker: call VTON service, write result back to row."""
    try:
        sb.table("tryons").update({"status": "processing"}).eq("id", tryon_id).execute()
        result = await run_tryon(person_url, garment_url)
        sb.table("tryons").update({
            "status": "done",
            "result_image_url": result.image_url,
            "finished_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", tryon_id).execute()
    except Exception as e:  # noqa: BLE001
        sb.table("tryons").update({
            "status": "failed",
            "error_message": str(e)[:500],
            "finished_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", tryon_id).execute()


@router.post("", response_model=TryOn)
async def create_tryon(
    body: TryOnRequest,
    bg: BackgroundTasks,
    user: CurrentUserDep,
    sb: SbService,
):
    # Verify product exists
    prod = sb.table("products").select("image_url").eq("id", str(body.product_id)).maybe_single().execute()
    if not prod.data:
        raise HTTPException(404, "Product not found")
    garment_url = prod.data["image_url"]

    row = sb.table("tryons").insert({
        "user_id": user.id,
        "product_id": str(body.product_id),
        "person_image_url": body.person_image_url,
        "status": "pending",
    }).execute()
    if not row.data:
        raise HTTPException(500, "Failed to create try-on record")
    created = row.data[0]

    bg.add_task(_process_tryon, created["id"], body.person_image_url, garment_url, sb)
    return created


@router.get("", response_model=list[TryOn])
def list_my_tryons(
    user: CurrentUserDep,
    sb: SbService,
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
):
    res = (
        sb.table("tryons")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return res.data or []


@router.get("/{tryon_id}", response_model=TryOn)
def get_tryon(tryon_id: UUID, user: CurrentUserDep, sb: SbService):
    res = sb.table("tryons").select("*").eq("id", str(tryon_id)).maybe_single().execute()
    if not res.data:
        raise HTTPException(404, "Try-on not found")
    if res.data["user_id"] != user.id:
        raise HTTPException(403, "Not your try-on")
    return res.data
