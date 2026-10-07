# HomeNest — Next.js (App Router) + Tailwind v4
    npm install && cp .env.example .env.local && npm run dev
Pages: `/` and `/properties`. All data access lives in `lib/api.ts`.
Go live: set `NEXT_PUBLIC_USE_MOCK=false` and `NEXT_PUBLIC_API_URL` to the Laravel API.
Expected: `GET /properties` (q,type,purpose,city,beds,min,max,sort,page,per_page,featured) returning `{data:[...],meta:{current_page,last_page,per_page,total}}`; plus `/stats`, `/testimonials`, `/property-types`.
Headers sent: Accept, Content-Type, X-Requested-With, `Authorization: Bearer <token>` (via `setAuthToken`), optional `X-API-Key`. No cookies (stateless).
