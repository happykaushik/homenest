"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api, CITIES, TYPES, Paged, Property } from "@/lib/api";
import PropertyCard from "./PropertyCard";

const inp = "h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm";
const PRICES: [string, string, string][] = [["Any price", "", ""], ["Under ₹50 L", "", "5000000"], ["₹50 L – 1 Cr", "5000000", "10000000"], ["₹1 – 3 Cr", "10000000", "30000000"], ["Above ₹3 Cr", "30000000", ""]];

export default function Listing() {
  const sp = useSearchParams(), router = useRouter(), path = usePathname();
  const [res, setRes] = useState<Paged<Property> | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const key = sp.toString();
  const [kw, setKw] = useState(sp.get("q") ?? "");
  useEffect(() => { setRes(null); setKw(sp.get("q") ?? ""); api.getProperties(Object.fromEntries(sp.entries())).then(setRes); }, [key]); // eslint-disable-line

  const set = (patch: Record<string, string>) => {
    const n = new URLSearchParams(key);
    Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    if (!("page" in patch)) n.delete("page");
    router.push(`${path}?${n}`, { scroll: false });
  };
  const sel = (k: string, label: string, opts: string[]) => (
    <label className="grid gap-1 text-xs text-ink/60">{label}
      <select value={sp.get(k) ?? ""} onChange={(e) => set({ [k]: e.target.value })} className={inp}>
        <option value="">Any</option>{opts.map((o) => <option key={o}>{o}</option>)}
      </select></label>
  );
  const chip = (label: string, k: string, v: string) => {
    const on = sp.get(k) === v;
    return <button key={label} aria-pressed={on} onClick={() => set({ [k]: on ? "" : v })} className={`rounded-full px-4 py-1.5 text-sm ${on ? "bg-pine text-white" : "bg-mist text-ink/80"}`}>{label}</button>;
  };
  const priceIdx = Math.max(0, PRICES.findIndex(([, a, b]) => a === (sp.get("min") ?? "") && b === (sp.get("max") ?? "")));
  const page = res?.meta.current_page ?? 1, last = res?.meta.last_page ?? 1;
  const pages = Array.from({ length: last }, (_, i) => i + 1).filter((n) => n === 1 || n === last || Math.abs(n - page) <= 1);

  return (
    <main>
      <div className="bg-white pb-6 pt-12"><div className="mx-auto max-w-7xl px-5">
        <h1 className="font-display text-4xl">Find your ideal property</h1>
        <p className="mt-1 max-w-xl text-ink/60">Explore the best properties for sale and rent. Use filters to narrow down your search.</p>
        <form onSubmit={(e) => { e.preventDefault(); set({ q: kw }); }} className="mt-6 grid items-end gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
          <label className="grid gap-1 text-xs text-ink/60">Keyword<input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="Locality or project" className={inp} /></label>
          {sel("city", "Location", CITIES)}
          {sel("type", "Property type", TYPES)}
          <label className="grid gap-1 text-xs text-ink/60">Price range
            <select value={priceIdx} onChange={(e) => { const [, min, max] = PRICES[+e.target.value]; set({ min, max }); }} className={inp}>{PRICES.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></label>
          <button className="h-11 rounded-lg bg-pine px-8 font-medium text-white">Search</button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chip("For sale", "purpose", "sale")}{chip("For rent", "purpose", "rent")}{chip("3+ beds", "beds", "3")}{chip("Featured", "featured", "1")}
          {key && <button onClick={() => router.push(path)} className="ml-2 text-sm underline">Clear all</button>}
        </div>
      </div></div>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/60">{res ? `Showing ${res.data.length} of ${res.meta.total} properties` : "Loading…"}</p>
          <div className="flex items-center gap-3">
            <select aria-label="Sort" value={sp.get("sort") ?? "newest"} onChange={(e) => set({ sort: e.target.value })} className={`${inp} !h-10 !w-auto`}>
              <option value="newest">Sort: Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="area_desc">Largest area</option>
            </select>
            <div className="flex overflow-hidden rounded-lg ring-1 ring-ink/15" role="group" aria-label="View">
              {(["grid", "list"] as const).map((v) => <button key={v} aria-pressed={view === v} onClick={() => setView(v)} className={`px-4 py-2 text-sm ${view === v ? "bg-pine text-white" : "bg-white"}`}>{v === "grid" ? "Grid" : "List"}</button>)}
            </div>
          </div>
        </div>
        {!res ? <p className="py-20 text-center text-ink/60">Loading properties…</p>
          : res.data.length === 0 ? <p className="py-20 text-center">No properties match these filters. <button className="underline" onClick={() => router.push(path)}>Clear filters</button></p>
          : <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-5"}>{res.data.map((p) => <PropertyCard key={p.id} p={p} list={view === "list"} />)}</div>}
        {last > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
            <button disabled={page <= 1} onClick={() => set({ page: String(page - 1) })} className="rounded-lg bg-white px-3 py-2 ring-1 ring-ink/15 disabled:opacity-40">Previous</button>
            {pages.map((n, i) => <span key={n} className="contents">{i > 0 && n - pages[i - 1] > 1 && <span>…</span>}
              <button aria-current={n === page} onClick={() => set({ page: String(n) })} className={`h-9 w-9 rounded-lg ${n === page ? "bg-pine text-white" : "bg-white ring-1 ring-ink/15"}`}>{n}</button></span>)}
            <button disabled={page >= last} onClick={() => set({ page: String(page + 1) })} className="rounded-lg bg-white px-3 py-2 ring-1 ring-ink/15 disabled:opacity-40">Next</button>
          </nav>
        )}
      </section>
    </main>
  );
}
