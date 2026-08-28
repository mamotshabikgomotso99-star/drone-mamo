# KM Drone Services

> **Precision agriculture. Smarter farming. Better results.**
> A premium agricultural drone services platform for South African farmers.

A full-stack Next.js 16 + TypeScript application for KM Drone Services — including a marketing website, customer & admin dashboards, an authenticated booking workflow with farm-mapping, a flexible pricing engine, transactional email, and a production-ready Vercel deployment.

---

## What's in the box

| Module | Description |
|---|---|
| **Marketing site** | Hero, services, technology, pricing, case studies, FAQ, contact |
| **Authentication** | Email + password (NextAuth v5), password reset, role-based access |
| **Booking system** | 9-step booking flow with map pin, farm boundary, pricing engine |
| **Customer dashboard** | Bookings, profile, notifications, farm info |
| **Admin dashboard** | Bookings, customers, services, pricing, drones, team, analytics |
| **Pricing engine** | Fixed / per-hectare / custom quote models |
| **Email** | Booking confirmations, status updates, welcome email (Resend) |
| **Database** | PostgreSQL via Drizzle ORM (Neon / Vercel Postgres / Supabase) |
| **Security** | Server-side auth, bcrypt, RBAC, CSRF, validation, audit logging |
| **SEO** | Metadata, OG, sitemap, robots, JSON-LD structured data |
| **A11y** | Semantic HTML, keyboard nav, focus states, reduced-motion |

---

## Tech stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: NextAuth v5 (credentials) + bcrypt
- **Email**: Resend (with console fallback)
- **Maps**: Leaflet + OpenStreetMap (no API key required)
- **Charts**: Recharts
- **Validation**: Zod
- **Hosting**: Vercel

---

## Project structure

```
km-drone-services/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages
│   ├── (auth)/             # Login, register, password reset
│   ├── (customer)/         # Customer dashboard
│   ├── (admin)/            # Admin dashboard
│   ├── api/                # Route handlers (auth, webhooks)
│   └── layout.tsx
├── components/             # Reusable UI
│   ├── ui/                 # Buttons, inputs, cards, etc.
│   ├── marketing/          # Hero, services, etc.
│   ├── booking/            # Booking flow
│   ├── dashboard/          # Dashboard widgets
│   └── map/                # Map / boundary picker
├── lib/                    # Cross-cutting utils
│   ├── auth.ts             # NextAuth config
│   ├── db/                 # Drizzle schema + client
│   ├── email/              # Resend templates + sender
│   ├── pricing/            # Pricing engine
│   └── validators/         # Zod schemas
├── actions/                # Server actions
├── public/                 # Static assets
├── styles/                 # (in globals.css)
└── types/                  # Shared TS types
```

---

## Local development

### 1. Prerequisites

- Node 20+
- npm 10+
- PostgreSQL (local install, Docker, or a free Neon/Supabase database)

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and AUTH_SECRET at minimum
```

### 4. Database setup

```bash
# Create database
createdb km_drones    # or use the GUI of your choice

# Push schema (creates tables)
npm run db:push

# Seed demo data (services, pricing, drones, admin user)
npm run db:seed
```

### 5. Dev server

```bash
npm run dev
# Visit http://localhost:3000
```

Default admin (from seed):
- Email: `admin@kmdrones.co.za`
- Password: `Admin123!`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Drizzle Studio (DB GUI) |
| `npm run db:seed` | Seed demo data |
| `npm run db:generate` | Generate Drizzle migrations |

---

## Deployment to Vercel

1. Push this repo to GitHub.
2. Import in Vercel — it auto-detects Next.js.
3. Add a managed Postgres (Neon, Vercel Postgres, or Supabase) and copy the `DATABASE_URL` into Vercel env vars.
4. Set the remaining env vars in Vercel (see `.env.example`).
5. Set `AUTH_SECRET` to a strong random value.
6. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
7. After build, run migrations against production:
   ```bash
   DATABASE_URL=... npx drizzle-kit push
   ```
8. (Optional) Seed the production database with sample services:
   ```bash
   DATABASE_URL=... npm run db:seed
   ```
9. Deploy. Vercel will build and run automatically.

---

## Booking workflow

```
Register/Login
   ↓
Select Service  →  Select Crop
   ↓
Enter Farm Details  →  Pick map location  →  Draw/select boundary
   ↓
Enter farm size (ha)  →  Pick date  →  Pick time
   ↓
Review summary + estimated price
   ↓
Submit booking → Confirmation + email
   ↓
Admin reviews  →  Approve / reschedule / assign drone+team
   ↓
Customer receives status emails
```

---

## Pricing engine

Pricing lives in the database (`service_pricing` table). An admin can edit base prices, per-hectare rates, and urgency fees from the admin dashboard. The engine supports:

- **Fixed** — flat rate per booking
- **Per hectare** — rate × farm size
- **Hybrid** — base + per-hectare + location fee + urgency fee

The quote is an *estimate*; final pricing is confirmed by the admin. This is shown clearly to the customer.

---

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- Sessions via **NextAuth v5** (JWT, secure cookies)
- **Server-side authorization** on every protected route & action
- **Zod** validation on every server action
- **CSRF** protection via NextAuth
- **Rate limiting** hooks on auth endpoints
- **Audit log** for admin actions
- Env vars never exposed to client; secrets not in repo

---

## License

Private — © KM Drone Services.
