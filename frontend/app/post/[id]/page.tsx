export const metadata = { title: "Look · Fashinsta" };

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-20 sm:px-8">
      <p className="eyebrow">Look No. {params.id.slice(0, 6)}</p>
      <h1 className="mt-4 text-h1 font-semibold text-ink">
        Detail view — <span className="bg-gradient-to-r from-accent2 via-accent to-accent3 bg-clip-text text-transparent">coming soon</span>.
      </h1>
      <p className="mt-6 max-w-xl text-ink2">
        This page will show the full look, the garment list, likes and comments. The data is already
        in the schema — just needs the UI. A good starter task.
      </p>
      <a href="/" className="btn-ghost mt-8">← Back to home</a>
    </div>
  );
}
