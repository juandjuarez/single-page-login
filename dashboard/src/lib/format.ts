const compactFormatter = new Intl.NumberFormat("es", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullFormatter = new Intl.NumberFormat("es");

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** e.g. 12345 -> "12,3 mil" / 1200000 -> "1,2 M" */
export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value);
}

/** e.g. 12345 -> "12.345" */
export function formatNumber(value: number): string {
  return fullFormatter.format(value);
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return dateFormatter.format(new Date(iso));
}
