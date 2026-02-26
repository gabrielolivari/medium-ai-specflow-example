"use client";

import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileDown, Loader2 } from "lucide-react";
import { QuoteSchema, type Quote } from "../schemas/quote.schema";
import { calculateTotals } from "../lib/calculations";
import { QuoteHeaderFields } from "./quote-header-fields";
import { IssuerFields } from "./issuer-fields";
import { RecipientFields } from "./recipient-fields";
import { LineItemsFields } from "./line-items-fields";
import { SummaryPanel } from "./summary-panel";

function generateQuoteNumber(): string {
  return `QT-${Date.now()}`;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Root quote form component. Orchestrates all sections, validation gate,
 * and PDF generation trigger. Covers FR-1, FR-6, FR-9, T-16, T-15.
 */
export function QuoteForm() {
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const methods = useForm<Quote>({
    resolver: zodResolver(QuoteSchema),
    mode: "onBlur",
    defaultValues: {
      quoteNumber: generateQuoteNumber(),
      date: todayISO(),
      ivaRate: 21,
      issuer: { name: "", taxId: "", address: "", email: "" },
      recipient: { name: "", taxId: "", address: "" },
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = useCallback(async (data: Quote) => {
    setPdfError(null);
    setGenerating(true);
    try {
      const totals = calculateTotals(data.items, data.ivaRate);
      const { generateAndDownloadPdf } = await import(
        "../lib/generate-pdf"
      );
      await generateAndDownloadPdf(data, totals);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      setPdfError(`PDF generation failed: ${message}`);
    } finally {
      setGenerating(false);
    }
  }, []);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-8"
      >
        <QuoteHeaderFields />

        <div className="grid gap-8 lg:grid-cols-2">
          <IssuerFields />
          <RecipientFields />
        </div>

        <LineItemsFields />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div />
          <SummaryPanel />
        </div>

        {pdfError && (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {pdfError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || generating}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <FileDown size={16} />
                Generate PDF
              </>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
