"use client";

import { RankSelect, selectClass } from "@/components/meta/rank-select";
import { ChipGroup, type ChipOption } from "@/components/ui/chip-group";
import { DEFAULT_BRACKET, DEFAULT_PERIOD } from "@/config/filters";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { metaText } from "@/i18n/messages/meta";
import { oneOf, rankParam, useUrlParams } from "@/lib/use-url-params";
import {
  HERO_LANES,
  HERO_ROLES,
  type HeroLane,
  type HeroRole,
  PERIODS,
  type PeriodDays,
  type RankBracket,
} from "@/types/domain";

export type MetaFilterState = {
  bracket: RankBracket;
  period: PeriodDays;
  role: HeroRole | "all";
  lane: HeroLane | "all";
};

/** Rank, period, role and lane, kept in the URL. */
export function useMetaFilters() {
  const [params, setParams] = useUrlParams();
  const periodValue = Number(params.get("period"));
  const state: MetaFilterState = {
    bracket: rankParam(params.get("rank")),
    period: (PERIODS as readonly number[]).includes(periodValue)
      ? (periodValue as PeriodDays)
      : DEFAULT_PERIOD,
    role: oneOf<HeroRole>(params.get("role"), HERO_ROLES),
    lane: oneOf<HeroLane>(params.get("lane"), HERO_LANES),
  };
  return { state, params, setParams };
}

export function MetaFilters({
  state,
  setParams,
}: {
  state: MetaFilterState;
  setParams: (next: Record<string, string | null>) => void;
}) {
  const locale = useLocale();
  const c = common[locale];
  const t = metaText[locale].filters;
  const roleOptions: ChipOption<HeroRole | "all">[] = [
    { value: "all", label: t.allRoles },
    ...HERO_ROLES.map((r) => ({ value: r, label: c.roles[r] })),
  ];
  const laneOptions: ChipOption<HeroLane | "all">[] = [
    { value: "all", label: t.allLanes },
    ...HERO_LANES.map((l) => ({ value: l, label: c.lanes[l] })),
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:flex sm:max-w-md">
        <RankSelect
          className="sm:flex-1"
          value={state.bracket}
          onChange={(bracket) =>
            setParams({ rank: bracket === DEFAULT_BRACKET ? null : bracket })
          }
        />
        <label className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-1">
          {t.period}
          <select
            className={selectClass}
            value={state.period}
            onChange={(e) =>
              setParams({
                period:
                  Number(e.target.value) === DEFAULT_PERIOD
                    ? null
                    : e.target.value,
              })
            }
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {c.periods[p]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ChipGroup
        label={t.role}
        options={roleOptions}
        value={state.role}
        onChange={(value) =>
          setParams({ role: value === "all" ? null : value })
        }
      />
      <ChipGroup
        label={t.lane}
        options={laneOptions}
        value={state.lane}
        onChange={(value) =>
          setParams({ lane: value === "all" ? null : value })
        }
      />
    </div>
  );
}
