import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-start px-6 py-32 sm:px-8">
      <p className="eyebrow">Erratum</p>
      <h1 className="mt-4 text-hero font-semibold text-ink">
        404 — <span className="bg-gradient-to-r from-accent2 via-accent to-accent3 bg-clip-text text-transparent">lost</span> in the rail.
      </h1>
      <p className="mt-6 max-w-xl text-ink2">
        The garment you were looking for is no longer on this hanger.
      </p>
      <Link href="/" className="btn-primary mt-8">Return to the studio →</Link>
    </div>
  );
}
