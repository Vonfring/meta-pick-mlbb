import Link from "@/components/locale-link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { common } from "@/i18n/messages/common";
import { getLocale } from "@/i18n/server";

// Unknown URLs and notFound() in any page land here, outside the (app)
// layout, so the page brings its own shell.
export default function NotFound() {
  return (
    <AppShell>
      <NotFoundMessage />
    </AppShell>
  );
}

async function NotFoundMessage() {
  const t = common[await getLocale()].notFound;
  return (
    <div className="flex max-w-[60ch] flex-col items-start gap-4 py-10">
      <p className="font-display text-sm font-semibold text-enemy-text">404</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{t.title}</h1>
      <p className="text-muted-foreground">{t.body}</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/heroes">{t.browseHeroes}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/app">{t.openApp}</Link>
        </Button>
      </div>
    </div>
  );
}
