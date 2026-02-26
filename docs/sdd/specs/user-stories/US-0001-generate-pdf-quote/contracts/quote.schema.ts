/**
 * US-0001 — Data Contract: Quote Schema
 *
 * This file is a SPEC-LEVEL PROPOSAL, not a production file.
 * It defines the Zod schemas and derived TypeScript types that govern the
 * quote form data model. All monetary values are handled as numbers with
 * two-decimal precision in the display layer.
 *
 * STATUS: Draft — awaiting human validation before implementation.
 *
 * Open assumptions:
 *   [A1] IVA rate is a free-text numeric input (not a dropdown).
 *         → If a dropdown is decided, `ivaRate` enum values must be added here.
 *   [A2] Currency symbol is hardcoded to the local currency (€).
 *         → If multi-currency is introduced, a `currency` field must be added.
 *   [A3] Issuer logo upload is out of scope for V1.
 *         → If added, a `logoDataUrl: z.string().url().optional()` field is needed on IssuerSchema.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** A positive decimal number (e.g. unit price, quantity). */
const PositiveNumber = z
  .number({ invalid_type_error: "Must be a number" })
  .positive("Must be greater than 0");

/** A non-empty string after trimming whitespace. */
const RequiredString = z.string().trim().min(1, "This field is required");

/** An optional string — empty strings are coerced to undefined. */
const OptionalString = z.string().trim().optional();

// ---------------------------------------------------------------------------
// Issuer
// ---------------------------------------------------------------------------

export const IssuerSchema = z.object({
  /** Full name or company name of the invoice issuer. Required. */
  name: RequiredString,
  /** Tax identification number (NIF / CIF). Required. */
  taxId: RequiredString,
  /** Postal address of the issuer. Optional. */
  address: OptionalString,
  /** Contact email of the issuer. Optional. */
  email: z
    .string()
    .trim()
    .email("Must be a valid email address")
    .optional()
    .or(z.literal("")),
});

export type Issuer = z.infer<typeof IssuerSchema>;

// ---------------------------------------------------------------------------
// Recipient
// ---------------------------------------------------------------------------

export const RecipientSchema = z.object({
  /** Full name or company name of the quote recipient. Required. */
  name: RequiredString,
  /** Tax identification number of the recipient. Optional. */
  taxId: OptionalString,
  /** Postal address of the recipient. Optional. */
  address: OptionalString,
});

export type Recipient = z.infer<typeof RecipientSchema>;

// ---------------------------------------------------------------------------
// Line Item
// ---------------------------------------------------------------------------

export const LineItemSchema = z.object({
  /** Short description of the service or product. Required. */
  description: RequiredString,
  /**
   * Number of units. Must be a positive integer.
   * Decimal quantities are not supported in V1.
   */
  quantity: z
    .number()
    .int("Must be a whole number")
    .positive("Must be greater than 0"),
  /** Price per unit in the local currency. Must be a positive decimal. */
  unitPrice: PositiveNumber,
});

export type LineItem = z.infer<typeof LineItemSchema>;

// ---------------------------------------------------------------------------
// Quote (root)
// ---------------------------------------------------------------------------

export const QuoteSchema = z.object({
  /**
   * Auto-generated quote identifier (format: `QT-<timestamp>`).
   * The user may overwrite it with a custom value.
   */
  quoteNumber: RequiredString,
  /**
   * Date of the quote in ISO 8601 format (YYYY-MM-DD).
   * Used as the date shown on the PDF and in the download filename.
   */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)"),
  /** IVA rate expressed as a percentage (e.g. 21 for 21 %). Must be 0 or positive. */
  ivaRate: z
    .number({ invalid_type_error: "Must be a number" })
    .min(0, "IVA rate cannot be negative")
    .max(100, "IVA rate cannot exceed 100 %"),
  issuer: IssuerSchema,
  recipient: RecipientSchema,
  /**
   * At least one line item is required.
   * The `.min(1)` constraint enforces AC-2.
   */
  items: z.array(LineItemSchema).min(1, "At least one item is required"),
});

export type Quote = z.infer<typeof QuoteSchema>;

// ---------------------------------------------------------------------------
// Computed totals (derived — not stored in the form schema)
// ---------------------------------------------------------------------------

/**
 * Represents the computed monetary summary displayed in the summary panel
 * and rendered in the PDF. These values are derived from `Quote` at render
 * time and are never persisted or submitted.
 */
export interface QuoteTotals {
  /** Sum of all line item totals (quantity × unitPrice). */
  subtotal: number;
  /** IVA amount = round(subtotal × ivaRate / 100, 2). */
  ivaAmount: number;
  /** Grand total = subtotal + ivaAmount. */
  grandTotal: number;
}
