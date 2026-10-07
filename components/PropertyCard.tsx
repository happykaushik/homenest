"use client";
import Link from "next/link";
import { Property, price } from "@/lib/api";
import { useWishlist } from "@/lib/wishlist";

export default function PropertyCard({ p, list = false }: { p: Property; list?: boolean }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(p.id);
  const share = async () => {
    const url = `${location.origin}/properties/${p.slug}`;
    if (navigator.share) await navigator.share({ title: p.title, url }).catch(() => {});
    else { await navigator.clipboard.writeText(url); alert("Link copied"); }
  };
  const btn = "grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white";
  return (
    <article className={`overflow-hidden rounded-xl bg-white ring-1 ring-ink/10 ${list ? "flex flex-col sm:flex-row" : "flex flex-col"}`}>
      <div className={`relative ${list ? "sm:w-80 sm:shrink-0" : ""}`}>
        <img src={p.image} alt={p.title} loading="lazy" className={`w-full object-cover ${list ? "h-56 sm:h-full" : "h-52"}`} />
        <span className="absolute left-3 top-3 rounded bg-white px-2 py-0.5 text-xs font-medium text-ink">{p.purpose === "rent" ? "For rent" : "For sale"}</span>
        <div className="absolute right-3 top-3 flex gap-2">
          <button onClick={share} aria-label="Share property" className={btn}>↗</button>
          <button onClick={() => toggle(p.id)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} className={`${btn} ${saved ? "text-red-600" : ""}`}>{saved ? "♥" : "♡"}</button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-2xl text-pine">{price(p)}</p>
        <Link href={`/properties/${p.slug}`} className="mt-1 font-medium hover:underline">{p.title}</Link>
        <p className="mb-3 text-sm text-ink/60">{p.locality}, {p.city} · {p.type}</p>
        <div className="mt-auto flex gap-4 border-t border-ink/10 pt-3 text-sm text-ink/70">
          {p.beds > 0 && <span>{p.beds} bed</span>}{p.baths > 0 && <span>{p.baths} bath</span>}<span>{p.area.toLocaleString("en-IN")} sq ft</span>
        </div>
      </div>
    </article>
  );
}
