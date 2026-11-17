import { PageHeader } from "@/components/meta/page-header";
import { TeamCompositionView } from "@/components/team-composition/team-composition-view";
import { CompositionMethod } from "@/components/tools/composition-method";
import { DEFAULT_BRACKET } from "@/config/filters";
import { compositionText } from "@/i18n/messages/composition";
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
  const t = compositionText[locale].page;
  return pageMetadata(locale, "/team-composition", {
    title: t.title,
    description: t.description,
  });
}

export default async function TeamCompositionPage() {
  const [heroes, knowledge, initial, locale] = await Promise.all([
    getHeroes(),
    getHeroKnowledge(),
    getMatchupSnapshot(DEFAULT_BRACKET),
    getLocale(),
  ]);
  const t = compositionText[locale].page;

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      <div className="flex flex-col gap-8">
        <TeamCompositionView
          heroes={heroes.map(toHeroSummary)}
          knowledge={knowledge}
          initial={initial}
        />
        <CompositionMethod />
      </div>
    </>
  );
}
