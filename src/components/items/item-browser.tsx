"use client";

import { useMemo } from "react";
import { MagnifyingGlassIcon, SwordIcon } from "@/components/icons";
import { EmptyState } from "@/components/meta/empty-state";
import { Button } from "@/components/ui/button";
import { ChipGroup, type ChipOption } from "@/components/ui/chip-group";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/client";
import { catalogText } from "@/i18n/messages/catalog";
import { common } from "@/i18n/messages/common";
import { inCategory, type ItemView } from "@/lib/catalog/items";
import { searchKey } from "@/lib/format";
import { oneOf, useUrlParams } from "@/lib/use-url-params";
import { ITEM_CATEGORIES, type ItemCategory } from "@/types/domain";
import { ItemCard } from "./item-card";

/** The shop by category, with search over names, stats and passives, kept in the URL. */
export function ItemBrowser({ items }: { items: ItemView[] }) {
  const locale = useLocale();
  const t = catalogText[locale].items;
  const categoryLabels = common[locale].itemCategories;
  const [params, setParams] = useUrlParams();
  const query = params.get("q") ?? "";
  const category = oneOf<ItemCategory>(params.get("category"), ITEM_CATEGORIES);

  const matches = useMemo(() => {
    const key = searchKey(query);
    return key ? items.filter((item) => item.searchText.includes(key)) : items;
  }, [items, query]);

  const options: ChipOption<ItemCategory | "all">[] = [
    { value: "all", label: t.all, count: matches.length },
    ...ITEM_CATEGORIES.map((c) => ({
      value: c,
      label: categoryLabels[c],
      count: matches.filter((item) => inCategory(item, c)).length,
    })),
  ];

  // With every category shown, each item appears once, under its main shop tab.
  const sections = (category === "all" ? ITEM_CATEGORIES : [category])
    .map((c) => ({
      category: c,
      items: matches.filter((item) =>
        category === "all" ? item.category === c : inCategory(item, c),
      ),
    }))
    .filter((section) => section.items.length > 0);
  const shownCount = sections.reduce(
    (sum, section) => sum + section.items.length,
    0,
  );
  const filtered = query !== "" || category !== "all";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <label className="relative block sm:max-w-sm">
          <span className="sr-only">{t.search}</span>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            placeholder={t.searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="pl-9"
            onChange={(event) => setParams({ q: event.target.value })}
          />
        </label>
        <ChipGroup
          label={t.category}
          options={options}
          value={category}
          onChange={(value) =>
            setParams({ category: value === "all" ? null : value })
          }
        />
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t.summary(shownCount, items.length, filtered)}
      </p>

      {sections.length > 0 ? (
        sections.map((section) => (
          <section
            key={section.category}
            aria-labelledby={`items-${section.category}`}
            className="flex flex-col gap-3"
          >
            <h2
              id={`items-${section.category}`}
              className="font-display text-lg font-semibold"
            >
              {categoryLabels[section.category]}
              <span className="ml-2 text-sm font-normal text-muted-foreground tabular-nums">
                {section.items.length}
              </span>
            </h2>
            <ul className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState
          icon={SwordIcon}
          title={t.noMatchTitle}
          description={t.noMatchDescription}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParams({ q: null, category: null })}
            >
              {t.clearSearch}
            </Button>
          }
        />
      )}
    </div>
  );
}
