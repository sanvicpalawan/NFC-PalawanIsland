<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/palawan-collective-logo-light.png">
  <source media="(prefers-color-scheme: light)" srcset="brand/palawan-collective-logo-dark.png">
  <img src="brand/palawan-collective-logo-dark.png" alt="Palawan Collective" width="230">
</picture>

# NFC Palawan Island

**Connect physical products and places to useful digital experiences.**

Tactile NFC tags and precision QR codes that turn tables, rooms, boats, equipment and
products into instant digital touchpoints — backed by a fast mobile web experience and a
complete content, catalogue and enquiry platform.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Status](https://img.shields.io/badge/status-pre--launch-B85D32)](#project-status)

A **Palawan Collective** venture · Palawan, Philippines

</div>

---

## Overview

NFC Palawan Island gives a business one physical object with one job: when a guest taps it,
they get the right page immediately. No app install, no typing, no QR hunting.

The platform is two halves that ship together:

| Half | Who uses it | What it does |
| --- | --- | --- |
| **Public site** | Guests, diners, travellers, prospects | Solutions, industries, product catalogue, use cases, FAQ, pilot programme and enquiry capture |
| **Admin CMS** | The operator and venue staff | Leads CRM, hardware catalogue, industries, use cases, page content, media library, settings and audit logs |

## Project status

**Pre-launch.** The application source is complete and buildable; it has not been deployed to
production. Two things must happen before a public deployment:

1. Every value in `.env.example` must be replaced with a real, unique secret — see [SECURITY.md](SECURITY.md).
2. The placeholder imagery in `public/images/` must be replaced with approved product photography.

## How it works

1. A guest taps an NFC tag (or scans the QR code printed on the same object).
2. The phone resolves the tag to a hosted page over HTTPS — no app, no login.
3. The page serves that venue's live menu, service request form, review link or product info.
4. The operator edits the destination once in the admin CMS; every tag pointed at it updates
   instantly, so nothing is ever reprinted.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4, custom editorial type scale |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | PostgreSQL with Drizzle ORM |
| Auth | HMAC-signed HTTP-only session cookies, four roles |
| Hosting | Docker / Coolify on a self-hosted VPS |

## Getting started

### Requirements

- Node.js 22 or newer
- PostgreSQL 16 or newer
- Docker (optional, for the container path)

### Local setup

```bash
git clone https://github.com/sanvicpalawan/NFC-PalawanIsland.git
cd NFC-PalawanIsland
npm install
cp .env.example .env      # then fill in every value
npm run db:push           # create the schema
npm run db:seed           # seed brand, industries, products, pages
npm run dev
```

The public site is at `http://localhost:3000` and the admin portal at
`http://localhost:3000/admin`.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_SESSION_SECRET` | Yes | Session signing key, **32+ characters**. Rotating it signs everyone out |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public origin, used for absolute URLs and auth redirects |
| `ADMIN_AUTH_DISABLED` | No | Development-only login bypass. Has no effect in a production build |
| `SEED_OWNER_PASSWORD` | No | Password for the seeded owner account |
| `SEED_EDITOR_PASSWORD` | No | Password for the seeded editor account |

If the two seed passwords are omitted, `npm run db:seed` generates strong random ones and
prints each once. Capture them, then change them from the admin portal.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run db:push` | Push the Drizzle schema to the database |
| `npm run db:seed` | Seed initial content (idempotent — skips if admins exist) |

## Deployment

```bash
cp .env.example .env      # set DATABASE_URL and a real ADMIN_SESSION_SECRET
docker compose up -d --build
```

`docker-compose.yml` refuses to start if `ADMIN_SESSION_SECRET` is unset. Full instructions for
Coolify and TLS are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Project structure

```
src/
├── app/                    # App Router routes
│   ├── (public pages)      # home, solutions, industries, products, use-cases, insights, faq,
│   │                       # pilot-program, how-it-works, about, contact, privacy, terms
│   ├── admin/              # Admin portal — dashboard, leads, products, industries, use cases,
│   │                       # pages, settings, media, team, audit logs
│   └── api/                # Route handlers for the public forms and the admin CMS
├── components/             # Public UI components
│   └── admin/              # CMS managers
├── db/                     # Schema, connection pool, seed data
└── lib/                    # Auth, session handling, public data access
brand/                      # Logos used by this README
public/
├── brand/                  # Logos served by the application
├── images/                 # Product imagery (currently placeholders)
└── uploads/                # Media uploaded through the admin CMS
docs/                       # Architecture, deployment and admin guides
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together.

## Admin portal

The CMS covers everything a venue or the operator needs without a code change: lead pipeline
with statuses and CSV export, hardware catalogue with variants and spec sheets, unlimited
industries and use cases, editable page copy and SEO metadata, pilot programme settings, a media
library, immutable audit logging and role-based access for owners, admins, editors and viewers.
Day-to-day usage is documented in [docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md).

## Security

This is a public repository. It contains **no working credentials** — only placeholders.

- Never commit `.env`, database dumps or uploaded media.
- `ADMIN_SESSION_SECRET` has no default. The application refuses to issue or verify a session
  until a 32+ character value is provided.
- The development login bypass is disabled in any production build.
- Report a vulnerability as described in [SECURITY.md](SECURITY.md), not in a public issue.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Proprietary. Copyright (c) 2026 Palawan Collective. All rights reserved — see [LICENSE](LICENSE).

Third-party names and logos remain the property of their respective owners.

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/merqato-digital-logo.png">
  <source media="(prefers-color-scheme: light)" srcset="brand/merqato-digital-logo.png">
  <img src="brand/merqato-digital-logo.png" alt="MerQato Digital" width="120">
</picture>

Built and operated by **MerQato Digital** · [merqato.digital](https://merqato.digital)

</div>
