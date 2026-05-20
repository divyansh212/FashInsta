"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { api, Product, TryOn, formatPrice } from "@/lib/api";
import { createSupabaseBrowser } from "@/lib/supabase";

type Phase = "idle" | "uploading" | "queued" | "processing" | "done" | "error";

export function TryOnStudio() {
  const params = useSearchParams();
  const preselected = params.get("product") ?? undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tryon, setTryon] = useState<TryOn | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.products.list({ limit: 24 }).then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (preselected && products.length) {
      const found = products.find((p) => p.id === preselected);
      if (found) setSelected(found);
    }
  }, [preselected, products]);

  useEffect(() => {
    if (!personFile) return;
    const url = URL.createObjectURL(personFile);
    setPersonPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [personFile]);

  async function start() {
    setError(null);
    if (!personFile || !selected) {
      setError("Pick a garment and upload a photo first.");
      return;
    }
    try {
      setPhase("uploading");
      const supabase = createSupabaseBrowser();
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError("You need to be signed in. (Wire up Supabase Auth UI / magic link to enable this flow.)");
        setPhase("error");
        return;
      }
      const filename = `tryons/${session.session!.user.id}/${Date.now()}-${personFile.name}`;
      const { error: upErr } = await supabase.storage
        .from("fashinsta")
        .upload(filename, personFile, { upsert: false, contentType: personFile.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("fashinsta").getPublicUrl(filename);

      setPhase("queued");
      const created = await api.tryon.create(token, {
        product_id: selected.id,
        person_image_url: pub.publicUrl,
      });
      setTryon(created);

      setPhase("processing");
      let attempt = 0;
      while (attempt < 60) {
        await new Promise((r) => setTimeout(r, 1500));
        const fresh = await api.tryon.get(token, created.id);
        setTryon(fresh);
        if (fresh.status === "done")   { setPhase("done"); return; }
        if (fresh.status === "failed") { setPhase("error"); setError(fresh.error_message ?? "Inference failed"); return; }
        attempt += 1;
      }
      setError("Timed out waiting for the model.");
      setPhase("error");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase("error");
    }
  }

  const isBusy = phase === "uploading" || phase === "queued" || phase === "processing";

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">The fitting room</p>
        <h1 className="mt-4 text-hero font-semibold text-ink">
          A private <span className="bg-gradient-to-r from-accent2 via-accent to-accent3 bg-clip-text text-transparent">studio</span>.
        </h1>
        <p className="mt-4 max-w-md text-ink2">
          Upload a clear, well-lit photo. Pick a piece from the rail. The studio stitches the rest.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* LEFT — uploader */}
        <div className="surface p-5 lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Step 01</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Your photograph</h2>
          <label className="mt-4 flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-bg text-center transition hover:border-accent/40">
            {personPreview ? (
              <Image src={personPreview} alt="You" width={600} height={800} className="h-full w-full object-cover" />
            ) : (
              <span className="px-6 text-sm text-ink2">
                Tap to upload
                <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.18em] text-ink3">JPG / PNG · full-body</span>
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPersonFile(e.target.files?.[0] ?? null)}
              disabled={isBusy}
            />
          </label>
        </div>

        {/* MIDDLE — garment */}
        <div className="surface p-5 lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Step 02</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">The garment</h2>
          {selected ? (
            <div className="mt-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg ring-1 ring-line">
                <Image src={selected.cover_url ?? selected.image_url} alt={selected.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink3">{selected.brand}</p>
                  <p className="text-base font-medium text-ink">{selected.name}</p>
                </div>
                <p className="font-mono text-sm text-ink2">{formatPrice(selected.price_cents, selected.currency)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-ink3 hover:text-ink"
              >
                ← Change garment
              </button>
            </div>
          ) : (
            <div className="mt-4 grid max-h-[640px] grid-cols-2 gap-2 overflow-y-auto pr-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="group text-left"
                  disabled={isBusy}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-bg ring-1 ring-line transition group-hover:ring-accent/40">
                    <Image src={p.cover_url ?? p.image_url} alt={p.name} fill className="object-cover" sizes="20vw" />
                  </div>
                  <p className="mt-1.5 truncate text-sm text-ink">{p.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — result */}
        <div className="surface p-5 lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Step 03</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">The fitting</h2>
          <div className="relative mt-4 aspect-[3/4] overflow-hidden rounded-xl bg-bg ring-1 ring-line">
            {tryon?.result_image_url && phase === "done" ? (
              <Image src={tryon.result_image_url} alt="Try-on result" fill className="object-cover" sizes="33vw" />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                {isBusy ? (
                  <div>
                    <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" />
                    <p className="text-base text-ink">
                      {phase === "uploading"  && "Uploading photograph…"}
                      {phase === "queued"     && "Sending to the atelier…"}
                      {phase === "processing" && "Stitching the fit…"}
                    </p>
                    <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-ink3">avg 3.4s</p>
                  </div>
                ) : (
                  <p className="px-6 text-sm text-ink3">Your fitting will appear here.</p>
                )}
              </div>
            )}
          </div>
          <button
            onClick={start}
            disabled={!personFile || !selected || isBusy}
            className="btn-primary mt-5 !w-full !justify-center disabled:!bg-bg3 disabled:!from-bg3 disabled:!to-bg3 disabled:!text-ink3 disabled:cursor-not-allowed disabled:!shadow-none"
          >
            {isBusy ? "Working…" : "Generate fitting →"}
          </button>
          {error && (
            <p className="mt-3 border-l-2 border-accent bg-accent/10 px-3 py-2 text-sm text-accent2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
