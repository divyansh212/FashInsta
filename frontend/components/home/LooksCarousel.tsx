"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Look = {
  img: string;
  caption: string;
  handle: string;
  pieces: { name: string; brand: string }[];
};

const LOOKS: Look[] = [
  {
    img: "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900",
    caption: "First fitting and I genuinely can't believe the drape is this accurate.",
    handle: "@anika.r",
    pieces: [
      { name: "Silk Slip Dress",  brand: "Aurelia" },
      { name: "Cropped Wool Coat", brand: "Studio Noir" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900",
    caption: "Spring uniform locked in. Linen on linen.",
    handle: "@tom.h",
    pieces: [
      { name: "Linen Drape Shirt", brand: "Maison Verte" },
      { name: "Wide-Leg Trouser",  brand: "Maison Verte" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900",
    caption: "Tried six tops on the bus ride home. Bought one.",
    handle: "@yui.k",
    pieces: [
      { name: "Heavyweight Tee", brand: "Studio Noir" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=900",
    caption: "Midi skirts always read shorter on me — the fitting caught it before checkout.",
    handle: "@priya.s",
    pieces: [
      { name: "A-Line Midi Skirt", brand: "Aurelia" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900",
    caption: "Cold-weather brief: solved.",
    handle: "@dimitri.v",
    pieces: [
      { name: "Cropped Wool Coat", brand: "Studio Noir" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900",
    caption: "Pleats sit exactly where they should. Pinning the silhouette.",
    handle: "@malia.j",
    pieces: [
      { name: "Wide-Leg Trouser", brand: "Maison Verte" },
    ],
  },
];

export function LooksCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  // Drag-to-scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startScroll = 0;

    const onDown = (clientX: number) => {
      setDragging(true);
      startX = clientX;
      startScroll = el.scrollLeft;
    };
    const onMove = (clientX: number) => {
      if (!dragging) return;
      el.scrollLeft = startScroll - (clientX - startX);
    };
    const onUp = () => setDragging(false);

    const md = (e: MouseEvent) => onDown(e.clientX);
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const mu = () => onUp();
    const td = (e: TouchEvent) => onDown(e.touches[0].clientX);
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX);

    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    el.addEventListener("touchstart", td, { passive: true });
    el.addEventListener("touchmove",  tm, { passive: true });
    el.addEventListener("touchend",   mu);

    return () => {
      el.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      el.removeEventListener("touchstart", td);
      el.removeEventListener("touchmove",  tm);
      el.removeEventListener("touchend",   mu);
    };
  }, [dragging]);

  const scrollBy = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-bg to-transparent" />

      <div
        ref={ref}
        className={`flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:px-12 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        } [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {LOOKS.map((look, i) => (
          <article
            key={i}
            className="surface relative w-[320px] flex-shrink-0 snap-start overflow-hidden p-2 sm:w-[380px]"
            onClickCapture={(e) => { if (dragging) e.preventDefault(); }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg3">
              <Image src={look.img} alt={look.caption} fill sizes="380px" className="object-cover" draggable={false} />
              <div className="absolute left-3 top-3 chip !py-1 !px-2.5 !text-[0.65rem]">
                <span className="chip-dot" /> Look {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="px-3 pb-3 pt-4">
              <p className="text-sm leading-snug text-ink">"{look.caption}"</p>
              <p className="mt-3 text-xs text-ink3">{look.handle}</p>
              <div className="mt-4 space-y-1.5 border-t border-line pt-3">
                {look.pieces.map((p) => (
                  <div key={p.name} className="flex items-baseline justify-between text-xs">
                    <span className="text-ink">{p.name}</span>
                    <span className="text-ink3">{p.brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Drag hint + controls */}
      <div className="mx-auto mt-8 flex max-w-[1280px] items-center justify-between px-6 sm:px-8">
        <p className="text-xs uppercase tracking-[0.18em] text-ink3 select-none">← Drag to explore →</p>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-bg2 text-ink2 transition hover:border-accent/40 hover:text-ink"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-bg2 text-ink2 transition hover:border-accent/40 hover:text-ink"
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
