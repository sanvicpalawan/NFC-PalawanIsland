# Architecture

## Shape of the system

One Next.js application serves two audiences from a single deployment:

- **Public site** — server-rendered marketing, catalogue and enquiry pages.
- **Admin CMS** — authenticated management of everything the public site reads.
- **API routes** — the write path for public forms and the CMS.

Both halves read from the same PostgreSQL database through Drizzle. There is no separate
backend service and no external CMS.

```
Guest phone ──tap/scan──▶ NFC tag or QR code
                              │
                              ▼
Browser ──HTTPS──▶ Next.js (public pages)  ──▶  PostgreSQL
                              ▲                     ▲
Staff browser ──session──▶ Next.js (admin CMS) ─────┘
```

## Directory map

| Path | Responsibility |
| --- | --- |
| `src/app/**/page.tsx` | Public routes |
| `src/app/admin/**` | Admin portal pages and layout |
| `src/app/api/**` | Route handlers |
| `src/components/` | Public UI components |
| `src/components/admin/` | CMS managers, one per entity |
| `src/db/schema.ts` | Drizzle table definitions — the single source of truth for the data model |
| `src/db/index.ts` | Connection pool, reused across hot reloads in development |
| `src/db/seed.ts` | Initial content: brand, industries, use cases, products, pages, demo leads |
| `src/lib/auth.ts` | Session tokens, role checks, audit logging |
| `src/lib/public-data.ts` | Read helpers used by public pages |

## Data model

| Table | Holds |
| --- | --- |
| `admins` | Portal accounts with a role and a bcrypt password hash |
| `site_settings` | Key/value brand, contact and pilot programme configuration |
| `pages` | Per-route hero copy, description and SEO metadata |
| `industries` | Sectors the product is sold into, with their own landing pages |
| `use_cases` | Software modules, assignable to one or more industries |
| `products` | Physical hardware: variants, materials, applications, spec sheets, galleries |
| `insights` | Articles published to `/insights` |
| `leads` | Enquiries with status, notes and CSV export |
| `media` | Metadata for uploaded assets |
| `audit_logs` | Append-only record of every administrative action |

## Authentication and authorisation

- Sign-in posts to `/api/admin/auth/login`, which verifies the password with bcrypt.
- On success the server issues an HMAC-SHA256 signed token in an HTTP-only cookie. The payload
  carries the user id, email, name, role and a seven-day expiry.
- `getCurrentAdmin()` is the single entry point used by every protected route handler.
- `canPerformAction(role, action)` is the single source of truth for what a role may do:

| Role | Read | Create / update / publish | Delete | Manage users |
| --- | --- | --- | --- | --- |
| `owner` | Yes | Yes | Yes | Yes |
| `admin` | Yes | Yes | Yes | No |
| `editor` | Yes | Yes | No | No |
| `viewer` | Yes | No | No | No |

Every mutation writes an audit log entry with the actor, entity and a plain-language detail string.

### Development bypass

`ADMIN_AUTH_DISABLED=true` signs every request in as an owner. It exists to speed up local UI work
and is ignored when `NODE_ENV=production`, so it cannot be switched on in a production build. It
must never be set on a shared environment.

## Rendering and caching

Public pages read live data through `src/lib/public-data.ts`. Every helper catches database
errors and returns an empty value, so a database outage degrades a section of the page rather
than returning a 500. Pages that depend on request state are dynamic; static assets are served
from `public/`.

## Media

Uploads go through `/api/admin/upload`, which requires an authenticated session, allow-lists image
and PDF MIME types, caps files at 8 MB and writes sanitised, collision-resistant filenames into
`public/uploads/`.

> **Scaling note.** `public/uploads/` is container-local. A multi-instance or rebuilt deployment
> loses uploaded files unless the directory is a mounted volume. Use a bind mount today, or move
> to object storage before running more than one instance.

## Integration boundaries

The CMS is deliberately separated from tag resolution. A future telemetry or redirect service can
consume the `products` and `use_cases` tables through a database connection without the marketing
site depending on it. No mock analytics are displayed until real telemetry exists.
