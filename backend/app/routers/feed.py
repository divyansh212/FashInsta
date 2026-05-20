"""Public feed + post creation."""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.deps import CurrentUserDep, SbService
from app.schemas.models import FeedPost, PostCreate

router = APIRouter()


@router.get("", response_model=list[FeedPost])
def feed(
    sb: SbService,
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
):
    res = (
        sb.table("posts_feed")
        .select("*")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return res.data or []


@router.post("", response_model=FeedPost)
def create_post(body: PostCreate, user: CurrentUserDep, sb: SbService):
    payload = {
        "user_id": user.id,
        "image_url": body.image_url,
        "caption": body.caption,
        "tryon_id": str(body.tryon_id) if body.tryon_id else None,
        "product_ids": [str(p) for p in body.product_ids],
    }
    res = sb.table("posts").insert(payload).execute()
    if not res.data:
        raise HTTPException(500, "Failed to create post")
    # Re-fetch via the view so we get author info + like_count
    post_id = res.data[0]["id"]
    feed_row = sb.table("posts_feed").select("*").eq("id", post_id).single().execute()
    return feed_row.data


@router.post("/{post_id}/like", status_code=204)
def like(post_id: UUID, user: CurrentUserDep, sb: SbService):
    sb.table("likes").upsert({"user_id": user.id, "post_id": str(post_id)}).execute()
    return None


@router.delete("/{post_id}/like", status_code=204)
def unlike(post_id: UUID, user: CurrentUserDep, sb: SbService):
    sb.table("likes").delete().eq("user_id", user.id).eq("post_id", str(post_id)).execute()
    return None
