"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, stripLocale, type Locale } from "./config";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Set once in the root layout from the [lang] segment. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

/** The language of the current page, in Client Components. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * The current app path without its language prefix ("/id/heroes/fanny"
 * gives "/heroes/fanny"). Use it instead of usePathname() for active states:
 * English pages are prerendered as /en/... behind a rewrite, and this keeps
 * the server and the browser in agreement.
 */
export function useAppPath(): string {
  return stripLocale(usePathname()).path;
}
