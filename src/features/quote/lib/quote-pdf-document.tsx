import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Quote, QuoteTotals } from "../schemas/quote.schema";
import { formatCurrency, round2 } from "./calculations";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 7,
    color: "#9ca3af",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },
  headerRight: {
    textAlign: "right",
  },
  headerLabel: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 2,
  },
  headerValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  sectionBlock: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 10,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 9,
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  colDescription: { width: "45%" },
  colQuantity: { width: "15%", textAlign: "right" },
  colUnitPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  totalsContainer: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 220,
    paddingVertical: 3,
  },
  totalsLabel: {
    width: 120,
    textAlign: "right",
    paddingRight: 10,
    color: "#6b7280",
  },
  totalsValue: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 220,
    paddingVertical: 6,
    borderTopWidth: 1.5,
    borderTopColor: "#2563eb",
    marginTop: 4,
  },
  grandTotalLabel: {
    width: 120,
    textAlign: "right",
    paddingRight: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  grandTotalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

interface QuotePdfDocumentProps {
  data: Quote;
  totals: QuoteTotals;
}

/** Corporate-styled PDF layout. Covers FR-8, T-13. */
export function QuotePdfDocument({ data, totals }: QuotePdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
            <Text style={styles.title}>QUOTE</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerLabel}>Quote No.</Text>
            <Text style={styles.headerValue}>{data.quoteNumber}</Text>
            <Text style={[styles.headerLabel, { marginTop: 4 }]}>Date</Text>
            <Text style={styles.headerValue}>{data.date}</Text>
          </View>
        </View>

        {/* Issuer / Recipient */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.sectionText}>{data.issuer.name}</Text>
            <Text style={styles.sectionText}>Tax ID: {data.issuer.taxId}</Text>
            {data.issuer.address && (
              <Text style={styles.sectionText}>{data.issuer.address}</Text>
            )}
            {data.issuer.email && (
              <Text style={styles.sectionText}>{data.issuer.email}</Text>
            )}
          </View>
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.sectionText}>{data.recipient.name}</Text>
            {data.recipient.taxId && (
              <Text style={styles.sectionText}>
                Tax ID: {data.recipient.taxId}
              </Text>
            )}
            {data.recipient.address && (
              <Text style={styles.sectionText}>{data.recipient.address}</Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colQuantity]}>
              Qty
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>

          {data.items.map((item, index) => {
            const lineTotal = round2(item.quantity * item.unitPrice);
            return (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={styles.colDescription}>{item.description}</Text>
                <Text style={styles.colQuantity}>
                  {item.quantity.toString()}
                </Text>
                <Text style={styles.colUnitPrice}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.colTotal}>{formatCurrency(lineTotal)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {formatCurrency(totals.subtotal)}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>IVA ({data.ivaRate} %)</Text>
            <Text style={styles.totalsValue}>
              {formatCurrency(totals.ivaAmount)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(totals.grandTotal)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated with AI PDF Pro — {data.date}
        </Text>
      </Page>
    </Document>
  );
}
