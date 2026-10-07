import Link from "next/link";
import { api, CITIES, TYPES } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

const sel = "h-12 rounded-lg border border-ink/15 bg-white px-3 text-ink";
const trust = [["Verified titles", "Every listing's documents are checked before it goes live."], ["Honest pricing", "Valuations come from recent local sales, not wishful asking prices."], ["One point of contact", "A single advisor from first viewing to registration."], ["Paperwork handled", "Stamp duty, registry and loan paperwork, done for you."]];

export default async function Home() {
  const [featured, latest, types, stats, reviews] = await Promise.all([api.getFeatured(), api.getLatest(), api.getTypes(), api.getStats(), api.getTestimonials()]);
  return (
    <main>
      <section className="relative flex min-h-[640px] items-end bg-ink pb-16 pt-24 text-white">
        <img src="https://picsum.photos/seed/hero-home/1800/1000" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative mx-auto w-full max-w-7xl px-5">
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">Find the home you will still love in ten years.</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">Homes, plots and commercial space across Gandhinagar, Ahmedabad, Surat and Vadodara.</p>
          <form action="/properties" className="mt-8 grid gap-3 rounded-2xl bg-white/95 p-4 text-ink shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <select name="purpose" className={sel} aria-label="Buy or rent"><option value="sale">Buy</option><option value="rent">Rent</option></select>
            <select name="type" className={sel} aria-label="Property type"><option value="">Any type</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            <select name="city" className={sel} aria-label="City"><option value="">Any city</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
            <input name="q" placeholder="Locality or project" className={sel} />
            <button className="h-12 rounded-lg bg-brass px-8 font-semibold text-white hover:brightness-110">Search homes</button>
          </form>
        </div>
      </section>

      <Section title="Featured properties" link="/properties?featured=1"><Grid items={featured} /></Section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="font-display text-3xl">Browse by type</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {types.map((t) => (
            <Link key={t.type} href={`/properties?type=${t.type}`} className="rounded-xl bg-mist p-5 transition hover:bg-pine hover:text-white">
              <p className="font-display text-xl">{t.type}</p><p className="text-sm opacity-70">{t.count} listings</p>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Latest listings" link="/properties?sort=newest"><Grid items={latest} /></Section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-4xl">Why buyers and sellers stay with us</h2>
          <div className="grid gap-8 sm:grid-cols-2">{trust.map(([h, d]) => <div key={h}><h3 className="font-medium text-pine">{h}</h3><p className="mt-1 text-ink/70">{d}</p></div>)}</div>
        </div>
      </section>

      <section className="bg-pine py-14 text-white"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4">
        {stats.map(([n, l]) => <div key={l}><p className="font-display text-4xl">{n}</p><p className="text-sm text-white/70">{l}</p></div>)}
      </div></section>

      <section className="bg-mist py-16"><div className="mx-auto max-w-7xl px-5">
        <h2 className="font-display text-3xl">In their words</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => <figure key={r.name} className="rounded-xl bg-white p-6"><blockquote>{r.text}</blockquote><figcaption className="mt-4 text-sm"><b>{r.name}</b><br /><span className="text-ink/60">{r.role}</span></figcaption></figure>)}
        </div>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink p-10 text-white md:flex-row md:items-center">
          <div><h2 className="font-display text-3xl">Selling a property?</h2><p className="mt-2 text-white/70">Get a free, honest valuation within 48 hours.</p></div>
          <Link href="/sell-property" className="rounded-full bg-brass px-7 py-3 font-semibold text-white">List your property</Link>
        </div>
      </section>
    </main>
  );
}
function Section({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
  return <section className="mx-auto max-w-7xl px-5 py-16"><div className="mb-6 flex items-end justify-between"><h2 className="font-display text-3xl">{title}</h2><Link href={link} className="text-sm underline">See all</Link></div>{children}</section>;
}
function Grid({ items }: { items: Awaited<ReturnType<typeof api.getFeatured>> }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <PropertyCard key={p.id} p={p} />)}</div>;
}
