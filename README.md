# Twist Website

Twist marketplace monorepo.

## Structure

- `frontend/` - Vite, React, TypeScript
- `backend/` - Express, TypeScript, Prisma
- `backend/prisma/` - database schema

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Copy `.env.example` to `.env` in both `frontend/` and `backend/` before running.

## Deployment

- API: Google Cloud Run
- Database: Cloud SQL (PostgreSQL)
- Object storage: Google Cloud Storage
- Frontend: Firebase Hosting (or equivalent static hosting)

## First admin account (no SQL)

The API can create or promote the **first** `ADMIN` when **no admin exists yet**, using environment variables on the backend:

1. In **Cloud Run** (or `backend/.env` locally), set:
   - `BOOTSTRAP_ADMIN_EMAIL` — your email (e.g. `you@domain.com`)
   - `BOOTSTRAP_ADMIN_PASSWORD` — password **≥ 8 characters** (only needed if that email is **not** already registered; if the user exists, they are **promoted** to admin and the password is unchanged)
2. Deploy / restart the API and check logs for `[bootstrap] created...` or `[bootstrap] promoted...`.
3. Log in on the website with that email and password (same as normal login).
4. Open **`/admin/users`** (use this path on your site, e.g. `https://yoursite.vercel.app/admin/users`).

After the first admin exists, bootstrap does nothing. You can unset the bootstrap env vars.

**If `/admin/users` shows “Not Found” on Vercel:** ensure `frontend/vercel.json` is deployed (SPA rewrite to `index.html`).

## More admin users

**From the UI:** log in as `ADMIN` → **Admin → Users** → **Create user** (password ≥ 8 characters).

**CLI against the DB** (optional):

```bash
cd backend
npm run script:create-user -- qa.twist.test@example.com "YourPass123" BUYER
```
