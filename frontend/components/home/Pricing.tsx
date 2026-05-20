"use client";

import { useState } from "react";
import Link from "next/link";

type Tier = {
  name: string;
  monthly: number | null;
  annual: number | null;
  custom?: boolean;
  blurb: string;
  popular?: boolean;
  features: string[];
  cta: string;
  href: string;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    monthly: 0, annual: 0,
    blurb: "Try the studio. Free, forever, with daily limits.",
    features: ["5 fittings / day", "Standard render quality", "Public looks feed", "Community support"],
    cta: "Get started",
    href: "/tryon",
  },
  {
    name: "Studio",
    monthly: 9, annual: 7,
    blurb: "For the serious shopper. Unlimited fittings, sharper results.",
    popular: true,
    features: ["Unlimited fittings", "High-res render quality", "Personal stylist", "Wardrobe sync", "Priority queue"],
    cta: "Go Studio",
    href: "/tryon",
  },
  {
    name: "Atelier",
    monthly: null, annual: null, custom: true,
    blurb: "For brands and houses. List garments and reach intentional buyers.",
    features: ["Bulk listing API", "Brand analytics", "Reduced-returns dashboard", "Co-marketing", "Dedicated success"],
    cta: "Talk to us",
    href: "#",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="mt-10">
      {/* Toggle */}
      <div className="mx-auto mb-12 flex w-fit items-center gap-1 rounded-full border border-line bg-bg2 p-1">
        {(["Monthly", "Annually"] as const).map((label, i) => {
          const isAnnual = i === 1;
          const isActive = annual === isAnnual;
          return (
            <button
              key={label}
              onClick={() => setAnnual(isAnnual)}
              className={`relative rounded-full px-4 py-1.5 text-sm transition ${
                isActive ? "bg-bg4 text-ink shadow-card" : "text-ink2 hover:text-ink"
              }`}
            >
              {label}
              {isAnnual && (
                <span className="ml-2 rounded-full bg-accent/15 px-1.5 py-0.5 text-[0.62rem] font-mono text-accent">
                  -22%
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`relative flex flex-col p-7 ${
              t.popular
                ? "surface-hi bg-gradient-to-b from-accent/[0.06] to-transparent"
                : "surface"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent2 to-accent3 px-3 py-1 text-[0.68rem] font-medium text-bg shadow-btn">
                Most popular
              </span>
            )}

            <p className="text-sm font-medium text-ink2">{t.name}</p>

            <div className="mt-4 flex items-baseline gap-1">
              {t.custom ? (
                <span className="text-5xl font-semibold tracking-tight text-ink">Custom</span>
              ) : (
                <>
                  <span className="text-5xl font-semibold tracking-tight text-ink">
                    ${annual ? t.annual : t.monthly}
                  </span>
                  <span className="text-sm text-ink3">/ month</span>
                </>
              )}
            </div>
            {annual && !t.custom && (t.annual ?? 0) > 0 && (
              <p className="mt-1 text-xs text-ink3">Billed annually</p>
            )}

            <p className="mt-4 text-sm text-ink2">{t.blurb}</p>

            <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-ink">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-1 grid h-3.5 w-3.5 flex-shrink-0 place-items-center rounded-full bg-accent/15 text-[0.6rem] text-accent">✓</span>
                  <span className="text-ink2">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={t.href}
              className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                t.popular ? "btn-primary !w-full" : "btn-ghost !w-full"
              }`}
            >
              {t.cta} <span aria-hidden>→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
