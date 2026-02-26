/**
 * Production Zod schemas for the Quote form.
 *
 * Decisions resolved from spec proposal (contracts/quote.schema.ts):
 *   [A1] IVA rate → free-text numeric input (not a dropdown).
 *   [A2] Currency symbol → hardcoded to € (EUR). Single currency for V1.
 *   [A3] Logo upload → out of scope for V1.
 */

import { z } from "zod";

const PositiveNumber = z
  .number({ error: "Must be a number" })
  .positive("Must be greater than 0");

const RequiredString = z.string().trim().min(1, "This field is required");

const OptionalString = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const IssuerSchema = z.object({
  name: RequiredString,
  taxId: RequiredString,
  address: OptionalString,
  email: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().email("Must be a valid email address").optional())
    .optional(),
});

export type Issuer = z.infer<typeof IssuerSchema>;

export const RecipientSchema = z.object({
  name: RequiredString,
  taxId: OptionalString,
  address: OptionalString,
});

export type Recipient = z.infer<typeof RecipientSchema>;

export const LineItemSchema = z.object({
  description: RequiredString,
  quantity: z
    .number({ error: "Must be a number" })
    .int("Must be a whole number")
    .positive("Must be greater than 0"),
  unitPrice: PositiveNumber,
});

export type LineItem = z.infer<typeof LineItemSchema>;

export const QuoteSchema = z.object({
  quoteNumber: RequiredString,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)"),
  ivaRate: z
    .number({ error: "Must be a number" })
    .min(0, "IVA rate cannot be negative")
    .max(100, "IVA rate cannot exceed 100 %"),
  issuer: IssuerSchema,
  recipient: RecipientSchema,
  items: z.array(LineItemSchema).min(1, "At least one item is required"),
});

export type Quote = z.infer<typeof QuoteSchema>;

export interface QuoteTotals {
  subtotal: number;
  ivaAmount: number;
  grandTotal: number;
}
