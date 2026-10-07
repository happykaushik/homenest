"use client";
import { useEffect, useState } from "react";
const KEY = "wishlist";
const read = (): number[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; } };
export function useWishlist() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => { setIds(read()); const f = () => setIds(read()); addEventListener("wishlist", f); return () => removeEventListener("wishlist", f); }, []);
  const toggle = (id: number) => {
    const n = read(); const next = n.includes(id) ? n.filter((x) => x !== id) : [...n, id];
    localStorage.setItem(KEY, JSON.stringify(next)); dispatchEvent(new Event("wishlist"));
  };
  return { ids, toggle };
}
