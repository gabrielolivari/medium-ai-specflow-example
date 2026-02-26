# Changelog

## 2026-02-25

- Added: Initial implementation of all Phase 1–5 tasks (T-01 through T-17).
- Added: Zod v4 schema in `src/features/quote/schemas/quote.schema.ts` (promoted from spec contract).
- Added: `calculateTotals` and `formatCurrency` utilities in `src/features/quote/lib/calculations.ts`.
- Added: Form section components: `IssuerFields`, `RecipientFields`, `LineItemsFields`, `QuoteHeaderFields`, `SummaryPanel`, `FieldErrorMessage`.
- Added: `QuoteForm` orchestrator with React Hook Form + Zod resolver, validation gate (disabled button), and lazy-loaded PDF generation with error handling.
- Added: `QuotePdfDocument` corporate layout via `@react-pdf/renderer`.
- Added: `generateAndDownloadPdf` download trigger in `src/features/quote/lib/generate-pdf.ts`.
- Added: Next.js page route at `/app/quote/page.tsx`; root `/` redirects to `/quote`.
- Changed: Resolved open questions — [Q1] `@react-pdf/renderer` chosen for maintainability; [A1] IVA rate as free-text numeric input; [A2] currency hardcoded to € with ES locale; [Q3] monetary locale `es-ES` (`€ 1.234,56`).
- Changed: `tsconfig.json` excludes `docs/` folder to avoid spec-level `.ts` files failing tsc.
- Changed: Layout metadata updated to "AI PDF Pro — Quote Generator".
- Notes: Phase 6 (testing: T-18 through T-21) is pending. No tests have been written yet.
