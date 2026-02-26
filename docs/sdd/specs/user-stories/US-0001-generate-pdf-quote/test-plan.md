# Test Plan — US-0001 Generate PDF Quote

## Scope

**Covered**
- Zod schema validation logic (unit).
- Monetary calculation utility (unit).
- Form validation state and inline error rendering (integration).
- Reactive summary panel updates (integration).
- Line item dynamic list interactions (integration).
- PDF generation, download filename, and file content (E2E).
- Cross-browser PDF rendering smoke (E2E).

**Not covered**
- Server-side behaviour (none exists).
- Persistence or session recovery (explicitly out of scope).
- Email delivery (out of scope).
- Visual regression / pixel-level PDF layout (manual exploratory only).

---

## Test Types

- **Unit (U)** — Vitest. Pure functions and Zod schemas, no DOM.
- **Integration (I)** — Vitest + React Testing Library. Component rendering, form state, user events.
- **End-to-end (E)** — Playwright. Full browser interaction, download assertion, cross-browser smoke.
- **Manual exploratory (M)** — Not automated. Visual quality of the generated PDF.

---

## Test Cases

### Unit — Schema

| ID | Description | Input | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-U-01 | Required issuer fields — empty string fails | `issuer.name = ""` | `ZodError` on `issuer.name` | AC-1 |
| TC-U-02 | Required issuer fields — whitespace-only fails | `issuer.name = "   "` | `ZodError` on `issuer.name` after trim | AC-7 |
| TC-U-03 | Items array — empty array fails | `items = []` | `ZodError` on `items` (min 1) | AC-2 |
| TC-U-04 | Line item — quantity = 0 fails | `quantity = 0` | `ZodError` on `quantity` | AC-3 |
| TC-U-05 | Line item — negative quantity fails | `quantity = -1` | `ZodError` on `quantity` | AC-3 |
| TC-U-06 | Line item — negative unit price fails | `unitPrice = -0.01` | `ZodError` on `unitPrice` | AC-3 |
| TC-U-07 | Valid complete quote passes | All fields valid | No `ZodError`; parsed object matches input | AC-1, AC-2, AC-3 |

### Unit — Calculation utility

| ID | Description | Input | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-U-08 | Standard case | subtotal = 1000.00, ivaRate = 21 | `ivaAmount = 210.00`, `grandTotal = 1210.00` | AC-5 |
| TC-U-09 | Fractional subtotal — no floating-point error | subtotal = 33.33, ivaRate = 10 | `ivaAmount = 3.33`, `grandTotal = 36.66` | AC-5 |
| TC-U-10 | IVA rate = 0 % | subtotal = 500.00, ivaRate = 0 | `ivaAmount = 0.00`, `grandTotal = 500.00` | AC-6 |
| TC-U-11 | Single line item total derivation | qty = 3, unitPrice = 49.99 | Line total = 149.97 (no floating-point error) | AC-5 |

### Integration — Form validation

| ID | Description | Action | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-I-01 | Button disabled on empty required fields | Render form, do not fill anything | "Generate PDF" button has `disabled` attribute | AC-1 |
| TC-I-02 | Button disabled when items list is empty | Fill all required header fields, remove all items | Button remains `disabled` | AC-2 |
| TC-I-03 | Inline error on invalid quantity | Enter `0` in a quantity field and blur | Error message rendered adjacent to the field | AC-3 |
| TC-I-04 | Inline error on whitespace-only issuer name | Enter `"   "` in issuer name and blur | Error message rendered; button stays `disabled` | AC-7 |
| TC-I-05 | Button enabled on valid complete form | Fill all required fields + 1 valid item | Button is not `disabled` | AC-1, AC-2 |
| TC-I-06 | Inline error on negative unit price | Enter `-5` in unit price and blur | Error message rendered adjacent to the field | AC-3 |

### Integration — Reactive summary panel

| ID | Description | Action | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-I-07 | Totals update on quantity change | Set qty=2, unitPrice=100, ivaRate=21; change qty to 3 | Subtotal = 300.00, IVA = 63.00, total = 363.00 | AC-4 |
| TC-I-08 | Totals update on IVA rate change | subtotal=1000, ivaRate=21; change ivaRate to 10 | IVA = 100.00, total = 1100.00 | AC-4, AC-5 |
| TC-I-09 | IVA = 0 % reflected immediately | Set ivaRate to 0 | IVA line shows € 0.00, total = subtotal | AC-6 |

### Integration — Line items

| ID | Description | Action | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-I-10 | Add item appends a new row | Click "Add item" | Row count increases by 1; new row inputs are focusable | AC-11 |
| TC-I-11 | Remove item updates totals | Add 2 items, remove one | Row count decreases by 1; totals recalculate immediately | AC-11 |

### Integration — Quote number

| ID | Description | Action | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-I-12 | Quote number pre-filled on mount | Render form | Quote number field is non-empty, value matches `QT-<digits>` pattern | AC-10 |
| TC-I-13 | Quote number editable | Clear field, type `MY-001` | Field value is `MY-001` | AC-10 |

### End-to-end

| ID | Description | Browsers | Expected outcome | AC |
| --- | --- | --- | --- | --- |
| TC-E-01 | Happy path: complete form → PDF download | Chrome | Download event fires; filename matches `quote-<YYYY-MM-DD>.pdf` | AC-8 |
| TC-E-02 | PDF content matches form input | Chrome | Parsed PDF text layer contains issuer name, recipient name, item descriptions, and correct totals | AC-9 |
| TC-E-03 | Custom quote number appears in PDF | Chrome | PDF text layer contains the user-entered quote number | AC-10 |
| TC-E-04 | Cross-browser smoke — full happy path | Firefox, Safari | Download event fires; no rendering error | AC-8 |

### Manual exploratory

| ID | Description | AC |
| --- | --- | --- |
| TC-M-01 | Visual review of PDF layout: corporate style, alternating row shading, correct font rendering, no overflow on 50+ items (EC-8) | AC-8, AC-9 |
| TC-M-02 | Visual review on mobile viewport: form is usable and scrollable | — |

---

## AC to Test Case Mapping

Every acceptance criterion is covered by at least one test case.

| AC | Test Cases |
| --- | --- |
| AC-1 — Required fields block PDF generation | TC-U-01, TC-U-07, TC-I-01, TC-I-05 |
| AC-2 — At least one line item required | TC-U-03, TC-U-07, TC-I-02, TC-I-05 |
| AC-3 — Quantity and unit price must be positive | TC-U-04, TC-U-05, TC-U-06, TC-I-03, TC-I-06 |
| AC-4 — Running totals update reactively | TC-I-07, TC-I-08 |
| AC-5 — IVA calculation is arithmetically correct | TC-U-08, TC-U-09, TC-U-11, TC-I-07, TC-I-08 |
| AC-6 — IVA rate at 0 % produces correct output | TC-U-10, TC-I-09 |
| AC-7 — Whitespace-only required fields are rejected | TC-U-02, TC-I-04 |
| AC-8 — PDF is generated and downloaded | TC-E-01, TC-E-04, TC-M-01 |
| AC-9 — PDF content matches form input | TC-E-02, TC-M-01 |
| AC-10 — Quote number is auto-generated and editable | TC-I-12, TC-I-13, TC-E-03 |
| AC-11 — Line items can be added and removed | TC-I-10, TC-I-11 |

---

## Environments

| Environment | Test types run |
| --- | --- |
| Local (developer machine) | Unit, Integration, E2E (Chrome only) |
| CI (GitHub Actions) | Unit, Integration, E2E (Chrome + Firefox) |
| Pre-release manual | E2E Safari smoke, Manual exploratory |

---

## Exit Criteria

- All unit and integration test cases pass.
- TC-E-01, TC-E-02, TC-E-03, TC-E-04 pass in CI.
- No high-severity defects open.
- Every AC has at least one passing test case.
- TC-M-01 signed off by a human reviewer before release.
