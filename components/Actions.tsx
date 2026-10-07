"use client";
import { Property } from "@/lib/api";
import { useWishlist } from "@/lib/wishlist";
export default function Actions({ p }: { p: Property }) {
  const { ids, toggle } = useWishlist(), saved = ids.includes(p.id);
  const share = async () => { const url = location.href; if (navigator.share) await navigator.share({ title: p.title, url }).catch(() => {}); else { await navigator.clipboard.writeText(url); alert("Link copied"); } };
  const b = "rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-ink/15";
  return <div className="flex gap-2"><button onClick={() => toggle(p.id)} aria-pressed={saved} className={b}>{saved ? "♥ Saved" : "♡ Save"}</button><button onClick={share} className={b}>↗ Share</button></div>;
}
