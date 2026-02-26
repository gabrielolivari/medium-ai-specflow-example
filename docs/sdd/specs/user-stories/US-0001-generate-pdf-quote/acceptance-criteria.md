# Acceptance Criteria

## AC-1 — Required fields block PDF generation

Given the user has opened the quote form  
When one or more required fields (issuer name, issuer tax ID, recipient name, or quote date) are empty or blank  
Then the "Generate PDF" button is disabled and each offending field displays an inline validation error message.

**Validation notes**: Covered by a React Hook Form + Zod integration test asserting button `disabled` state and the presence of error messages in the DOM.

---

## AC-2 — At least one line item is required

Given the user has filled in all issuer and recipient required fields  
When the line items list is empty  
Then the "Generate PDF" button remains disabled and a validation message is shown indicating that at least one item is required.

**Validation notes**: Unit test on the Zod schema asserting that an empty `items` array fails validation; integration test asserting disabled button state.

---

## AC-3 — Line item quantity and unit price must be positive

Given the user is filling in a line item  
When the user enters 0, a negative number, or non-numeric text in the quantity or unit price field  
Then the field displays an inline error and the row is excluded from totals calculation until corrected.

**Validation notes**: Zod schema unit test for boundary values (`0`, `-1`, `0.001`); integration test for inline error rendering.

---

## AC-4 — Running totals update reactively

Given the user has at least one valid line item  
When the user changes a quantity, unit price, or the IVA rate  
Then the subtotal, IVA amount, and grand total in the summary panel update immediately without any explicit user action (e.g., no "Recalculate" button).

**Validation notes**: Integration test using React Testing Library — simulate input change events and assert updated text content in the summary panel.

---

## AC-5 — IVA calculation is arithmetically correct

Given a quote with line items summing to a known subtotal S and an IVA rate of R %  
When the user reviews the summary panel or generates the PDF  
Then IVA amount = round(S × R / 100, 2) and grand total = S + IVA amount, with no floating-point display errors.

**Validation notes**: Unit tests with known fixtures (e.g., subtotal = 1000.00, IVA 21 % → IVA = 210.00, total = 1210.00; and a fractional case such as subtotal = 33.33, IVA 10 % → IVA = 3.33, total = 36.66).

---

## AC-6 — IVA rate at 0 % produces correct output

Given the user sets the IVA rate to 0 %  
When the summary panel updates  
Then the IVA line shows € 0.00 and grand total equals subtotal exactly.

**Validation notes**: Unit test on the calculation function; integration test asserting the rendered value in the summary panel.

---

## AC-7 — Whitespace-only required fields are rejected

Given the user types only spaces or tabs into a required text field (e.g. issuer name)  
When the form validates (on blur or on submit attempt)  
Then the field is treated as empty, an inline error is shown, and PDF generation is blocked.

**Validation notes**: Zod schema unit test using `z.string().trim().min(1)` with inputs like `"   "`.

---

## AC-8 — PDF is generated and downloaded on valid submission

Given all required fields are filled and at least one valid line item exists  
When the user clicks "Generate PDF"  
Then a PDF file is downloaded by the browser with the filename `quote-<YYYY-MM-DD>.pdf` (where the date matches the quote date field), and the download occurs without a page reload or server request.

**Validation notes**: E2E test (Playwright) filling the form completely, clicking the button, and asserting a download event occurs with the expected filename pattern.

---

## AC-9 — PDF content matches form input

Given a valid quote form submission with known input data  
When the PDF is generated  
Then the PDF contains: issuer name, recipient name, all line item descriptions, subtotal, IVA amount, and grand total — matching the values shown in the summary panel.

**Validation notes**: E2E or snapshot test parsing the generated PDF text layer and asserting the presence of key string values.

---

## AC-10 — Quote number is auto-generated and editable

Given the user opens the form  
When the form loads  
Then the quote number field is pre-filled with an auto-generated value (format `QT-<timestamp>`); the user can clear and overwrite it with a custom value, and the custom value appears in the generated PDF.

**Validation notes**: Integration test asserting that the field has a non-empty default value on mount; integration test asserting that an edited value is reflected in the PDF generation call.

---

## AC-11 — Line items can be added and removed

Given the user is on the form  
When the user clicks "Add item"  
Then a new empty row is appended to the line items list and is focusable.

When the user clicks the remove button on an existing row  
Then that row is removed from the list, and totals recalculate immediately.

**Validation notes**: Integration tests for both add and remove interactions, asserting DOM row count and updated totals.
