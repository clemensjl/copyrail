# Contributing

Copyrail is an early preview. Bug reports and focused pull requests are welcome.

## Setup

1. Fork and clone the repository.
2. `npm ci`
3. Create `.env.local` with `DATABASE_URL` (any Postgres, for example a free Neon database) and a random `SESSION_SECRET` of at least 32 characters. See `.env.example`.
4. `npm run dev`

## Checks

```bash
npm run lint
npm test
npm run build
```

`npm test` runs the unit tests without a database. The database test is opt-in, see the Development section of the [README](README.md). CI runs the same three commands.

## Pull request

1. Branch from `master`, one change per pull request.
2. Add or update a test when you change the phrase checker, authentication or the report format.
3. Describe what changes and why. Attach a screenshot for visible changes.
4. Never commit `.env*` files, real customer text or database dumps.

## License

Copyrail is licensed under the [AGPL-3.0](LICENSE). By contributing you agree that your contribution is published under the same license.
