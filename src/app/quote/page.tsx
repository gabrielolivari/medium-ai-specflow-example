"use client";

import { QuoteForm } from "@/features/quote/components/quote-form";

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Quote Generator
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Fill in the details below and generate a professional PDF quote
          instantly — everything runs in your browser.
        </p>
      </div>
      <QuoteForm />
    </div>
  );
}
