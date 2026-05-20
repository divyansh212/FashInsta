import Image from "next/image";
import Link from "next/link";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/Faq";
import { LooksCarousel } from "@/components/home/LooksCarousel";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Background glow + grid */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-grid [mask-image:radial-gradient(50%_50%_at_50%_0%,black,transparent)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 pt-16 pb-24 text-center sm:px-8 sm:pt-24">
          <div className="animate-rise-in">
            <span className="chip">
              <span className="chip-dot" />
              New · Studio v1 just launched
            </span>
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-hero font-semibold text-ink animate-rise-in [animation-delay:80ms]">
            Try it on, before
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-accent2 via-accent to-accent3 bg-clip-text text-transparent">
              you buy it
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-ink2 sm:text-lg animate-rise-in [animation-delay:160ms]">
            Fashinsta brings the fitting room to your phone. Upload a photo, pick a
            garment, and see the look in seconds — no queues, no fluorescent lights,
            no regrets.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-rise-in [animation-delay:240ms]">
            <Link href="/tryon" className="btn-primary">
              Start a fitting
              <span aria-hidden>→</span>
            </Link>
            <Link href="/catalog" className="btn-ghost">View catalogue</Link>
          </div>

          {/* Hero composite "screenshot" — a real-looking app preview */}
          <div className="relative mt-16 animate-rise-in [animation-delay:320ms]">
            <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[3rem] bg-accent/20 blur-3xl" />
            <div className="surface-hi mx-auto max-w-5xl overflow-hidden rounded-2xl p-2 sm:p-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <HeroMockPhoto label="Your photo" src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" />
                <HeroMockGarment label="The garment" src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600" />
                <HeroMockResult label="The fitting" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600" />
              </div>
            </div>
          </div>

          {/* Trusted-by marquee */}
          <div className="mt-20">
            <p className="text-xs uppercase tracking-[0.18em] text-ink3">Over 50+ ateliers trust us</p>
            <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
              <div className="marquee-row">
                {Array.from({ length: 2 }).flatMap((_, i) =>
                  ["Maison Verte", "Aurelia", "Studio Noir", "Houdou", "Verda", "Kassia", "Atelier Onze", "Foulard", "Bellecourt", "Marais & Co."].map((b, j) => (
                    <span key={`${i}-${j}`} className="whitespace-nowrap text-2xl font-medium tracking-tight text-ink2/70">
                      {b}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES (translation of Xtract's "Our Services")
          ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="mx-auto max-w-[1280px] px-6 pt-24 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">What we do</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">
            A fitting room that fits in <span className="italic">your pocket.</span>
          </h2>
          <p className="mt-4 text-ink2">
            We don't sell clothes. We sell certainty — four tools that let you decide before the parcel ever ships.
          </p>
        </header>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Virtual Try-On */}
          <FeatureCard
            tag="Try-On Studio"
            title="Wear it without wearing it"
            body="Upload one photo. The studio dresses you in any garment from the catalogue using state-of-the-art VTON inference — in seconds, not days."
            chips={["Single-shot", "Diffusion-based", "Pose-aware"]}
          >
            <TryOnMock />
          </FeatureCard>

          {/* Smart Sizing */}
          <FeatureCard
            tag="Smart Sizing"
            title="The right size, on the first try"
            body="Body-aware measurements predict which size will fit before you check out. Returns drop, confidence rises."
            chips={["EU 36–48", "UK 4–20", "Returns ↓ 42%"]}
          >
            <SizingMock />
          </FeatureCard>

          {/* Style Discovery */}
          <FeatureCard
            tag="Style Feed"
            title="A magazine you can step into"
            body="See how the community styles each piece. Tap any look to try the exact outfit on yourself."
            chips={["Edited daily", "By the house", "Try-with-one-tap"]}
          >
            <FeedMock />
          </FeatureCard>

          {/* Personal Stylist */}
          <FeatureCard
            tag="AI Stylist"
            title="Your tailor, on standby"
            body="Chat to a stylist that knows your wardrobe, your fits, and your colour. It assembles outfits — you approve them."
            chips={["Wardrobe-aware", "Occasion-aware", "24/7"]}
          >
            <StylistMock />
          </FeatureCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PROCESS
          ═══════════════════════════════════════════════════════════════ */}
      <section id="process" className="mx-auto max-w-[1280px] px-6 pt-32 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">How it works</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">
            Four steps, three seconds, one fitting.
          </h2>
        </header>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Upload your photo",  d: "Any full-body shot. The clearer the light, the better the fit.",   m: <ProcessMockUpload /> },
            { n: "02", t: "Browse the rail",     d: "Curated pieces from independent ateliers. New drops every week.",  m: <ProcessMockBrowse /> },
            { n: "03", t: "Generate the fit",    d: "VTON inference runs in seconds. Iterate until the look is right.", m: <ProcessMockGenerate /> },
            { n: "04", t: "Share or check out",  d: "Post the look to your feed. Or buy it. Or both.",                   m: <ProcessMockShare /> },
          ].map((step) => (
            <li key={step.n} className="surface relative overflow-hidden p-5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-50" />
              <span className="font-mono text-xs text-accent">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{step.t}</h3>
              <p className="mt-1.5 text-sm text-ink2">{step.d}</p>
              <div className="mt-5 rounded-xl bg-bg p-3 ring-1 ring-line">{step.m}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LOOKS (the "case studies" translation — drag carousel)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="looks" className="mt-32">
        <header className="mx-auto max-w-2xl px-6 text-center sm:px-8">
          <p className="eyebrow justify-center">Looks</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">
            Real fittings. Real bodies. Real wear.
          </h2>
          <p className="mt-4 text-ink2">
            Drag to explore looks generated and shared by the community this week.
          </p>
        </header>
        <div className="mt-12">
          <LooksCarousel />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BENEFITS GRID
          ═══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1280px] px-6 pt-32 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Benefits</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">
            Why people stop shopping the old way.
          </h2>
        </header>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "✦", t: "Confidence before purchase", d: "See the silhouette, the drape, the fit — before you commit." },
            { icon: "↻", t: "Returns dropped 42%",         d: "Buying the right size on the first try costs less for everyone." },
            { icon: "◐", t: "Open 24/7",                    d: "No queues, no closing hours. Your fitting room is on your phone." },
            { icon: "△", t: "Built for indie ateliers",     d: "Curated drops from independent houses, not fast-fashion endlessness." },
            { icon: "≈", t: "Style that knows you",         d: "Recommendations learn from what you actually wear, not what you click." },
            { icon: "✕", t: "No haunted closet",            d: "Try fearlessly. Buy intentionally. Wear with conviction." },
          ].map((b) => (
            <div key={b.t} className="bg-bg p-7 transition hover:bg-bg2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-bg3 text-lg text-accent">{b.icon}</div>
              <h3 className="mt-5 text-base font-semibold text-ink">{b.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink2">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRICING (client component for monthly/annual toggle)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="mx-auto max-w-[1280px] px-6 pt-32 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Pricing</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">
            The right plan, at the right price.
          </h2>
          <p className="mt-4 text-ink2">Free to start. Upgrade only when the fitting room becomes a habit.</p>
        </header>
        <Pricing />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1280px] px-6 pt-32 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Testimonials</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">Why people stay.</h2>
        </header>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { q: "I haven't returned a single piece since I started using it. Fittings just work.", n: "Anika R.",      r: "Member · Delhi" },
            { q: "The studio caught a sizing problem I always have with shoulders. Saved me an exchange.", n: "Tomás H.",  r: "Member · Madrid" },
            { q: "Our exchanges dropped 30% in the first month after we listed on Fashinsta.",     n: "Maison Verte",  r: "Atelier · Paris" },
            { q: "It's the only shopping app I open just to browse. The feed is a magazine.",       n: "Yui K.",        r: "Member · Tokyo" },
          ].map((t) => (
            <figure key={t.n} className="surface flex h-full flex-col p-6">
              <blockquote className="text-sm leading-relaxed text-ink">"{t.q}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent2 to-accent3 text-bg text-xs font-semibold">
                  {t.n.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{t.n}</p>
                  <p className="text-xs text-ink3">{t.r}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 pt-32 sm:px-8">
        <header className="text-center">
          <p className="eyebrow justify-center">FAQs</p>
          <h2 className="mt-4 text-h1 font-semibold text-ink">Questions we get a lot.</h2>
        </header>
        <Faq />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1280px] px-6 pt-32 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-bg2 px-8 py-20 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-card-glow" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <p className="eyebrow justify-center">Step into the studio</p>
          <h2 className="mx-auto mt-5 max-w-2xl text-hero font-semibold text-ink">
            Stop guessing.<br />
            <span className="bg-gradient-to-r from-accent2 via-accent to-accent3 bg-clip-text text-transparent">
              Start fitting.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-ink2">
            One photo. A few seconds. A wardrobe you actually wear.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/tryon" className="btn-primary">Start a fitting →</Link>
            <Link href="/catalog" className="btn-ghost">Browse the rail</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
function HeroMockPhoto({ label, src }: { label: string; src: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg3">
      <Image src={src} alt={label} fill sizes="33vw" className="object-cover" />
      <div className="absolute left-3 top-3 chip !py-1 !px-2.5 !text-[0.65rem]">
        <span className="chip-dot" /> 1 · {label}
      </div>
    </div>
  );
}
function HeroMockGarment({ label, src }: { label: string; src: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg3">
      <Image src={src} alt={label} fill sizes="33vw" className="object-cover" />
      <div className="absolute left-3 top-3 chip !py-1 !px-2.5 !text-[0.65rem]">
        <span className="chip-dot" /> 2 · {label}
      </div>
    </div>
  );
}
function HeroMockResult({ label, src }: { label: string; src: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg3 ring-1 ring-accent/50">
      <Image src={src} alt={label} fill sizes="33vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
      <div className="absolute left-3 top-3 chip !py-1 !px-2.5 !text-[0.65rem]">
        <span className="chip-dot" /> 3 · {label}
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-bg/70 px-3 py-2 backdrop-blur-md">
        <span className="text-xs text-ink">Generated in 3.4s</span>
        <span className="font-mono text-xs text-accent">✓ done</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FEATURE CARD + MOCK UIs (the visual centerpieces, à la Xtract)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureCard({
  tag, title, body, chips, children,
}: {
  tag: string; title: string; body: string; chips: string[]; children: React.ReactNode;
}) {
  return (
    <article className="surface ring-shimmer group relative overflow-hidden p-6 sm:p-7">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.14em] text-accent">{tag}</span>
          <h3 className="mt-3 text-h2 font-semibold text-ink">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink2">{body}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-line bg-bg3 px-2.5 py-1 text-[0.7rem] text-ink2">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl bg-bg p-3 ring-1 ring-line transition group-hover:ring-accent/30">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

function TryOnMock() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300",
      ].map((src, i) => (
        <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-bg3">
          <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
          {i === 2 && <div className="absolute inset-0 ring-2 ring-inset ring-accent/60 rounded-lg" />}
        </div>
      ))}
    </div>
  );
}

function SizingMock() {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink2">Best fit for you</span>
        <span className="font-mono text-accent">M · 98%</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {sizes.map((s) => (
          <div
            key={s}
            className={`flex h-10 flex-1 items-center justify-center rounded-lg text-sm font-medium ${
              s === "M"
                ? "bg-gradient-to-b from-accent2 to-accent3 text-bg shadow-btn"
                : "border border-line bg-bg2 text-ink2"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-xs">
        {[
          ["Shoulders", "OK", 96],
          ["Chest",     "Loose · intended", 88],
          ["Length",    "OK", 94],
        ].map(([l, n, pct]) => (
          <div key={l as string}>
            <div className="flex justify-between text-ink2"><span>{l}</span><span>{n}</span></div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg3">
              <div className="h-full bg-gradient-to-r from-accent2 to-accent3" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedMock() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=300",
        "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=300",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300",
      ].map((src) => (
        <div key={src} className="relative aspect-square overflow-hidden rounded-md bg-bg3">
          <Image src={src} alt="" fill sizes="15vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function StylistMock() {
  return (
    <div className="space-y-2.5 text-sm">
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-to-br from-accent2 to-accent3 px-3.5 py-2 text-bg">
        Anything for a dinner in Paris?
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg3 px-3.5 py-2 text-ink2">
        Pulling three looks from your wardrobe…
      </div>
      <div className="flex gap-1.5 pt-1">
        {[
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=240",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=240",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=240",
        ].map((src) => (
          <div key={src} className="relative aspect-[3/4] flex-1 overflow-hidden rounded-md bg-bg3">
            <Image src={src} alt="" fill sizes="12vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PROCESS STEP MOCK UIs
   ═══════════════════════════════════════════════════════════════════ */
function ProcessMockUpload() {
  return (
    <div className="flex h-28 flex-col items-center justify-center rounded-lg border border-dashed border-line text-center">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-bg3 text-accent">↑</div>
      <p className="mt-2 text-[0.72rem] text-ink2">selfie.jpg · 2.4 MB</p>
    </div>
  );
}
function ProcessMockBrowse() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={`relative h-9 rounded-md bg-bg3 ${i === 4 ? "ring-1 ring-accent" : ""}`} />
      ))}
    </div>
  );
}
function ProcessMockGenerate() {
  return (
    <div className="flex h-28 items-center justify-center">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-line border-t-accent" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-2 grid place-items-center rounded-full bg-bg3 text-xs font-mono text-accent">3.4s</div>
      </div>
    </div>
  );
}
function ProcessMockShare() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-16 w-16 overflow-hidden rounded-md">
        <Image src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200" alt="" fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="h-2 w-3/4 rounded bg-bg3" />
        <div className="h-2 w-1/2 rounded bg-bg3" />
        <div className="flex gap-1 pt-1">
          <span className="text-[0.65rem] text-accent">♥ 248</span>
          <span className="text-[0.65rem] text-ink3">· 12 comments</span>
        </div>
      </div>
    </div>
  );
}
