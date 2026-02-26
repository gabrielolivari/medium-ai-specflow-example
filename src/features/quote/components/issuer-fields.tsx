"use client";

import { useFormContext } from "react-hook-form";
import type { Quote } from "../schemas/quote.schema";
import { FieldErrorMessage } from "./field-error";

/** Issuer section of the quote form. Covers FR-2. */
export function IssuerFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Quote>();

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold text-zinc-900">Issuer</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="issuer.name"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Name / Company *
          </label>
          <input
            id="issuer.name"
            type="text"
            {...register("issuer.name")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldErrorMessage error={errors.issuer?.name} />
        </div>

        <div>
          <label
            htmlFor="issuer.taxId"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Tax ID (NIF/CIF) *
          </label>
          <input
            id="issuer.taxId"
            type="text"
            {...register("issuer.taxId")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldErrorMessage error={errors.issuer?.taxId} />
        </div>

        <div>
          <label
            htmlFor="issuer.address"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Address
          </label>
          <input
            id="issuer.address"
            type="text"
            {...register("issuer.address")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="issuer.email"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Email
          </label>
          <input
            id="issuer.email"
            type="email"
            {...register("issuer.email")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldErrorMessage error={errors.issuer?.email} />
        </div>
      </div>
    </fieldset>
  );
}
