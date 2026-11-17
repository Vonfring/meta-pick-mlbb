"use client";

import { useRef, useState } from "react";
import {
  ArrowsLeftRightIcon,
  CaretDownIcon,
  UsersFourIcon,
} from "@/components/icons";
import { EmptyState } from "@/components/meta/empty-state";
import { HeroAvatar } from "@/components/meta/hero-avatar";
import { CompositionChecklist } from "@/components/tools/composition-checklist";
import { Points, ReasonList } from "@/components/tools/edge-reasons";
import { HeroPicker } from "@/components/tools/hero-picker";
import { HeroSlots, type TeamSide } from "@/components/tools/hero-slots";
import { VerdictBanner } from "@/components/tools/verdict-banner";
import { Button } from "@/components/ui/button";
import { MATCHUP_SCORING } from "@/config/matchup-scoring";
import { useLocale } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import { matchupText } from "@/i18n/messages/matchup";
import { toolsText } from "@/i18n/messages/tools";
import type { HeroSummary } from "@/lib/data";
import { formatDecimal, formatPoints } from "@/lib/format";
import { heroListParam, parseHeroList } from "@/lib/hero-list-param";
import { TEAM_SIZE } from "@/lib/scoring/composition";
import { edgeLines } from "@/lib/scoring/explain";
import {
  type SynergyPair,
  teamMatchup,
  type TeamMatchup,
} from "@/lib/scoring/matchup";
import { cn } from "@/lib/utils";
import type { MatchupTools } from "./matchup-view";

type Team = "blue" | "red";
const KEY_PAIRS = 6;

/** Five against five: ?mode=team&blue=…&red=…, hero slugs joined by commas. */
export function TeamVsTeam({ tools }: { tools: MatchupTools }) {
  const locale = useLocale();
  const m = matchupText[locale];
  const t = m.team;
  const { bySlug, params, setParams, index, popular } = tools;
  const blue = parseHeroList(params.get("blue"), bySlug, TEAM_SIZE);
  // A hero can only be picked once per game.
  const red = parseHeroList(params.get("red"), bySlug, TEAM_SIZE).filter(
    (h) => !blue.includes(h),
  );
  const [chosen, setChosen] = useState<Team>("blue");
  const searchRef = useRef<HTMLInputElement>(null);
  const isFull = (team: Team) =>
    (team === "blue" ? blue : red).length >= TEAM_SIZE;
  const other = (team: Team): Team => (team === "blue" ? "red" : "blue");
  // The picker fills the chosen team, or the other one once it is full.
  const target: Team = isFull(chosen) ? other(chosen) : chosen;

  const set = (nextBlue: HeroSummary[], nextRed: HeroSummary[]) =>
    setParams({ blue: heroListParam(nextBlue), red: heroListParam(nextRed) });
  const add = (hero: HeroSummary) => {
    if (target === "blue") set([...blue, hero], red);
    else set(blue, [...red, hero]);
  };
  const choose = (team: Team) => {
    setChosen(team);
    searchRef.current?.focus();
  };

  const result =
    blue.length > 0 && red.length > 0
      ? teamMatchup(
          index,
          blue.map((h) => h.id),
          red.map((h) => h.id),
        )
      : null;
  const bothFull = isFull("blue") && isFull("red");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:items-start">
      <section
        aria-labelledby="teams-heading"
        className="flex flex-col gap-4 lg:sticky lg:top-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="teams-heading" className="font-display text-lg font-semibold">
            {t.heading}
          </h2>
          {blue.length > 0 || red.length > 0 ? (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => set(red, blue)}>
                <ArrowsLeftRightIcon aria-hidden />
                {m.swap}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => set([], [])}>
                {m.clear}
              </Button>
            </div>
          ) : null}
        </div>
        <TeamPanel
          name={t.names.blue}
          side="ally"
          heroes={blue}
          active={!bothFull && target === "blue"}
          onChoose={() => choose("blue")}
          onRemove={(hero) =>
            set(
              blue.filter((h) => h !== hero),
              red,
            )
          }
        />
        <TeamPanel
          name={t.names.red}
          side="enemy"
          heroes={red}
          active={!bothFull && target === "red"}
          onChoose={() => choose("red")}
          onRemove={(hero) =>
            set(
              blue,
              red.filter((h) => h !== hero),
            )
          }
        />
        <HeroPicker
          inputRef={searchRef}
          heroes={popular}
          taken={new Set([...blue, ...red].map((h) => h.id))}
          onPick={add}
          placeholder={t.addTo(target)}
          caption={t.pickerCaption(
            target,
            common[locale].brackets[tools.bracket],
          )}
          actionLabel={(name) => t.addHero(name, target)}
          blocked={bothFull ? t.bothFull : null}
        />
      </section>

      <section aria-label={m.result} className="flex min-w-0 flex-col gap-6">
        {result ? (
          <TeamResult result={result} blue={blue} red={red} tools={tools} />
        ) : (
          <EmptyState
            icon={UsersFourIcon}
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        )}
      </section>
    </div>
  );
}

function TeamPanel({
  name,
  side,
  heroes,
  active,
  onChoose,
  onRemove,
}: {
  name: string;
  side: TeamSide;
  heroes: HeroSummary[];
  active: boolean;
  onChoose: () => void;
  onRemove: (hero: HeroSummary) => void;
}) {
  const t = matchupText[useLocale()].team;
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3 transition-colors",
        active && (side === "ally" ? "border-ally" : "border-enemy"),
      )}
    >
      <button
        type="button"
        onClick={onChoose}
        aria-pressed={active}
        className="flex items-baseline justify-between gap-2 text-left"
      >
        <span
          className={cn(
            "font-medium",
            side === "ally" ? "text-ally-text" : "text-enemy-text",
          )}
        >
          {name}
        </span>
        <span className="text-xs text-muted-foreground">
          {active ? t.addingHere : t.count(heroes.length, TEAM_SIZE)}
        </span>
      </button>
      <HeroSlots
        heroes={heroes}
        size={TEAM_SIZE}
        side={side}
        teamName={name.toLowerCase()}
        onRemove={onRemove}
        onEmpty={onChoose}
        active={active}
      />
    </div>
  );
}

function TeamFaces({
  label,
  heroes,
  align,
}: {
  label: string;
  heroes: HeroSummary[];
  align: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "start" ? "items-start" : "items-end",
      )}
    >
      <span className="font-display text-lg font-semibold">{label}</span>
      <ul className="flex flex-wrap gap-1" aria-label={label}>
        {heroes.map((h) => (
          <li key={h.id}>
            <HeroAvatar name={h.name} src={h.head_image_url} size="xs" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Which team a number of points favors, in that team's text color. */
function SideEdge({ points }: { points: number }) {
  const locale = useLocale();
  const t = matchupText[locale].team;
  const rounded = Number(points.toFixed(1));
  if (rounded === 0)
    return <span className="text-sm text-muted-foreground">{t.even}</span>;
  const blue = rounded > 0;
  return (
    <span
      className={cn(
        "text-sm font-semibold tabular-nums",
        blue ? "text-ally-text" : "text-enemy-text",
      )}
    >
      {t.sideEdge(
        blue ? "blue" : "red",
        formatDecimal(Math.abs(rounded), 1, locale),
      )}
    </span>
  );
}

function SynergyList({
  pairs,
  nameOf,
  empty,
}: {
  pairs: SynergyPair[];
  nameOf: (id: number) => string;
  empty: string;
}) {
  const t = matchupText[useLocale()].team;
  if (pairs.length === 0)
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="flex flex-col gap-1.5">
      {pairs.map((p) => (
        <li
          key={`${p.heroId}-${p.teammateId}`}
          className="grid grid-cols-[3.25rem_1fr] items-baseline gap-2 text-sm"
        >
          <Points value={p.delta * 100} className="justify-end" />
          <span>{t.pairWith(nameOf(p.heroId), nameOf(p.teammateId))}</span>
        </li>
      ))}
    </ul>
  );
}

const share = (score: number) => `${Math.round(score * 100)}%`;

/** A config value as written ("0.5"), with the language's decimal mark. */
const configNumber = (value: number, locale: Locale) =>
  formatDecimal(
    value,
    Math.min(2, (String(value).split(".")[1] ?? "").length),
    locale,
  );

function TeamResult({
  result,
  blue,
  red,
  tools,
}: {
  result: TeamMatchup;
  blue: HeroSummary[];
  red: HeroSummary[];
  tools: MatchupTools;
}) {
  const locale = useLocale();
  const m = matchupText[locale];
  const t = m.team;
  const { nameOf } = tools;
  const { meta, counters, synergy, composition, verdict } = result;
  const withData = counters.pairs.filter((p) => p.hasData).length;
  const keyPairs = counters.pairs
    .filter((p) => Math.abs(p.points.total) >= 0.5)
    .slice(0, KEY_PAIRS);
  const categories = [
    {
      label: toolsText[locale].suggestion.currentForm,
      points: meta.points,
      detail: t.formDetail(
        formatPoints(meta.blue, 1, locale),
        formatPoints(meta.red, 1, locale),
      ),
    },
    {
      label: t.counters,
      points: counters.points,
      detail: t.countersDetail(withData, counters.pairs.length),
    },
    {
      label: t.synergy,
      points: synergy.points,
      detail: t.synergyDetail(synergy.blue.length, synergy.red.length),
    },
    {
      label: t.composition,
      points: composition.points,
      detail:
        composition.points === null
          ? t.compositionPending
          : t.compositionDetail(
              share(composition.blue.score),
              share(composition.red.score),
            ),
    },
  ];

  return (
    <>
      <VerdictBanner
        verdict={verdict}
        firstName={t.names.blue}
        secondName={t.names.red}
        first={<TeamFaces label={t.names.blue} heroes={blue} align="start" />}
        second={<TeamFaces label={t.names.red} heroes={red} align="end" />}
      />

      <section
        aria-labelledby="team-breakdown-heading"
        className="flex flex-col gap-3"
      >
        <h3
          id="team-breakdown-heading"
          className="font-display text-lg font-semibold"
        >
          {m.breakdown}
        </h3>
        <dl className="divide-y rounded-lg border bg-surface">
          {categories.map((c) => (
            <div key={c.label} className="flex flex-col gap-0.5 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium">{c.label}</dt>
                <dd>
                  {c.points === null ? (
                    <span className="text-sm text-muted-foreground">
                      {t.notCounted}
                    </span>
                  ) : (
                    <SideEdge points={c.points} />
                  )}
                </dd>
              </div>
              <p className="text-sm text-muted-foreground">{c.detail}</p>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <dt className="font-semibold">{m.total}</dt>
            <dd>
              <SideEdge points={verdict.total} />
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="key-pairs-heading"
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <h3
            id="key-pairs-heading"
            className="font-display text-lg font-semibold"
          >
            {t.keyMatchups}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.keyMatchupsHint(
              configNumber(MATCHUP_SCORING.countersWeight, locale),
            )}
          </p>
        </div>
        {keyPairs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.noKeyPairs}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {keyPairs.map((pair) => (
              <li
                key={`${pair.heroId}-${pair.opponentId}`}
                className="rounded-lg border bg-surface"
              >
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                    <CaretDownIcon
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-sm">
                      <span className="font-medium text-ally-text">
                        {nameOf(pair.heroId)}
                      </span>
                      {` ${t.against} `}
                      <span className="font-medium text-enemy-text">
                        {nameOf(pair.opponentId)}
                      </span>
                    </span>
                    <SideEdge points={pair.points.total} />
                  </summary>
                  <div className="px-3 pb-3 sm:pl-9">
                    <ReasonList
                      lines={edgeLines(pair, nameOf, locale)}
                      empty={t.onlySmallTags}
                    />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="synergy-heading"
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <h3
            id="synergy-heading"
            className="font-display text-lg font-semibold"
          >
            {t.synergy}
          </h3>
          <p className="text-sm text-muted-foreground">{t.synergyHint}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-ally-text">
              {t.names.blue}
            </h4>
            <SynergyList
              pairs={synergy.blue}
              nameOf={nameOf}
              empty={t.noSynergy}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-enemy-text">
              {t.names.red}
            </h4>
            <SynergyList
              pairs={synergy.red}
              nameOf={nameOf}
              empty={t.noSynergy}
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="composition-heading"
        className="flex flex-col gap-3"
      >
        <h3
          id="composition-heading"
          className="font-display text-lg font-semibold"
        >
          {t.composition}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-surface p-4">
            <h4 className="text-sm font-medium text-ally-text">
              {t.names.blue}
              {composition.blue.complete
                ? `: ${share(composition.blue.score)}`
                : ""}
            </h4>
            <CompositionChecklist report={composition.blue} nameOf={nameOf} />
          </div>
          <div className="flex flex-col gap-2 rounded-lg border bg-surface p-4">
            <h4 className="text-sm font-medium text-enemy-text">
              {t.names.red}
              {composition.red.complete
                ? `: ${share(composition.red.score)}`
                : ""}
            </h4>
            <CompositionChecklist report={composition.red} nameOf={nameOf} />
          </div>
        </div>
      </section>
    </>
  );
}
