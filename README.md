# Crestlane Digital

The existing Crestlane agency site, with an interactive communication hub, persistent lead/chat workflows, and secure client and staff workspaces.

See [platform setup and release](docs/platform-setup.md) for the dedicated database migration, credentials, invite-only accounts, optional AI/booking/social providers and release checks. Existing Resend contact configuration remains in [contact setup](docs/contact-setup.md).

Routes: `/#connect`, `/portal/login`, `/portal`, `/studio`. Missing integrations fail closed or show an explicit fallback; no sample customer records are displayed in production.

## Local development

Install dependencies with `npm ci`; run `npm run dev`. Use ignored `.env.local` for local secrets. The public site and FAQ guide work without the new database; persistent intake and workspaces need configuration. Never connect browser tests to production customer data.

## Verification

`npm test`, `npm run typecheck`, `npm run lint -- --max-warnings 0`, `npm run test:browser`, `npm run test:workspace`, `npm run build`.

Browser tests need Playwright Chromium (`npx playwright install chromium`) or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` pointing to an installed browser. Workspace tests launch a local provider fixture, never a production bypass. Actual RLS/migration tests run in PostgreSQL-compatible PGlite. See [verification evidence](docs/platform-verification.md).
