import { DraftView } from "@/components/draft/draft-view";
import { PageHeader } from "@/components/meta/page-header";
import { CompositionMethod } from "@/components/tools/composition-method";
import { DEFAULT_BRACKET } from "@/config/filters";
import { draftText } from "@/i18n/messages/draft";
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
  const t = draftText[locale].page;
  return pageMetadata(locale, "/draft", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function DraftPage() {
  const [heroes, knowledge, initial, locale] = await Promise.all([
    getHeroes(),
    getHeroKnowledge(),
    getMatchupSnapshot(DEFAULT_BRACKET),
    getLocale(),
  ]);
  const t = draftText[locale].page;

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      <div className="flex flex-col gap-8">
        <DraftView
          heroes={heroes.map(toHeroSummary)}
          knowledge={knowledge}
          initial={initial}
        />
        <CompositionMethod title={t.methodTitle} />
      </div>
    </>
  );
}
