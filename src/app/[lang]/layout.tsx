import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Chakra_Petch } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeScript } from "@/components/theme/theme-script";
import { siteConfig } from "@/config/site";
import { isLocale, LOCALES, ogLocales } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { getLocale } from "@/i18n/server";
import "../globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  // next/font has no fallback metrics for this family yet.
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Every page is prerendered once per language (docs/i18n.md). */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = common[locale].site;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.titleDefault, template: `%s | ${siteConfig.name}` },
    description: t.description,
    applicationName: siteConfig.name,
    // Each page sets its own canonical URL and hreflang alternates with
    // pageMetadata() (src/i18n/metadata.ts): English pages are rendered as
    // /en/... behind a rewrite, so "./" would point at the wrong address.
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: ogLocales[locale],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: siteConfig.themeColors.light,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: siteConfig.themeColors.dark,
    },
  ],
};

// The app shell comes from the (app) layout, so the welcome page can go without it.
export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html
      lang={lang}
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <LocaleProvider locale={lang}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
