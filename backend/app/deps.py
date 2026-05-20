"""Reusable FastAPI dependencies."""
from __future__ import annotations

from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException, status
from supabase import Client, create_client

from app.config import settings


def _service_client() -> Client:
    """A Supabase client that uses the service role — bypasses RLS.
    Use sparingly, only when the operation has been authorized at the API layer.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


def _anon_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)


SbService = Annotated[Client, Depends(_service_client)]
SbAnon = Annotated[Client, Depends(_anon_client)]


class CurrentUser:
    """Authenticated Supabase user, decoded from the Authorization bearer token."""
    def __init__(self, user_id: str, email: str | None) -> None:
        self.id = user_id
        self.email = email


def current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except jwt.PyJWTError as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Invalid token: {e}")
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token missing sub claim")
    return CurrentUser(user_id=sub, email=payload.get("email"))


def optional_user(authorization: str | None = Header(default=None)) -> CurrentUser | None:
    """For endpoints that personalize when logged in but work anonymously too."""
    if not authorization:
        return None
    try:
        return current_user(authorization)
    except HTTPException:
        return None


CurrentUserDep = Annotated[CurrentUser, Depends(current_user)]
OptionalUserDep = Annotated["CurrentUser | None", Depends(optional_user)]
