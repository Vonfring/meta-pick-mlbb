"use client";

import Link from "@/components/locale-link";
import {
  allNavItems,
  isActivePath,
  mobilePrimaryHrefs,
} from "@/config/navigation";
import { useAppPath, useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { cn } from "@/lib/utils";
import { MoreDrawer } from "./more-drawer";

const primaryItems = mobilePrimaryHrefs.map((href) =>
  allNavItems.find((item) => item.href === href)!,
);

/** Fixed bottom bar for phones and tablets. */
export function BottomNav({ className }: { className?: string }) {
  const pathname = useAppPath();
  const t = common[useLocale()];
  const moreActive =
    !primaryItems.some((item) => isActivePath(pathname, item.href)) &&
    allNavItems.some((item) => isActivePath(pathname, item.href));

  return (
    <nav
      aria-label={t.shell.mainNav}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-surface/85",
        className,
      )}
    >
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {primaryItems.map(({ href, icon: Icon }) => {
          const text = t.nav.items[href];
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium",
                  active ? "text-ally-text" : "text-muted-foreground",
                )}
              >
                <Icon
                  className="size-6"
                  weight={active ? "fill" : "regular"}
                  aria-hidden
                />
                {text.shortLabel ?? text.label}
              </Link>
            </li>
          );
        })}
        <li>
          <MoreDrawer active={moreActive} />
        </li>
      </ul>
    </nav>
  );
}
