# Waste2Value — Supabase Infrastructure & Database Guide

This directory contains the database schema migrations, seed records, and security policies for the Waste2Value circular economy platform.

---

## 1. Quick Setup & Connecting Your Project

### A. Create a Supabase Project
1. Visit [database.new](https://database.new) and create a project (e.g. `waste2value`).
2. Go to **Project Settings -> API**.
3. Copy:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **anon / public key** (`eyJhbGciOi...`)

### B. Configure Client Environment
In the repository root, create `.env.local` (or configure your deployment environment variables):

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
VITE_USE_MOCK_SERVICES=false
```

---

## 2. Credentials Security Rules (CRITICAL)

| Key | Where to use? | Safe for Browser? |
|---|---|---|
| `anon` / `publishable` key | Client frontend (`VITE_SUPABASE_PUBLISHABLE_KEY`) | **YES** — Restricted by RLS policies |
| `service_role` secret | Backend scripts / CI only | **NEVER IN BROWSER** — Bypasses all RLS |
| Database connection password | Database CLI / Direct Postgres connection | **NEVER IN BROWSER** |

> [!CAUTION]
> The Supabase **`service_role`** key bypasses Row Level Security completely. NEVER add it to `.env.example`, Vite config, client files, or frontend repositories.

---

## 3. Running Database Migrations

### Using Supabase CLI (Recommended)
```bash
# Login to Supabase CLI
npx supabase login

# Link your remote project
npx supabase link --project-ref your-project-ref

# Push migrations to remote database
npx supabase db push
```

### Using Supabase SQL Editor
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open [0001_initial_schema.sql](file:///C:/Users/sujan/Downloads/a%20start/supabase/migrations/0001_initial_schema.sql).
3. Execute the script.

---

## 4. Row Level Security (RLS) Model

Security is enforced at the database level, not solely through frontend route guards.

### Table Permissions Matrix
| Table | SELECT | INSERT | UPDATE | DELETE | Security Rule |
|---|---|---|---|---|---|
| `profiles` | Own only | Own / Trigger | Own only | Cascade | `auth.uid() = id` |
| `items` | Own only | Own only | Own only | Own only | `auth.uid() = user_id` |
| `ai_assessments`| Own only | Own only | Own only | Own only | `auth.uid() = user_id` |
| `receivers` | Active only | Service role | Service role | Service role | Directory lookup: `is_active = true` |
| `handover_records`| Own only | Own only | Own only | Own only | `auth.uid() = user_id` |
| `impact_records`| Own only | Own / Trigger | Own only | Own only | `auth.uid() = user_id` |

---

## 5. Generating TypeScript Types

When schema modifications are introduced, regenerate types:

```bash
npx supabase gen types typescript --project-id your-project-ref > src/types/database.ts
```
