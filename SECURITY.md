# Security Policy

## Reporting a vulnerability

Do **not** open a public issue for a security problem.

Email **hello@merqato.digital** with:

- a description of the issue and its impact,
- the steps needed to reproduce it,
- any affected version or commit,
- your contact details, if you would like a reply.

You will get an acknowledgement within a few business days. Please allow a reasonable window
for a fix before disclosing publicly.

## Supported versions

The `main` branch is the only supported version. Deployments should track it.

## Handling secrets in this repository

This repository is public and **must never contain a working credential**.

- `.env` files, database dumps and uploaded media are git-ignored — keep them that way.
- `ADMIN_SESSION_SECRET` has no default value. The application throws rather than falling back
  to a published key, and requires at least 32 characters.
- The development login bypass (`ADMIN_AUTH_DISABLED`) is ignored when `NODE_ENV=production`.
- Seed passwords are never hard-coded. They come from `SEED_OWNER_PASSWORD` /
  `SEED_EDITOR_PASSWORD`, or are randomly generated and printed once by the seed script.

If a credential is committed, treat it as compromised: rotate it first, then clean the history.

## Pre-deployment checklist

Complete every item before exposing an environment publicly.

- [ ] `ADMIN_SESSION_SECRET` set to a unique random value of 32+ characters
- [ ] `DATABASE_URL` points at a dedicated database with a non-default password
- [ ] Seeded owner and editor passwords changed from the admin portal
- [ ] `ADMIN_AUTH_DISABLED` unset or `false`
- [ ] TLS terminated in front of the application; HTTP redirected to HTTPS
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real public origin
- [ ] Database port not reachable from the public internet
- [ ] Backups configured and a restore has been rehearsed
- [ ] DNS, firewall and access rules reviewed and re-verified after the change

## Known history

The initial import of this project contained an archive with development defaults: seeded
administrator credentials, a placeholder session secret and a development login route. These
were removed in the first hardening commit. Because they were published, they must be treated
as compromised and must never be reused in any environment.
