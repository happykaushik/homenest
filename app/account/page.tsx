"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { session, useUser } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";
const inp = "h-11 w-full rounded-lg border border-ink/15 bg-white px-3";
export default function Account() {
  const u = useUser(), router = useRouter(), { ids } = useWishlist(), [msg, setMsg] = useState("");
  useEffect(() => { if (u === null) router.replace("/login"); }, [u, router]);
  if (!u) return <p className="p-20 text-center text-ink/60">Loading…</p>;
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as { name: string; phone: string };
    try { const n = await api.updateMe(f); session.save(localStorage.getItem("auth_token") ?? "", { ...u!, ...n }); setMsg("Profile saved."); } catch { setMsg("Couldn't save. Try again."); }
  }
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-[1fr_280px]">
      <section className="rounded-2xl bg-white p-8 ring-1 ring-ink/10">
        <h1 className="font-display text-3xl">My account</h1>
        <form onSubmit={save} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm">Full name<input name="name" defaultValue={u.name} required className={inp} /></label>
          <label className="grid gap-1 text-sm">Email<input value={u.email} readOnly className={`${inp} bg-mist`} /></label>
          <label className="grid gap-1 text-sm">Phone<input name="phone" defaultValue={u.phone ?? ""} className={inp} /></label>
          <div className="flex items-center gap-4"><button className="h-11 rounded-lg bg-pine px-6 font-medium text-white">Save changes</button><span role="status" className="text-sm text-ink/60">{msg}</span></div>
        </form>
      </section>
      <aside className="grid content-start gap-3">
        <Link href="/favorites" className="rounded-2xl bg-white p-5 ring-1 ring-ink/10"><p className="font-display text-3xl text-pine">{ids.length}</p><p className="text-sm text-ink/60">Saved properties</p></Link>
        <Link href="/sell-property" className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">List a property</Link>
        <button onClick={async () => { await api.logout(); session.clear(); router.push("/"); }} className="rounded-2xl bg-white p-5 text-left ring-1 ring-ink/10">Log out</button>
      </aside>
    </main>
  );
}
