"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/i18n/config";
import { useLocale } from "@/i18n/client";

/**
 * next/link that keeps the visitor in their language: on an Indonesian page
 * href="/heroes" goes to /id/heroes. Use it for every link inside the app.
 * External links and the welcome page (/) are left as they are.
 */
export default function Link({
  href,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = useLocale();
  return <NextLink href={localizeHref(locale, href)} {...props} />;
}
