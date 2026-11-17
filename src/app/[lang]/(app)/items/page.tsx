import type { Metadata } from "next";
import { ItemBrowser } from "@/components/items/item-browser";
import { EmptyState } from "@/components/meta/empty-state";
import { PageHeader } from "@/components/meta/page-header";
import { SwordIcon } from "@/components/icons";
import { catalogText } from "@/i18n/messages/catalog";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { toItemViews } from "@/lib/catalog/items";
import { getItems } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = catalogText[locale].items;
  return pageMetadata(locale, "/items", {
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function ItemsPage() {
  const t = catalogText[await getLocale()].items;
  const items = toItemViews(await getItems());

  return (
    <>
      <PageHeader title={t.title} description={t.description} />
      {items.length > 0 ? (
        <ItemBrowser items={items} />
      ) : (
        <EmptyState
          icon={SwordIcon}
          title={t.emptyTitle}
          description={t.emptyDescription}
        />
      )}
    </>
  );
}
