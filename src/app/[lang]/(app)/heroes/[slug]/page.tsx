import type { Metadata } from "next";
import Link from "@/components/locale-link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaretLeftIcon, InfoIcon } from "@/components/icons";
import { PairingList, type PairingEntry } from "@/components/hero/pairing-list";
import { HeroAvatar } from "@/components/meta/hero-avatar";
import { TierBadge } from "@/components/meta/tier-badge";
import { LevelSteps, Meter } from "@/components/stats/meter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_BRACKET,
  DEFAULT_PERIOD,
  MATCHUP_PERIOD,
} from "@/config/filters";
import type { Locale } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import { heroesText } from "@/i18n/messages/heroes";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import {
  getHeroDetails,
  getHeroes,
  getHeroSlugParams,
  getPairsSnapshot,
  getRankedHeroes,
  type RankedHero,
  type SnapshotInfo,
} from "@/lib/data";
import { formatDate, formatPercent } from "@/lib/format";
import {
  bestTeammates,
  counteredBy,
  type Pairing,
  strongAgainst,
} from "@/lib/heroes/pairings";
import { roleLine, rolesText } from "@/lib/heroes/roles";
import { displaySkills } from "@/lib/heroes/skills";
import { RATING_FIELDS, TAG_FIELDS } from "@/lib/heroes/tags";
import type { HeroRelationKind } from "@/types/data";
import { RANK_BRACKETS } from "@/types/domain";

export const generateStaticParams = getHeroSlugParams;

/**
 * Looks the slug up in the cached roster, so an unknown URL never costs a
 * database query of its own.
 */
async function findHero(slug: string) {
  return (await getHeroes()).find((hero) => hero.slug === slug);
}

/** "Mythic, last 7 days" */
function describeSnapshot(snapshot: SnapshotInfo | null, locale: Locale) {
  const c = common[locale];
  return snapshot
    ? heroesText[locale].snapshot(
        c.brackets[snapshot.rank_bracket],
        c.periods[snapshot.period_days],
      )
    : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/heroes/[slug]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = heroesText[locale].detail;
  const hero = await findHero((await params).slug);
  if (!hero) return { title: t.notFoundTitle };
  return pageMetadata(locale, `/heroes/${hero.slug}`, {
    title: hero.name,
    description: t.metaDescription(hero.name, rolesText(hero.roles, locale)),
  });
}

const RELATION_KINDS: readonly HeroRelationKind[] = [
  "best_teammate",
  "strong_against",
  "weak_against",
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function StatFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-xl leading-tight font-semibold tabular-nums sm:text-2xl">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function BackLink({ locale }: { locale: Locale }) {
  return (
    <Link
      href="/heroes"
      className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <CaretLeftIcon className="size-4" aria-hidden />
      {heroesText[locale].detail.allHeroes}
    </Link>
  );
}

/** Shown while a hero page streams in, for example on the first visit to a new hero. */
function HeroPageSkeleton({ locale }: { locale: Locale }) {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-label={heroesText[locale].detail.loading}
    >
      <BackLink locale={locale} />
      <div className="flex flex-col gap-5 sm:flex-row">
        <Skeleton className="size-28 rounded-sm" />
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

// The hero page reads its slug inside <Suspense>, so navigating to a hero
// shows the skeleton at once. Every hero known at build time is prerendered.
// The language comes from the root layout's segment, known at build time.
export default async function HeroPage(
  props: PageProps<"/[lang]/heroes/[slug]">,
) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<HeroPageSkeleton locale={locale} />}>
      <HeroDetail params={props.params} locale={locale} />
    </Suspense>
  );
}

async function HeroDetail({
  params,
  locale,
}: Pick<PageProps<"/[lang]/heroes/[slug]">, "params"> & { locale: Locale }) {
  const t = heroesText[locale];
  const c = common[locale];
  const { slug } = await params;
  // Inside <Suspense> the response has already started, so an unknown slug
  // gets the not-found page with a noindex tag rather than a 404 status.
  if (!(await findHero(slug))) notFound();
  const details = await getHeroDetails(slug);
  if (!details) notFound();
  const { hero, skills, relations, tags } = details;

  const [current, pairs, byRank] = await Promise.all([
    getRankedHeroes(DEFAULT_BRACKET, DEFAULT_PERIOD),
    getPairsSnapshot(DEFAULT_BRACKET, MATCHUP_PERIOD),
    Promise.all(
      RANK_BRACKETS.map((bracket) => getRankedHeroes(bracket, DEFAULT_PERIOD)),
    ),
  ]);
  const heroById = new Map(current.heroes.map((h) => [h.id, h]));
  const me = heroById.get(hero.id);
  const toEntries = (pairings: Pairing[]): PairingEntry[] =>
    pairings.flatMap(({ heroId, delta }) => {
      const other = heroById.get(heroId);
      return other ? [{ hero: other, delta }] : [];
    });
  const matchups = pairs?.matchups ?? [];
  const beats = toEntries(strongAgainst(hero.id, matchups));
  const losesTo = toEntries(counteredBy(hero.id, matchups));
  const teammates = toEntries(bestTeammates(hero.id, pairs?.synergies ?? []));
  const context = describeSnapshot(current.snapshot, locale);
  const pairContext = describeSnapshot(pairs, locale);

  const relationGroups = RELATION_KINDS.map((kind) => {
    const rows = relations.filter((r) => r.relation === kind);
    const targets = rows
      .map((r) => heroById.get(r.target_hero_id))
      .filter((h): h is RankedHero => h !== undefined);
    return {
      kind,
      targets,
      description: rows.find((r) => r.description)?.description ?? null,
    };
  }).filter((group) => group.targets.length > 0);

  const ratings = RATING_FIELDS.flatMap(({ key }) => {
    const value = hero[key];
    return value === null ? [] : [{ label: c.ratings[key], value }];
  });

  return (
    <article className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <BackLink locale={locale} />

        <header className="flex items-start gap-4 sm:gap-5">
          <div className="w-20 shrink-0 sm:w-28">
            <HeroAvatar
              name={hero.name}
              src={hero.head_image_url}
              size="xl"
              fluid
              preload
            />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                {hero.name}
              </h1>
              <p className="text-muted-foreground">{roleLine(hero, locale)}</p>
            </div>
            {hero.specialties.length > 0 ? (
              <ul
                className="flex flex-wrap gap-1.5"
                aria-label={t.detail.specialties}
              >
                {hero.specialties.map((specialty) => (
                  <li
                    key={specialty}
                    className="rounded-sm bg-muted px-2 py-0.5 text-xs font-medium"
                  >
                    {specialty}
                  </li>
                ))}
              </ul>
            ) : null}
            {hero.lore ? (
              <p className="max-w-[65ch] text-sm text-muted-foreground">
                {hero.lore}
              </p>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] items-center gap-x-3 gap-y-3 rounded-lg border bg-surface p-4 sm:flex sm:flex-wrap sm:gap-x-8 sm:px-5">
          {me?.tier ? (
            <TierBadge tier={me.tier} size="lg" />
          ) : (
            <span className="max-w-24 text-sm leading-tight text-muted-foreground">
              {(me?.winRate ?? null) === null
                ? t.detail.noStats
                : t.detail.rarelyPicked}
            </span>
          )}
          <StatFigure
            label={t.winRate}
            value={formatPercent(me?.winRate, 1, locale)}
          />
          <StatFigure
            label={t.pickRate}
            value={formatPercent(me?.pickRate, 2, locale)}
          />
          <StatFigure
            label={t.banRate}
            value={formatPercent(me?.banRate, 1, locale)}
          />
          {context ? (
            <p className="col-span-full text-sm text-muted-foreground sm:ml-auto">
              {current.snapshot
                ? t.snapshotUpdated(
                    context,
                    formatDate(current.snapshot.fetched_at, locale),
                  )
                : context}
            </p>
          ) : null}
        </div>
      </div>

      <Section
        title={t.detail.matchups}
        description={t.detail.matchupsDescription(hero.name, pairContext)}
      >
        <div className="relative grid overflow-hidden rounded-lg border md:grid-cols-2">
          <div className="flex flex-col gap-2 bg-ally-soft/50 p-4">
            <h3 className="text-sm font-semibold text-ally-text">
              {t.detail.strongAgainst}
            </h3>
            <PairingList entries={beats} empty={t.detail.noFavorable} />
          </div>
          <div className="flex flex-col gap-2 border-t bg-enemy-soft/50 p-4 md:border-t-0 md:border-l">
            <h3 className="text-sm font-semibold text-enemy-text">
              {t.detail.counteredBy}
            </h3>
            <PairingList entries={losesTo} empty={t.detail.noUnfavorable} />
          </div>
        </div>
      </Section>

      <Section
        title={t.detail.bestTeammates}
        description={t.detail.bestTeammatesDescription(hero.name, pairContext)}
      >
        <div className="rounded-lg border bg-surface p-3">
          <PairingList entries={teammates} empty={t.detail.noTeammates} />
        </div>
      </Section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-10">
          <Section title={t.detail.skills}>
            <ol className="flex flex-col divide-y rounded-lg border bg-surface">
              {displaySkills(skills).map((skill) => (
                <li
                  key={`${skill.slot}-${skill.name}`}
                  className="flex flex-col gap-1.5 px-4 py-3"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-semibold">{skill.name}</h3>
                    {skill.slot === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        {t.detail.passive}
                      </span>
                    ) : null}
                    {skill.cooldown ? (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {t.detail.cooldown(skill.cooldown)}
                      </span>
                    ) : null}
                    {skill.cost ? (
                      <span className="text-xs text-muted-foreground">
                        {skill.cost}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {skill.description}
                  </p>
                  {skill.tags.length > 0 ? (
                    <ul
                      className="flex flex-wrap gap-1"
                      aria-label={t.detail.skillEffects}
                    >
                      {skill.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-sm bg-muted px-1.5 py-0.5 text-xs"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </Section>

          {relationGroups.length > 0 ? (
            <Section
              title={t.detail.officialNotes}
              description={t.detail.officialNotesDescription}
            >
              <div className="flex flex-col gap-4">
                {relationGroups.map((group) => (
                  <div
                    key={group.kind}
                    className="flex flex-col gap-2 rounded-lg border bg-surface p-4"
                  >
                    <h3 className="text-sm font-semibold">
                      {t.detail.relations[group.kind]}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {group.targets.map((target) => (
                        <li key={target.id}>
                          <Link
                            href={`/heroes/${target.slug}`}
                            className="flex items-center gap-2 rounded-md border bg-background py-1 pr-2.5 pl-1 text-sm hover:border-foreground/40"
                          >
                            <HeroAvatar
                              name={target.name}
                              src={target.head_image_url}
                              size="xs"
                              decorative
                            />
                            {target.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {group.description ? (
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-10">
          <Section
            title={t.detail.byRank}
            description={`${c.periods[DEFAULT_PERIOD]}.`}
          >
            <div className="overflow-hidden rounded-lg border bg-surface">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      {t.detail.columns.rank}
                    </th>
                    <th scope="col" className="px-2 py-2 text-left font-medium">
                      {t.detail.columns.tier}
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-right font-medium"
                    >
                      {t.detail.columns.win}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right font-medium"
                    >
                      {t.detail.columns.ban}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {byRank.map((rank, index) => {
                    const row = rank.heroes.find((h) => h.id === hero.id);
                    const bracket = RANK_BRACKETS[index]!;
                    return (
                      <tr
                        key={bracket}
                        className={
                          bracket === DEFAULT_BRACKET
                            ? "bg-ally-soft/40"
                            : undefined
                        }
                      >
                        <th
                          scope="row"
                          className="px-3 py-2 text-left font-medium"
                        >
                          {c.brackets[bracket]}
                        </th>
                        <td className="px-2 py-2">
                          {row?.tier ? (
                            <TierBadge tier={row.tier} size="sm" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {formatPercent(row?.winRate, 1, locale)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatPercent(row?.banRate, 1, locale)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          {ratings.length > 0 ? (
            <Section
              title={t.detail.ratings}
              description={t.detail.ratingsDescription}
            >
              <div className="flex flex-col gap-3 rounded-lg border bg-surface p-4">
                {ratings.map((rating) => (
                  <Meter
                    key={rating.label}
                    label={rating.label}
                    value={rating.value}
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {tags ? (
            <Section
              title={t.detail.teamRole}
              description={t.detail.teamRoleDescription}
            >
              <div className="flex flex-col gap-2.5 rounded-lg border bg-surface p-4">
                <p className="text-sm font-medium">
                  {c.damageTypes[tags.damage_type]}
                </p>
                {TAG_FIELDS.map(({ key }) => (
                  <LevelSteps key={key} label={c.tags[key]} level={tags[key]} />
                ))}
                {tags.needs_review ? (
                  <p className="flex items-start gap-1.5 pt-1 text-xs text-muted-foreground">
                    <InfoIcon className="mt-px size-3.5 shrink-0" aria-hidden />
                    {t.detail.needsReview}
                  </p>
                ) : null}
              </div>
            </Section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
