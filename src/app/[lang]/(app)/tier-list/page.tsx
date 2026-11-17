import { PageHeader } from "@/components/meta/page-header";
import { TierListView } from "@/components/meta-stats/tier-list-view";
import { TierMethod } from "@/components/meta-stats/tier-method";
import { DEFAULT_BRACKET, DEFAULT_PERIOD } from "@/config/filters";
import { metaText } from "@/i18n/messages/meta";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { getHeroes, getMetaSnapshot, toHeroSummary } from "@/lib/data";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = metaText[locale].tierListPage;
  return pageMetadata(locale, "/tier-list", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function TierListPage() {
  const [heroes, initial, locale] = await Promise.all([
    getHeroes(),
    getMetaSnapshot(DEFAULT_BRACKET, DEFAULT_PERIOD),
    getLocale(),
  ]);
  const summaries = heroes.map(toHeroSummary);
  const t = metaText[locale].tierListPage;

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      <div className="flex flex-col gap-8">
        <TierListView heroes={summaries} initial={initial} />
        <TierMethod />
      </div>
    </>
  );
}
