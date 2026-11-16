"use client";

import Link from "@/components/locale-link";
import { useEffect } from "react";
import { WarningIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = common[useLocale()].error;
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex max-w-[60ch] flex-col items-start gap-4 py-10">
      <WarningIcon className="size-8 text-enemy-text" aria-hidden />
      <h1 className="font-display text-2xl font-bold">{t.title}</h1>
      <p className="text-muted-foreground">{t.body}</p>
      <div className="flex gap-2">
        <Button onClick={() => retry()}>{t.tryAgain}</Button>
        <Button asChild variant="outline">
          <Link href="/app">{t.openApp}</Link>
        </Button>
      </div>
    </div>
  );
}
