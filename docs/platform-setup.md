# Crestlane client platform: setup and release

## Inspected infrastructure

This feature extends the existing Next.js 16 / Tailwind 4 site. The globe, portfolio, branding, service explorer, workflow demo and existing `/api/contact` Resend/Upstash workflow are preserved. The branch includes the latest `main` portfolio/inquiry changes (`7864349`); no unrelated production changes are overwritten.

Existing business number: **(703) 431-4468**. Calling uses `tel:`, texting uses `sms:` and opens the visitor's device application. Automated/two-way SMS is not enabled. The second existing phone number remains in the footer contact section. Existing email: sales@crestlanedigital.com.

GitHub reports a connected Vercel production deployment. This cloud machine has no Vercel login/token, no `.vercel` project binding, and no Resend, Redis, Supabase or AI credentials. Remote encrypted environment values cannot be inspected without Vercel account access. No live customer data or messages were used in tests.

## Dedicated Crestlane database

Use a **separate** Supabase project named `crestlane-client-platform` in your organization. Do not apply this migration to DMV Attack or the Command Center database.

1. In Supabase Dashboard, create the project and choose a suitable region. Store the database password in your password manager.
2. After provisioning, open SQL Editor and execute `database/001-platform.sql` once. It is a versioned initial migration, not a rerunnable reset script. It creates twelve tables, shared request limiting, capability-based chat creation, access/approval functions, and a private `crestlane-projects` storage bucket. No existing tables or data are deleted.
3. Enable Email/password authentication. Disable public signup. Set the production site URL. Add exact authorized preview URLs separately. Set up Supabase SMTP/recovery using your verified email provider. Accounts are provisioned by the owner, not visitors.
4. Create a confirmed owner account for `takwancrews@gmail.com` through Auth → Users. Complete verification/password setup securely in Supabase. Add the user's UUID to `crestlane_accounts` with name and role `staff`, using SQL Editor:

   ```sql
   insert into public.crestlane_accounts(id,name,role)
   values ('ACTUAL_AUTH_USER_UUID', 'Crestlane owner', 'staff');
   ```

   Replace the placeholder with the actual Auth UUID. Do not put passwords in SQL, source control or chat. For clients, create/invite their verified Auth account and insert their UUID/name with role `client`. Roles and account creation remain owner-controlled. The staff dashboard can update client display names and assign projects; it cannot promote a client to staff.
5. Put the project URL, anon/publishable key and **legacy service_role JWT key** into encrypted Vercel runtime settings:

   - `CRESTLANE_SUPABASE_URL`
   - `CRESTLANE_SUPABASE_ANON_KEY`
   - `CRESTLANE_SUPABASE_SERVICE_KEY`

   These are server-only. No `NEXT_PUBLIC` keys are needed. Service-role access is limited to public intake, guest capabilities, approved public FAQs/presence, rate limits and authorized staff customer-name updates. Project reads/writes, private files and client approvals use the signed-in user's Supabase JWT and PostgreSQL RLS.

## Existing Vercel project

Keep the existing Crestlane Digital project under **taenextlevelqbs-ops**. Use Node.js 24 (pinned in package.json and verified locally/CI); the new Supabase SDK requires Node 22 or newer. Do not create a replacement public project or change its domains. Authenticate Vercel securely or use its existing GitHub integration to deploy this PR as a preview. Configure the new database keys for the preview separately. Set `CONTACT_SITE_ORIGIN` to the exact deployment HTTPS origin. Apex and www Crestlane origins are accepted together only when configured as the production Crestlane domain.

Retain these existing contact variables: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_SITE_ORIGIN` and complete `KV_REST_API_URL`/`KV_REST_API_TOKEN` (or legacy complete Upstash pair). Notification emails reuse the configured verified Resend sender. Existing `/api/contact` remains unchanged. New quote/consultation requests are stored before notification; email acceptance is distinct from inbox delivery. A missing/failed email notification does not discard a saved lead.

The new routes require Supabase for shared rate limiting even if Resend is missing. Missing database configuration returns HTTP 503 and never invents a saved request. The portal requires an invited, confirmed account and validates its token against Supabase on every protected request; sessions use HttpOnly, Secure in production, SameSite Strict cookies, expiring within an hour. Users sign in again after expiration. Origin validation protects POST requests, including login/logout; no CORS opening is introduced.

## Optional services

- `CRESTLANE_BOOKING_URL`: actual HTTPS Calendly or other scheduling-provider URL. The UI links to the provider's calendar; the provider owns availability and confirmation. No API-based calendar synchronization is claimed.
- Without a provider, visitors request 15/30 minute consultations. Staff must check their actual calendar, choose a future date/time and supply a real Meet/Zoom URL for video calls before approving. Request emails are explicitly unconfirmed; approval emails identify the confirmed UTC time. No Zoom/Google account, calendar slot or meeting is fabricated.
- `CRESTLANE_INSTAGRAM_URL`, `CRESTLANE_MESSENGER_URL`, `CRESTLANE_WHATSAPP_URL`: owner-approved HTTPS profile/message links. Unconfigured links are hidden.
- `CRESTLANE_AI_PROVIDER`: `openai` (default) or `anthropic`; `CRESTLANE_AI_API_KEY`: provider key; `CRESTLANE_AI_MODEL`: authorized model ID. Calls use fixed official provider endpoints, never browser-provided URLs. Published, staff-approved FAQs are the knowledge source. AI selects relevant FAQ indexes using a validated JSON response; the server composes replies from the approved answer text, so generated pricing, services or booking claims are not rendered. Provider errors fall back to FAQs and real lead/human controls. AI is guidance, not a guaranteed factual source; no pricing/booking tools exist. No key means the FAQ guide works without AI. Public AI questions are sent to the selected provider; avoid sensitive details.
- SMS automation can be added later behind verified provider webhooks and explicit opt-in. No SMS subscription or billable messaging provider is provisioned here.
- Invoices record amounts in currency minor units and manually verified payment status. No payment collection buttons, Stripe checkout or fabricated receipts are enabled.

## Data, retention and operational limits

Live chat uses five-second polling while the tab is visible, persistent database messages and a 256-bit visitor capability stored in an HttpOnly cookie for 30 days. Only its SHA-256 hash is stored. The server never accepts a conversation ID from a visitor. Changing browsers does not recover chat automatically; email the team if needed. Do not start private conversations on shared devices. Staff unread counts use a shared team read timestamp. Availability requires an explicit staff toggle and heartbeat within 90 seconds; hidden/closed tabs stop refreshing it.

The workspace uses bounded recent lists (200 leads, 100 projects, 500 messages). Overview counts label these limits and are not website audience analytics/all-time totals. Long conversations beyond 200 guest messages and high-volume inboxes need pagination in a future scale-up. File uploads accept passive formats up to 4 MiB in private storage; download links expire after 60 seconds and force download. No malware scanning service is provisioned. MIME/size controls are not antivirus. Storage RLS enforces project ownership. Avoid uploading sensitive documents.

Choose a retention policy with your business, then delete/archive old conversations, messages, leads, files and inactive accounts through the owner-controlled database. No scheduled deletion of customer data is enabled. Monitor notifications with status pending/not_configured/unconfirmed; review the saved lead in the inbox before retrying an email. Request bodies are bounded; persistent throttles fail closed on outages. IPs are hashed for short-lived rate buckets, cleaned opportunistically after two days. AI guidance is not stored as a human conversation until the visitor explicitly submits a lead/message.

## Release checks

Run `npm test`, `npm run typecheck`, `npm run lint -- --max-warnings 0`, `npm run test:browser`, `npm run test:workspace`, `npm run build`. Browser suites use provider fixtures only and never send live messages. SQL tests execute the actual migration in PostgreSQL-compatible PGlite with Supabase Auth/Storage scaffolding and test anonymous/client/staff isolation. This is not a substitute for testing the deployed Supabase project.

Before merging/deploying production: apply the migration in the new database, provision staff and two separate client accounts, verify each client sees only its project/files, save a quote and inspect the staff lead inbox, start guest chat and reply as staff, confirm offline/presence behavior, request and manually approve a consultation after checking availability, verify Resend receipt and Reply-To, upload/download a private file, approve a milestone and inspect invoice status. Validate login/logout, missing/expired sessions and public SEO on the actual preview URL. No production-readiness claim should be made before these checks pass.

Routes after release: homepage `/#connect`, `/portal/login`, `/portal`, `/studio`. These routes are implemented on the feature branch; their production activation depends on merge, migrations and credentials.
