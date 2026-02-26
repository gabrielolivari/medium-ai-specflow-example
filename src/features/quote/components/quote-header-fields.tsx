"use client";

import { useFormContext } from "react-hook-form";
import type { Quote } from "../schemas/quote.schema";
import { FieldErrorMessage } from "./field-error";

/** Quote header: quote number, date, and IVA rate. Covers FR-10, BR-1. */
export function QuoteHeaderFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Quote>();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label
          htmlFor="quoteNumber"
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          Quote Number *
        </label>
        <input
          id="quoteNumber"
          type="text"
          {...register("quoteNumber")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <FieldErrorMessage error={errors.quoteNumber} />
      </div>

      <div>
        <label
          htmlFor="date"
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          Date *
        </label>
        <input
          id="date"
          type="date"
          {...register("date")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <FieldErrorMessage error={errors.date} />
      </div>

      <div>
        <label
          htmlFor="ivaRate"
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          IVA Rate (%)
        </label>
        <input
          id="ivaRate"
          type="number"
          min={0}
          max={100}
          step={1}
          {...register("ivaRate", { valueAsNumber: true })}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <FieldErrorMessage error={errors.ivaRate} />
      </div>
    </div>
  );
}
