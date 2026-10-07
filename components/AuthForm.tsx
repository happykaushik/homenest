"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { session } from "@/lib/auth";
const inp = "h-11 w-full rounded-lg border border-ink/15 bg-white px-3";
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(), reg = mode === "register";
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (reg && f.password !== f.password_confirmation) return setErr("Passwords do not match.");
    setBusy(true);
    try { const r = reg ? await api.register(f) : await api.login({ email: f.email, password: f.password }); session.save(r.token, r.user); router.push("/account"); }
    catch { setErr(reg ? "We couldn't create your account. Check your details and try again." : "Email or password is incorrect."); }
    finally { setBusy(false); }
  }
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-14">
      <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-2xl bg-white p-8 ring-1 ring-ink/10">
        <h1 className="font-display text-3xl">{reg ? "Create your account" : "Welcome back"}</h1>
        <p className="text-sm text-ink/60">{reg ? "Save homes, track enquiries and list your property." : "Log in to see your saved homes and enquiries."}</p>
        {reg && <input name="name" required placeholder="Full name" autoComplete="name" className={inp} />}
        <input name="email" type="email" required placeholder="Email" autoComplete="email" className={inp} />
        {reg && <input name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" className={inp} />}
        <input name="password" type="password" required minLength={8} placeholder="Password" autoComplete={reg ? "new-password" : "current-password"} className={inp} />
        {reg && <input name="password_confirmation" type="password" required minLength={8} placeholder="Confirm password" autoComplete="new-password" className={inp} />}
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="h-11 rounded-lg bg-pine font-medium text-white disabled:opacity-60">{busy ? "Please wait…" : reg ? "Create account" : "Log in"}</button>
        <p className="text-sm text-ink/60">{reg ? <>Already registered? <Link href="/login" className="underline">Log in</Link></> : <>New here? <Link href="/register" className="underline">Create an account</Link></>}</p>
      </form>
    </main>
  );
}
