"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { Quote } from "../schemas/quote.schema";
import { FieldErrorMessage } from "./field-error";

/** Dynamic line items list with add/remove. Covers FR-4, AC-11. */
export function LineItemsFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<Quote>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold text-zinc-900">
        Line Items
      </legend>

      {errors.items?.root && (
        <p className="text-sm text-red-600" role="alert">
          {errors.items.root.message}
        </p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-[1fr_80px_100px_40px] items-start gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3"
          >
            <div>
              <label
                htmlFor={`items.${index}.description`}
                className="mb-1 block text-xs font-medium text-zinc-600"
              >
                Description *
              </label>
              <input
                id={`items.${index}.description`}
                type="text"
                {...register(`items.${index}.description`)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <FieldErrorMessage error={errors.items?.[index]?.description} />
            </div>

            <div>
              <label
                htmlFor={`items.${index}.quantity`}
                className="mb-1 block text-xs font-medium text-zinc-600"
              >
                Qty *
              </label>
              <input
                id={`items.${index}.quantity`}
                type="number"
                min={1}
                step={1}
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <FieldErrorMessage error={errors.items?.[index]?.quantity} />
            </div>

            <div>
              <label
                htmlFor={`items.${index}.unitPrice`}
                className="mb-1 block text-xs font-medium text-zinc-600"
              >
                Unit Price *
              </label>
              <input
                id={`items.${index}.unitPrice`}
                type="number"
                min={0.01}
                step={0.01}
                {...register(`items.${index}.unitPrice`, {
                  valueAsNumber: true,
                })}
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <FieldErrorMessage error={errors.items?.[index]?.unitPrice} />
            </div>

            <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 hover:border-blue-400 hover:text-blue-600"
      >
        <Plus size={16} />
        Add item
      </button>
    </fieldset>
  );
}
