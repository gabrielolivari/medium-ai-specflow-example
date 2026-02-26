# Project Profile

## Project

- Name: AI PDF Pro
- Domain: Document AI / PDF Processing
- Architecture pattern: Modular monolith (feature-based)
- Monorepo tooling: None (single repository)

## Runtime and Platforms

- Language: TypeScript (latest stable)
- Package manager: npm
- Frontend runtime/framework: React 19 with Next.js (App Router)

## Frontend Stack

- UI framework: React 19 + Next.js App Router
- Styling: TailwindCSS (utility-first, no CSS modules)
- Component primitives: shadcn/ui (Radix UI under the hood)
- Forms: React Hook Form + Zod (schema-driven validation)
- Data fetching: Next.js Server Components + Server Actions (no client-side fetching layer)
- State management: None — all state is derived from URL, server components, or form state
- Validation library: Zod (shared schemas for forms and API response parsing)

## Contracts

- Contract style: Zod schemas (runtime-validated, TypeScript types derived via `z.infer`)
- All external API responses are parsed through a Zod schema before use

## Testing

- Unit test tool: Vitest
- Integration test tool: React Testing Library + Vitest
- E2E test tool: Playwright
- Coverage target: 80 % statements, 70 % branches

## Delivery

- CI/CD tool: GitHub Actions
- Branch strategy: GitHub Flow (feature branches → main)
- Release strategy: Continuous deployment on merge to main
- Containerization: None (deployed to Vercel)
- Environment list: development, preview, production

## Observability

- Logging library: None (relies on Vercel runtime logs)
- Metrics/tracing: None
- Error tracking: Sentry (client-side error boundary + server component errors)

## Code Quality

- Linter: ESLint (with `eslint-config-next` and type-aware rules)
- Formatter: Prettier
- Pre-commit hooks: Husky + lint-staged (runs ESLint + Prettier on staged files)

## Architecture

- Structure: Feature-based (`/features/<domain>/`) with shared `components/`, `lib/`, and `hooks/` at the root
- Routing: Next.js App Router file-system routing (`/app/`)
- Server vs. Client components: Default to Server Components; opt into `"use client"` only at interaction boundaries
- Forms: Every form is backed by a Zod schema; React Hook Form handles field state and submission; Server Actions handle mutations
- No Redux, Zustand, Jotai, or any global state library
- No SWR or TanStack Query; data lives in Server Components or URL search params

## Security / Compliance Notes

- Secrets handling: All secrets in environment variables (`.env.local` for local dev, Vercel environment variables for deployed environments); never exposed to the client bundle
- Compliance constraints: No PII stored client-side; no third-party analytics beyond Sentry
