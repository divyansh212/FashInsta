# Architecture Notes

## Request flow: a try-on

```
User
 │  uploads selfie + picks garment
 ▼
Next.js /tryon
 │  1. uploads selfie → Supabase Storage → gets public URL
 │  2. POST /api/tryon { product_id, person_image_url } with JWT
 ▼
FastAPI /api/tryon
 │  1. verifies JWT (HS256 with SUPABASE_JWT_SECRET)
 │  2. inserts a `tryons` row with status='pending'
 │  3. fires a BackgroundTask → run_tryon(...)
 │  4. returns the row immediately so the client can poll
 ▼
tryon_service.run_tryon
 │  dispatches to the configured provider:
 │  - mock                → returns garment URL after 1.2s
 │  - http / streamlit    → POSTs to your inference HTTP service
 │  - replicate           → submits prediction, polls
 ▼
On success: updates `tryons` row → status='done', result_image_url=...
Frontend polls GET /api/tryon/{id} until status==done.
```

## Why a background task and not synchronous

VTON inference takes anywhere from 3 to 60 seconds depending on the model and hardware. Holding an HTTP connection that long is wasteful and gets killed by edge proxies. The "queue a row, poll for status" pattern is what every production VTON service uses.

For a real production deployment you'd swap `BackgroundTasks` for a proper queue (Celery/RQ/Arq) so the inference workers can be scaled independently of the API.

## Auth model

- Supabase Auth lives on the frontend. Users sign up / sign in via Supabase's client SDK (we did not include the UI in this scaffold — magic links or `@supabase/auth-ui-react` are both quick to bolt on).
- The frontend sends `Authorization: Bearer <access_token>` on requests that need a user.
- The FastAPI backend decodes that JWT locally using `SUPABASE_JWT_SECRET`. No round-trip to Supabase for verification.
- For DB reads/writes, the backend uses the **service role** key (`SbService`). It's the API's responsibility to enforce ownership rules — RLS is a defence-in-depth layer for when clients hit Supabase directly.
- Clients that hit Supabase directly (e.g. uploading to Storage) are still subject to RLS via the user's anon-key session.

## Data model decisions

- **`tryons` separated from `posts`** — most try-ons are never shared. Keep them private by default.
- **`product_ids` is a uuid[]** on posts, not a join table. Reads dominate; joins would just be overhead. If you grow into tagging analytics later, denormalise into a join table then.
- **`posts_feed` view** materialises author info + like count for the feed. Cheap because it's just a left join and a subselect; if it becomes hot, swap to a materialised view or cache.

## Where to extend

| What you'd add | Where it goes |
|---|---|
| Likes / follows | New router + tables; the `likes` table is already in the schema |
| Comments | New `comments` table, owner-write RLS like `posts` |
| DMs | A `conversations` + `messages` table; consider Supabase Realtime |
| Notifications | A `notifications` table + Supabase Realtime channels |
| Search | Postgres FTS on `products.name`, `products.tags`; for embeddings use pgvector |
| Payments | Stripe webhooks → `orders` table; don't put webhook handlers in Next.js, put them in FastAPI |

## Performance notes

- Next.js home page is a Server Component — the API calls happen on the server, the HTML is shipped fully rendered. Replace `cache: "no-store"` with `revalidate: 60` in `api.ts` once you want ISR.
- The try-on studio is a client component (it manages upload state and polling); keep it that way.
- Tailwind purges unused classes automatically. Don't worry about CSS size.

## Things deliberately not done

- **No auth UI** — wire up Supabase Auth UI or roll your own. The studio shows a friendly error when no session is present.
- **No payment** — out of scope for a try-on platform foundation.
- **No mobile-native VTON** — `nawodyaishan/ar-fashion-tryon` is the AR/on-device reference if you want that path. It's a separate codebase, not a fork of this one.
- **No model training pipeline** — `aimagelab/dress-code` is where training infrastructure lives. Treat it as a separate sub-project.
