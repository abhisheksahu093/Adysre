import type { InvoiceDocument, LineItem } from './types';
import { computeTotals, lineAmount } from './totals';

/**
 * Export/import - moving a document in and out of ADYSRE, all offline.
 *
 * JSON is the loss-less round-trip (the whole document). CSV covers the line
 * items, which is what a spreadsheet or an accounting import actually wants. The
 * CSV parser is deliberately small but correct about quoted fields and commas.
 */

export function toJson(doc: InvoiceDocument): string {
  return JSON.stringify({ document: doc, totals: computeTotals(doc) }, null, 2);
}

function csvCell(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Line items as CSV, with an amount column derived from the totals engine. */
export function toItemsCsv(doc: InvoiceDocument): string {
  const rows: Array<Array<string | number>> = [
    ['Description', 'Quantity', 'Unit Price', 'Amount'],
    ...doc.items.map((item) => [
      item.description,
      item.quantity,
      item.unitPrice,
      lineAmount(item).toFixed(2),
    ]),
  ];
  // Escaping happens once, here, for every cell.
  return rows.map((row) => row.map(csvCell).join(',')).join('\n');
}

/** Parse a CSV line respecting `"quoted, fields"` and doubled `""` quotes. */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }
  out.push(cell);
  return out;
}

/**
 * Parse a line-items CSV into `LineItem`s. Tolerant of a header row and of the
 * common column names (description/item, qty/quantity, price/rate/unit price).
 * `idFactory` is injectable so callers control id generation (and tests stay
 * deterministic).
 */
export function parseItemsCsv(text: string, idFactory: () => string): LineItem[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const header = parseCsvLine(lines[0]!).map((h) => h.toLowerCase().trim());
  const hasHeader = header.some((h) => /desc|item|qty|quantity|price|rate|amount/.test(h));

  const col = (names: string[]): number => header.findIndex((h) => names.some((n) => h.includes(n)));
  const descI = hasHeader ? col(['desc', 'item']) : 0;
  const qtyI = hasHeader ? col(['qty', 'quantity']) : 1;
  const priceI = hasHeader ? col(['price', 'rate', 'unit']) : 2;

  const dataLines = hasHeader ? lines.slice(1) : lines;
  return dataLines.map((line) => {
    const cells = parseCsvLine(line);
    return {
      id: idFactory(),
      description: (cells[descI] ?? '').trim(),
      quantity: Number(cells[qtyI]) || 0,
      unitPrice: Number(cells[priceI]) || 0,
    };
  });
}
