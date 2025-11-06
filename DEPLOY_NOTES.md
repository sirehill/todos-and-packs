# Packs & Lists — Postgres Migration Notes

This package contains changes to run on Postgres in Vercel/Neon/Supabase.

## What changed
- **Prisma datasource** switched to `postgresql` with `DATABASE_URL` and `DIRECT_URL`.
- **package.json** now includes `prisma:migrate:deploy` and uses `prisma generate` on install/build.
- **Prisma singleton** added at `src/server/db.ts`.
- **Health check** added at `app/api/_health/db/route.ts` (Node runtime) to verify DB connectivity.
- Added `.env.example` entries for `DATABASE_URL` and `DIRECT_URL` (pooled vs non-pooled).

## Next steps (quick)
1. Create a Postgres database (Vercel Postgres / Neon / Supabase).
2. Set **Vercel → Project → Environment Variables**:
   - `DATABASE_URL` = pooled URL (`?pgbouncer=true&connection_limit=1&connect_timeout=5&sslmode=require`).
   - `DIRECT_URL` = non-pooled URL (`?sslmode=require`).
3. Locally (with `.env.local` set to the same URLs):
   ```bash
   npx prisma format
   npx prisma migrate dev -n init_postgres
   git add prisma package.json src/server/db.ts app/api/_health/db/route.ts .env.example DEPLOY_NOTES.md
   git commit -m "Postgres migration"
   git push
   npx prisma migrate deploy
   ```
4. Open `/api/_health/db` on the deployed site — you should see a JSON list of tables.
5. Remove any temporary “fallback” code paths now that DB is live (search for: `fallback`, `POSTGRES LIVE`).

## Notes
- Any route or server action that uses Prisma must run on **Node runtime**, not Edge. A few routes were auto-patched to export `runtime = "nodejs"`.
- If using NextAuth database sessions, ensure the default tables exist; otherwise set `session: { strategy: "jwt" }` in your auth config.
- For Supabase, use port `6543` for pooled connections; `5432` for direct.
