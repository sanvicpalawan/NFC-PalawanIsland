# Changelog

All notable changes to this project are recorded here.
This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Full Next.js application source at the repository root: public site, admin CMS, API routes,
  database schema and seed data.
- Brand assets in `brand/` (dark and light logos) and `public/brand/` for the application.
- Documentation: architecture, deployment, admin guide, security policy, contributing guide.
- GitHub issue templates, pull request template and a CI workflow (lint, typecheck, build).
- Docker configuration that reads every secret from the environment.

### Changed

- Product naming standardised to **NFC Palawan Island** across the application, seed content,
  documentation and repository metadata.
- `ADMIN_SESSION_SECRET` is now required and has no fallback value; the application throws
  instead of signing sessions with a published default.
- The development login bypass no longer has any effect in a production build.
- Seed accounts take their passwords from `SEED_OWNER_PASSWORD` / `SEED_EDITOR_PASSWORD`, or
  generate a random password and print it once.

### Removed

- Hard-coded administrator credentials from the login screen, seed script, environment example
  and Docker Compose file.
- The `chip-nfc-sticker-business.zip` archive, whose contents now live at the repository root.

### Security

- Removed a committed placeholder session secret and a default database password from tracked
  configuration. See [SECURITY.md](SECURITY.md) — the published defaults must never be reused.

## [0.1.0] - 2026-11-05

- Initial repository: supplied application archive and project overview.
