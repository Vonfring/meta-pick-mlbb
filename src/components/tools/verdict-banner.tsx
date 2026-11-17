"use client";

import type * as React from "react";
import { useLocale } from "@/i18n/client";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { matchupText } from "@/i18n/messages/matchup";
import type { Verdict } from "@/lib/scoring/matchup";
import { cn } from "@/lib/utils";

/**
 * "Khufra is favored" ("Khufra lebih unggul"), from the side names and a
 * verdict. Pass the side names in the same language.
 */
export function verdictText(
  verdict: Verdict,
  first: string,
  second: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const t = matchupText[locale].verdict;
  if (!verdict.favored) return t.even;
  const name = verdict.favored === "first" ? first : second;
  return verdict.strength === "clear" ? t.favored(name) : t.slight(name);
}

/**
 * The matchup verdict on the board's diagonal: the blue side in the lower
 * left, the red side in the upper right, as on the game map.
 */
export function VerdictBanner({
  verdict,
  firstName,
  secondName,
  first,
  second,
}: {
  verdict: Verdict;
  firstName: string;
  secondName: string;
  /** Portrait or team summary for each side. */
  first: React.ReactNode;
  second: React.ReactNode;
}) {
  const locale = useLocale();
  const firstShare = verdict.estimate;
  return (
    <section
      aria-label={matchupText[locale].verdict.label}
      className="flex flex-col gap-5 overflow-hidden rounded-lg border bg-[linear-gradient(to_top_right,var(--ally-soft)_calc(50%-1px),var(--border)_calc(50%-1px)_calc(50%+1px),var(--enemy-soft)_calc(50%+1px))] p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">{first}</div>
        <div className="min-w-0 text-right">{second}</div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-display text-2xl font-bold" aria-live="polite">
          {verdictText(verdict, firstName, secondName, locale)}
        </p>
        <EstimateBar
          first={firstShare}
          firstName={firstName}
          secondName={secondName}
        />
        <p className="text-xs text-muted-foreground">
          {matchupText[locale].verdict.note}
        </p>
      </div>
    </section>
  );
}

/** Two shares of 100, blue from the left and red from the right, with a gap between. */
export function EstimateBar({
  first,
  firstName,
  secondName,
  className,
}: {
  first: number;
  firstName: string;
  secondName: string;
  className?: string;
}) {
  const second = 100 - first;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex justify-between text-sm font-semibold tabular-nums">
        <span className="text-ally-text">
          <span className="sr-only">{firstName}: </span>
          {first}%
        </span>
        <span className="text-enemy-text">
          <span className="sr-only">{secondName}: </span>
          {second}%
        </span>
      </div>
      <div className="flex h-2.5 gap-0.5" aria-hidden>
        <div
          className="rounded-l-full bg-ally"
          style={{ width: `${first}%` }}
        />
        <div
          className="rounded-r-full bg-enemy"
          style={{ width: `${second}%` }}
        />
      </div>
    </div>
  );
}
