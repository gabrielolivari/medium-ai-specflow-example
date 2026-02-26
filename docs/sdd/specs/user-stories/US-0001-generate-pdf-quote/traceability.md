# Traceability

`PR/Commit` placeholder policy:

- `DRAFT` for not-yet-executed rows.
- `AUTO_PR` for rows that must be auto-linked by PR workflow.

| Requirement | Code Reference                                                        | Test Reference | PR/Commit |
| ----------- | --------------------------------------------------------------------- | -------------- | --------- |
| FR-1        | `src/features/quote/components/quote-form.tsx`                        | —              | DRAFT     |
| FR-2        | `src/features/quote/components/issuer-fields.tsx`                     | —              | DRAFT     |
| FR-3        | `src/features/quote/components/recipient-fields.tsx`                  | —              | DRAFT     |
| FR-4        | `src/features/quote/components/line-items-fields.tsx`                 | —              | DRAFT     |
| FR-5        | `src/features/quote/components/summary-panel.tsx`                     | —              | DRAFT     |
| FR-6        | `src/features/quote/components/quote-form.tsx` (disabled button gate) | —              | DRAFT     |
| FR-7        | `src/features/quote/lib/generate-pdf.ts`                              | —              | DRAFT     |
| FR-8        | `src/features/quote/lib/quote-pdf-document.tsx`                       | —              | DRAFT     |
| FR-9        | `src/features/quote/components/field-error.tsx`                       | —              | DRAFT     |
| FR-10       | `src/features/quote/components/quote-header-fields.tsx`               | —              | DRAFT     |
| BR-1        | `src/features/quote/lib/calculations.ts`                              | —              | DRAFT     |
| BR-2        | `src/features/quote/lib/calculations.ts`                              | —              | DRAFT     |
| BR-3        | `src/features/quote/schemas/quote.schema.ts` (items min 1)            | —              | DRAFT     |
| BR-4        | `src/features/quote/schemas/quote.schema.ts` (RequiredString)         | —              | DRAFT     |
| BR-5        | `src/features/quote/lib/quote-pdf-document.tsx`                       | —              | DRAFT     |
| BR-6        | `src/features/quote/lib/calculations.ts` (`formatCurrency`)           | —              | DRAFT     |
| BR-7        | `src/features/quote/lib/generate-pdf.ts` (client-only)                | —              | DRAFT     |
| EC-6        | `src/features/quote/components/quote-form.tsx` (try/catch pdfError)   | —              | DRAFT     |
| EC-7        | `src/features/quote/schemas/quote.schema.ts` (trim + min 1)           | —              | DRAFT     |
