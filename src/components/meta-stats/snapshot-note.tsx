"use client";

import { useSyncExternalStore } from "react";
import { InfoIcon } from "@/components/icons";
import { useLocale } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { metaText } from "@/i18n/messages/meta";
import type { MetaSnapshot, SnapshotInfo } from "@/lib/data";
import { formatDate } from "@/lib/format";

/** Statistics older than this get a note that the update may be late. */
const STALE_AFTER_HOURS = 48;

// Read once in the browser. The server and the prerendered HTML show no
// staleness note, since they cannot know when the page is read.
const openedAt = typeof window === "undefined" ? null : Date.now();
const subscribe = () => () => {};

/**
 * Which numbers are shown, when they were updated, and what the changes
 * compare with. Without `previous` (pages that show no changes) the last
 * part is left out.
 */
export function SnapshotNote({
  data,
  loading,
  error,
}: {
  data: Pick<MetaSnapshot, "bracket" | "period" | "checkedAt" | "snapshot"> & {
    previous?: SnapshotInfo | null;
  };
  loading: boolean;
  error: boolean;
}) {
  const now = useSyncExternalStore(
    subscribe,
    () => openedAt,
    () => null,
  );
  const locale = useLocale();
  const c = common[locale];
  const t = metaText[locale].snapshot;
  const { snapshot, previous } = data;
  if (!snapshot) {
    return (
      <p className="text-sm text-muted-foreground">
        {t.noStats(c.brackets[data.bracket], c.periods[data.period])}
      </p>
    );
  }
  // The updater only writes numbers that changed, so the last check can be
  // newer than the snapshot itself.
  const checked = data.checkedAt ?? snapshot.fetched_at;
  const fetchedDate = formatDate(snapshot.fetched_at, locale);
  const checkedDate = formatDate(checked, locale);
  const ageHours = now === null ? 0 : (now - Date.parse(checked)) / 3_600_000;
  return (
    <div
      className="flex flex-col gap-1 text-sm text-muted-foreground"
      aria-live="polite"
    >
      <p>
        {t.updated(
          c.brackets[snapshot.rank_bracket],
          c.periods[snapshot.period_days],
          checkedDate,
          fetchedDate !== checkedDate ? fetchedDate : null,
        )}{" "}
        {previous === undefined
          ? ""
          : previous
            ? t.comparedWith(formatDate(previous.snapshot_date, locale))
            : t.changesLater(snapshot.period_days)}
        {loading ? ` ${t.loading}` : ""}
      </p>
      {error ? <p className="text-negative">{t.loadError}</p> : null}
      {ageHours > STALE_AFTER_HOURS ? (
        <p className="flex items-center gap-1.5">
          <InfoIcon className="size-4 shrink-0" aria-hidden />
          {t.stale(Math.floor(ageHours / 24))}
        </p>
      ) : null}
    </div>
  );
}
