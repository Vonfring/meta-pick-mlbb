"use client";

import { Meter } from "@/components/stats/meter";
import { DRAFT_SCORING } from "@/config/draft-scoring";
import { useLocale } from "@/i18n/client";
import { toolsText } from "@/i18n/messages/tools";
import type { TeamStrength } from "@/lib/scoring/draft";
import { cn } from "@/lib/utils";

const percent = (share: number) => `${Math.round(share * 100)}%`;

/** A team's strength, 0 to 100, with its three parts. */
export function StrengthCard({
  strength,
  title,
  className,
}: {
  strength: TeamStrength | null;
  /** Defaults to "Team strength" in the page language. */
  title?: string;
  className?: string;
}) {
  const t = toolsText[useLocale()].strength;
  const heading = title ?? t.title;
  const w = DRAFT_SCORING.strength;
  return (
    <section
      aria-label={heading}
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-medium">{heading}</h3>
        <span className="font-display text-3xl font-bold tabular-nums">
          {strength ? strength.total : "—"}
          <span className="text-base font-semibold text-muted-foreground">
            {" "}
            / 100
          </span>
        </span>
      </div>
      {strength ? (
        <div className="flex flex-col gap-3">
          <Meter
            label={t.composition(w.composition)}
            value={Math.round(strength.composition * 100)}
            display={percent(strength.composition)}
          />
          <Meter
            label={t.form(w.form)}
            value={Math.round(strength.form * 100)}
            display={percent(strength.form)}
          />
          <Meter
            label={t.synergy(w.synergy)}
            value={Math.round(strength.synergy * 100)}
            display={percent(strength.synergy)}
          />
          <p className="text-xs text-muted-foreground">{t.explainer}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t.empty}</p>
      )}
    </section>
  );
}
