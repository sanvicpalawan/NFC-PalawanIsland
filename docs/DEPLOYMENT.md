# Deployment

Two supported paths: Docker Compose for a single VPS, or Coolify when the host is already managed.

## Before anything goes public

Work through the checklist in [SECURITY.md](../SECURITY.md). At minimum:

| Variable | Value |
| --- | --- |
| `ADMIN_SESSION_SECRET` | 32+ random characters, unique to this environment |
| `DATABASE_URL` | Dedicated database, non-default password |
| `NEXT_PUBLIC_SITE_URL` | The real public origin, e.g. `https://merqato.digital` |
| `ADMIN_AUTH_DISABLED` | Unset or `false` |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Path A — Docker Compose

```bash
cp .env.example .env
# edit .env: set DATABASE_URL and ADMIN_SESSION_SECRET
docker compose up -d --build
docker compose exec web npm run db:push
docker compose exec web npm run db:seed
```

The stack brings up the application on port 3000 and PostgreSQL 16 alongside it. Compose refuses
to start when `ADMIN_SESSION_SECRET` is missing, rather than falling back to a default.

Schema and seed are separate steps, so a redeploy never touches existing data. `db:seed` exits
without changes when administrators already exist.

### Uploaded media

`public/uploads` is container-local. Mount it so uploads survive a rebuild:

```yaml
services:
  web:
    volumes:
      - uploads:/app/public/uploads

volumes:
  uploads:
```

## Path B — Coolify

1. Create a new resource and point it at this repository, branch `main`.
2. Build pack: **Dockerfile**.
3. Set the environment variables from the table above.
4. Add a persistent volume for `/app/public/uploads`.
5. Expose port `3000` to the domain.
6. Run `npm run db:push` once, then `npm run db:seed`, from the resource terminal.
7. Attach TLS and verify the certificate before announcing the URL.

## Database

- PostgreSQL 16 or newer. The schema is defined in `src/db/schema.ts`.
- `npm run db:push` applies the schema; there is no migration history yet. Add one before the
  first production release so changes become reviewable and reversible.
- Keep the database port off the public internet. The application only needs to reach it.
- Back up before every schema change and rehearse a restore at least once.

## Domain and TLS

Terminate TLS at the edge and redirect HTTP to HTTPS. Card-free NFC tags and QR codes must resolve
over HTTPS — a mixed-content or plain-HTTP link is a broken guest experience and a security risk.
Set `NEXT_PUBLIC_SITE_URL` to the same origin that the tags point at, so auth redirects and
canonical URLs stay consistent.

## Verifying a deployment

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://<domain>/api/health      # 200
curl -sS -o /dev/null -w '%{http_code}\n' https://<domain>/               # 200
curl -sS -o /dev/null -w '%{http_code}\n' https://<domain>/admin          # redirects to login
```

Then in a browser: load the home page, submit a test enquiry, sign in to `/admin`, publish a copy
change, confirm it appears on the public page, and delete the test lead.

## Rollback

Docker Compose keeps the previous image until it is rebuilt, so `git checkout <previous-tag>`
followed by `docker compose up -d --build` restores the earlier release. On Coolify, redeploy the
previous commit from the deployment history. Database changes are not rolled back automatically —
take a backup before applying one.
