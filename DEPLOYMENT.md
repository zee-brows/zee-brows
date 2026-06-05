# Zee Brows Vercel Deployment

This project contains two connected apps:

- Public website: `/`
- Admin dashboard: `/admin`

The admin dashboard edits the same content model used by the public website. In production, use Supabase for persistence and Supabase Storage or Cloudinary for media.

## 1. Install And Build Locally

```bash
npm install
npm run build
```

## 2. Supabase Setup

Create a Supabase project, then run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);
```

Create a public storage bucket named:

```text
zee-brows-media
```

If you choose a different bucket name, set `SUPABASE_STORAGE_BUCKET` to that name.

## 3. Vercel Environment Variables

Add these in Vercel Project Settings:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
```

Use `.env.example` as the template.

Important: keep `SUPABASE_SERVICE_ROLE_KEY` secret. It is used only in server route handlers for database and storage writes.

## 4. Admin Dashboard

Admin route:

```text
/admin
```

Login route:

```text
/admin/login
```

If an admin user is not logged in, middleware redirects `/admin` to `/admin/login`.

The login uses an HTTP-only cookie and the `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables.

## 5. Media Uploads

Admin uploads call:

```text
/api/upload
```

With Supabase env vars configured, images/videos are uploaded to Supabase Storage and public URLs are saved into the content model.

Without Supabase env vars, uploads fall back to inline data URLs for local development only. Do not rely on that fallback for production content.

Production image loading supports:

- Local files in `public/assets`
- Supabase Storage URLs under `*.supabase.co`
- Cloudinary URLs under `res.cloudinary.com`

## 6. Deploy To Vercel

Recommended flow:

```bash
git init
git add .
git commit -m "Prepare Zee Brows for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/zee-brows.git
git push -u origin main
```

Then import the repository in Vercel and add the environment variables above.

## 7. Production Notes

- `/api/content` reads and writes site content.
- `/api/admin/login` creates the admin session.
- `/api/admin/logout` clears the session.
- `/api/upload` stores media in Supabase Storage when configured.
- Public pages fetch the latest content through the API-backed content hook.
- SEO metadata reads from the production content repository at request time.
