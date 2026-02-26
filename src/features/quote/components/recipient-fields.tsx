"use client";

import { useFormContext } from "react-hook-form";
import type { Quote } from "../schemas/quote.schema";
import { FieldErrorMessage } from "./field-error";

/** Recipient section of the quote form. Covers FR-3. */
export function RecipientFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Quote>();

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold text-zinc-900">Recipient</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="recipient.name"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Name / Company *
          </label>
          <input
            id="recipient.name"
            type="text"
            {...register("recipient.name")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldErrorMessage error={errors.recipient?.name} />
        </div>

        <div>
          <label
            htmlFor="recipient.taxId"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Tax ID
          </label>
          <input
            id="recipient.taxId"
            type="text"
            {...register("recipient.taxId")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="recipient.address"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Address
          </label>
          <input
            id="recipient.address"
            type="text"
            {...register("recipient.address")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </fieldset>
  );
}
