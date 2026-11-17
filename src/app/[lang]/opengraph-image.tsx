import { ImageResponse } from "next/og";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/i18n/config";
import { homeText } from "@/i18n/messages/home";
import { OG_SIZE, OgFrame, ogColors, ogFonts } from "@/lib/og";

// A static export, so it cannot follow the [lang] param: per-language alt
// text would need generateImageMetadata, which moves the image to
// /opengraph-image/<id> and brings its own generateStaticParams.
export const alt = homeText.en.og.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

// Built with the site in both languages. Image routes do not inherit the
// [lang] params of the root layout.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = homeText[isLocale(lang) ? lang : DEFAULT_LOCALE].og;
  return new ImageResponse(
    <OgFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {t.headline}
        </span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: ogColors.muted,
            maxWidth: 860,
            lineHeight: 1.3,
          }}
        >
          {t.subline}
        </span>
      </div>
    </OgFrame>,
    { ...size, fonts: await ogFonts() },
  );
}
