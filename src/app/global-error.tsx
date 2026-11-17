"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, stripLocale, type Locale } from "@/i18n/config";
import { homeText } from "@/i18n/messages/home";

// Rendered in place of the root layout, so there is no LocaleProvider: the
// language comes from the URL. The server snapshot is English, so hydration
// matches and an Indonesian page switches right after.
const subscribe = () => () => {};
const getLocaleSnapshot = (): Locale =>
  stripLocale(window.location.pathname).locale;
const getServerLocale = (): Locale => DEFAULT_LOCALE;

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocale,
  );
  const t = homeText[locale].globalError;
  return (
    <html lang={locale}>
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          background: "#eef2f2",
          color: "#10212a",
        }}
      >
        <title>{t.documentTitle}</title>
        <h1 style={{ fontSize: "1.5rem" }}>{t.title}</h1>
        <p>{t.body}</p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: 10,
          }}
        >
          {t.tryAgain}
        </button>
      </body>
    </html>
  );
}
