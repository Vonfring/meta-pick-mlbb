import type { Metadata } from "next";
import {
  EmblemExplorer,
  type EmblemSetView,
} from "@/components/emblems/emblem-explorer";
import { HexagonIcon } from "@/components/icons";
import { EmptyState } from "@/components/meta/empty-state";
import { PageHeader } from "@/components/meta/page-header";
import { catalogText } from "@/i18n/messages/catalog";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { toTalentViews } from "@/lib/catalog/emblems";
import { splitCooldown } from "@/lib/catalog/text";
import { getEmblemCatalog, getSpells } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = catalogText[locale].emblems;
  return pageMetadata(locale, "/emblems", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function EmblemsPage() {
  const c = catalogText[await getLocale()];
  const t = c.emblems;
  const [{ emblems, talents }, spells] = await Promise.all([
    getEmblemCatalog(),
    getSpells(),
  ]);
  const sets: EmblemSetView[] = emblems.map(
    ({ id, slug, name, attributes, recommended_roles }) => ({
      id,
      slug,
      name,
      attributes,
      recommended_roles,
    }),
  );

  return (
    <>
      <PageHeader title={t.title} description={t.description} />

      {sets.length > 0 ? (
        <EmblemExplorer sets={sets} talents={toTalentViews(emblems, talents)} />
      ) : (
        <EmptyState
          icon={HexagonIcon}
          title={t.emptyTitle}
          description={t.emptyDescription}
        />
      )}

      {spells.length > 0 ? (
        <section
          aria-labelledby="battle-spells"
          className="mt-10 flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <h2
              id="battle-spells"
              className="font-display text-lg font-semibold"
            >
              {t.battleSpells}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.battleSpellsDescription}
            </p>
          </div>
          <ul className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {spells.map((spell) => {
              const { text, cooldown } = splitCooldown(spell.description);
              return (
                <li
                  key={spell.id}
                  className="flex flex-col gap-1 rounded-lg border bg-surface p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold">{spell.name}</h3>
                    {cooldown ? (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {c.cooldown(cooldown)}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {text}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </>
  );
}
