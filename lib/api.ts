import props from "@/data/properties.json";
import site from "@/data/site.json";

export type Property = (typeof props)[number];
export type Paged<T> = { data: T[]; meta: { current_page: number; last_page: number; per_page: number; total: number } };
export type Query = Record<string, string | undefined>;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Stateless auth: call setAuthToken after login (Laravel Sanctum/Passport bearer token).
let token: string | null = null;
const getToken = () => token ?? (typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null);
export type User = { name: string; email: string; phone?: string };
export type AuthRes = { token: string; user: User };
export const setAuthToken = (t: string | null) => { token = t; };

async function http<T>(path: string, params?: Query, init: RequestInit = {}): Promise<T> {
  const qs = new URLSearchParams(Object.entries(params ?? {}).filter(([, v]) => v) as [string, string][]).toString();
  const res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ""}`, {
    ...init,
    credentials: "omit", // no cookies: stateless
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(process.env.NEXT_PUBLIC_API_KEY ? { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY } : {}),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

// ---- mock implementation (same response shapes as the Laravel API will return)
function mockList(q: Query): Paged<Property> {
  let r = [...props];
  const t = (q.q ?? "").toLowerCase();
  if (t) r = r.filter((p) => `${p.title} ${p.locality} ${p.city}`.toLowerCase().includes(t));
  if (q.type) r = r.filter((p) => p.type === q.type);
  if (q.purpose) r = r.filter((p) => p.purpose === q.purpose);
  if (q.city) r = r.filter((p) => p.city === q.city);
  if (q.beds) r = r.filter((p) => p.beds >= +q.beds!);
  if (q.min) r = r.filter((p) => p.price >= +q.min!);
  if (q.max) r = r.filter((p) => p.price <= +q.max!);
  if (q.featured) r = r.filter((p) => p.featured);
  const s = q.sort ?? "newest";
  r.sort((a, b) => s === "price_asc" ? a.price - b.price : s === "price_desc" ? b.price - a.price : s === "area_desc" ? b.area - a.area : b.created_at.localeCompare(a.created_at));
  const per = +(q.per_page ?? 9), page = Math.max(1, +(q.page ?? 1));
  return { data: r.slice((page - 1) * per, page * per), meta: { current_page: page, last_page: Math.max(1, Math.ceil(r.length / per)), per_page: per, total: r.length } };
}

// ---- public API: only this file changes when Laravel/Filament goes live.
// Expected endpoints: GET /properties, /stats, /testimonials, /property-types
export const api = {
  getProperties: async (q: Query = {}): Promise<Paged<Property>> => MOCK ? mockList(q) : http("/properties", q),
  getFeatured: async () => (MOCK ? mockList({ featured: "1", per_page: "6" }) : await http<Paged<Property>>("/properties", { featured: "1", per_page: "6" })).data,
  getLatest: async () => (MOCK ? mockList({ per_page: "6" }) : await http<Paged<Property>>("/properties", { sort: "newest", per_page: "6" })).data,
  getProperty: async (slug: string): Promise<Property | null> => MOCK ? props.find((p) => p.slug === slug) ?? null : (await http<{ data: Property }>(`/properties/${slug}`)).data,
  getByIds: async (ids: number[]): Promise<Property[]> => MOCK ? props.filter((p) => ids.includes(p.id)) : (await http<Paged<Property>>("/properties", { ids: ids.join(","), per_page: "50" })).data,
  // Auth (Laravel Sanctum token flow): POST /auth/login, /auth/register -> { token, user }; GET/PUT /me; POST /auth/logout
  login: async (b: { email: string; password: string }): Promise<AuthRes> => MOCK ? { token: "mock-token", user: { name: b.email.split("@")[0], email: b.email } } : http("/auth/login", undefined, { method: "POST", body: JSON.stringify(b) }),
  register: async (b: Record<string, string>): Promise<AuthRes> => MOCK ? { token: "mock-token", user: { name: b.name, email: b.email, phone: b.phone } } : http("/auth/register", undefined, { method: "POST", body: JSON.stringify(b) }),
  updateMe: async (b: Partial<User>): Promise<User> => MOCK ? (b as User) : http("/me", undefined, { method: "PUT", body: JSON.stringify(b) }),
  logout: async () => { if (!MOCK) await http("/auth/logout", undefined, { method: "POST" }).catch(() => {}); },
  getStats: async (): Promise<string[][]> => MOCK ? site.stats : http("/stats"),
  getTestimonials: async (): Promise<typeof site.testimonials> => MOCK ? site.testimonials : http("/testimonials"),
  getTypes: async (): Promise<{ type: string; count: number }[]> =>
    MOCK ? ["Apartment", "Villa", "Plot", "Commercial", "Penthouse", "Farmhouse"].map((type) => ({ type, count: props.filter((p) => p.type === type).length })) : http("/property-types"),
};

export const CITIES = ["Gandhinagar", "Ahmedabad", "Surat", "Vadodara"];
export const TYPES = ["Apartment", "Villa", "Plot", "Commercial", "Penthouse", "Farmhouse"];
export const price = (p: Property) => {
  const n = p.price, v = n >= 1e7 ? `${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `${(n / 1e5).toFixed(1)} L` : n.toLocaleString("en-IN");
  return `₹${v}${p.purpose === "rent" ? "/mo" : ""}`;
};
