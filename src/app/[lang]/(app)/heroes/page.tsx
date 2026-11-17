import type { Metadata } from "next";
import { HeroBrowser } from "@/components/hero/hero-browser";
import { PageHeader } from "@/components/meta/page-header";
import { DEFAULT_BRACKET, DEFAULT_PERIOD } from "@/config/filters";
import { common } from "@/i18n/messages/common";
import { heroesText } from "@/i18n/messages/heroes";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { getRankedHeroes } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = heroesText[locale].list;
  return pageMetadata(locale, "/heroes", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function HeroesPage() {
  const locale = await getLocale();
  const t = heroesText[locale];
  const c = common[locale];
  const { heroes, snapshot } = await getRankedHeroes(
    DEFAULT_BRACKET,
    DEFAULT_PERIOD,
  );
  const context = snapshot
    ? t.snapshotUpdated(
        t.snapshot(
          c.brackets[snapshot.rank_bracket],
          c.periods[snapshot.period_days],
        ),
        formatDate(snapshot.fetched_at, locale),
      )
    : t.list.noStats;

  return (
    <>
      <PageHeader title={t.list.title} description={t.list.description} />
      <HeroBrowser heroes={heroes} context={context} />
    </>
  );
}
