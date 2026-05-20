"""Virtual try-on inference abstraction.

This is the seam where you plug in a real VTON model. The rest of the codebase
talks to `run_tryon(...)` and doesn't care which provider you use.
"""
from __future__ import annotations

import asyncio
from typing import Protocol

import httpx

from app.config import settings


class TryOnResult:
    def __init__(self, image_url: str, meta: dict | None = None) -> None:
        self.image_url = image_url
        self.meta = meta or {}


class VtonProvider(Protocol):
    async def run(self, person_image_url: str, garment_image_url: str) -> TryOnResult: ...


class MockProvider:
    """Returns the garment image as-is. Useful for wiring up the UI before a real model exists."""
    async def run(self, person_image_url: str, garment_image_url: str) -> TryOnResult:
        # Simulate model latency so the UI's loading states get exercised.
        await asyncio.sleep(1.2)
        return TryOnResult(image_url=garment_image_url, meta={"provider": "mock"})


class HttpProvider:
    """Generic HTTP provider — POSTs {person_url, garment_url} to VTON_SERVICE_URL/infer
    and expects {"result_url": "..."} back. The Streamlit demo can be wrapped this way,
    or any self-hosted VTON model with a thin Flask/FastAPI front."""
    async def run(self, person_image_url: str, garment_image_url: str) -> TryOnResult:
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                f"{settings.VTON_SERVICE_URL.rstrip('/')}/infer",
                json={"person_url": person_image_url, "garment_url": garment_image_url},
            )
            r.raise_for_status()
            data = r.json()
            return TryOnResult(image_url=data["result_url"], meta={"provider": "http", **data.get("meta", {})})


class ReplicateProvider:
    """Calls a Replicate model. Pick a model slug that exposes a person + garment input.
    See https://replicate.com/explore for VTON models like cuuupid/idm-vton."""
    MODEL = "cuuupid/idm-vton"  # placeholder — verify and pin a version in production

    async def run(self, person_image_url: str, garment_image_url: str) -> TryOnResult:
        if not settings.REPLICATE_API_TOKEN:
            raise RuntimeError("REPLICATE_API_TOKEN not configured")
        headers = {
            "Authorization": f"Bearer {settings.REPLICATE_API_TOKEN}",
            "Content-Type": "application/json",
        }
        payload = {
            "version": self.MODEL,
            "input": {
                "human_img": person_image_url,
                "garm_img": garment_image_url,
                "category": "upper_body",
            },
        }
        async with httpx.AsyncClient(timeout=300) as client:
            r = await client.post("https://api.replicate.com/v1/predictions",
                                  headers=headers, json=payload)
            r.raise_for_status()
            prediction = r.json()
            # Poll until done
            poll_url = prediction["urls"]["get"]
            while prediction["status"] not in {"succeeded", "failed", "canceled"}:
                await asyncio.sleep(2)
                pr = await client.get(poll_url, headers=headers)
                pr.raise_for_status()
                prediction = pr.json()
            if prediction["status"] != "succeeded":
                raise RuntimeError(f"Replicate prediction failed: {prediction.get('error')}")
            output = prediction["output"]
            url = output[0] if isinstance(output, list) else output
            return TryOnResult(image_url=url, meta={"provider": "replicate", "id": prediction["id"]})


def _select_provider() -> VtonProvider:
    p = settings.VTON_PROVIDER
    if p == "mock":
        return MockProvider()
    if p == "replicate":
        return ReplicateProvider()
    if p in ("http", "streamlit_local"):
        return HttpProvider()
    raise ValueError(f"Unknown VTON_PROVIDER: {p}")


async def run_tryon(person_image_url: str, garment_image_url: str) -> TryOnResult:
    provider = _select_provider()
    return await provider.run(person_image_url, garment_image_url)
