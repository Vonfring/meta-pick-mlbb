/**
 * Display helpers. Rates and deltas are stored as fractions (0.523 = 52.3%).
 * Every formatter takes the page's language: Indonesian uses a decimal comma
 * ("52,3%") and Indonesian month names ("14 Okt 2026").
 */
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const noData: Record<Locale, string> = { en: "No data", id: "Belum ada data" };

/** Swaps the decimal point for a comma in Indonesian. */
const decimal = (text: string, locale: Locale) =>
  locale === "id" ? text.replace(".", ",") : text;

export function formatPercent(
  fraction: number | null | undefined,
  digits = 1,
  locale: Locale = DEFAULT_LOCALE,
): string {
  if (fraction === null || fraction === undefined || Number.isNaN(fraction))
    return noData[locale];
  return `${decimal((fraction * 100).toFixed(digits), locale)}%`;
}

/** Signed points with a true minus sign: "+4.8", "−1.2", "0.0" ("+4,8" in Indonesian). */
export function formatPoints(
  points: number,
  digits = 1,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const rounded = Number(points.toFixed(digits));
  const text = decimal(Math.abs(rounded).toFixed(digits), locale);
  return rounded > 0 ? `+${text}` : rounded < 0 ? `−${text}` : text;
}

/** A plain number with a fixed number of decimals: "3.2" ("3,2" in Indonesian). */
export function formatDecimal(
  value: number,
  digits = 1,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return decimal(value.toFixed(digits), locale);
}

const dateFormats: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
  id: new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
};

/** "14 Oct 2026" ("14 Okt 2026" in Indonesian) from an ISO date or timestamp. */
export function formatDate(
  iso: string,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return dateFormats[locale].format(
    new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso),
  );
}

const goldFormats: Record<Locale, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-US"),
  id: new Intl.NumberFormat("id-ID"),
};

/** "2,150" ("2.150" in Indonesian). */
export function formatGold(
  amount: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return goldFormats[locale].format(amount);
}

/** Two-letter fallback for a missing portrait: "Yi Sun-shin" gives "YS", "Fanny" gives "FA". */
export function initials(name: string): string {
  const parts = name
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .split(/[\s-]+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

/** Lowercase, accent-free text for forgiving search ("Chang'e" matches "change"). */
export function searchKey(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Sorts names the same way on the server and in every browser. A plain
 * localeCompare follows the visitor's language (Danish puts "Aa" last), so
 * a list sorted on both sides would no longer match after hydration.
 */
export const compareNames = new Intl.Collator("en").compare;
