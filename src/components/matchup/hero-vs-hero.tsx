"use client";

import Link from "@/components/locale-link";
import { useRef } from "react";
import { ArrowsLeftRightIcon, ScalesIcon } from "@/components/icons";
import { EmptyState } from "@/components/meta/empty-state";
import { HeroAvatar } from "@/components/meta/hero-avatar";
import { TierBadge } from "@/components/meta/tier-badge";
import { Points, ReasonList } from "@/components/tools/edge-reasons";
import { HeroPicker } from "@/components/tools/hero-picker";
import { HeroSlots } from "@/components/tools/hero-slots";
import { useNoteTexts } from "@/components/tools/note-texts";
import { VerdictBanner } from "@/components/tools/verdict-banner";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { matchupText } from "@/i18n/messages/matchup";
import { toolsText } from "@/i18n/messages/tools";
import type { HeroSummary } from "@/lib/data";
import { formatPercent } from "@/lib/format";
import { parseHeroList } from "@/lib/hero-list-param";
import { edgeLines } from "@/lib/scoring/explain";
import { heroMatchup, type HeroMatchup } from "@/lib/scoring/matchup";
import type { MatchupTools } from "./matchup-view";

/** Two heroes head to head: ?hero=khufra&vs=fanny. */
export function HeroVsHero({ tools }: { tools: MatchupTools }) {
  const locale = useLocale();
  const m = matchupText[locale];
  const t = m.hero;
  const { bySlug, params, setParams, index, popular } = tools;
  const first = parseHeroList(params.get("hero"), bySlug, 1)[0];
  const picked = parseHeroList(params.get("vs"), bySlug, 1)[0];
  const second = picked && picked !== first ? picked : undefined;
  const searchRef = useRef<HTMLInputElement>(null);

  const set = (a: HeroSummary | undefined, b: HeroSummary | undefined) =>
    setParams({ hero: a?.slug ?? null, vs: b?.slug ?? null });
  const result =
    first && second ? heroMatchup(index, first.id, second.id) : null;
  const focusSearch = () => searchRef.current?.focus();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:items-start">
      <section
        aria-labelledby="heroes-heading"
        className="flex flex-col gap-4 lg:sticky lg:top-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="heroes-heading"
            className="font-display text-lg font-semibold"
          >
            {t.heading}
          </h2>
          {first || second ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => set(second, first)}
            >
              <ArrowsLeftRightIcon aria-hidden />
              {m.swap}
            </Button>
          ) : null}
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <HeroSlots
            heroes={first ? [first] : []}
            size={1}
            side="ally"
            teamName={t.slots.blue}
            onRemove={() => set(undefined, second)}
            onEmpty={focusSearch}
            active={!first}
          />
          <span className="pb-5 font-display text-sm font-semibold text-muted-foreground">
            vs
          </span>
          <HeroSlots
            heroes={second ? [second] : []}
            size={1}
            side="enemy"
            teamName={t.slots.red}
            onRemove={() => set(first, undefined)}
            onEmpty={focusSearch}
            active={Boolean(first) && !second}
          />
        </div>
        <HeroPicker
          inputRef={searchRef}
          heroes={popular}
          taken={new Set([first, second].flatMap((h) => (h ? [h.id] : [])))}
          onPick={(hero) => (first ? set(first, hero) : set(hero, second))}
          placeholder={toolsText[locale].picker.searchHeroes}
          caption={toolsText[locale].picker.mostPickedFirst(
            common[locale].brackets[tools.bracket],
          )}
          actionLabel={(name) => t.pickFor(name, first ? "red" : "blue")}
          blocked={first && second ? t.bothPicked : null}
        />
      </section>

      <section aria-label={m.result} className="flex min-w-0 flex-col gap-6">
        {result && first && second ? (
          <HeroResult
            result={result}
            first={first}
            second={second}
            tools={tools}
          />
        ) : (
          <EmptyState
            icon={ScalesIcon}
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        )}
      </section>
    </div>
  );
}

function SideHero({
  hero,
  side,
  align,
  tools,
}: {
  hero: HeroSummary;
  side: string;
  align: "start" | "end";
  tools: MatchupTools;
}) {
  const tier = tools.index.meta.get(hero.id)?.tier;
  return (
    <div
      className={
        align === "start"
          ? "flex flex-col items-start gap-2"
          : "flex flex-col items-end gap-2"
      }
    >
      <HeroAvatar
        name={hero.name}
        src={hero.head_image_url}
        size="lg"
        decorative
      />
      <div
        className={
          align === "start"
            ? "flex flex-col items-start"
            : "flex flex-col items-end"
        }
      >
        <span className="text-xs text-muted-foreground">{side}</span>
        <span className="flex items-center gap-1.5">
          <Link
            href={`/heroes/${hero.slug}`}
            className="font-display text-lg font-semibold hover:underline"
          >
            {hero.name}
          </Link>
          {tier ? <TierBadge tier={tier} size="sm" /> : null}
        </span>
      </div>
    </div>
  );
}

function HeroResult({
  result,
  first,
  second,
  tools,
}: {
  result: HeroMatchup;
  first: HeroSummary;
  second: HeroSummary;
  tools: MatchupTools;
}) {
  const locale = useLocale();
  const m = matchupText[locale];
  const t = m.hero;
  const { edge, metaPoints, verdict } = result;
  const { nameOf, index, bracket } = tools;
  const rankLabel = common[locale].brackets[bracket];
  const texts = useNoteTexts(edge.notes.length > 0);
  const rows = [
    { label: t.headToHead, points: edge.points.stats },
    { label: t.officialNotes, points: edge.points.notes },
    { label: t.heroTags, points: edge.points.tags },
    { label: toolsText[locale].suggestion.currentForm, points: metaPoints },
  ];
  const metaA = index.meta.get(first.id);
  const metaB = index.meta.get(second.id);
  const form = [
    { label: t.winRate, a: metaA?.winRate, b: metaB?.winRate, digits: 1 },
    {
      label: t.adjustedWinRate,
      a: metaA?.adjustedWinRate,
      b: metaB?.adjustedWinRate,
      digits: 1,
    },
    { label: t.pickRate, a: metaA?.pickRate, b: metaB?.pickRate, digits: 2 },
    { label: t.banRate, a: metaA?.banRate, b: metaB?.banRate, digits: 1 },
  ];

  return (
    <>
      <VerdictBanner
        verdict={verdict}
        firstName={first.name}
        secondName={second.name}
        first={
          <SideHero
            hero={first}
            side={t.sides.blue}
            align="start"
            tools={tools}
          />
        }
        second={
          <SideHero
            hero={second}
            side={t.sides.red}
            align="end"
            tools={tools}
          />
        }
      />

      <section
        aria-labelledby="breakdown-heading"
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <h3
            id="breakdown-heading"
            className="font-display text-lg font-semibold"
          >
            {m.breakdown}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.breakdownHint(first.name, second.name)}
          </p>
        </div>
        <dl className="divide-y rounded-lg border bg-surface">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
            >
              <dt>{row.label}</dt>
              <dd>
                <Points value={row.points} />
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold">
            <dt>{m.total}</dt>
            <dd>
              <Points value={verdict.total} />
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="reasons-heading"
        className="flex flex-col gap-3"
      >
        <h3 id="reasons-heading" className="font-display text-lg font-semibold">
          {t.why}
        </h3>
        <ReasonList
          lines={edgeLines(edge, nameOf, locale)}
          empty={t.noReasons}
        />
        {edge.statsDelta === null ? (
          <p className="text-sm text-muted-foreground">
            {index.matchups.size === 0
              ? t.noMatchupStats(rankLabel)
              : t.noHeadToHead}
          </p>
        ) : null}
        {edge.notes.map((note) => {
          const owner = note.by === "hero" ? first : second;
          const text = texts?.[`${owner.id}:${note.kind}`];
          return text ? (
            <figure
              key={`${owner.id}:${note.kind}`}
              className="flex flex-col gap-1 border-l-2 pl-3 text-sm"
            >
              <blockquote className="text-muted-foreground">{text}</blockquote>
              <figcaption className="text-xs text-muted-foreground">
                {t.noteSource(owner.name)}
              </figcaption>
            </figure>
          ) : null;
        })}
      </section>

      <section aria-labelledby="form-heading" className="flex flex-col gap-3">
        <h3 id="form-heading" className="font-display text-lg font-semibold">
          {t.formHeading(rankLabel)}
        </h3>
        <div className="overflow-hidden rounded-lg border bg-surface">
          <table className="w-full text-sm tabular-nums">
            <thead className="bg-surface-2 text-left text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  <span className="sr-only">{t.number}</span>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-right font-medium text-ally-text"
                >
                  {first.name}
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-right font-medium text-enemy-text"
                >
                  {second.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {form.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-4 py-2 text-left font-normal">
                    {row.label}
                  </th>
                  <td className="px-4 py-2 text-right">
                    {formatPercent(row.a, row.digits, locale)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatPercent(row.b, row.digits, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
