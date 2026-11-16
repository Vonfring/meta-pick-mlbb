import Link from "@/components/locale-link";
import { siteConfig } from "@/config/site";
import { common } from "@/i18n/messages/common";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

export async function Wordmark({ className }: { className?: string }) {
  const t = common[await getLocale()].shell;
  // Inside the app the logo leads to the app's start, not the welcome page.
  return (
    <Link
      href="/app"
      className={cn("inline-flex items-center gap-2 rounded-sm", className)}
    >
      <LogoMark className="size-6" />
      <span className="font-display text-[1.375rem] leading-none font-bold tracking-tight">
        {siteConfig.wordmark}
      </span>
      <span className="rounded-[5px] border px-1.5 py-[3px] text-[0.625rem] leading-none font-bold text-muted-foreground">
        {siteConfig.label}
      </span>
      <span className="sr-only">{t.homeSuffix}</span>
    </Link>
  );
}
