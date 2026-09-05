# Copyrail

Brand guideline checks for content teams using multiple writing tools.

## Current implementation

Next.js 16, React 19, TypeScript, Tailwind, Neon Postgres, Vercel. Accounts use salted scrypt password hashes and signed, HTTP-only sessions. Guidelines and check history are stored in Postgres and scoped to the authenticated account. The phrase checker is deterministic; it does not assess factual truth, legal compliance, or nuanced tone.

The preview supports signup, login, editable phrase guidelines, located flags, reversible phrase removal, and saved check history. Subscriptions, multiple brands, team invitations, password recovery, and email verification remain unfinished. No customers or revenue are claimed.

## Development

1. `npm ci`
2. Set `DATABASE_URL` and a random `SESSION_SECRET` of at least 32 characters in `.env.local`.
3. `npm run dev`

`npm test` runs unit tests. To run the actual database test, set `RUN_DATABASE_TESTS=1`, then execute `node --env-file=.env.local node_modules/vitest/vitest.mjs run`. It creates unique test accounts and deletes only those accounts afterward. `npm run build` and `npm run lint` check production compilation and lint.

Database tables are initialized on first use. Never commit environment files or the old local data directory. Production intentionally has no local-memory fallback for account storage.

## Deployment

- Repository: https://github.com/clemensjl/copyrail
- Vercel project: copyrail
- Production: https://copyrail.vercel.app
- Database: dedicated `copyrail-db`, Neon free tier, Frankfurt

See `docs/launch-status.md` for verified progress and remaining work. Deployment existence alone does not establish commercial readiness.
