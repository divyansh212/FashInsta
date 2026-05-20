"""Fashinsta — Streamlit VTON demo.

Two modes:
    1. UI mode (default): an interactive page where you upload a person photo and a garment,
       press a button, and see the result.
    2. Service mode: when run with `STREAMLIT_AS_SERVICE=1`, exposes an /infer POST endpoint
       (via a small bundled FastAPI sidecar) that the main FastAPI backend can call.

The compositing here is a *placeholder*. Replace `tryon_pipeline()` with a call into
one of the real models from the references — OutfitAnyone, IDM-VTON, etc.
"""
from __future__ import annotations

import io
from dataclasses import dataclass

import numpy as np
import streamlit as st
from PIL import Image, ImageEnhance, ImageFilter

st.set_page_config(page_title="Fashinsta Try-On", page_icon="✦", layout="wide")


# ----------------------------------------------------------------------
#  Pipeline
# ----------------------------------------------------------------------
@dataclass
class TryOnInputs:
    person: Image.Image
    garment: Image.Image


def tryon_pipeline(inp: TryOnInputs) -> Image.Image:
    """Placeholder VTON. Composites a softened garment image onto the upper body.

    SWAP THIS FOR A REAL MODEL. Suggested replacements:
      - OutfitAnyone (HumanAIGC/OutfitAnyone)
      - IDM-VTON (cuuupid/idm-vton on Replicate)
      - dress-code baseline
      - clothes-virtual-try-on
    """
    person = inp.person.convert("RGBA")
    garment = inp.garment.convert("RGBA")

    pw, ph = person.size
    # Roughly fit garment to torso region
    target_w = int(pw * 0.55)
    aspect = garment.size[1] / garment.size[0]
    target_h = int(target_w * aspect)
    garment_resized = garment.resize((target_w, target_h), Image.LANCZOS)

    # Soften garment edges so the composite reads less jarring
    alpha = garment_resized.split()[-1].filter(ImageFilter.GaussianBlur(2))
    garment_resized.putalpha(alpha)

    # Slight contrast match
    garment_resized = ImageEnhance.Color(garment_resized).enhance(0.92)

    canvas = person.copy()
    x = (pw - target_w) // 2
    y = int(ph * 0.18)
    canvas.alpha_composite(garment_resized, dest=(x, y))
    return canvas.convert("RGB")


# ----------------------------------------------------------------------
#  UI
# ----------------------------------------------------------------------
st.markdown(
    """
    <style>
      .block-container { padding-top: 2rem; max-width: 1200px; }
      h1 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
      .stButton>button { background: #1A1815; color: #FAF7F2; border-radius: 0; }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("Fashinsta — Try-On Studio")
st.caption("Mock pipeline. Replace `tryon_pipeline()` in `app.py` with a real VTON model.")

col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("1 — Person")
    person_file = st.file_uploader("Photo (full-body or upper-body)", type=["jpg", "jpeg", "png"])
    if person_file:
        person_img = Image.open(person_file)
        st.image(person_img, use_column_width=True)
    else:
        person_img = None

with col2:
    st.subheader("2 — Garment")
    garment_file = st.file_uploader("Garment cutout (flat-lay or product)", type=["jpg", "jpeg", "png"])
    if garment_file:
        garment_img = Image.open(garment_file)
        st.image(garment_img, use_column_width=True)
    else:
        garment_img = None

with col3:
    st.subheader("3 — Result")
    run = st.button("Generate try-on", type="primary", disabled=not (person_img and garment_img))
    if run and person_img and garment_img:
        with st.spinner("Running pipeline…"):
            result = tryon_pipeline(TryOnInputs(person=person_img, garment=garment_img))
        st.image(result, use_column_width=True)
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        st.download_button("Download", buf.getvalue(), file_name="fashinsta-tryon.png", mime="image/png")

st.divider()
with st.expander("How to plug in a real model"):
    st.markdown(
        """
        1. Replace `tryon_pipeline(inp)` with a call into your model. The function takes
           PIL `person` and `garment` images and must return a PIL image.
        2. If running on a GPU host, load the model once at module level (Streamlit caches modules).
        3. For the backend to call this as a service, wrap the pipeline in a small FastAPI sidecar
           that exposes `POST /infer` accepting `{person_url, garment_url}` JSON. The Fashinsta
           backend's `HttpProvider` will then route requests here when `VTON_PROVIDER=http`.
        """
    )
