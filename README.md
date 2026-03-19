# Twist Website

Monorepo for the Twist marketplace migration from Supabase runtime dependencies to a custom backend on Google Cloud.

## Project Structure

- `frontend/` - Vite + React + TypeScript client app
- `backend/` - Express + TypeScript API server
- `backend/prisma/` - Prisma schema and database layer
- `images/` - local image source assets used during migration/import

## Local Development

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_BASE_URL` (Cloud Run API URL or local API URL)
3. Run:

```bash
cd frontend
npm install
npm run dev
```

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Configure DB/JWT/GCS variables
3. Run:

```bash
cd backend
npm install
npm run dev
```

## Deployment Notes

- Backend deploy target: Google Cloud Run
- Database: Cloud SQL PostgreSQL (via Prisma)
- Assets: Google Cloud Storage
- Frontend can be deployed to Firebase Hosting or another static host

## Data Hygiene

Migration/export files such as `database-items.csv`, `database-profiles.csv`, and `image-manifest.csv` are intentionally ignored at repo root and should be kept outside version control after import is complete.
