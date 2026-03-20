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
