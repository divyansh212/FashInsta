"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "How does virtual try-on actually work?",
    a: "We use a diffusion-based virtual try-on model. You upload a single photo; the model identifies your pose and body, segments the garment cleanly, and renders the result as if you were wearing it. The whole thing takes a few seconds on a GPU.",
  },
  {
    q: "What kind of photo gets the best result?",
    a: "A clear, well-lit, full-body shot taken straight on, against a relatively plain background. Try to keep your arms at your sides — heavy occlusion (crossed arms, hands on hips) makes the model work harder.",
  },
  {
    q: "Is my photo stored anywhere?",
    a: "Uploads are stored in your private Supabase bucket and used only to generate your fittings. You can delete any try-on (and the underlying photo) from your account at any time. We never use member photos to train models.",
  },
  {
    q: "Can sellers list garments on Fashinsta?",
    a: "Yes — that's the Atelier plan. Brands upload a flat-lay or product photo plus metadata; the catalogue handles the rest. Each garment gets an associated VTON-ready cutout used for fittings.",
  },
  {
    q: "Why are returns lower for items previewed here?",
    a: "Because the biggest reason for returns is 'didn't look like I expected.' Seeing the silhouette and drape on your own body before checkout takes most of that uncertainty off the table. Member data shows a ~42% drop in size-related returns.",
  },
  {
    q: "Do I need an account to try a fitting?",
    a: "Yes — accounts are needed so the fitting result is private to you and so we can keep a usage history. Sign-up takes about 15 seconds via magic link.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg2">
      {QUESTIONS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-bg3"
            >
              <span className="text-base font-medium text-ink">{item.q}</span>
              <span
                className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-line bg-bg3 text-ink2 transition ${
                  isOpen ? "rotate-45 border-accent/50 text-accent" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink2">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
