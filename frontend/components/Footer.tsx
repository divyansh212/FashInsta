import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-line bg-bg2/40">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:grid-cols-12 sm:px-8">
        {/* Brand + newsletter */}
        <div className="sm:col-span-5">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent2 to-accent3 text-bg">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M3 2h10v2H3zM3 12h10v2H3zM4 6h8v4H4z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">Fashinsta</span>
          </div>
          <p className="mt-5 max-w-sm text-ink2 leading-relaxed">
            Try smarter, return less, share more. Fashinsta is the fitting room that
            lives in your pocket.
          </p>
          <form className="mt-6 flex max-w-sm gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-line bg-bg2 px-4 py-2.5 text-sm text-ink placeholder:text-ink3 focus:border-accent/60 focus:outline-none"
            />
            <button type="button" className="btn-primary !py-2.5 !px-4 !text-[0.82rem]">
              Subscribe
            </button>
          </form>
        </div>

        <div className="sm:col-span-2">
          <p className="eyebrow">Links</p>
          <ul className="mt-4 space-y-2 text-sm text-ink2">
            <li><Link href="/#features"  className="hover:text-ink">Features</Link></li>
            <li><Link href="/#process"   className="hover:text-ink">Process</Link></li>
            <li><Link href="/#looks"     className="hover:text-ink">Looks</Link></li>
            <li><Link href="/#pricing"   className="hover:text-ink">Pricing</Link></li>
          </ul>
        </div>
        <div className="sm:col-span-2">
          <p className="eyebrow">Pages</p>
          <ul className="mt-4 space-y-2 text-sm text-ink2">
            <li><Link href="/"          className="hover:text-ink">Home</Link></li>
            <li><Link href="/catalog"   className="hover:text-ink">Catalogue</Link></li>
            <li><Link href="/tryon"     className="hover:text-ink">Try-On</Link></li>
            <li><Link href="#"          className="hover:text-ink">About</Link></li>
          </ul>
        </div>
        <div className="sm:col-span-3">
          <p className="eyebrow">Socials</p>
          <ul className="mt-4 space-y-2 text-sm text-ink2">
            <li><a className="hover:text-ink" href="#">Instagram</a></li>
            <li><a className="hover:text-ink" href="#">TikTok</a></li>
            <li><a className="hover:text-ink" href="#">LinkedIn</a></li>
            <li><a className="hover:text-ink" href="#">Twitter / X</a></li>
          </ul>
        </div>
      </div>
      <div className="hairline" />
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 text-xs text-ink3 sm:px-8">
        <span>© Fashinsta {new Date().getFullYear()} — all rights reserved.</span>
        <span>Crafted in Delhi · Paris · Tokyo</span>
      </div>
    </footer>
  );
}
