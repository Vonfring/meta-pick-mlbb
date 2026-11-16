import type { Metadata } from "next";
import { localizeHref, ogLocales, type Locale } from "./config";

/**
 * Canonical URL and hreflang alternates of an app page in one language.
 * English pages are rendered as /en/... behind a rewrite, so the canonical
 * URL is always set explicitly to the address visitors see.
 */
export function localeAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizeHref(locale, path),
    languages: {
      en: localizeHref("en", path),
      id: localizeHref("id", path),
      "x-default": localizeHref("en", path),
    },
  };
}

/**
 * Metadata for an app page: title, description, canonical URL, hreflang
 * alternates and the Open Graph URL and locale.
 *
 *   export async function generateMetadata() {
 *     const locale = await getLocale();
 *     const t = tierListText[locale];
 *     return pageMetadata(locale, "/tier-list", { title: t.title, description: t.metaDescription });
 *   }
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title?: string; description?: string },
): Metadata {
  return {
    ...(title === undefined ? {} : { title }),
    ...(description === undefined ? {} : { description }),
    alternates: localeAlternates(locale, path),
    // A page's openGraph replaces the layout's whole object, so repeat the
    // shared fields here.
    openGraph: {
      type: "website",
      siteName: "Metapick MLBB",
      url: localizeHref(locale, path),
      locale: ogLocales[locale],
      ...(title === undefined ? {} : { title }),
      ...(description === undefined ? {} : { description }),
    },
  };
}
