# Repository Guidelines

## Project Structure & Module Organization

AcidBot is a Next.js and TypeScript app. Main application code lives in `src/app`, with pages under `src/app/pages`, reusable UI in `src/app/components`, and API route handlers under `src/app/api`. Shared utilities and domain types are in `src/lib`; API-specific helpers are in `src/app/api/_shared`. Unit tests are colocated with source files using `*.test.ts` or `*.test.tsx`. Static assets, rating plates, maimai jackets, fonts, icons, and B50 image resources live in `public`. Project configuration is in `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`, `tailwind.config.js`, and `postcss.config.mjs`.

## Build, Test, and Development Commands

Use `pnpm` for dependency management; the repo pins `pnpm@10.33.0`.

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start the local Next.js development server with Turbopack.
- `pnpm build`: create a production Next.js build.
- `pnpm start`: serve the production build locally.
- `pnpm lint`: run ESLint across the project.
- `pnpm test`: run Vitest once.
- `pnpm test:watch`: run Vitest in watch mode during development.
- `pnpm test:coverage`: run Vitest with V8 coverage reporting.
- `pnpm format`: format files with Prettier.

## Coding Style & Naming Conventions

Write TypeScript with `strict` mode expectations. Prefer the `@/*` path alias for imports from `src`. Use single quotes and keep JSX props wrapped in curly braces where required by ESLint. Follow the existing four-space indentation style. Name React components in PascalCase, such as `B50Table.tsx`, and keep route folders descriptive, such as `src/app/pages/Best50`.

## Testing Guidelines

Vitest is configured in `vitest.config.ts` with the Node environment, the `@/*` alias, and static asset stubs for PNG/SVG imports. Tests should be colocated with affected code and named `*.test.ts` or `*.test.tsx`; the include pattern is `src/**/*.{test,spec}.{ts,tsx}`. Use `describe`, `it`, and `expect` from Vitest, and prefer focused utility/API tests for parsing, rating, and data transformations. Run `pnpm test` for unit checks, `pnpm test:coverage` when changing shared logic, and `pnpm lint` plus `pnpm build` before larger pull requests.

## Commit & Pull Request Guidelines

Recent commits use short Conventional Commits-style prefixes, for example `feat(b50): ...`, `fix(db): ...`, and `chores(api link): ...`. Keep subjects imperative and scoped when useful. Pull requests should include a concise summary, verification commands, linked issues when applicable, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Create local secrets in `.env.local`; do not commit them. Required values include `SITE_LINK`, `AUTH_SECRET`, OAuth client credentials, and `MONGODB_URI`. Treat MongoDB data access and OAuth changes as security-sensitive and verify both local development and production build behavior before merging.
