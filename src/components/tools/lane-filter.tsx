"use client";

import { ChipGroup } from "@/components/ui/chip-group";
import { useLocale } from "@/i18n/client";
import { toolsText } from "@/i18n/messages/tools";

/** Whether suggestions must fit a lane the team still has open. Kept in the URL as ?lanes=any. */
export function LaneFilter({
  openLanesOnly,
  onChange,
}: {
  openLanesOnly: boolean;
  onChange: (openLanesOnly: boolean) => void;
}) {
  const t = toolsText[useLocale()].laneFilter;
  return (
    <ChipGroup
      label={t.label}
      options={[
        { value: "open", label: t.open },
        { value: "any", label: t.any },
      ]}
      value={openLanesOnly ? "open" : "any"}
      onChange={(value) => onChange(value === "open")}
    />
  );
}
