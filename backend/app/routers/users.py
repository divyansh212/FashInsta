"""User profile endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.deps import CurrentUserDep, SbService
from app.schemas.models import Profile, ProfileUpsert

router = APIRouter()


@router.get("/me", response_model=Profile)
def me(user: CurrentUserDep, sb: SbService):
    res = sb.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
    if not res.data:
        raise HTTPException(404, "Profile not found — call PUT /me to create it")
    return res.data


@router.put("/me", response_model=Profile)
def upsert_me(body: ProfileUpsert, user: CurrentUserDep, sb: SbService):
    payload = {"id": user.id, **body.model_dump(exclude_none=True)}
    res = sb.table("profiles").upsert(payload).execute()
    if not res.data:
        raise HTTPException(500, "Failed to upsert profile")
    return res.data[0]


@router.get("/{handle}", response_model=Profile)
def get_by_handle(handle: str, sb: SbService):
    res = sb.table("profiles").select("*").eq("handle", handle).maybe_single().execute()
    if not res.data:
        raise HTTPException(404, "Profile not found")
    return res.data
