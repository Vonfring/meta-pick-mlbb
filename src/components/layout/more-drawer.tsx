"use client";

import Link from "@/components/locale-link";
import { useState } from "react";
import { DotsThreeOutlineIcon, InfoIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  isActivePath,
  mobilePrimaryHrefs,
  navGroups,
} from "@/config/navigation";
import { useAppPath, useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./language-switch";

const primary = new Set<string>(mobilePrimaryHrefs);

export function MoreDrawer({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = useAppPath();
  const t = common[useLocale()];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium",
          active ? "text-ally-text" : "text-muted-foreground",
        )}
      >
        <DotsThreeOutlineIcon
          className="size-6"
          weight={active ? "fill" : "regular"}
          aria-hidden
        />
        {t.shell.more}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t.shell.more}</DrawerTitle>
          <DrawerDescription>{t.shell.moreDescription}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-2">
          {navGroups.map((group) => {
            const items = group.items.filter((item) => !primary.has(item.href));
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="flex flex-col gap-1">
                <p className="pb-1 text-xs font-medium text-muted-foreground">
                  {t.nav.groups[group.id]}
                </p>
                {items.map(({ href, icon: Icon }) => {
                  const current = isActivePath(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5",
                        current ? "bg-ally-soft" : "hover:bg-surface-2",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 shrink-0",
                          current ? "text-ally-text" : "text-muted-foreground",
                        )}
                        weight={current ? "fill" : "regular"}
                        aria-hidden
                      />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">
                          {t.nav.items[href].label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t.nav.items[href].description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-surface-2"
          >
            <InfoIcon
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span className="text-sm font-medium">{t.shell.aboutData}</span>
          </Link>
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t.shell.language}
            </p>
            <LanguageSwitch />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t.shell.theme}
            </p>
            <ThemeToggle />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
