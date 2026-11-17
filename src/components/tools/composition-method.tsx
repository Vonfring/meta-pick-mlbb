import { COMPOSITION_RULES } from "@/config/composition-rules";
import { DRAFT_SCORING } from "@/config/draft-scoring";
import {
  compositionRuleText,
  compositionText,
} from "@/i18n/messages/composition";
import { getLocale } from "@/i18n/server";
import { formatDecimal } from "@/lib/format";

/** How the checklist, suggestions and strength work, written from the config files. */
export async function CompositionMethod({
  title,
}: {
  /** Defaults to "How the checklist and suggestions work" in the page language. */
  title?: string;
}) {
  const locale = await getLocale();
  const t = compositionText[locale].method;
  const { metaWeight, compositionPoints, teammateNotePoints, strength } =
    DRAFT_SCORING;
  // Config values as written ("0.3", "5"), with the language's decimal mark.
  const number = (value: number) =>
    formatDecimal(
      value,
      Math.min(2, (String(value).split(".")[1] ?? "").length),
      locale,
    );
  return (
    <details className="group rounded-lg border bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:hidden">
        {title ?? t.title}
      </summary>
      <div className="flex max-w-[72ch] flex-col gap-4 border-t px-4 py-4 text-sm text-muted-foreground">
        <p>{t.tags}</p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-left">
            <thead className="bg-surface-2 text-xs">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  {t.check}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  {t.okFrom}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  {t.weakFrom}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y tabular-nums">
              {COMPOSITION_RULES.checks.map((check) => (
                <tr key={check.id}>
                  <th scope="row" className="px-3 py-1.5 font-normal">
                    {compositionRuleText(locale, check).label}
                  </th>
                  <td className="px-3 py-1.5 text-right">
                    {check.kind === "tag"
                      ? check.ok
                      : check.kind === "lanes"
                        ? t.everyHero
                        : t.ofEach(number(1.5))}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {check.kind === "tag"
                      ? check.weak
                      : check.kind === "lanes"
                        ? t.oneShort
                        : t.ofEach(number(0.5))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          {t.suggestions(
            number(compositionPoints),
            number(teammateNotePoints),
            number(metaWeight),
          )}
        </p>
        <p>
          {t.strength(
            strength.composition,
            strength.form,
            strength.synergy,
            number(100 / strength.synergyScale),
          )}
        </p>
      </div>
    </details>
  );
}
