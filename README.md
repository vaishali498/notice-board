# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and a hosted MySQL/Postgres database, deployed on Vercel.

- **Live app:** _add your Vercel URL here after deploying_
- **Repo:** _this repository_

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
- **Database:** any free hosted MySQL/Postgres (developed against TiDB Cloud / Neon)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (Hobby/free tier)

## Running locally

1. Clone the repo and install dependencies:
   ```bash
   git clone <this-repo-url>
   cd notice-board
   npm install
   ```

2. Create a free hosted database (see "Database setup" below) and copy `.env.example` to `.env`:
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

This project ships configured for **MySQL** (`prisma/schema.prisma` → `provider = "mysql"`), matching TiDB Cloud's free serverless tier. If you use a Postgres provider instead (Neon, Supabase), change that line to `provider = "postgresql"` before running `prisma db push`.

Either way, no local database file is used — a local SQLite file resets on every Vercel deploy, so a hosted DB is required for data to persist.

## Deploying

1. Push this repo to a public GitHub repository.
2. Import the repo into [Vercel](https://vercel.com).
3. Add an environment variable `DATABASE_URL` in the Vercel project settings, using the same hosted database connection string.
4. Deploy. Vercel runs `prisma generate` automatically via the `postinstall` script.
5. Make sure `npx prisma db push` has been run at least once against the same database so the table exists.

## Design decisions (left open by the spec)

- **Normal notice ordering:** sorted by `publishDate` descending (newest first) within each priority tier.
- **Image field:** implemented as a plain image URL input rather than a file upload, since file uploads need a storage service (S3/Cloudinary) with its own account and free-tier setup, which felt out of scope for the assignment's time budget. Any hosted image link (e.g. Imgur) works.
- **Delete:** uses a custom in-app confirmation modal rather than the browser's native `confirm()`, for a more consistent look across devices.

## What I'd improve with more time

Add real image upload (via a free-tier storage bucket) instead of a pasted URL, plus optimistic UI updates on the list page so create/edit/delete feel instant instead of waiting for a full round trip.

## Where and how AI was used

I used Claude to scaffold the project structure (Prisma schema, API routes, form and card components) and to write the server-side validation logic, based on the requirements in this assignment document. I reviewed and understood the generated code, tested CRUD flows locally, and made adjustments to [describe anything you changed — e.g. styling tweaks, field defaults, wording]. I did not use AI to write this README's design-decision reasoning without reviewing it myself.

_(Edit this section honestly to reflect what you actually did before submitting — the assignment specifically evaluates this for accuracy.)_
