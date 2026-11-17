import Link from "@/components/locale-link";
import { HeroAvatar } from "@/components/meta/hero-avatar";
import { TierBadge } from "@/components/meta/tier-badge";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { heroesText } from "@/i18n/messages/heroes";
import { formatPercent } from "@/lib/format";
import type { RankedHero } from "@/lib/data";

/**
 * A hero in the roster grid: portrait with its tier, name, and win rate.
 * Rendered from the hero browser, a Client Component.
 */
export function HeroTile({ hero }: { hero: RankedHero }) {
  const locale = useLocale();
  const c = common[locale];
  return (
    <Link
      href={`/heroes/${hero.slug}`}
      className="group flex flex-col gap-1.5 rounded-md p-1 outline-offset-2 hover:bg-surface"
    >
      <span className="relative block w-full">
        <HeroAvatar
          name={hero.name}
          src={hero.head_image_url}
          size="lg"
          fluid
          decorative
        />
        {hero.tier ? (
          <TierBadge
            tier={hero.tier}
            size="sm"
            className="absolute right-1 bottom-1 shadow-sm"
          />
        ) : null}
      </span>
      <span className="flex flex-col px-0.5">
        <span className="truncate text-sm font-semibold group-hover:text-ally-text">
          {hero.name}
        </span>
        <span className="flex items-baseline justify-between gap-1 text-xs text-muted-foreground">
          <span className="truncate">
            {hero.roles.map((role) => c.roles[role]).join(", ")}
          </span>
          {hero.winRate !== null ? (
            <span
              className="shrink-0 tabular-nums"
              title={heroesText[locale].winRate}
            >
              {formatPercent(hero.winRate, 1, locale)}
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}
