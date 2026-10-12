# Verification evidence

See `platform-setup.md` for configuration and live-release checks.

- Existing site inspected and branch rebased on latest main; globe, portfolio, services, navigation and contact endpoint preserved.
- Unit/API tests execute server handlers with explicit provider fixtures. SQL tests execute the actual migration, authentication role grants, project isolation, storage isolation, approval ownership, persistent messages and atomic limits in PGlite. They do not query a live Supabase project.
- Public browser tests cover existing interactions, four widths, reduced motion, quote steps, unconfirmed booking requests, chat persistence UI, FAQ fallback, private-route redirects and unavailable services.
- Workspace browser tests run the real Next.js pages/routes against a local Supabase protocol fixture and exercise sign-in, logout, project messages, approvals, mobile staff milestones, knowledge editing and availability. This fixture is launched only by the test script and is never imported by production code. Database security is tested separately against actual PostgreSQL RLS.
- External validation: GitHub API confirms an existing successful Vercel production deployment of the current main branch. No remote encrypted Vercel credentials, new schema, live provider email delivery, calendar availability or client accounts have been verified in this environment.

Release results and actual preview URL will be recorded below after checks and branch publication.

## Local release results

- 23 unit/API/PostgreSQL tests passed, including invalid/unverified/uninvited sessions and approved-knowledge-only AI replies for both provider adapters.
- 24 public browser tests passed (14 existing-site regressions, 10 communication/auth/responsive tests). The 10 new-feature tests were rerun after visual refinements and passed.
- 3 workspace browser tests passed, including private uploads, persisted client messages/approvals, staff milestones/knowledge and guest/staff chat + consultation approval. The workspace tests were rerun after reducing uploads to 4 MiB for Vercel's request limit.
- TypeScript, lint with zero warnings and Next.js production build passed. No live provider email or calendar booking was created.
