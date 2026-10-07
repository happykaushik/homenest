"use client";
import Link from "next/link";
import { useUser } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";
export default function AuthNav() {
  const u = useUser(), { ids } = useWishlist();
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/favorites">Saved{ids.length > 0 && ` (${ids.length})`}</Link>
      {u ? <Link href="/account" className="rounded-lg bg-pine px-4 py-2 font-medium text-white">{u.name}</Link>
        : <Link href="/login" className="rounded-lg bg-pine px-4 py-2 font-medium text-white">Login / Sign up</Link>}
    </div>
  );
}
