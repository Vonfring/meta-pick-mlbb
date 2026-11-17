"use client";

import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "@/components/icons";
import { useLocale } from "@/i18n/client";
import { metaText } from "@/i18n/messages/meta";
import { formatDecimal } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Change between two rates, shown in percentage points with an arrow so the
 * direction never depends on color alone. `delta` is a fraction (0.012 = +1.2).
 * A Client Component so it can read the language under Server Components
 * (hero pages) and Client Components (tools) alike.
 */
export function RateDelta({
  delta,
  className,
  digits = 1,
}: {
  delta: number | null | undefined;
  className?: string;
  digits?: number;
}) {
  const locale = useLocale();
  const t = metaText[locale].rateDelta;
  if (delta === null || delta === undefined || Number.isNaN(delta)) {
    return (
      <span
        className={cn("text-xs text-muted-foreground", className)}
        title={t.notEnoughHistory}
      >
        {t.notAvailable}
      </span>
    );
  }

  const points = delta * 100;
  const rounded = Number(points.toFixed(digits));
  const direction = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const Icon =
    direction === "up"
      ? ArrowUpIcon
      : direction === "down"
        ? ArrowDownIcon
        : MinusIcon;
  const shown = formatDecimal(Math.abs(rounded), digits, locale);
  const label =
    direction === "flat"
      ? t.noChange
      : direction === "up"
        ? t.up(shown)
        : t.down(shown);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-medium tabular-nums",
        direction === "up" && "text-positive",
        direction === "down" && "text-negative",
        direction === "flat" && "text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5" weight="bold" aria-hidden />
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
