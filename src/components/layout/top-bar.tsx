import { Wordmark } from "@/components/brand/wordmark";
import { ThemeCycleButton } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { LanguageToggleButton } from "./language-switch";

/** Mobile and tablet header. Desktop uses the sidebar instead. */
export function TopBar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-surface/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-surface/80",
        className,
      )}
    >
      <Wordmark />
      <div className="flex items-center gap-1">
        <LanguageToggleButton />
        <ThemeCycleButton />
      </div>
    </header>
  );
}
