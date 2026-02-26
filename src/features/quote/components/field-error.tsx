"use client";

import type { FieldError } from "react-hook-form";

interface FieldErrorMessageProps {
  error: FieldError | undefined;
}

/** Inline validation error message rendered adjacent to a form field. Covers FR-9. */
export function FieldErrorMessage({ error }: FieldErrorMessageProps) {
  if (!error?.message) return null;
  return (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {error.message}
    </p>
  );
}
