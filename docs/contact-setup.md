# Phase 1 contact configuration

Branch: `feat/crestlane-phase-1-contact`. No production deployment is authorized.

The `/api/contact` endpoint uses Resend's HTTPS API, with no browser credentials.
It returns HTTP 503 when configuration is missing. A successful provider response
must contain an email ID; HTTP 202 means **accepted for sending**, never confirmed
inbox delivery. The UI states that distinction explicitly. Provider acceptance
and rejection are covered by mocked tests; no live message has been sent.

## Required setup

1. Create or use a Resend account. Add a sending domain you control (for example,
   a dedicated subdomain of `crestlanedigital.com`). Add the DNS records Resend
   specifies and wait until the domain is verified. Do not substitute guessed DNS values.
2. Create a sending API key scoped to that verified domain. Store it securely as
   **RESEND_API_KEY** in the hosting environment. Never use a NEXT_PUBLIC variable.
3. Set **CONTACT_FROM_EMAIL** to a verified sender, e.g.
   `Crestlane Digital <inquiries@your-verified-domain>`.
4. Set **CONTACT_TO_EMAIL** to `sales@crestlanedigital.com`, or the approved inbox.
   The browser cannot choose recipients. The visitor's validated email is Reply-To.
5. Set **CONTACT_SITE_ORIGIN** to the exact public origin, e.g.
   `https://crestlanedigital.com` (no trailing slash). Configure preview environments
   separately with their exact origin. Development defaults to the local HTTP host. Production fails closed without
   this variable; explicitly pin it for each deployment.
6. Allow HTTPS access to **api.resend.com** in cloud environment networking. Existing
   Google Fonts permissions must also be applied for an unmodified production build.
7. Restart the development service after applying settings. For local testing,
   use the existing ignored `.env.local`, preserving any user settings; never commit
   credentials. Production settings belong in the hosting platform's secret manager.
8. After approval for a live test, submit a single test inquiry and verify both
   Resend's event history and receipt in the configured inbox. Confirm Reply-To works.
   A send API response alone does not prove delivery.

No delivered claim is displayed. Confirmed delivery tracking would require a
verified signed webhook and durable storage; that is a separate extension, not
silently simulated by this endpoint.

## Protections and limits

- Required fields, lengths, email, contact preference, phone and service selections
  are validated on the server. Client validation provides accessible field errors.
- Only same-origin JSON submissions are accepted. No cross-origin CORS allowance.
- Request bodies are capped at 16 KiB while streaming, even without Content-Length.
- A honeypot and a 20-request/minute per-process global limiter reduce basic abuse.
  The limiter intentionally does not trust arbitrary IP headers. It is **not** a
  distributed limit and resets across serverless instances/restarts. Before public
  launch, configure managed host/WAF rate limiting on POST `/api/contact`; consider
  a verified challenge if abuse warrants it. Origin checks alone do not stop bots.
- Sender and recipient come from server configuration; email content is plain text.
- Provider calls time out after 10 seconds. The client waits 15 seconds. Ambiguous
  timeouts direct visitors to contact Crestlane before retrying, because an email
  could already have been accepted. No automatic retries are performed.
- Inputs remain visible on errors. An accepted inquiry disables resubmission.
- Keys, provider errors and visitor details are not written to application logs.

## Validation

- `npm run test:contact`: server validation and mocked provider outcomes.
- `npm run test:browser`: Chromium navigation, responsive layout, forms, SEO, case studies and globe-motion tests.
  Install the Playwright Chromium browser with `npx playwright install chromium`,
  or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chromium executable.
  Browser tests mock valid submissions so they never send live email.
- `npx tsc --noEmit --incremental false`
- `npm run lint`
- `npm run build` (requires Google Fonts network access).

Production deployment, delivery confirmation and Phase 2 remain pending review.

## Phase 1 review results

- 8 server tests passed; provider acceptance, rejection and timeout responses are mocked.
- 9 Chromium browser tests passed, including 320/390/768/1440 px layouts,
  keyboard navigation, form errors, loading, acceptance wording, error recovery,
  and regression checks for filters, the globe and workflow demo.
- TypeScript and production build passed. Google Fonts access is now working.
- Lint passed with two pre-existing image warnings in `app/page.backup.tsx`.
- Live unconfigured endpoint returned HTTP 503 and explicitly said the inquiry was not sent.
- Interface and contact screenshots were inspected at mobile, tablet and desktop sizes.
- A pre-existing hero strip intercepted globe button clicks; pointer handling was
  corrected without changing the globe or removing the strip's navigation link.
- All other repositories remained unchanged. No live email, merge, push or deployment occurred.

## Production Vercel variables

Add these names to the Crestlane Vercel project for **Production** (and separately
for Preview/Development if those environments should send mail):

- `RESEND_API_KEY` — Resend API secret; keep server-only.
- `CONTACT_FROM_EMAIL` — sender address on the domain verified in Resend.
- `CONTACT_TO_EMAIL` — destination business inbox (`sales@crestlanedigital.com` is the existing site contact).
- `CONTACT_SITE_ORIGIN` — exact origin, `https://crestlanedigital.com`.
- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST endpoint for persistent rate limits.
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis token; keep server-only.

The application requires Resend and Upstash settings in production. Missing provider
settings fail closed with HTTP 503. Missing Redis settings or an unavailable limiter
also fails closed with HTTP 503. Local development uses a small in-memory limiter.
Create an Upstash Redis database, add its REST URL and token as encrypted Vercel environment variables, then redeploy before accepting live leads.
A successful Resend API response means accepted for sending, not delivered. Check
Resend delivery events and the inbox before confirming end-to-end delivery.

## Case study source notes

The case pages use the project descriptions and identity images already in the Crestlane
repository and make no claims about revenue, growth, performance or client quotations.
The deployed project domains returned an environment proxy HTTP 403 during this task,
so authentic full-page screenshots and live implementation technology could not be
verified. Current case pages identify that limitation rather than inventing a stack.
For a true portfolio case study, add owner-approved captures and confirm each project's
frameworks, integrations, authentication and implementation details.
