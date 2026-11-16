"use client";

import {
  DesktopIcon,
  MoonIcon,
  SunIcon,
  type IconComponent,
} from "@/components/icons";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { cn } from "@/lib/utils";
import type { ThemePreference } from "./theme-constants";
import { useThemePreference } from "./use-theme";

const options: {
  value: ThemePreference;
  icon: IconComponent;
}[] = [
  { value: "system", icon: DesktopIcon },
  { value: "light", icon: SunIcon },
  { value: "dark", icon: MoonIcon },
];

/** Three-way theme switch: follow the system, or force light or dark. */
export function ThemeToggle({ className }: { className?: string }) {
  const [preference, setPreference] = useThemePreference();
  const t = common[useLocale()].shell;

  return (
    <div
      role="radiogroup"
      aria-label={t.themeGroup}
      className={cn(
        "grid grid-cols-3 gap-1 rounded-md border bg-surface-2 p-1",
        className,
      )}
    >
      {options.map(({ value, icon: Icon }) => {
        const checked = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => setPreference(value)}
            className={cn(
              "flex h-8 items-center justify-center gap-1.5 rounded-[7px] text-xs font-medium text-muted-foreground transition-colors",
              "hover:text-foreground",
              checked &&
                "bg-surface text-foreground shadow-[var(--shadow-panel)]",
            )}
          >
            <Icon
              className="size-4"
              weight={checked ? "fill" : "regular"}
              aria-hidden
            />
            {t.themeOptions[value]}
          </button>
        );
      })}
    </div>
  );
}

/** Compact button for tight spaces: cycles system, light, dark. */
export function ThemeCycleButton({ className }: { className?: string }) {
  const [preference, setPreference] = useThemePreference();
  const index = options.findIndex((option) => option.value === preference);
  const current = options[index] ?? options[0]!;
  const next = options[(index + 1) % options.length]!;
  const Icon = current.icon;
  const t = common[useLocale()].shell;

  return (
    <button
      type="button"
      onClick={() => setPreference(next.value)}
      aria-label={t.themeCycle(
        t.themeOptions[current.value],
        t.themeOptions[next.value],
      )}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
