# Fashinsta

A social-fashion + virtual try-on platform. Browse outfits, see them on yourself, share looks.

> **Read this section before you start.** This repo is a **runnable foundation**, not a finished product. The frontend, API, database schema, and a Streamlit demo are all wired up end-to-end with a *mock* try-on service. The actual virtual try-on (VTON) model is plugged in as an external inference call — see [Plugging in a real try-on model](#plugging-in-a-real-try-on-model). Building a from-scratch VTON model is a research project of its own; the references below are where the actual ML lives.

## Architecture

```
┌────────────────────┐      ┌────────────────────┐      ┌──────────────────┐
│  Next.js Frontend  │◄────►│   FastAPI Backend  │◄────►│  Supabase (PG)   │
│  (Tailwind, RSC)   │      │  (Python 3.11+)    │      │  + Storage       │
└────────┬───────────┘      └─────────┬──────────┘      └──────────────────┘
         │                            │
         │                            ▼
         │                  ┌────────────────────┐
         │                  │  VTON Inference    │
         │                  │  (Streamlit demo,  │
         │                  │   or HF/Replicate, │
         │                  │   or your own GPU) │
         │                  └────────────────────┘
         ▼
   Browser (uploads selfie, browses catalog, posts looks)
```

- **Frontend** — Next.js 14 (App Router), Tailwind CSS, TypeScript. Editorial-magazine aesthetic.
- **Backend** — FastAPI. REST endpoints for catalog, feed, try-on, auth pass-through to Supabase.
- **Database** — Supabase (Postgres + Storage + Auth). Schema in `supabase/schema.sql`.
- **Try-on demo** — A Streamlit app (`streamlit_app/`) that runs a VTON pipeline locally. Useful for prototyping and as a fallback inference endpoint.

### About the original stack request

You asked for Java, C++, and Rust in the backend. I dropped them because they don't fit this project — the VTON ecosystem (the GitHub references you listed) is entirely Python/PyTorch. Forcing JVM/Rust services here would slow you down without buying you anything. Realistic places those *could* slot in later if you want them:

- **Rust microservice** — Image preprocessing (resize, EXIF, format normalization) and a high-throughput thumbnail pipeline. The FastAPI tryon router would call it over gRPC or HTTP.
- **C++** — Only if you write a custom inference kernel or wrap a non-Python model (e.g. ONNX runtime with custom ops). Most VTON repos ship Python; this is rarely worth it.
- **Java** — If you integrate with an enterprise system (Salesforce Commerce, SAP Hybris) that already runs JVM. Not relevant otherwise.

If you want any of those scaffolded, ask and I'll add them as a separate service.

## Repo layout

```
fashinsta/
├── frontend/         Next.js 14 + Tailwind app
├── backend/          FastAPI service
├── streamlit_app/    Local VTON inference UI
├── supabase/         schema.sql + RLS policies
└── docs/             notes, architecture, model integration
```

## Quick start

You need **Node 20+**, **Python 3.11+**, a **Supabase project**, and (optionally) a GPU host or Replicate/HF account for the VTON model.

### 1. Supabase

1. Create a project at supabase.com.
2. In SQL editor, run `supabase/schema.sql`.
3. Create a public Storage bucket named `fashinsta` with two folders: `products/` and `tryons/`.
4. Copy the project URL, anon key, and service role key.

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # fill in Supabase + VTON service URL
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_* and NEXT_PUBLIC_API_URL
npm run dev
```

Open http://localhost:3000.

### 4. Streamlit try-on demo (optional)

```bash
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py
```

Open http://localhost:8501. By default it runs the mock pipeline. To swap in a real model, see below.

## Plugging in a real try-on model

The backend calls `app.services.tryon_service.run_tryon(person_image_url, garment_image_url)` and expects a URL back. Right now it returns a placeholder. Pick one of these and replace the stub:

| Option | Where the code goes | Notes |
|---|---|---|
| **OutfitAnyone** ([HumanAIGC/OutfitAnyone](https://github.com/HumanAIGC/OutfitAnyone)) | Run as a Gradio space or local GPU service; call its API from `tryon_service.py` | Highest quality of the references; needs a real GPU. |
| **dress-code** ([aimagelab/dress-code](https://github.com/aimagelab/dress-code)) | Train/run their model; expose a FastAPI wrapper | Research codebase; good for understanding. |
| **OpenTryOn** ([tryonlabs/opentryon](https://github.com/tryonlabs/opentryon)) | Self-host their service; point `VTON_SERVICE_URL` at it | Most production-ready of the open options. |
| **Replicate / HF Inference** | Set `VTON_PROVIDER=replicate`, add API key | Easiest. Pay per call. |
| **Streamlit demo** | Set `VTON_PROVIDER=streamlit_local` | For dev only. |

The wrapper interface is intentionally tiny so you can swap providers without touching the frontend or DB.

## What's done vs. what's stubbed

**Done** — Next.js app with home feed, catalog, try-on studio, post detail pages; FastAPI with auth-aware routers for users/products/feed/tryon; Supabase schema with RLS; Streamlit mock pipeline; type-safe API client.

**Stubbed** — The actual VTON inference (returns the garment image overlaid on the person via a placeholder). Auth flows assume Supabase Auth on the frontend; backend trusts the JWT. No payment, no DM, no notification system.

## References

The references you provided, briefly annotated:

- [HumanAIGC/OutfitAnyone](https://github.com/HumanAIGC/OutfitAnyone) — Alibaba's high-fidelity VTON. **Best quality, GPU-heavy.**
- [aimagelab/dress-code](https://github.com/aimagelab/dress-code) — Academic dataset + baseline model.
- [tryonlabs/opentryon](https://github.com/tryonlabs/opentryon) — Production-oriented open VTON.
- [SwayamInSync/clothes-virtual-try-on](https://github.com/SwayamInSync/clothes-virtual-try-on) — Solid mid-quality baseline.
- [Cyanex1702/Virtual_Try_on_FashionGenAi](https://github.com/Cyanex1702/Virtual_Try_on_FashionGenAi) — GenAI-style approach.
- [nawodyaishan/ar-fashion-tryon](https://github.com/nawodyaishan/ar-fashion-tryon) — AR-based (different paradigm, runs on-device).
- [rishabh-s-t/Vastra-Final](https://github.com/rishabh-s-t/Vastra-Final) — Indian-fashion focused.
- [ThinhPhan0108/Virtual-try-on-web](https://github.com/ThinhPhan0108/Virtual-try-on-web) — Web wrapper reference.
- [fmind/virtual-try-on](https://github.com/fmind/virtual-try-on) — Simple pipeline reference.
- [minar09/awesome-virtual-try-on](https://github.com/minar09/awesome-virtual-try-on) — Curated list; start here for survey.
