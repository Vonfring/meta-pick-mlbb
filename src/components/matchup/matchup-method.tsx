import { COMPOSITION_RULES } from "@/config/composition-rules";
import { MATCHUP_SCORING } from "@/config/matchup-scoring";
import { compositionText } from "@/i18n/messages/composition";
import { matchupText } from "@/i18n/messages/matchup";
import { getLocale } from "@/i18n/server";
import { formatDecimal } from "@/lib/format";

/** How matchups are judged, written from the config files so it never drifts. */
export async function MatchupMethod() {
  const locale = await getLocale();
  const t = matchupText[locale].method;
  const c = compositionText[locale];
  const {
    metaWeight,
    countersWeight,
    synergyWeight,
    compositionPoints,
    estimateRange,
    evenBelow,
    clearFrom,
  } = MATCHUP_SCORING;
  // Config values as written ("0.3", "10"), with the language's decimal mark.
  const number = (value: number) =>
    formatDecimal(
      value,
      Math.min(2, (String(value).split(".")[1] ?? "").length),
      locale,
    );
  return (
    <details className="group rounded-lg border bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:hidden">
        {t.title}
      </summary>
      <div className="flex max-w-[68ch] flex-col gap-3 border-t px-4 py-4 text-sm text-muted-foreground">
        <p>{t.intro(number(metaWeight))}</p>
        <p>{t.teamsIntro}</p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>{t.form(number(metaWeight))}</li>
          <li>{t.counters(number(countersWeight))}</li>
          <li>{t.synergy(number(synergyWeight))}</li>
          <li>
            {t.composition(
              COMPOSITION_RULES.checks
                .map((check) => c.ruleInSentence(c.rules[check.id].label))
                .join(", "),
              number(compositionPoints),
            )}
          </li>
        </ul>
        <p>
          {t.estimate(
            number(estimateRange[0]),
            number(estimateRange[1]),
            number(evenBelow),
            number(clearFrom),
          )}
        </p>
      </div>
    </details>
  );
}
