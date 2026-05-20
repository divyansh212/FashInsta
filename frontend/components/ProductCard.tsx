import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/tryon?product=${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg2 ring-1 ring-line transition group-hover:ring-accent/40">
        <Image
          src={product.cover_url ?? product.image_url}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          {product.tags.slice(0, 1).map((t) => (
            <span key={t} className="rounded-full bg-bg/85 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg/80 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          {product.brand && (
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink3">{product.brand}</p>
          )}
          <p className="text-base font-medium text-ink">{product.name}</p>
        </div>
        <p className="whitespace-nowrap font-mono text-sm text-ink2">
          {formatPrice(product.price_cents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
