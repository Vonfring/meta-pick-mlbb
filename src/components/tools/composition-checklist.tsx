"use client";

import {
  CheckCircleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@/components/icons";
import { useLocale } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import {
  compositionRuleText,
  compositionText,
} from "@/i18n/messages/composition";
import { formatDecimal } from "@/lib/format";
import type {
  CheckResult,
  CheckStatus,
  CompositionReport,
} from "@/lib/scoring/composition";
import { cn } from "@/lib/utils";

const status: Record<
  CheckStatus,
  { icon: typeof CheckCircleIcon; className: string }
> = {
  ok: { icon: CheckCircleIcon, className: "text-positive" },
  weak: { icon: WarningCircleIcon, className: "text-foreground" },
  missing: { icon: XCircleIcon, className: "text-negative" },
};

const count = (n: number, locale: Locale) =>
  Number.isInteger(n) ? String(n) : formatDecimal(n, 1, locale);

function detail(check: CheckResult, complete: boolean, locale: Locale): string {
  const t = compositionText[locale].checklist;
  switch (check.kind) {
    case "tag":
      return t.tagDetail(check.total, check.ok);
    case "lanes":
      return complete && check.open.length > 0
        ? t.openLanes(check.open.map((l) => common[locale].lanes[l]).join(", "))
        : t.lanesCovered(check.covered, check.needed);
    case "damage":
      return t.damageDetail(
        count(check.physical, locale),
        count(check.magic, locale),
      );
  }
}

/** The composition checks for one team, each with its status as icon and word. */
export function CompositionChecklist({
  report,
  nameOf,
  showHints = false,
  className,
}: {
  report: CompositionReport;
  nameOf: (heroId: number) => string;
  /** Explain in plain words what each missing or weak check means. */
  showHints?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const t = compositionText[locale];
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ul className="flex flex-col gap-1.5">
        {report.checks.map((check) => {
          const s = status[check.status];
          const label = t.status[check.status];
          const text = compositionRuleText(locale, check);
          const Icon = s.icon;
          return (
            <li
              key={check.id}
              className="grid grid-cols-[1.25rem_1fr] items-start gap-2 text-sm"
            >
              <Icon
                className={cn("mt-0.5 size-4", s.className)}
                weight="fill"
                aria-hidden
              />
              <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span>
                  <span className="font-medium">{text.label}</span>
                  {check.status === "ok" ? (
                    <span className="sr-only">: {label}.</span>
                  ) : (
                    <span
                      className={cn("ml-1.5 text-xs font-medium", s.className)}
                    >
                      {label}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {detail(check, report.complete, locale)}
                </span>
                {/* A partial team misses most checks; only a lane clash
                    means something before the team is full. */}
                {showHints &&
                check.status !== "ok" &&
                (report.complete || check.kind === "lanes") ? (
                  <span className="basis-full pt-0.5 text-xs text-muted-foreground">
                    {text.hint}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      {report.untagged.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          {t.checklist.untagged(
            report.untagged.map(nameOf).join(", "),
            report.untagged.length,
          )}
        </p>
      ) : null}
    </div>
  );
}
