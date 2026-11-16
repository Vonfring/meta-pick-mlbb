"use client";

import { useSyncExternalStore } from "react";
import { LOCALES, localeNames, localizeHref, type Locale } from "@/i18n/config";
import { useAppPath, useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { cn } from "@/lib/utils";

const short: Record<Locale, string> = { en: "EN", id: "ID" };

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener("metapick:urlparams", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("metapick:urlparams", onChange);
  };
};

/**
 * The same page in another language, with the current filters: the query
 * string holds the tool state, so it is carried over. The server and the
 * prerendered HTML link without it; the browser adds it after hydration.
 */
function useLocaleHref() {
  const path = useAppPath();
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  return (locale: Locale) => localizeHref(locale, path + search);
}

/** Two-way language switch for the sidebar and the More drawer. */
export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const hrefFor = useLocaleHref();

  return (
    <nav
      aria-label={common[locale].shell.language}
      className={cn(
        "grid grid-cols-2 gap-1 rounded-md border bg-surface-2 p-1",
        className,
      )}
    >
      {LOCALES.map((option) => {
        const current = option === locale;
        return (
          // A plain link reloads the page, so the whole document (including
          // <html lang>) is rendered in the new language.
          <a
            key={option}
            href={hrefFor(option)}
            hrefLang={option}
            lang={option}
            aria-current={current ? "true" : undefined}
            className={cn(
              "flex h-8 items-center justify-center rounded-[7px] text-xs font-medium text-muted-foreground transition-colors",
              "hover:text-foreground",
              current &&
                "bg-surface text-foreground shadow-[var(--shadow-panel)]",
            )}
          >
            {localeNames[option]}
          </a>
        );
      })}
    </nav>
  );
}

/** Compact link to the other language for the mobile top bar. */
export function LanguageToggleButton({ className }: { className?: string }) {
  const locale = useLocale();
  const hrefFor = useLocaleHref();
  const other: Locale = locale === "en" ? "id" : "en";

  return (
    <a
      href={hrefFor(other)}
      hrefLang={other}
      lang={other}
      aria-label={localeNames[other]}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center rounded-md px-2 font-display text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
        className,
      )}
    >
      {short[other]}
    </a>
  );
}
