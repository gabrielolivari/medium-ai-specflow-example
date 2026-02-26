import { pdf } from "@react-pdf/renderer";
import type { Quote, QuoteTotals } from "../schemas/quote.schema";
import { QuotePdfDocument } from "./quote-pdf-document";

/**
 * Generates a PDF blob from quote data and triggers a browser download.
 * This module is lazy-loaded via dynamic import to mitigate R-1 (bundle size).
 * Covers FR-7, AC-8, T-12, T-14.
 */
export async function generateAndDownloadPdf(
  data: Quote,
  totals: QuoteTotals,
): Promise<void> {
  const blob = await pdf(
    <QuotePdfDocument data={data} totals={totals} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quote-${data.date}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
