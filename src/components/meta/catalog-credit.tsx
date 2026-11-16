import { siteConfig } from "@/config/site";
import { common } from "@/i18n/messages/common";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";

/** Attribution for the Liquipedia catalog (CC BY-SA 3.0). */
export async function CatalogCredit({ className }: { className?: string }) {
  const { source, license } = siteConfig.catalogCredit;
  const t = common[await getLocale()].site.catalogCredit;
  const link = "underline underline-offset-2 hover:text-foreground";
  return (
    <p className={cn(className)}>
      {t.before}{" "}
      <a href={source.href} className={link} rel="noopener">
        {source.label}
      </a>{" "}
      {t.middle}{" "}
      <a href={license.href} className={link} rel="noopener license">
        {license.label}
      </a>
      {t.after}
    </p>
  );
}
