---
status: in-progress
owner: tbd
created_at: 2026-02-25
related_story: US-0001-generate-pdf-quote
---

# Objective

Implement the complete primary value loop of AI PDF Pro: a single-page, fully client-side quote generator where a freelancer fills in issuer details, recipient details, and service line items, previews live totals with automatic IVA calculation, and downloads a print-ready PDF — all without any server interaction.

# Scope

**In scope**

- Next.js App Router page at `/app/` rendered as a Client Component (`"use client"`).
- Zod schema definition (promoted from `contracts/quote.schema.ts` spec proposal).
- React Hook Form integration with inline validation errors.
- Three form sections: Issuer, Recipient, Line Items (dynamic list).
- Summary panel with reactive subtotal / IVA / grand total.
- Fixed-precision monetary calculation utility.
- Client-side PDF generation (lazy-loaded) with corporate layout.
- Browser download trigger with filename `quote-<YYYY-MM-DD>.pdf`.
- Error boundary for PDF generation failure.
- Unit, integration, and E2E test suites as defined in `test-plan.md`.

**Out of scope**

- Server-side rendering of the PDF.
- Persistence, database, or session storage.
- Multi-currency support.
- Email delivery.
- User authentication.
- Company logo upload.

---

# Tasks

## Phase 1 — Foundation

- [x] **T-01** Resolve open question [Q1]: decided `@react-pdf/renderer` for full React-based layout control and maintainability.
- [x] **T-02** Create the Next.js page route (`/app/quote/page.tsx`) as a `"use client"` component with a minimal shell and page title.
- [x] **T-03** Promote the `contracts/quote.schema.ts` Zod schema proposal to `src/features/quote/schemas/quote.schema.ts`. Resolved: [A1] free-text numeric input, [A2] currency hardcoded to € with `es-ES` locale.

## Phase 2 — Form UI

- [x] **T-04** Build the **Issuer** form section component (`IssuerFields`).
- [x] **T-05** Build the **Recipient** form section component (`RecipientFields`).
- [x] **T-06** Build the **Line Items** dynamic list component (`LineItemsFields`) with `useFieldArray`. Remove button disabled when only one row remains.
- [x] **T-07** Build the **Quote Header** fields: quote number (auto-generated `QT-<timestamp>`, editable), date (native date input), IVA rate (numeric input, default 21).
- [x] **T-08** Inline validation error messages via `FieldErrorMessage` component, rendered on blur (`mode: "onBlur"`).

## Phase 3 — Calculations & Summary Panel

- [x] **T-09** Implement `calculateTotals(items, ivaRate)` with `Math.round(x * 100) / 100`.
- [x] **T-10** Build `SummaryPanel` with `useWatch` for reactive totals.
- [x] **T-11** `formatCurrency` using `Intl.NumberFormat("es-ES")` → `€ 1.234,56`.

## Phase 4 — PDF Generation

- [x] **T-12** PDF generation module lazy-loaded via `import("../lib/generate-pdf")` on button click.
- [x] **T-13** Corporate PDF layout in `QuotePdfDocument`: issuer/recipient blocks, itemised table with alternating shading, totals block. Uses built-in Helvetica font.
- [x] **T-14** Browser download trigger: blob → object URL → programmatic click → revoke.
- [x] **T-15** try/catch in `QuoteForm.onSubmit` with `pdfError` state displayed as inline alert.

## Phase 5 — Validation Gate

- [x] **T-16** "Generate PDF" button `disabled` when `!isValid || generating`.
- [x] **T-17** Whitespace-only required fields fail via `.trim().min(1)` in Zod schema.

## Phase 6 — Testing

- [ ] **T-18** Write unit tests for `quote.schema.ts`: empty fields, whitespace, non-positive numbers, empty items array (TC-U-01 through TC-U-04).
- [ ] **T-19** Write unit tests for `calculateTotals`: standard case, IVA 0 %, fractional subtotal (TC-U-05 through TC-U-07).
- [ ] **T-20** Write integration tests for form validation state and summary panel reactivity (TC-I-01 through TC-I-09).
- [ ] **T-21** Write E2E tests (Playwright): full happy-path download + filename assertion, PDF content validation, cross-browser smoke (TC-E-01 through TC-E-03).

---

# Verification

| Task(s)                | Verified by                                 |
| ---------------------- | ------------------------------------------- |
| T-03, T-16, T-17, T-18 | TC-U-01, TC-U-02, TC-U-03, TC-U-04          |
| T-09, T-19             | TC-U-05, TC-U-06, TC-U-07                   |
| T-04 to T-08, T-16     | TC-I-01, TC-I-02, TC-I-03, TC-I-06, TC-I-07 |
| T-10, T-20             | TC-I-04, TC-I-05                            |
| T-06, T-20             | TC-I-08, TC-I-09                            |
| T-12 to T-15, T-21     | TC-E-01, TC-E-02, TC-E-03                   |

All test cases must pass before the story is considered done. See `test-plan.md` for the full AC → TC mapping.

---

# Risks and Mitigation Tasks

| Risk (from `risk-matrix.md`)              | Mitigation task                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| PDF library bundle weight (200–500 KB)    | T-12: lazy-load via dynamic import; add bundle size check to CI                  |
| Floating-point arithmetic display errors  | T-09: use `Math.round(x * 100) / 100` throughout; T-19: fractional fixture tests |
| Cross-browser PDF rendering inconsistency | T-13: embed fonts explicitly; T-21: Playwright cross-browser smoke test          |

---

> **Blocking questions before T-01 can be closed**
>
> - [Q1] PDF library choice: `@react-pdf/renderer` (full React layout control, heavier) vs `jsPDF` (lighter, coordinate-based drawing). Recommend `@react-pdf/renderer` for maintainability.
> - [Q2] IVA rate input: free-text numeric input or predefined dropdown (0 %, 10 %, 21 %)? Impacts T-03 and T-07.
> - [Q3] Monetary locale format: `€ 1.210,00` (ES locale) or `€ 1210.00` (EN)? Impacts T-11 and T-13.
