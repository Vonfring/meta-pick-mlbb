import { COUNTER_SCORING } from "@/config/counter-scoring";
import { counterText } from "@/i18n/messages/counter";
import { getLocale } from "@/i18n/server";
import { formatDecimal } from "@/lib/format";

/** How counters are scored, written from src/config/counter-scoring.ts so it never drifts. */
export async function CounterMethod() {
  const locale = await getLocale();
  const t = counterText[locale];
  const m = t.method;
  const { statsWeight, relationPoints, tagRules, metaWeight } = COUNTER_SCORING;
  // Config values as written ("0.3", "1.5"), with the language's decimal mark.
  const points = (value: number) =>
    m.points(
      formatDecimal(
        value,
        Math.min(2, (String(value).split(".")[1] ?? "").length),
        locale,
      ),
    );
  return (
    <details className="group rounded-lg border bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:hidden">
        {m.title}
      </summary>
      <div className="flex max-w-[68ch] flex-col gap-3 border-t px-4 py-4 text-sm text-muted-foreground">
        <p>{m.intro}</p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>{m.statistics(points(statsWeight))}</li>
          <li>{m.notes(points(relationPoints))}</li>
          <li>
            {m.tags(
              tagRules.map((r) => t.tagRules[r.id]).join("; "),
              points(Math.max(...tagRules.map((r) => r.points))),
            )}
          </li>
          <li>{m.meta(points(metaWeight))}</li>
        </ul>
        <p>{m.limited(t.view.tagsAndMetaOnly)}</p>
      </div>
    </details>
  );
}
