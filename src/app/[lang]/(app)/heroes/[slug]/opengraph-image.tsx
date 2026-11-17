import { ImageResponse } from "next/og";
import { DEFAULT_BRACKET, DEFAULT_PERIOD } from "@/config/filters";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import { heroesText } from "@/i18n/messages/heroes";
import { getHeroSlugParams, getRankedHeroes } from "@/lib/data";
import { formatPercent, initials } from "@/lib/format";
import { roleLine } from "@/lib/heroes/roles";
import {
  imageDataUrl,
  OG_SIZE,
  OgFrame,
  ogColors,
  ogFonts,
  ogTierColors,
} from "@/lib/og";

// The alt text cannot follow the language: a file-based image has one static
// alt, and generateImageMetadata would clash with generateStaticParams below.
export const alt = "Hero card with role, lane, tier and win rate";
export const size = OG_SIZE;
export const contentType = "image/png";

// One image per hero and language, built with the site like the hero pages.
// Image routes do not inherit the [lang] params of the root layout.
export async function generateStaticParams() {
  const slugs = await getHeroSlugParams();
  return LOCALES.flatMap((lang) => slugs.map(({ slug }) => ({ lang, slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = heroesText[locale].og;
  const { heroes } = await getRankedHeroes(DEFAULT_BRACKET, DEFAULT_PERIOD);
  const hero = heroes.find((h) => h.slug === slug);
  // The hero page answers 404 for an unknown slug; so does its image.
  if (!hero) return new Response(null, { status: 404 });
  const [fonts, portrait] = await Promise.all([
    ogFonts(),
    imageDataUrl(hero.head_image_url),
  ]);

  return new ImageResponse(
    <OgFrame>
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 260,
            height: 260,
            border: `6px solid ${ogColors.ally}`,
            borderRadius: 14,
            background: ogColors.portrait,
            overflow: "hidden",
          }}
        >
          {portrait ? (
            <img src={portrait} width={248} height={248} alt="" />
          ) : (
            <span
              style={{ fontSize: 96, fontWeight: 700, color: ogColors.muted }}
            >
              {initials(hero.name)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 84, fontWeight: 700, lineHeight: 1 }}>
            {hero.name}
          </span>
          <span
            style={{ fontSize: 34, fontWeight: 600, color: ogColors.muted }}
          >
            {roleLine(hero, locale)}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 10,
            }}
          >
            {hero.tier ? (
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  ...ogTierColors[hero.tier],
                  borderRadius: 8,
                  padding: "4px 16px",
                }}
              >
                {t.tier(hero.tier)}
              </span>
            ) : null}
            <span style={{ fontSize: 34, fontWeight: 600 }}>
              {t.winRate(
                formatPercent(hero.winRate, 1, locale),
                common[locale].brackets[DEFAULT_BRACKET],
              )}
            </span>
          </div>
        </div>
      </div>
    </OgFrame>,
    { ...size, fonts },
  );
}
