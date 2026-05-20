import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent2 to-accent3 text-bg shadow-btn">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M3 2h10v2H3zM3 12h10v2H3zM4 6h8v4H4z" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-ink">
            Fashinsta
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {[
            ["Home", "/"],
            ["Catalogue", "/catalog"],
            ["Try-On", "/tryon"],
            ["Journal", "#"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="rounded-full px-3.5 py-2 text-sm text-ink2 transition hover:bg-bg3 hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/tryon" className="btn-primary !py-2 !px-4 !text-[0.82rem]">
          Start fitting
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
