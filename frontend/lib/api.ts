// Typed client for the FastAPI backend.
// Server components can pass a raw access token from cookies; client components
// pull it from the Supabase session.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ProductCategory =
  | "top" | "bottom" | "dress" | "outerwear" | "accessory" | "footwear";

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: ProductCategory;
  price_cents: number;
  currency: string;
  image_url: string;
  cover_url: string | null;
  description: string | null;
  tags: string[];
  in_stock: boolean;
  created_at: string;
}

export interface FeedPost {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  product_ids: string[];
  created_at: string;
  handle: string | null;
  display_name: string | null;
  avatar_url: string | null;
  like_count: number;
}

export interface TryOn {
  id: string;
  user_id: string;
  product_id: string;
  person_image_url: string;
  result_image_url: string | null;
  status: "pending" | "processing" | "done" | "failed";
  error_message: string | null;
  created_at: string;
  finished_at: string | null;
}

async function req<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.token) headers["Authorization"] = `Bearer ${init.token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    let detail = res.statusText;
    try { detail = (await res.json()).detail ?? detail; } catch {}
    throw new Error(`${res.status} ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  products: {
    list: (params?: { category?: ProductCategory; q?: string; limit?: number }) => {
      const usp = new URLSearchParams();
      if (params?.category) usp.set("category", params.category);
      if (params?.q) usp.set("q", params.q);
      if (params?.limit) usp.set("limit", String(params.limit));
      const qs = usp.toString();
      return req<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
    },
    get: (id: string) => req<Product>(`/api/products/${id}`),
  },
  feed: {
    list: (limit = 20) => req<FeedPost[]>(`/api/feed?limit=${limit}`),
  },
  tryon: {
    create: (token: string, body: { product_id: string; person_image_url: string }) =>
      req<TryOn>("/api/tryon", { method: "POST", token, body: JSON.stringify(body) }),
    get: (token: string, id: string) =>
      req<TryOn>(`/api/tryon/${id}`, { token }),
  },
};

export const formatPrice = (cents: number, currency = "INR") => {
  const value = cents / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
};
