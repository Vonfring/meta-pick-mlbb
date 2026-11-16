import { Wordmark } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { common } from "@/i18n/messages/common";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./language-switch";
import { SidebarNav } from "./sidebar-nav";

export async function AppSidebar({ className }: { className?: string }) {
  const t = common[await getLocale()].shell;
  return (
    <aside
      className={cn(
        "sticky top-0 h-dvh flex-col gap-8 overflow-y-auto border-r bg-surface px-4 py-6",
        className,
      )}
    >
      <Wordmark className="px-2" />
      <SidebarNav />
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="px-1 text-xs font-medium text-muted-foreground">
            {t.language}
          </p>
          <LanguageSwitch />
        </div>
        <div className="flex flex-col gap-2">
          <p className="px-1 text-xs font-medium text-muted-foreground">
            {t.theme}
          </p>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
