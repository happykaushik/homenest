"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Property } from "@/lib/api";
import { useWishlist } from "@/lib/wishlist";
import PropertyCard from "@/components/PropertyCard";
export default function Favorites() {
  const { ids } = useWishlist(), [items, setItems] = useState<Property[] | null>(null), [tab, setTab] = useState("");
  const key = ids.join(",");
  useEffect(() => { ids.length ? api.getByIds(ids).then(setItems) : setItems([]); }, [key]); // eslint-disable-line
  const shown = (items ?? []).filter((p) => !tab || p.purpose === tab);
  const n = (k: string) => (items ?? []).filter((p) => !k || p.purpose === k).length;
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="font-display text-4xl">My favorites</h1>
      <p className="mt-1 text-ink/60">Your saved properties are here. Keep track of the homes you love.</p>
      <div className="mt-6 flex gap-2 text-sm">
        {[["", "All"], ["sale", "For sale"], ["rent", "For rent"]].map(([k, l]) => <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)} className={`rounded-lg px-4 py-2 ${tab === k ? "bg-pine text-white" : "bg-white ring-1 ring-ink/15"}`}>{l} ({n(k)})</button>)}
      </div>
      {items && shown.length === 0
        ? <p className="py-20 text-center text-ink/60">Nothing saved here yet. <Link href="/properties" className="underline">Browse properties</Link></p>
        : <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p) => <PropertyCard key={p.id} p={p} />)}</div>}
    </main>
  );
}
