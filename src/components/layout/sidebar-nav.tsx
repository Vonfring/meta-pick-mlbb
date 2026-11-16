"use client";

import Link from "@/components/locale-link";
import { isActivePath, navGroups } from "@/config/navigation";
import { useAppPath, useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = useAppPath();
  const t = common[useLocale()];

  return (
    <nav aria-label={t.shell.mainNav} className="flex flex-col gap-6">
      {navGroups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
            {t.nav.groups[group.id]}
          </p>
          {group.items.map(({ href, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-ally-soft text-foreground"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    active ? "text-ally-text" : "text-current",
                  )}
                  weight={active ? "fill" : "regular"}
                  aria-hidden
                />
                {t.nav.items[href].label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
