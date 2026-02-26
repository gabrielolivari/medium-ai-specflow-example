import type { QuoteTotals } from "../schemas/quote.schema";

interface LineItemInput {
  quantity: number;
  unitPrice: number;
}

/** Fixed-precision rounding to 2 decimal places. Mitigates R-4 (floating-point). */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Computes subtotal, IVA amount, and grand total from line items and an IVA rate.
 * Covers BR-1, BR-2, and R-4.
 */
export function calculateTotals(
  items: LineItemInput[],
  ivaRate: number
): QuoteTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + round2(item.quantity * item.unitPrice),
    0
  );
  const roundedSubtotal = round2(subtotal);
  const ivaAmount = round2(roundedSubtotal * (ivaRate / 100));
  const grandTotal = round2(roundedSubtotal + ivaAmount);

  return { subtotal: roundedSubtotal, ivaAmount, grandTotal };
}

const CURRENCY_SYMBOL = "€";

/** Formats a number to `€ 1.234,56` (ES locale, 2 decimals). Covers BR-6. */
export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${CURRENCY_SYMBOL} ${formatted}`;
}
