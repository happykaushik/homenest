import Link from "next/link";
import { notFound } from "next/navigation";
import { api, price } from "@/lib/api";
import Actions from "@/components/Actions";
export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await api.getProperty(slug);
  if (!p) notFound();
  const thumbs = [2, 3].map((n) => `https://picsum.photos/seed/${p.slug}-${n}/600/400`);
  const facts = [p.beds && [`${p.beds}`, "Bedrooms"], p.baths && [`${p.baths}`, "Bathrooms"], [p.area.toLocaleString("en-IN"), "Sq ft"], [p.type, "Type"]].filter(Boolean) as string[][];
  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <nav className="text-sm text-ink/60"><Link href="/">Home</Link> / <Link href="/properties">Properties</Link> / {p.title}</nav>
      <div className="mt-4 grid gap-3 md:grid-cols-[3fr_1fr]">
        <img src={p.image} alt={p.title} className="h-72 w-full rounded-2xl object-cover md:h-[420px]" />
        <div className="hidden gap-3 md:grid">{thumbs.map((t) => <img key={t} src={t} alt="" className="h-[204px] w-full rounded-2xl object-cover" />)}</div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h1 className="font-display text-4xl">{p.title}</h1><p className="mt-1 text-ink/60">{p.locality}, {p.city}</p></div>
            <Actions p={p} />
          </div>
          <p className="mt-4 font-display text-4xl text-pine">{price(p)} <span className="ml-2 rounded bg-mist px-2 py-1 align-middle font-sans text-xs">{p.purpose === "rent" ? "For rent" : "For sale"}</span></p>
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink/10 sm:grid-cols-4">
            {facts.map(([v, l]) => <div key={l}><p className="font-medium">{v}</p><p className="text-sm text-ink/60">{l}</p></div>)}
          </div>
          <h2 className="mt-8 font-display text-2xl">About this property</h2>
          <p className="mt-2 max-w-2xl text-ink/75">A well-kept {p.type.toLowerCase()} in {p.locality}, {p.city}, close to schools, hospitals and daily shopping. Documents are verified and a visit can be arranged this week.</p>
          <h2 className="mt-8 font-display text-2xl">Key highlights</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">{["Prime location", "Verified title", "Gated community", "24/7 security", "Covered parking", "Ready to move"].map((h) => <li key={h} className="text-ink/75">✓ {h}</li>)}</ul>
        </div>
        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-ink/10 lg:sticky lg:top-24">
          <h2 className="font-medium">Contact agent</h2>
          <p className="mt-3">{p.agent}</p><p className="text-sm text-ink/60">Property consultant</p>
          <a href="tel:+910000000000" className="mt-4 block text-sm">+91 00000 00000</a>
          <button className="mt-4 h-11 w-full rounded-lg bg-pine font-medium text-white">Message agent</button>
        </aside>
      </div>
    </main>
  );
}
