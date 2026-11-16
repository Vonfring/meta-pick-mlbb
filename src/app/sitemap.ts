import type { MetadataRoute } from "next";
import { allNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { localizeHref, LOCALES } from "@/i18n/config";
import { getHeroes, getLastUpdate } from "@/lib/data";

/**
 * The home (welcome) page, then every app page in English and Indonesian
 * (docs/i18n.md): the app's start, every page in the navigation, one entry
 * per hero and the about page. Each app entry lists its other language as
 * an alternate. Built with the site and refreshed with the game data, which
 * the welcome page and hero pages show.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [heroes, lastUpdate] = await Promise.all([
    getHeroes(),
    getLastUpdate(),
  ]);
  const lastModified = lastUpdate ? new Date(lastUpdate) : undefined;
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const localized = (path: string, withDate = true): MetadataRoute.Sitemap =>
    LOCALES.map((locale) => ({
      url: url(localizeHref(locale, path)),
      ...(withDate && lastModified ? { lastModified } : {}),
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((other) => [other, url(localizeHref(other, path))]),
        ),
      },
    }));

  return [
    { url: url("/"), lastModified },
    ...localized("/app"),
    ...allNavItems.flatMap((item) => localized(item.href)),
    ...heroes.flatMap((hero) => localized(`/heroes/${hero.slug}`)),
    ...localized("/about", false),
  ];
}
