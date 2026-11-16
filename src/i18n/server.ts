import "server-only";

import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/**
 * The language of the page being rendered, from the [lang] segment of the
 * root layout. Works in any Server Component and in generateMetadata,
 * without passing the language down as a prop. Client Components use
 * useLocale() from "@/i18n/client" instead.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
