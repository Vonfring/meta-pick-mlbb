import { TIER_SCORING } from "@/config/tier-scoring";
import { metaText } from "@/i18n/messages/meta";
import { getLocale } from "@/i18n/server";
import { formatPercent } from "@/lib/format";

const percent = (n: number) => `${Math.round(n * 100)}%`;

/** How tiers are calculated, written from src/config/tier-scoring.ts so it never drifts. */
export async function TierMethod() {
  const locale = await getLocale();
  const t = metaText[locale].tierMethod;
  const { weights, cutoffs, shrinkage, minPickRate } = TIER_SCORING;
  const bands = cutoffs.map(([tier, from], i) => {
    const to = i === 0 ? 100 : cutoffs[i - 1]![1];
    return { tier, share: to - from };
  });
  return (
    <details className="group rounded-lg border bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:hidden">
        {t.summary}
      </summary>
      <div className="flex max-w-[68ch] flex-col gap-3 border-t px-4 py-4 text-sm text-muted-foreground">
        <p>
          {t.score(
            percent(weights.winRate),
            percent(weights.banRate),
            percent(weights.pickRate),
          )}
        </p>
        <p>{t.shrinkage(formatPercent(shrinkage, 1, locale))}</p>
        <p>{t.ranking(bands, formatPercent(minPickRate, 1, locale))}</p>
      </div>
    </details>
  );
}
