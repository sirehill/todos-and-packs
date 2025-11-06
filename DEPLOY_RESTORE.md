# Packs & Lists — Restored Features + Postgres (Merged)

This is a merge of:
- v0.19 (deployable on Vercel)
- v0.17 (feature-complete locally)

## Next steps
1. Ensure env vars on Vercel and in .env.local:
   - DATABASE_URL (Supabase pooled: port 6543 + sslmode=require&pgbouncer=true&connection_limit=1&connect_timeout=5)
   - DIRECT_URL (Supabase direct: port 5432 + sslmode=require)

2. Install and apply schema changes:
   npm install
   npx prisma format
   npx prisma migrate dev -n bring_back_features
   git add prisma
   git commit -m "bring_back_features"
   git push
   npx prisma migrate deploy

3. Verify deployment:
   - Visit /api/_health/db
   - Test Collections, Duplicates, CRUD
   - Confirm NextAuth (v5) works

Notes: secrets not included; use .env.local or Vercel Settings.
