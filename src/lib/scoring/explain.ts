import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { counterText } from "@/i18n/messages/counter";
import { formatDecimal } from "@/lib/format";
import type { PairEdge } from "./counter";

export type ReasonLine = { points: number; text: string };

/** Plain sentences for one edge in the page language, largest effect first. */
export function edgeLines(
  edge: PairEdge,
  nameOf: (heroId: number) => string,
  locale: Locale = DEFAULT_LOCALE,
): ReasonLine[] {
  const t = counterText[locale];
  const hero = nameOf(edge.heroId);
  const opponent = nameOf(edge.opponentId);
  const lines: ReasonLine[] = [];

  if (edge.statsDelta !== null) {
    const size = formatDecimal(Math.abs(edge.statsDelta * 100), 1, locale);
    const rises = edge.statsDelta >= 0;
    // Say it the way the source lists it: from the hero whose list has it.
    const text =
      edge.statsFrom === "hero"
        ? t.reasons.winRate(hero, rises, size, opponent)
        : t.reasons.winRate(opponent, !rises, size, hero);
    lines.push({ points: edge.points.stats, text });
  }
  for (const note of edge.notes) {
    const [who, whom] =
      note.by === "hero" ? [hero, opponent] : [opponent, hero];
    lines.push({
      points: note.points,
      text: t.reasons.officialNote(who, note.kind === "strong_against", whom),
    });
  }
  let listed = 0;
  for (const reason of edge.tagReasons) {
    listed += reason.points;
    lines.push({
      points: reason.points,
      text: t.reasons.tag(
        reason.by === "hero" ? hero : opponent,
        t.tagRules[reason.rule],
      ),
    });
  }
  // Tag effects too small to list still count; show their sum so the lines
  // add up to the edge.
  const rest = edge.points.tags - listed;
  if (Math.abs(rest) >= 0.05)
    lines.push({ points: rest, text: t.reasons.smallerTagEffects });
  lines.sort((a, b) => Math.abs(b.points) - Math.abs(a.points));
  return lines;
}
