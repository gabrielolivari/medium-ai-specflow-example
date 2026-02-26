---
id: US-0001-generate-pdf-quote
title: Generate a downloadable PDF quote from a single-page form
status: in-progress
owner: tbd
created_at: 2026-02-25
updated_at: 2026-02-25
related_adrs: []
---

# Context

AI PDF Pro targets freelancers and independent professionals who need to produce clean, professional-looking quotes quickly. The target user has no access to (or desire for) design tools like Figma or Adobe, and finds spreadsheet-based quotes error-prone and time-consuming.

The application runs entirely in the browser — no backend, no authentication, no persistence. This is not merely a technical preference; it is a **product constraint**: keeping the tool server-free eliminates operational costs and removes any onboarding friction (no account registration required). The download is the only output artifact.

This story covers the complete primary value loop of the product: fill in a form → preview live totals → download a print-ready PDF.

# Problem Statement

Freelancers currently generate quotes using spreadsheets or word processors, which require manual tax calculations, offer poor visual quality, and are prone to formula errors. There is no lightweight, browser-native tool that takes structured input (issuer, recipient, line items) and produces a print-ready, IVA-compliant PDF without any server dependency or account registration.

# Goals

- Allow a freelancer to fill in a single-page form with issuer details, recipient details, and one or more service line items.
- Automatically calculate subtotal, IVA amount, and grand total from line item quantities and unit prices.
- Generate and download a clean, corporate-styled PDF entirely client-side, with zero server round-trips.
- Validate all required fields strictly before allowing PDF generation.

# Non-Goals

- No persistence in a database (quotes are ephemeral; download is the only output).
- No multi-currency support — the form operates in a single local currency only.
- No email delivery from within the application.
- No user accounts, authentication, or session management.
- No quote history or list view.
- No server-side rendering of the PDF (must be purely client-side).

# Business Rules

- BR-1: IVA is calculated as a fixed percentage applied to the sum of all line item totals. The percentage value must be configurable per quote (default: 21 %).
- BR-2: Line item total = quantity × unit price. Both fields must be positive numbers.
- BR-3: A quote must have at least one line item before PDF generation is allowed.
- BR-4: Issuer name, issuer tax ID, recipient name, and quote date are mandatory fields.
- BR-5: The PDF must include: issuer block, recipient block, itemised table (description, quantity, unit price, line total), subtotal, IVA line, and grand total.
- BR-6: All monetary values displayed in the PDF must be formatted to two decimal places with the currency symbol.
- BR-7: PDF generation runs entirely in the browser; no form data leaves the client.

# Functional Requirements

- FR-1: The page renders a single form divided into three sections: **Issuer**, **Recipient**, and **Line Items**.
- FR-2: The Issuer section collects: full name / company name, tax ID (NIF/CIF), address (optional), and email (optional).
- FR-3: The Recipient section collects: full name / company name, tax ID (optional), and address (optional).
- FR-4: The Line Items section allows adding, editing, and removing rows. Each row has: description (required), quantity (required, positive integer), and unit price (required, positive decimal).
- FR-5: A running summary panel (or footer) displays subtotal, IVA amount, and grand total, updating reactively as the user edits line items or the IVA rate.
- FR-6: A "Generate PDF" button is disabled until all required fields pass Zod validation.
- FR-7: On valid submission, a PDF is generated client-side and immediately triggers a browser download (filename: `quote-<YYYY-MM-DD>.pdf`).
- FR-8: The PDF layout follows a clean corporate style: logotype area (placeholder), section headers, an itemised table with alternating row shading, and a totals block.
- FR-9: Form validation uses React Hook Form + Zod; all validation errors are displayed inline next to the offending field.
- FR-10: The quote number field is auto-generated (e.g., `QT-<timestamp>`) but editable by the user.

# Edge Cases

- EC-1: User removes all line items — the "Generate PDF" button must remain disabled and an inline validation message must appear.
- EC-2: User enters 0 or a negative value for quantity or unit price — the field must show an inline error and block submission.
- EC-3: Very long description text in a line item — the PDF renderer must wrap text within the table cell; it must not overflow or clip.
- EC-4: IVA rate set to 0 % — the IVA line in the PDF must display € 0.00 and grand total must equal subtotal.
- EC-5: User navigates away and returns — no data is recovered (no persistence); the form resets to its empty initial state.
- EC-6: Client browser does not support the PDF generation library — a user-visible error message must be shown; the download must not silently fail or produce a corrupt file.
- EC-7: User enters only whitespace in a required text field (e.g. issuer name) — whitespace-only strings must fail validation; `.trim()` must be applied before the Zod check.
- EC-8: Very large number of line items (e.g. 50+) — the PDF must still render correctly without truncating rows or layout overflow.

# Dependencies

- **Client-side PDF library**: A browser-compatible library capable of rendering a structured, styled document (e.g., `@react-pdf/renderer` or `jsPDF` + `html2canvas`). Choice to be decided during implementation; the spec is library-agnostic.
- **React Hook Form + Zod**: Already part of the project stack per the project profile.
- **TailwindCSS + shadcn/ui**: Already part of the project stack; used for the form UI and summary panel.
- **Next.js App Router**: The page lives under `/app/` as a Client Component (`"use client"`) given the interactive and PDF-generation requirements.

# Risks

- **R-1 — PDF library bundle size**: Client-side PDF libraries can add 200–500 KB to the JS bundle. Mitigation: lazy-load the PDF generation module only when the user clicks "Generate PDF" (dynamic import).
- **R-2 — Cross-browser PDF rendering inconsistency**: Font rendering and layout may differ between browsers. Mitigation: embed fonts explicitly in the PDF and test on Chrome, Firefox, and Safari before release.
- **R-3 — IVA rate hardcoding**: Different markets apply different rates; hardcoding 21 % limits reuse. Mitigation: the rate is editable per quote (BR-1), no logic depends on a hardcoded constant.
- **R-4 — Floating-point arithmetic errors**: JS floating-point can produce values like `10.000000000001`. Mitigation: use a fixed-precision arithmetic utility (e.g., multiply by 100, round, divide) or a library like `dinero.js` for all monetary calculations.

---

> **Open questions for the team**
>
> 1. Which client-side PDF library should be used? (`@react-pdf/renderer` gives full React-based layout control; `jsPDF` is lighter but requires manual coordinate drawing.) Decision needed before implementation starts.
> 2. Should the IVA percentage be a free-text input or a predefined dropdown (e.g., 0 %, 10 %, 21 %)? Current spec treats it as a numeric input; product owner should confirm.
> 3. Is a company logo upload (for the issuer block) in scope for V1, or strictly out of scope?
