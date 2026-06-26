# Supabase — Bob's Burger

## Quick setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and add your keys from **Project Settings → API**
3. Run migrations in the SQL editor (in order):
   - `migrations/001_initial_schema.sql`
   - `migrations/002_admin_auth_settings.sql`
   - `migrations/010_menu_banners.sql` (menu page hero carousel)
4. Seed the menu from the POS export:

```bash
npm run seed
```

5. Create your first admin user in **Authentication → Users → Add user** (email + password)
6. Confirm the user has a `profiles` row with `role = 'admin'` (auto-created by trigger on signup)
7. Start the app and sign in at `/admin/login`

## Admin panel

| Route | Purpose |
|-------|---------|
| `/admin/login` | Email/password sign-in |
| `/admin` | Dashboard overview |
| `/admin/categories` | Manage menu categories |
| `/admin/menu` | Manage items, prices, images, availability |
| `/admin/settings` | WhatsApp, hours, branding, delivery fee |

### Security

- **RLS** on all tables — public can read menu; only admins (`profiles.role`) can write
- **Middleware** protects `/admin/*` routes (except login)
- **Server actions** call `requireAdmin()` before any mutation
- **Storage** bucket `menu-images` — public read, admin-only upload

### Image uploads

Menu images upload to the `menu-images` Supabase Storage bucket. You can also paste an external image URL.

## Without Supabase

The site falls back to static data in `src/data/menu-extracted.json` and `src/data/restaurant.ts` when env vars are not set.

## Regenerate types

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/types.ts
```

## Auth callback URL

In Supabase **Authentication → URL Configuration**, set:

- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs**: `http://localhost:3000/auth/callback`
