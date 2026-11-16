/**
 * Languages of the app (docs/i18n.md). English lives at the unprefixed URLs
 * (/tier-list), Indonesian under /id (/id/tier-list). Inside the app router
 * both sit under app/[lang]; next.config.ts rewrites the unprefixed URLs to
 * /en/... so every page is prerendered once per language.
 *
 * The welcome page (/) is English only.
 */
export const LOCALES = ["en", "id"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

/** BCP 47 tags for Intl formatters and Open Graph. */
export const localeTags: Record<Locale, string> = {
  en: "en-GB",
  id: "id-ID",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  id: "id_ID",
};

/** Names shown in the language switch, each in its own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

/** Paths that exist in one language only and are never prefixed. */
const UNLOCALIZED = ["/", "/api", "/data"];

const isUnlocalized = (path: string) =>
  UNLOCALIZED.some((base) =>
    base === "/" ? path === "/" : path === base || path.startsWith(`${base}/`),
  );

/**
 * The URL of an app path in a language: "/heroes" stays "/heroes" in English
 * and becomes "/id/heroes" in Indonesian. Query strings and hashes are kept.
 * External links, the welcome page and the data routes are left alone.
 */
export function localizeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const end = href.search(/[?#]/);
  const path = end === -1 ? href : href.slice(0, end);
  const rest = end === -1 ? "" : href.slice(end);
  const bare = stripLocale(path).path;
  if (locale === DEFAULT_LOCALE || isUnlocalized(bare)) return bare + rest;
  return `/${locale}${bare}${rest}`;
}

/**
 * Splits a pathname into its language and the app path. "/id/heroes" gives
 * id and "/heroes". "/en/heroes" (how English pages are prerendered behind
 * the rewrite) and "/heroes" (what the browser shows) both give en and
 * "/heroes", so the server and the browser agree during hydration.
 */
export function stripLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const match = /^\/(en|id)(?=\/|$)/.exec(pathname);
  if (!match) return { locale: DEFAULT_LOCALE, path: pathname || "/" };
  const path = pathname.slice(match[0].length) || "/";
  return { locale: match[1] as Locale, path };
}
