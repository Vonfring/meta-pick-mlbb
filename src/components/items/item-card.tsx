import { CoinsIcon } from "@/components/icons";
import type { Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { catalogText } from "@/i18n/messages/catalog";
import type { ItemView } from "@/lib/catalog/items";
import { formatGold } from "@/lib/format";

function Price({ amount, locale }: { amount: number; locale: Locale }) {
  const t = catalogText[locale].items;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums">
      <CoinsIcon className="size-4 text-muted-foreground" aria-hidden />
      {amount === 0 ? (
        t.free
      ) : (
        <>
          {formatGold(amount, locale)}
          <span className="sr-only">{t.gold}</span>
        </>
      )}
    </span>
  );
}

/** One item of the shop. Rendered from the item browser, a Client Component. */
export function ItemCard({ item }: { item: ItemView }) {
  const locale = useLocale();
  const c = catalogText[locale];
  const t = c.items;
  const recipe = [
    { label: t.builtFrom, names: item.builtFrom },
    { label: t.buildsInto, names: item.buildsInto },
  ].filter((row) => row.names.length > 0);

  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-surface p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <h3 className="leading-snug font-semibold">{item.name}</h3>
          {item.tier !== null ? (
            <p className="text-xs text-muted-foreground">
              {t.tiers[item.tier] ?? t.tierFallback(item.tier)}
            </p>
          ) : null}
        </div>
        {item.price !== null ? (
          <Price amount={item.price} locale={locale} />
        ) : null}
      </header>

      {item.attributes.length > 0 ? (
        <ul className="flex flex-col gap-0.5 text-sm" aria-label={c.stats}>
          {item.attributes.map((attribute) => (
            <li key={attribute.label}>
              <span className="font-medium tabular-nums">
                {attribute.value}
              </span>{" "}
              {attribute.label}
            </li>
          ))}
        </ul>
      ) : null}

      {item.passives.map((passive, index) => (
        // Names can repeat: Demon Hunter Sword has two "Devour" passives.
        <div
          key={`${index}-${passive.name}`}
          className="flex flex-col gap-0.5 text-sm"
        >
          <h4 className="font-medium">{passive.name}</h4>
          <p className="whitespace-pre-line text-muted-foreground">
            {passive.description}
          </p>
        </div>
      ))}

      {recipe.length > 0 ? (
        <dl className="flex flex-col gap-1 border-t pt-3 text-xs text-muted-foreground">
          {recipe.map((row) => (
            <div key={row.label}>
              <dt className="inline font-medium text-foreground">
                {row.label}:{" "}
              </dt>
              <dd className="inline">{row.names.join(", ")}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </article>
  );
}
