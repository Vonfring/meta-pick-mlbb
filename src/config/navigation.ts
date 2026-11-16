import {
  ChartBarIcon,
  CrosshairIcon,
  HexagonIcon,
  RankingIcon,
  ScalesIcon,
  StrategyIcon,
  SwordIcon,
  UsersFourIcon,
  UsersThreeIcon,
  type IconComponent,
} from "@/components/icons";
import { common, type NavGroupId, type NavHref } from "@/i18n/messages/common";

export type NavItem = {
  href: NavHref;
  /** English texts; the app shows common[locale].nav.items[href] instead. */
  label: string;
  /** Shorter label for the mobile bottom bar. */
  shortLabel?: string;
  icon: IconComponent;
  description: string;
};

export type NavGroup = {
  id: NavGroupId;
  label: string;
  items: NavItem[];
};

const groupItems: Record<NavGroupId, [NavHref, IconComponent][]> = {
  meta: [
    ["/tier-list", RankingIcon],
    ["/statistics", ChartBarIcon],
  ],
  database: [
    ["/heroes", UsersThreeIcon],
    ["/items", SwordIcon],
    ["/emblems", HexagonIcon],
  ],
  tools: [
    ["/counter-pick", CrosshairIcon],
    ["/matchup", ScalesIcon],
    ["/team-composition", UsersFourIcon],
    ["/draft", StrategyIcon],
  ],
};

const en = common.en.nav;

/** The navigation, with English texts for the welcome page and the sitemap. */
export const navGroups: NavGroup[] = (
  Object.keys(groupItems) as NavGroupId[]
).map((id) => ({
  id,
  label: en.groups[id],
  items: groupItems[id].map(([href, icon]) => ({
    href,
    icon,
    ...en.items[href],
  })),
}));

export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items);

/** Routes shown directly in the mobile bottom bar; the rest live under "More". */
export const mobilePrimaryHrefs = [
  "/heroes",
  "/tier-list",
  "/counter-pick",
  "/draft",
] as const;

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
