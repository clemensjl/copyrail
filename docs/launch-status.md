# Launch status - 2026-09-05

## Verified this continuation

- Existing GitHub repository `clemensjl/copyrail` and Vercel project `copyrail`.
- Dedicated Neon database `copyrail-db` provisioned on free_v3 in Frankfurt, connected to all Vercel environments.
- Replaced temporary file/memory account storage and oversized cookie replicas with Postgres.
- Real database test passed: credentials read back, duplicate accounts rejected, independent SQL sees persisted profile/history, separate account cannot see another account's history.
- Unit tests cover session tampering, expiry, password hashing, empty checks, prohibited phrases, required phrases, word boundaries, Unicode offsets, and edit behavior.
- Production SESSION_SECRET created as Vercel secret, value never printed.
- Removed fabricated testimonials/customer logos and fictitious plan activation. Planned prices labeled as planned.
- Grok CLI invocation for logo returned `Not signed in`. Existing logo is not verified as Grok-generated.

## Production verification completed

Runtime source commit: d1c2140. Vercel deployment dpl_7qdDwWThFJJTtRjQZW8nRs94RZxc is READY and aliased to https://copyrail.vercel.app.

Production HTTP smoke passed: signup, session cookie flags, input validation, saved guidelines, failing/passing checks, logout/login persistence, tenant isolation, origin rejection, and forged-session rejection. Two temporary accounts and their dependent data were removed.

Production browser smoke passed at 1440px desktop and 390px mobile: no horizontal overflow, signup, guidelines save, scoring, phrase removal and undo, history, no JavaScript errors. Screenshots were inspected and remain locally in artifacts (ignored by Git and deployment). Browser test accounts were removed.

Lint passes after converting standalone smoke scripts to ES modules. Latest app source compiled successfully on Vercel. Unit tests: 10 passed; the separate live Postgres integration test also passed.

## Next work

Continue subscription checkout/webhooks, reviewer collaboration, and account lifecycle features. Multi-brand workspaces and saved reports are now live. Grok authentication is still unavailable. Do not mark the entire business objective complete.

## Remaining requirements for the requested finished SaaS

- Paid subscription checkout, webhook verification, entitlements, billing management, and live merchant setup.
- Reviewer/team collaboration on top of the shipped multi-brand review workflow.
- Account recovery, email verification, account deletion/export, operational monitoring.
- Privacy/terms with actual operator information, data retention, and support channel.
- Grok logo, requiring working Grok authentication.
- Market validation and actual customers; no $1m business outcome has been established.

Goal remains active. Previous continuation made concrete source and infrastructure progress; no blocked threshold has been reached.

## External setup still required

Stripe sandbox provisioning returned integration_terms_acceptance_required. Vercel explicitly requires browser acceptance by the user before it will provision the sandbox. No Stripe account or resource was created. URL: https://vercel.com/clemens-jeles-projects/~/integrations/accept-terms/stripe?source=cli

This does not block building remaining product features or implementing the billing adapter and tests. It does block verified Stripe checkout until the service accepts the setup. Do not repeatedly attempt the same provisioning command without an external state change.

## Multi-brand review milestone

Implemented five private brand spaces, create/rename/switch, brand-specific guidelines and histories, full saved drafts, immutable rule snapshots/revisions, authenticated JSON reports, and print/PDF layouts. Legacy guidelines and check excerpts remain associated with the first brand.

All 13 tests passed, including real Postgres migration, account/brand isolation, capacity under concurrent creation, and immutable reports. A test caught concurrent schema initialization; it is now serialized with a transaction-scoped advisory lock and all migrations run in one transaction.

Local production build and browser smoke passed: desktop/mobile, brand creation/switching, scoped histories, reports, JSON export, and unchanged historic snapshots after edits. The print layout has also passed production browser verification, including dark-mode print rendering.

Production verified: runtime commit 41dd3a9; Vercel deployment dpl_r8bsyBnZGFybHCQesKgge2xyxqLm is READY at https://copyrail.vercel.app. The first deployment call returned Not authorized; whoami/project inspect verified access, and retrying with --scope clemens-jeles-projects succeeded.

The expanded live HTTP smoke passed brand and account isolation, authenticated exports, and historic rule snapshots. The live browser smoke passed desktop/mobile signup, brand creation/switching, guidelines, reports, JSON download, history isolation, and no JavaScript errors. Print/PDF rendering was tested with dark color preference; a real PDF was generated and the print screenshot inspected. Temporary test accounts were removed.

Next: subscription integration, reviewer collaboration, account recovery and the launch prerequisites above. No current deployment blocker remains.
