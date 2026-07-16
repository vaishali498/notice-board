# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and a hosted PostgreSQL database, deployed on Render.

- **Live app:** https://notice-board-pwop.onrender.com/
## Features

- List all notices as responsive cards (phone and desktop)
- Create and edit notices through a single shared form
- Delete with a confirmation dialog
- Urgent notices always sort above Normal notices — ordering is done in the Prisma query (`orderBy`), not in the browser
- All writes go through API routes under `pages/api/notices/`, with validation enforced server-side (never trusting the client)
- Data persists in a hosted database and survives refreshes and redeploys

## Tech stack

- **Framework:** Next.js 14, Pages Router
- **Database access:** Prisma ORM
- **Database:** hosted PostgreSQL (Neon free tier)
- **Styling:** Tailwind CSS
- **Hosting:** Render (free tier)

## Running locally

1. Clone the repo and install dependencies:
```bash
   git clone <this-repo-url>
   cd notice-board
   npm install
```

2. Create a free hosted Postgres database on [Neon](https://neon.tech) and copy `.env.example` to `.env`:
```bash
   cp .env.example .env
```
   Fill in `DATABASE_URL` with your real connection string.

3. Push the schema to your database:
```bash
   npx prisma db push
```

4. Run the dev server:
```bash
   npm run dev
```
   Open [http://localhost:3000](http://localhost:3000).

### Database setup

This project is configured for **PostgreSQL** (`prisma/schema.prisma` → `provider = "postgresql"`), matching Neon's free serverless tier. If you use a MySQL provider instead (TiDB Cloud), change that line to `provider = "mysql"` before running `prisma db push`.

Either way, no local database file is used — a local SQLite file resets on every redeploy, so a hosted DB is required for data to persist.

## Deploying (Render)

1. Push this repo to a public GitHub repository.
2. Create a new Web Service on [Render](https://render.com) and connect the repo.
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm start`
5. Add an environment variable `DATABASE_URL` in Render's Environment settings, using the same hosted database connection string.
6. Deploy. Render automatically installs dependencies and builds the app.
7. Make sure `npx prisma db push` has been run at least once against the same database so the table exists.

## Design decisions (left open by the spec)

- **Normal notice ordering:** sorted by `publishDate` descending (newest first) within each priority tier.
- **Image field:** implemented as a plain image URL input rather than a file upload, since file uploads need a storage service (S3/Cloudinary) with its own account and free-tier setup. Any hosted image link (e.g. Imgur) works.
- **Delete:** uses a custom in-app confirmation modal rather than the browser's native `confirm()`, for a more consistent look across devices.

## What I'd improve with more time

Add real image upload (via a free-tier storage bucket) instead of a pasted URL, plus optimistic UI updates on the list page so create/edit/delete feel instant instead of waiting for a full round trip.

