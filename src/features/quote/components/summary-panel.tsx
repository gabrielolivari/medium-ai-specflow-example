"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { Quote } from "../schemas/quote.schema";
import { calculateTotals, formatCurrency } from "../lib/calculations";

/** Reactive summary panel showing subtotal, IVA, and grand total. Covers FR-5, AC-4. */
export function SummaryPanel() {
  const { control } = useFormContext<Quote>();
  const items = useWatch({ control, name: "items" });
  const ivaRate = useWatch({ control, name: "ivaRate" });

  const validItems = (items ?? []).filter(
    (item) =>
      typeof item.quantity === "number" &&
      item.quantity > 0 &&
      typeof item.unitPrice === "number" &&
      item.unitPrice > 0
  );

  const safeIvaRate = typeof ivaRate === "number" && ivaRate >= 0 ? ivaRate : 0;
  const { subtotal, ivaAmount, grandTotal } = calculateTotals(
    validItems,
    safeIvaRate
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Summary
      </h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-600">Subtotal</dt>
          <dd className="font-medium text-zinc-900" data-testid="subtotal">
            {formatCurrency(subtotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-600">IVA ({safeIvaRate} %)</dt>
          <dd className="font-medium text-zinc-900" data-testid="iva-amount">
            {formatCurrency(ivaAmount)}
          </dd>
        </div>
        <hr className="border-zinc-200" />
        <div className="flex justify-between text-base font-bold">
          <dt className="text-zinc-900">Grand Total</dt>
          <dd className="text-zinc-900" data-testid="grand-total">
            {formatCurrency(grandTotal)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
