import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import type { HeroRow } from "@/types/data";
import type { HeroRole } from "@/types/domain";

/** "Fighter and Tank" ("Fighter dan Tank") */
export function rolesText(
  roles: readonly HeroRole[],
  locale: Locale = DEFAULT_LOCALE,
): string {
  const t = common[locale];
  return roles.map((role) => t.roles[role]).join(` ${t.and} `);
}

/** "Fighter and Tank, EXP lane or Roam": the line under a hero's name. */
export function roleLine(
  hero: Pick<HeroRow, "roles" | "lanes">,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const t = common[locale];
  const roles = rolesText(hero.roles, locale);
  return hero.lanes.length > 0
    ? `${roles}, ${hero.lanes.map((lane) => t.lanes[lane]).join(` ${t.or} `)}`
    : roles;
}
