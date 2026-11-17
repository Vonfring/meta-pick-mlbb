"use client";

import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { metaText } from "@/i18n/messages/meta";
import { cn } from "@/lib/utils";
import { RANK_BRACKETS, type RankBracket } from "@/types/domain";

export const selectClass =
  "h-10 w-full rounded-md border bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring";

/** The rank bracket picker shared by the statistics pages and the tools. */
export function RankSelect({
  value,
  onChange,
  className,
}: {
  value: RankBracket;
  onChange: (bracket: RankBracket) => void;
  className?: string;
}) {
  const locale = useLocale();
  const brackets = common[locale].brackets;
  return (
    <label
      className={cn(
        "flex flex-col gap-1 text-sm text-muted-foreground",
        className,
      )}
    >
      {metaText[locale].filters.rank}
      <select
        className={selectClass}
        value={value}
        onChange={(e) => onChange(e.target.value as RankBracket)}
      >
        {RANK_BRACKETS.map((b) => (
          <option key={b} value={b}>
            {brackets[b]}
          </option>
        ))}
      </select>
    </label>
  );
}
