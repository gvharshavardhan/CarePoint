# CarePoint

A fictional healthcare website and patient-management portfolio demo built with Next.js App Router, TypeScript, Tailwind CSS and Supabase.

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project (needed when we connect authentication and database features)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env.local
```

Open http://localhost:3000.

## Supabase environment

Set these values in `.env.local` using the Supabase project Connect panel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Never expose a Supabase secret/service-role key in browser code or commit `.env.local` to Git.

## Current scaffold

- Premium CarePoint public landing page shell
- Shared site header and footer
- Tailwind CSS v4 setup
- Supabase browser and server client utilities
- TypeScript, ESLint and Next.js configuration
- Environment variable template

## Important demo boundary

CarePoint uses fictional data and is not a real healthcare provider. Do not enter real patient information. No real appointments, diagnosis, prescriptions or clinical services are provided.

## Next development steps

1. Connect a Supabase project.
2. Review and approve the SQL schema and RLS policies before applying migrations.
3. Build public departments, doctors and appointment-request pages.
4. Implement patient authentication and portal.
5. Implement server-enforced admin role authorization and admin dashboard.
