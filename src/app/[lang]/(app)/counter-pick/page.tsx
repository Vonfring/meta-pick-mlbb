import { CounterMethod } from "@/components/counter-pick/counter-method";
import { CounterPickView } from "@/components/counter-pick/counter-pick-view";
import { PageHeader } from "@/components/meta/page-header";
import { DEFAULT_BRACKET } from "@/config/filters";
import { counterText } from "@/i18n/messages/counter";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import {
  getHeroes,
  getHeroKnowledge,
  getMatchupSnapshot,
  toHeroSummary,
} from "@/lib/data";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = counterText[locale].page;
  return pageMetadata(locale, "/counter-pick", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function CounterPickPage() {
  const [heroes, knowledge, initial, locale] = await Promise.all([
    getHeroes(),
    getHeroKnowledge(),
    getMatchupSnapshot(DEFAULT_BRACKET),
    getLocale(),
  ]);
  const t = counterText[locale].page;

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      <div className="flex flex-col gap-8">
        <CounterPickView
          heroes={heroes.map(toHeroSummary)}
          knowledge={knowledge}
          initial={initial}
        />
        <CounterMethod />
      </div>
    </>
  );
}
