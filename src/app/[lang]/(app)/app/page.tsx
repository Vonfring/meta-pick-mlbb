import Link from "@/components/locale-link";
import {
  CaretRightIcon,
  MagnifyingGlassIcon,
  ScalesIcon,
  StrategyIcon,
  UsersFourIcon,
} from "@/components/icons";
import { navGroups } from "@/config/navigation";
import { common } from "@/i18n/messages/common";
import { homeText } from "@/i18n/messages/home";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = homeText[locale];
  return pageMetadata(locale, "/app", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

const browseItems = navGroups
  .filter((group) => group.id !== "tools")
  .flatMap((group) => group.items);

/** Where "Open the app" leads: the start of the app, inside the shell. */
export default async function AppStartPage() {
  const locale = await getLocale();
  const t = homeText[locale];
  const nav = common[locale].nav.items;
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-5 pt-2 lg:pt-6">
        <h1 className="font-display text-3xl font-bold sm:text-[2.75rem] sm:leading-[1.05]">
          {t.title}
        </h1>
        <p className="max-w-[46ch] text-muted-foreground sm:text-lg">
          {t.intro}
        </p>
        <Link
          href="/counter-pick"
          className="flex h-14 w-full max-w-xl items-center gap-3 rounded-md border bg-surface px-4 text-muted-foreground shadow-[var(--shadow-panel)] transition-colors hover:border-ally hover:text-foreground"
        >
          <MagnifyingGlassIcon className="size-5" aria-hidden />
          <span className="flex-1">{t.searchEnemies}</span>
          <CaretRightIcon className="size-4" aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="tools-heading" className="flex flex-col gap-4">
        <h2 id="tools-heading" className="font-display text-xl font-semibold">
          {t.planHeading}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/draft"
            className={cn(
              "group relative flex min-h-44 flex-col justify-between gap-6 overflow-hidden rounded-lg border p-5 sm:col-span-2 sm:min-h-52 sm:p-6",
              "bg-[linear-gradient(to_top_right,var(--ally-soft)_calc(50%-1px),var(--border)_calc(50%-1px)_calc(50%+1px),var(--enemy-soft)_calc(50%+1px))]",
            )}
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-medium text-enemy-text">
                {t.enemySide}
              </span>
              <StrategyIcon className="size-7 text-foreground" aria-hidden />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-2xl font-bold">
                {nav["/draft"].label}
              </span>
              <span className="max-w-[44ch] text-sm text-muted-foreground">
                {t.draftDescription}
              </span>
              <span className="pt-2 text-sm font-medium text-ally-text">
                {t.yourSide}
              </span>
            </span>
          </Link>
          <ToolLink
            href="/team-composition"
            title={nav["/team-composition"].label}
            description={t.teamCompositionDescription}
            icon={UsersFourIcon}
          />
          <ToolLink
            href="/matchup"
            title={nav["/matchup"].label}
            description={t.matchupDescription}
            icon={ScalesIcon}
          />
        </div>
      </section>

      <section aria-labelledby="browse-heading" className="flex flex-col gap-4">
        <h2 id="browse-heading" className="font-display text-xl font-semibold">
          {t.browseHeading}
        </h2>
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {browseItems.map(({ href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 border-b py-3.5 transition-colors hover:text-ally-text"
              >
                <Icon
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{nav[href].label}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {nav[href].description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ToolLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof ScalesIcon;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-lg border bg-surface p-5 transition-colors hover:border-ally"
    >
      <Icon className="size-6 text-muted-foreground" aria-hidden />
      <span className="flex flex-col gap-1">
        <span className="font-display text-lg font-semibold">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}
