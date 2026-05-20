import { Suspense } from "react";
import { TryOnStudio } from "@/components/TryOnStudio";

export const metadata = { title: "Try-On · Fashinsta" };

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1280px] px-6 py-20 text-center text-ink3">Loading the studio…</div>}>
      <TryOnStudio />
    </Suspense>
  );
}
