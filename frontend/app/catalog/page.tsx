import { api, Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Catalogue · Fashinsta" };

const CATEGORIES: { slug: Product["category"] | "all"; label: string }[] = [
  { slug: "all", label: "All" },
  { slug: "top", label: "Tops" },
  { slug: "bottom", label: "Bottoms" },
  { slug: "dress", label: "Dresses" },
  { slug: "outerwear", label: "Outerwear" },
  { slug: "accessory", label: "Accessories" },
];

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: { category?: Product["category"] };
}) {
  let products: Product[] = [];
  try {
    products = await api.products.list({ category: searchParams.category, limit: 60 });
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">The rail</p>
        <h1 className="mt-4 text-hero font-semibold text-ink">
          The <span className="bg-gradient-to-r from-accent2 via-accent to-accent3 bg-clip-text text-transparent">catalogue</span>.
        </h1>
        <p className="mt-4 max-w-xl text-ink2">
          Each piece is curated, photographed, and fitted by the house. Pick one —
          the studio will dress you in it.
        </p>
      </header>

      <nav className="my-8 flex flex-wrap gap-2">
        {CATEGORIES.map(({ slug, label }) => {
          const active = (slug === "all" && !searchParams.category) || slug === searchParams.category;
          const href = slug === "all" ? "/catalog" : `/catalog?category=${slug}`;
          return (
            <a
              key={slug}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                active
                  ? "bg-gradient-to-b from-accent2 to-accent3 text-bg shadow-btn"
                  : "border border-line bg-bg2 text-ink2 hover:border-accent/40 hover:text-ink"
              }`}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {products.length === 0 ? (
        <div className="surface p-12 text-center">
          <p className="text-2xl font-semibold text-ink">Nothing on the rail.</p>
          <p className="mt-2 text-sm text-ink3">
            Make sure the backend is running and the schema is seeded.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
