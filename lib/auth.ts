"use client";
import { useEffect, useState } from "react";
import { User, setAuthToken } from "./api";
export const session = {
  get(): User | null { try { return JSON.parse(localStorage.getItem("auth_user") ?? "null"); } catch { return null; } },
  save(t: string, u: User) { localStorage.setItem("auth_token", t); localStorage.setItem("auth_user", JSON.stringify(u)); setAuthToken(t); dispatchEvent(new Event("auth")); },
  clear() { localStorage.removeItem("auth_token"); localStorage.removeItem("auth_user"); setAuthToken(null); dispatchEvent(new Event("auth")); },
};
// undefined = not checked yet, null = signed out
export function useUser() {
  const [u, setU] = useState<User | null | undefined>(undefined);
  useEffect(() => { const f = () => setU(session.get()); f(); addEventListener("auth", f); return () => removeEventListener("auth", f); }, []);
  return u;
}
