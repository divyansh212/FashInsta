import Image from "next/image";
import Link from "next/link";
import { FeedPost as FeedPostType } from "@/lib/api";

export function FeedPost({ post, featured = false }: { post: FeedPostType; featured?: boolean }) {
  return (
    <article className={featured ? "sm:col-span-2 sm:row-span-2" : ""}>
      <Link href={`/post/${post.id}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bg2 ring-1 ring-line transition group-hover:ring-accent/40">
          <Image
            src={post.image_url}
            alt={post.caption ?? "Look"}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink3">
              @{post.handle ?? "anon"}
            </p>
            {post.caption && (
              <p className="text-sm leading-snug text-ink line-clamp-2">
                {post.caption}
              </p>
            )}
          </div>
          <p className="font-mono text-xs text-ink3">♡ {post.like_count}</p>
        </div>
      </Link>
    </article>
  );
}
