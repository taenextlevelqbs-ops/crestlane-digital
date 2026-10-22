# Crestlane studio design refresh

The public site now follows one visual direction: charcoal, warm ivory and muted olive; a typographic wordmark; clear section hierarchy; and a consistent spacing system. The homepage is a server component; interactive services, project filters, communication tools and inquiry form remain client components.

The homepage leads with selected work and real website screenshots for DMV Attack and NOVA Sports Live, followed by services, an illustrative workflow, the studio approach, communication options and the project inquiry. Existing client brand assets are used where a current screenshot could not be captured. No invented results, testimonials, revenue or client statistics are added. The decorative animated globe is no longer mounted.

Case studies and the private portal use the same palette. Portal authentication, tenant isolation, lead persistence and email delivery logic are unchanged. Project images are local optimized WebP assets; Geist fonts are self-hosted with their SIL Open Font License. Project screenshots were captured from the public sites on October 21, 2026 (Eastern time).

Validation includes public menu and keyboard navigation, all service selections, project filters, loaded project images, contact validation/pending/error states, quote requests, chat, booking requests, reduced motion, case-study navigation, metadata and 320/390/768/1440px layouts. Workspace fixtures exercise client/staff login, project messaging, approvals, uploads, knowledge publishing and authorization boundaries. These are isolated tests; no real inquiries or client messages are sent.

Stripe/payment or other client websites are not changed by this release. Dependency maintenance updates Next.js and matching ESLint configuration to 16.4.2, and resolves production audit advisories. Development-only braces advisories remain in lint tooling; no forced incompatible downgrade is applied.

## Color and motion refinement

Section 05 (Let’s connect), with prominent call and email actions, sits directly below the selected website portfolio, before services. The homepage uses brighter lime and teal accents, tinted project frames and brief entrance motion. Scroll motion uses IntersectionObserver without a continuous animation loop; content is visible without JavaScript and reduced-motion preferences disable it. Contact and reduced-motion browser checks pass.

## Blue brand alignment and portfolio order

The blue, white and black brand palette now carries through the homepage, case studies and private tools. DMV Attack remains the opening feature; Coach Tae QB is the first large portfolio preview, followed by NOVA Sports Live. Project categories and filter behavior remain separate from featured placement. The Coach Tae preview was rendered from an isolated local checkout of the existing Coach Tae website; that website was not changed or deployed.
