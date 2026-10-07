"use client";
import { useState } from "react";
import { api, CITIES, TYPES } from "@/lib/api";

const inp = "h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm";
const lab = "grid gap-1 text-sm";

export default function SellProperty() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f: Record<string, string> = {};
    new FormData(e.currentTarget).forEach((v, k) => { f[k] = String(v); });
    setState("busy");
    try { await api.submitListing(f); setState("done"); } catch { setState("error"); }
  }

  if (state === "done")
    return (
      <main className="mx-auto grid max-w-xl place-items-center px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Thank you!</h1>
        <p className="mt-3 text-ink/70">We have received your property details. An advisor will call you within 48 hours with a free valuation.</p>
      </main>
    );

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl">Sell your property</h1>
      <p className="mt-2 text-ink/60">Tell us about your property and get an honest valuation within 48 hours.</p>

      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-ink/10 sm:grid-cols-2 sm:p-8">
        <label className={lab}>Your name<input name="name" required autoComplete="name" className={inp} /></label>
        <label className={lab}>Phone<input name="phone" type="tel" required autoComplete="tel" className={inp} /></label>
        <label className={`${lab} sm:col-span-2`}>Email<input name="email" type="email" required autoComplete="email" className={inp} /></label>

        <label className={lab}>Property type
          <select name="type" required className={inp}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className={lab}>Listing for
          <select name="purpose" className={inp}><option value="sale">Sale</option><option value="rent">Rent</option></select></label>

        <label className={lab}>City
          <select name="city" required className={inp}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className={lab}>Locality<input name="locality" required className={inp} /></label>

        <label className={lab}>Area (sq ft)<input name="area" type="number" min="1" required className={inp} /></label>
        <label className={lab}>Bedrooms<input name="beds" type="number" min="0" className={inp} /></label>
        <label className={`${lab} sm:col-span-2`}>Expected price (₹)<input name="expected_price" type="number" min="1" className={inp} /></label>
        <label className={`${lab} sm:col-span-2`}>Description
          <textarea name="description" rows={4} className="w-full rounded-lg border border-ink/15 bg-white p-3 text-sm" /></label>

        {state === "error" && <p role="alert" className="text-sm text-red-700 sm:col-span-2">Something went wrong. Please try again.</p>}
        <button disabled={state === "busy"} className="h-11 rounded-lg bg-pine font-medium text-white disabled:opacity-60 sm:col-span-2">
          {state === "busy" ? "Sending…" : "Request free valuation"}
        </button>
      </form>
    </main>
  );
}