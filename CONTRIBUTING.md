# Contributing

Thanks for helping improve NFC Palawan Island.

## Before you start

- Open an issue describing the problem or proposal, so the approach can be agreed first.
- Keep secrets out of the repository. Every credential belongs in `.env`, which is git-ignored.

## Workflow

1. Branch from `main`: `feat/short-description`, `fix/short-description` or `chore/short-description`.
2. Make the smallest change that solves the problem. Do not refactor unrelated code.
3. Run the checks listed below and make sure they pass.
4. Open a pull request and describe the behaviour that changed and how it was verified.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

A change is not ready to merge if any of these fail.

## Code conventions

- TypeScript, strict mode. Avoid `any` in new code.
- Match the existing App Router structure: pages in `src/app`, shared UI in `src/components`,
  CMS managers in `src/components/admin`, database access in `src/lib` and `src/db`.
- Server-side data access stays server-side. Do not expose a database credential to client code.
- Tailwind utilities are ordered to match the surrounding file. Reuse the existing design tokens
  (`var(--accent)`, `var(--bg-surface)`, `var(--border-subtle)`) instead of new hex values.

## Content and copy

Public copy lives either in the seed data (`src/db/seed.ts`) or in the CMS. Prefer editing
content through the admin portal for anything that is not structural, so the change is audited
and does not require a deployment.

## Database changes

Update `src/db/schema.ts`, then run `npm run db:push` against a local database and verify the
affected pages before opening a pull request. Never run a destructive migration against a
database you do not own.

## Licensing

This is proprietary software. Contributions are made to Palawan Collective under the terms in
[LICENSE](LICENSE). Do not add a dependency whose licence is incompatible with commercial,
closed-source distribution, and note any new dependency in the pull request.
