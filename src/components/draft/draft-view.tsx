"use client";

import Link from "@/components/locale-link";
import { useEffect, useMemo, useState } from "react";
import { ArrowClockwiseIcon, MagnifyingGlassIcon } from "@/components/icons";
import { HeroAvatar } from "@/components/meta/hero-avatar";
import { RankSelect, selectClass } from "@/components/meta/rank-select";
import { TierBadge } from "@/components/meta/tier-badge";
import { SnapshotNote } from "@/components/meta-stats/snapshot-note";
import { CompositionChecklist } from "@/components/tools/composition-checklist";
import { HeroPicker } from "@/components/tools/hero-picker";
import { LaneFilter } from "@/components/tools/lane-filter";
import { PickSuggestionRow } from "@/components/tools/pick-suggestion";
import { StrengthCard } from "@/components/tools/strength";
import { useToolData } from "@/components/tools/use-tool-data";
import { EstimateBar } from "@/components/tools/verdict-banner";
import { Button } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip-group";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DEFAULT_BRACKET } from "@/config/filters";
import {
  DEFAULT_PRESET,
  DEFAULT_SIDE,
  DRAFT_PRESETS,
  type DraftPresetId,
  type DraftTeam,
} from "@/config/draft-order";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { draftText } from "@/i18n/messages/draft";
import { toolsText } from "@/i18n/messages/tools";
import type { HeroKnowledge, HeroSummary, MatchupSnapshot } from "@/lib/data";
import {
  currentStep,
  type DraftStep,
  expandSteps,
  parseSlots,
  picksOf,
  serializeSlots,
  SKIP,
  type Slot,
  turnPosition,
  unavailableAt,
  undoSlots,
} from "@/lib/draft/board";
import { formatPercent } from "@/lib/format";
import { heroListParam } from "@/lib/hero-list-param";
import {
  type BanSuggestion,
  type PickSuggestion,
  suggestBans,
  suggestPicks,
  teamStrength,
} from "@/lib/scoring/draft";
import type { HeroIndex } from "@/lib/scoring/hero-index";
import { teamMatchup } from "@/lib/scoring/matchup";
import { rankParam, useUrlParams } from "@/lib/use-url-params";
import { cn } from "@/lib/utils";
import type { RankBracket } from "@/types/domain";
import { DraftTeamPanel } from "./draft-board";
import { preloadGsap } from "./lock-in";

const PRESET_IDS = Object.keys(DRAFT_PRESETS) as DraftPresetId[];
const SIDES = ["blue", "red"] as const;

/** Which ban or pick phase a step is in, counted per action: 2 for "Pick phase 2". */
function phaseNumber(steps: readonly DraftStep[], step: DraftStep) {
  const sameAction = [
    ...new Set(
      steps.filter((s) => s.action === step.action).map((s) => s.phase),
    ),
  ];
  return sameAction.indexOf(step.phase) + 1;
}

/** The finished teams on Matchup, with the same rank. */
function matchupHref(
  blue: HeroSummary[],
  red: HeroSummary[],
  bracket: RankBracket,
) {
  const params = new URLSearchParams({ mode: "team" });
  params.set("blue", heroListParam(blue) ?? "");
  params.set("red", heroListParam(red) ?? "");
  if (bracket !== DEFAULT_BRACKET) params.set("rank", bracket);
  return `/matchup?${params.toString().replace(/%2C/gi, ",")}`;
}

/** Draft master: a practice ban and pick board. State lives in the URL. */
export function DraftView({
  heroes,
  knowledge,
  initial,
}: {
  heroes: HeroSummary[];
  knowledge: HeroKnowledge;
  initial: MatchupSnapshot;
}) {
  const locale = useLocale();
  const t = draftText[locale];
  const tools = toolsText[locale];
  const [params, setParams] = useUrlParams();
  const presetParam = params.get("preset");
  const presetId: DraftPresetId =
    presetParam && Object.hasOwn(DRAFT_PRESETS, presetParam)
      ? (presetParam as DraftPresetId)
      : DEFAULT_PRESET;
  const side: DraftTeam =
    params.get("side") === "red" || params.get("side") === "blue"
      ? (params.get("side") as DraftTeam)
      : DEFAULT_SIDE;
  const bracket = rankParam(params.get("rank"));
  const openLanesOnly = params.get("lanes") !== "any";
  const draftParam = params.get("d");

  const { byId, bySlug, allIds } = useMemo(
    () => ({
      byId: new Map(heroes.map((h) => [h.id, h])),
      bySlug: new Map(heroes.map((h) => [h.slug, h])),
      allIds: heroes.map((h) => h.id),
    }),
    [heroes],
  );
  const steps = useMemo(() => expandSteps(DRAFT_PRESETS[presetId]), [presetId]);
  const slots = useMemo(
    () => parseSlots(draftParam, steps, (slug) => bySlug.get(slug)?.id),
    [draftParam, steps, bySlug],
  );
  const current = currentStep(steps, slots, side);
  const { snapshot, index, popular, loading, error } = useToolData(
    heroes,
    knowledge,
    initial,
    bracket,
  );
  const [justPlaced, setJustPlaced] = useState<number | null>(null);
  // Warm the animation library while the visitor reads the board.
  useEffect(() => {
    preloadGsap().catch(() => {});
  }, []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const nameOf = (id: number) => byId.get(id)?.name ?? tools.unknownHero;
  const rankLabel = common[locale].brackets[snapshot.bracket];

  const write = (next: Slot[]) =>
    setParams({ d: serializeSlots(next, (id) => byId.get(id)?.slug ?? "_") });
  const place = (heroId: number) => {
    if (!current) return;
    setJustPlaced(current.index);
    write(slots.map((hero, i) => (i === current.index ? heroId : hero)));
  };
  const skipBan = () => {
    if (current?.action !== "ban") return;
    setJustPlaced(null);
    write(slots.map((hero, i) => (i === current.index ? SKIP : hero)));
  };
  const undo = () => {
    setJustPlaced(null);
    write(undoSlots(steps, slots, side));
  };

  const bluePicks = picksOf(steps, slots, "blue");
  const redPicks = picksOf(steps, slots, "red");
  const strength = {
    blue: teamStrength(index, bluePicks),
    red: teamStrength(index, redPicks),
  };
  const matchup =
    bluePicks.length > 0 && redPicks.length > 0
      ? teamMatchup(index, bluePicks, redPicks)
      : null;
  const unavailable = current
    ? unavailableAt(steps, slots, current.index)
    : new Set<number>();
  const empty = slots.every((hero) => hero === null);

  const mine = current?.team === side;
  const pickerLabel = current
    ? t.picker.label(current.action, current.team)
    : tools.picker.searchHeroes;
  const picker = (inline: boolean) => (
    <HeroPicker
      gridWhenEmpty={!inline}
      heroes={popular}
      taken={unavailable}
      onPick={(hero) => {
        place(hero.id);
        setSheetOpen(false);
      }}
      placeholder={pickerLabel}
      caption={
        inline
          ? t.picker.inlineCaption
          : tools.picker.mostPickedFirst(rankLabel)
      }
      actionLabel={(name) =>
        current ? t.picker.action(current.action, name, current.team) : name
      }
      blocked={current ? null : t.picker.complete}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-end">
          <label className="flex flex-col gap-1 text-sm text-muted-foreground lg:w-60">
            {t.controls.order}
            <select
              className={selectClass}
              value={presetId}
              onChange={(e) =>
                setParams({
                  preset:
                    e.target.value === DEFAULT_PRESET ? null : e.target.value,
                  // Another order has other steps, so the board starts over.
                  d: null,
                })
              }
            >
              {PRESET_IDS.map((id) => (
                <option key={id} value={id}>
                  {t.presets[id].label}
                </option>
              ))}
            </select>
          </label>
          <RankSelect
            className="lg:w-48"
            value={bracket}
            onChange={(next) =>
              setParams({ rank: next === DEFAULT_BRACKET ? null : next })
            }
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ChipGroup
            label={t.controls.side}
            options={SIDES.map((value) => ({
              value,
              label: t.controls.sides[value],
            }))}
            value={side}
            onChange={(value) =>
              setParams({ side: value === DEFAULT_SIDE ? null : value })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            disabled={empty}
            onClick={() => {
              setJustPlaced(null);
              setParams({ d: null });
            }}
          >
            <ArrowClockwiseIcon aria-hidden />
            {t.controls.reset}
          </Button>
        </div>
      </div>
      <p className="-mt-3 text-sm text-muted-foreground">
        {t.presets[presetId].description}
      </p>
      <SnapshotNote data={snapshot} loading={loading} error={error} />

      {/* Once the draft is complete the board takes the full width. */}
      <div
        className={cn("grid gap-6 lg:items-start", current && "lg:grid-cols-2")}
      >
        <section
          aria-label={t.board.label}
          className="flex flex-col gap-5 rounded-lg border bg-[linear-gradient(to_top_right,var(--ally-soft)_calc(50%-1px),var(--border)_calc(50%-1px)_calc(50%+1px),var(--enemy-soft)_calc(50%+1px))] p-4 sm:p-6 lg:order-2"
        >
          <DraftTeamPanel
            team="red"
            isYou={side === "red"}
            steps={steps}
            slots={slots}
            byId={byId}
            current={current}
            justPlaced={justPlaced}
            strength={strength.red}
            align="end"
          />
          <TurnBanner
            steps={steps}
            side={side}
            current={current}
            canUndo={!empty}
            onUndo={undo}
            onSkip={skipBan}
            estimate={matchup?.verdict.estimate ?? null}
          />
          <DraftTeamPanel
            team="blue"
            isYou={side === "blue"}
            steps={steps}
            slots={slots}
            byId={byId}
            current={current}
            justPlaced={justPlaced}
            strength={strength.blue}
            align="start"
          />
        </section>

        {current ? (
          <section
            aria-labelledby="suggestions-heading"
            className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6"
          >
            <div className="hidden lg:block">{picker(true)}</div>
            <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start lg:hidden"
                onClick={() => setSheetOpen(true)}
              >
                <MagnifyingGlassIcon aria-hidden />
                {pickerLabel}
              </Button>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{pickerLabel}</DrawerTitle>
                  <DrawerDescription>
                    {t.picker.drawerDescription}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto px-4">{picker(false)}</div>
              </DrawerContent>
            </Drawer>

            <SuggestionList
              steps={steps}
              slots={slots}
              current={current}
              mine={mine}
              index={index}
              allIds={allIds}
              byId={byId}
              nameOf={nameOf}
              rankLabel={rankLabel}
              openLanesOnly={openLanesOnly}
              onLanes={(open) => setParams({ lanes: open ? null : "any" })}
              onChoose={place}
            />
          </section>
        ) : null}
      </div>

      {!current && matchup ? (
        <section
          aria-labelledby="result-heading"
          className="flex flex-col gap-4"
        >
          <h2
            id="result-heading"
            className="font-display text-xl font-semibold"
          >
            {t.result.title}
          </h2>
          <div className="flex flex-col gap-3 rounded-lg border bg-surface p-4">
            <p className="font-display text-xl font-bold">
              {t.result.verdict(matchup.verdict)}
            </p>
            <EstimateBar
              first={matchup.verdict.estimate}
              firstName={t.teams.blue}
              secondName={t.teams.red}
            />
            <p className="text-xs text-muted-foreground">{t.result.note}</p>
            <Link
              href={matchupHref(
                bluePicks.flatMap((id) => byId.get(id) ?? []),
                redPicks.flatMap((id) => byId.get(id) ?? []),
                bracket,
              )}
              className="text-sm font-medium text-ally-text hover:underline"
            >
              {t.result.breakdown}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(["blue", "red"] as const).map((team) => (
              <div key={team} className="flex flex-col gap-4">
                <StrengthCard
                  strength={strength[team]}
                  title={t.result.strength(team)}
                />
                {strength[team] ? (
                  <div className="rounded-lg border bg-surface p-4">
                    <CompositionChecklist
                      report={strength[team]!.report}
                      nameOf={nameOf}
                      showHints
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

type Suggestions =
  | { kind: "pick"; items: PickSuggestion[] }
  | { kind: "ban"; items: BanSuggestion[] };

/** Suggestions for the team whose turn it is. */
function suggestionsFor(
  index: HeroIndex,
  allIds: readonly number[],
  turn: DraftStep,
  slots: readonly Slot[],
  bluePicks: readonly number[],
  redPicks: readonly number[],
  { openLanesOnly }: { openLanesOnly: boolean },
): Suggestions {
  const own = turn.team === "blue" ? bluePicks : redPicks;
  const theirs = turn.team === "blue" ? redPicks : bluePicks;
  // Suggestions skip every hero already on the board; the picker still
  // allows a blind ban the other team made too.
  const taken = new Set(
    slots.filter((hero): hero is number => hero !== null && hero !== SKIP),
  );
  return turn.action === "pick"
    ? {
        kind: "pick",
        items: suggestPicks(index, allIds, own, theirs, taken, {
          openLanesOnly,
        }),
      }
    : { kind: "ban", items: suggestBans(index, allIds, own, theirs, taken) };
}

function TurnBanner({
  steps,
  side,
  current,
  canUndo,
  onUndo,
  onSkip,
  estimate,
}: {
  steps: readonly DraftStep[];
  side: DraftTeam;
  current: DraftStep | null;
  canUndo: boolean;
  onUndo: () => void;
  onSkip: () => void;
  estimate: number | null;
}) {
  const t = draftText[useLocale()];
  const position = current ? turnPosition(steps, side, current) : null;
  return (
    <div className="flex flex-col gap-3 rounded-md border bg-surface/90 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div aria-live="polite">
          {current && position ? (
            <>
              <p className="text-xs text-muted-foreground">
                {t.turn.phase(
                  current.action,
                  phaseNumber(steps, current),
                  current.blind,
                )}
              </p>
              <p className="font-display text-lg font-bold">
                {t.turn.turn(
                  current.team,
                  current.team === side,
                  current.action,
                  position.number,
                  position.of,
                )}
              </p>
            </>
          ) : (
            <p className="font-display text-lg font-bold">{t.turn.complete}</p>
          )}
        </div>
        <div className="flex gap-1">
          {current?.action === "ban" ? (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              {t.turn.skipBan}
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            disabled={!canUndo}
            onClick={onUndo}
          >
            {t.turn.undo}
          </Button>
        </div>
      </div>
      {current?.blind ? (
        <p className="text-xs text-muted-foreground">
          {current.team === side ? t.turn.blindOwn : t.turn.blindEnemy}
        </p>
      ) : null}
      {estimate !== null ? (
        <div className="flex flex-col gap-1">
          <EstimateBar
            first={estimate}
            firstName={t.teams.blue}
            secondName={t.teams.red}
          />
          <p className="text-xs text-muted-foreground">{t.turn.estimateNote}</p>
        </div>
      ) : null}
    </div>
  );
}

function SuggestionList({
  steps,
  slots,
  current,
  mine,
  index,
  allIds,
  byId,
  nameOf,
  rankLabel,
  openLanesOnly,
  onLanes,
  onChoose,
}: {
  steps: readonly DraftStep[];
  slots: readonly Slot[];
  current: DraftStep;
  mine: boolean;
  index: HeroIndex;
  allIds: readonly number[];
  byId: ReadonlyMap<number, HeroSummary>;
  nameOf: (id: number) => string;
  rankLabel: string;
  openLanesOnly: boolean;
  onLanes: (openLanesOnly: boolean) => void;
  onChoose: (heroId: number) => void;
}) {
  // Scoring every hero is the page's heaviest work; it reruns only when the
  // board, the turn, the rank or the lane filter changes.
  const suggestions = useMemo(
    () =>
      suggestionsFor(
        index,
        allIds,
        current,
        slots,
        picksOf(steps, slots, "blue"),
        picksOf(steps, slots, "red"),
        { openLanesOnly },
      ),
    [index, allIds, current, slots, steps, openLanesOnly],
  );
  const locale = useLocale();
  const text = draftText[locale];
  const t = text.suggestions;
  const team = current.team;
  const heading = mine
    ? current.action === "pick"
      ? t.picks
      : t.bans
    : t.watchOut;
  const firstBan =
    suggestions.kind === "ban" && suggestions.items[0]?.kind === "meta";
  const description = mine
    ? current.action === "pick"
      ? t.pickDescription
      : firstBan
        ? t.firstBanDescription(rankLabel)
        : t.banDescription
    : current.action === "pick"
      ? t.enemyPickDescription(team)
      : firstBan
        ? t.enemyFirstBanDescription(rankLabel)
        : t.enemyBanDescription;
  const action = (hero: HeroSummary) => (
    <Button
      variant={mine ? "primary" : "outline"}
      size="sm"
      aria-label={text.picker.action(current.action, hero.name, team)}
      onClick={() => onChoose(hero.id)}
    >
      {t.verbs[current.action]}
    </Button>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2
          id="suggestions-heading"
          className="font-display text-lg font-semibold"
        >
          {heading}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {suggestions.kind === "pick" ? (
        <LaneFilter openLanesOnly={openLanesOnly} onChange={onLanes} />
      ) : null}
      <ol className="flex flex-col gap-2">
        {suggestions.kind === "pick"
          ? suggestions.items.map((s, i) => {
              const hero = byId.get(s.heroId);
              return hero ? (
                <PickSuggestionRow
                  key={s.heroId}
                  rank={i + 1}
                  suggestion={s}
                  hero={hero}
                  index={index}
                  nameOf={nameOf}
                  rankLabel={rankLabel}
                  action={action(hero)}
                />
              ) : null;
            })
          : suggestions.items.map((s, i) => {
              const hero = byId.get(s.heroId);
              if (!hero) return null;
              if (s.kind === "threat")
                return (
                  <PickSuggestionRow
                    key={s.heroId}
                    rank={i + 1}
                    suggestion={s.pick}
                    hero={hero}
                    index={index}
                    nameOf={nameOf}
                    rankLabel={rankLabel}
                    action={action(hero)}
                  />
                );
              const meta = index.meta.get(hero.id);
              return (
                <li
                  key={s.heroId}
                  className="flex items-center gap-3 rounded-lg border bg-surface p-3"
                >
                  <span className="w-5 shrink-0 text-right font-display text-sm font-semibold text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <HeroAvatar
                    name={hero.name}
                    src={hero.head_image_url}
                    size="sm"
                    decorative
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2">
                      <Link
                        href={`/heroes/${hero.slug}`}
                        className="truncate font-medium hover:text-ally-text"
                      >
                        {hero.name}
                      </Link>
                      {meta?.tier ? (
                        <TierBadge tier={meta.tier} size="sm" />
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.metaLine(
                        formatPercent(meta?.winRate, 1, locale),
                        formatPercent(meta?.banRate, 1, locale),
                      )}
                    </span>
                  </span>
                  {action(hero)}
                </li>
              );
            })}
      </ol>
    </div>
  );
}
