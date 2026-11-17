import { MatchupMethod } from "@/components/matchup/matchup-method";
import { MatchupView } from "@/components/matchup/matchup-view";
import { PageHeader } from "@/components/meta/page-header";
import { DEFAULT_BRACKET } from "@/config/filters";
import { matchupText } from "@/i18n/messages/matchup";
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
  const t = matchupText[locale].page;
  return pageMetadata(locale, "/matchup", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function MatchupPage() {
  const [heroes, knowledge, initial, locale] = await Promise.all([
    getHeroes(),
    getHeroKnowledge(),
    getMatchupSnapshot(DEFAULT_BRACKET),
    getLocale(),
  ]);
  const t = matchupText[locale].page;

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      <div className="flex flex-col gap-8">
        <MatchupView
          heroes={heroes.map(toHeroSummary)}
          knowledge={knowledge}
          initial={initial}
        />
        <MatchupMethod />
      </div>
    </>
  );
}
