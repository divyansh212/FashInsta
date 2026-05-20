"""Pydantic models exposed by the API."""
from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


# ---------- Profiles ----------
class Profile(BaseModel):
    id: UUID
    handle: str
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    created_at: datetime


class ProfileUpsert(BaseModel):
    handle: str = Field(min_length=3, max_length=30)
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


# ---------- Products ----------
ProductCategory = Literal["top", "bottom", "dress", "outerwear", "accessory", "footwear"]


class Product(BaseModel):
    id: UUID
    name: str
    brand: str | None = None
    category: ProductCategory
    price_cents: int
    currency: str = "INR"
    image_url: str
    cover_url: str | None = None
    description: str | None = None
    tags: list[str] = []
    in_stock: bool = True
    created_at: datetime


# ---------- Try-ons ----------
TryOnStatus = Literal["pending", "processing", "done", "failed"]


class TryOnRequest(BaseModel):
    product_id: UUID
    person_image_url: str


class TryOn(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    person_image_url: str
    result_image_url: str | None = None
    status: TryOnStatus
    error_message: str | None = None
    created_at: datetime
    finished_at: datetime | None = None


# ---------- Posts ----------
class PostCreate(BaseModel):
    image_url: str
    caption: str | None = None
    tryon_id: UUID | None = None
    product_ids: list[UUID] = []


class FeedPost(BaseModel):
    id: UUID
    user_id: UUID
    image_url: str
    caption: str | None = None
    product_ids: list[UUID] = []
    created_at: datetime
    handle: str | None = None
    display_name: str | None = None
    avatar_url: str | None = None
    like_count: int = 0
