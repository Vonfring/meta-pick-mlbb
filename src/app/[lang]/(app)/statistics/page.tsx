import { PageHeader } from "@/components/meta/page-header";
import { StatisticsView } from "@/components/meta-stats/stats-table";
import { DEFAULT_BRACKET, DEFAULT_PERIOD } from "@/config/filters";
import { metaText } from "@/i18n/messages/meta";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { getHeroes, getMetaSnapshot, toHeroSummary } from "@/lib/data";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = metaText[locale].statisticsPage;
  return pageMetadata(locale, "/statistics", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function StatisticsPage() {
  const [heroes, initial, locale] = await Promise.all([
    getHeroes(),
    getMetaSnapshot(DEFAULT_BRACKET, DEFAULT_PERIOD),
    getLocale(),
  ]);
  const summaries = heroes.map(toHeroSummary);
  const t = metaText[locale].statisticsPage;

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      <StatisticsView heroes={summaries} initial={initial} />
    </>
  );
}
