import type { Tier } from "@/types/domain";
import { defineMessages } from "../define";

/** Columns of the statistics table. */
export type StatsSortKey = "name" | "tier" | "win" | "pick" | "ban";

/** One tier band of the formula: the share of heroes (in percent) that lands in it. */
export type TierBand = { tier: Tier; share: number };

/**
 * Texts of the tier list and statistics pages, and of the pieces they share
 * with the tools (rank, period, role and lane filters, the note about which
 * numbers are shown, rate changes). Numbers and dates are formatted with the
 * page's language before they are passed in.
 */
export const metaText = defineMessages<{
  tierListPage: { title: string; description: string; metaDescription: string };
  statisticsPage: {
    title: string;
    description: string;
    metaDescription: string;
  };
  filters: {
    rank: string;
    period: string;
    role: string;
    lane: string;
    allRoles: string;
    allLanes: string;
    noMatch: string;
  };
  snapshot: {
    /** No numbers for this rank and period. */
    noStats: (bracket: string, period: string) => string;
    /** "Mythic, last 7 days. Updated 14 Oct 2026." */
    updated: (
      bracket: string,
      period: string,
      checked: string,
      unchangedSince: string | null,
    ) => string;
    comparedWith: (date: string) => string;
    changesLater: (days: number) => string;
    loading: string;
    loadError: string;
    stale: (days: number) => string;
  };
  statsTable: {
    search: string;
    caption: string;
    sorts: Record<StatsSortKey, { label: string; short: string }>;
    rarelyPicked: string;
  };
  tierBoard: {
    tier: (tier: Tier) => string;
    heroTitle: (name: string, win: string, pick: string, ban: string) => string;
    emptyTier: string;
    rarelyPicked: string;
    rarelyPickedBody: string;
  };
  tierMethod: {
    summary: string;
    score: (win: string, ban: string, pick: string) => string;
    shrinkage: (share: string) => string;
    ranking: (bands: readonly TierBand[], minPick: string) => string;
  };
  rateDelta: {
    notEnoughHistory: string;
    notAvailable: string;
    noChange: string;
    up: (points: string) => string;
    down: (points: string) => string;
  };
}>({
  en: {
    tierListPage: {
      title: "Tier list",
      description:
        "Every hero ranked SS to D by rank and period. Pick a role or lane to see only those heroes.",
      metaDescription:
        "Mobile Legends heroes ranked SS to D from win rate, pick rate and ban rate, by rank and period.",
    },
    statisticsPage: {
      title: "Hero statistics",
      description:
        "Win, pick and ban rates for every hero. Pick rate is each hero's share of all picks; ban rate is the share of games in which the hero was banned.",
      metaDescription:
        "Win, pick and ban rates for every Mobile Legends hero by rank and period, with the change from the previous period.",
    },
    filters: {
      rank: "Rank",
      period: "Period",
      role: "Role",
      lane: "Lane",
      allRoles: "All roles",
      allLanes: "All lanes",
      noMatch: "No hero matches these filters.",
    },
    snapshot: {
      noStats: (bracket, period) =>
        `No statistics for ${bracket}, ${period.toLowerCase()} yet.`,
      updated: (bracket, period, checked, unchangedSince) =>
        `${bracket}, ${period.toLowerCase()}. Updated ${checked}${
          unchangedSince ? ` (numbers unchanged since ${unchangedSince})` : ""
        }.`,
      comparedWith: (date) => `Changes are compared with ${date}.`,
      changesLater: (days) =>
        `Changes appear once there are numbers from ${
          days === 1 ? "the day" : `${days} days`
        } before.`,
      loading: "Loading…",
      loadError:
        "The numbers you picked could not be loaded, so the previous ones stay on screen.",
      stale: (days) => `No update for ${days} days. The next one may be late.`,
    },
    statsTable: {
      search: "Search heroes",
      caption: "Hero statistics. Select a column header to sort.",
      sorts: {
        name: { label: "Hero", short: "Hero" },
        tier: { label: "Tier", short: "Tier" },
        win: { label: "Win rate", short: "Win" },
        pick: { label: "Pick rate", short: "Pick" },
        ban: { label: "Ban rate", short: "Ban" },
      },
      rarelyPicked: "Rarely picked",
    },
    tierBoard: {
      tier: (tier) => `Tier ${tier}`,
      heroTitle: (name, win, pick, ban) =>
        `${name}: win rate ${win}, pick rate ${pick}, ban rate ${ban}`,
      emptyTier: "No heroes in this tier.",
      rarelyPicked: "Rarely picked",
      rarelyPickedBody:
        "Picked in too few games to rank fairly, so they have no tier.",
    },
    tierMethod: {
      summary: "How tiers are calculated",
      score: (win, ban, pick) =>
        `Each hero gets a score from three numbers in the chosen rank and period: win rate counts ${win}, ban rate ${ban} and pick rate ${pick}. Every number is compared with all heroes in the same rank and period, so a tier means strong for that rank right now.`,
      shrinkage: (share) =>
        `A win rate from few games is less certain, so it is pulled toward 50%. A hero with ${share} of all picks counts half its own win rate and half 50%.`,
      ranking: (bands, minPick) => {
        const list = bands
          .map(({ tier, share }, i) =>
            i === 0
              ? `the top ${share}% are ${tier}`
              : i === bands.length - 1
                ? `and the last ${share}% are ${tier}`
                : `the next ${share}% ${tier}`,
          )
          .join(", ");
        return `Heroes are then sorted by score: ${list}. Heroes with under ${minPick} of all picks are listed as rarely picked.`;
      },
    },
    rateDelta: {
      notEnoughHistory: "Not enough history yet",
      notAvailable: "n/a",
      noChange: "No change",
      up: (points) => `Up ${points} points`,
      down: (points) => `Down ${points} points`,
    },
  },
  id: {
    tierListPage: {
      title: "Tier list",
      description:
        "Semua hero dikasih tier SS sampai D, per rank dan periode. Mau lihat role atau lane tertentu aja? Tinggal pilih di filter.",
      metaDescription:
        "Tier list hero Mobile Legends dari SS sampai D, dihitung dari win rate, pick rate, dan ban rate, per rank dan periode.",
    },
    statisticsPage: {
      title: "Statistik hero",
      description:
        "Win rate, pick rate, dan ban rate semua hero. Pick rate itu berapa persen dari semua pick yang jatuh ke hero itu, dan ban rate itu di berapa persen game hero itu kena ban.",
      metaDescription:
        "Win rate, pick rate, dan ban rate semua hero Mobile Legends per rank dan periode, lengkap sama perubahannya dari periode sebelumnya.",
    },
    filters: {
      rank: "Rank",
      period: "Periode",
      role: "Role",
      lane: "Lane",
      allRoles: "Semua role",
      allLanes: "Semua lane",
      noMatch: "Nggak ada hero yang cocok sama filter ini.",
    },
    snapshot: {
      noStats: (bracket, period) =>
        `Belum ada statistik buat ${bracket}, ${period.toLowerCase()}.`,
      updated: (bracket, period, checked, unchangedSince) =>
        `${bracket}, ${period.toLowerCase()}. Di-update ${checked}${
          unchangedSince
            ? ` (angkanya nggak berubah sejak ${unchangedSince})`
            : ""
        }.`,
      comparedWith: (date) => `Perubahannya dibandingin sama data ${date}.`,
      changesLater: (days) =>
        `Perubahannya baru muncul kalo udah ada data dari ${
          days === 1 ? "sehari" : `${days} hari`
        } sebelumnya.`,
      loading: "Lagi dimuat…",
      loadError:
        "Angka yang kamu pilih gagal dimuat, jadi yang sebelumnya masih ditampilin.",
      stale: (days) =>
        `Udah ${days} hari nggak ada update. Update berikutnya mungkin agak telat.`,
    },
    statsTable: {
      search: "Cari hero",
      caption: "Statistik hero. Pilih judul kolom buat ngurutin.",
      sorts: {
        name: { label: "Hero", short: "Hero" },
        tier: { label: "Tier", short: "Tier" },
        win: { label: "Win rate", short: "Win" },
        pick: { label: "Pick rate", short: "Pick" },
        ban: { label: "Ban rate", short: "Ban" },
      },
      rarelyPicked: "Jarang di-pick",
    },
    tierBoard: {
      tier: (tier) => `Tier ${tier}`,
      heroTitle: (name, win, pick, ban) =>
        `${name}: win rate ${win}, pick rate ${pick}, ban rate ${ban}`,
      emptyTier: "Nggak ada hero di tier ini.",
      rarelyPicked: "Jarang di-pick",
      rarelyPickedBody:
        "Terlalu jarang di-pick, jadi datanya belum cukup buat dikasih tier yang adil.",
    },
    tierMethod: {
      summary: "Cara ngitung tier",
      score: (win, ban, pick) =>
        `Tiap hero dapet skor dari tiga angka di rank dan periode yang kamu pilih, dengan bobot win rate ${win}, ban rate ${ban}, dan pick rate ${pick}. Masing-masing angka dibandingin sama semua hero di rank dan periode yang sama, jadi tier di sini artinya kuat di rank itu buat meta sekarang.`,
      shrinkage: (share) =>
        `Win rate dari sedikit game kurang bisa dipercaya, jadi angkanya ditarik ke arah 50%. Buat hero dengan pick rate ${share}, win rate-nya dihitung setengah dari angka aslinya dan setengah lagi 50%.`,
      ranking: (bands, minPick) => {
        const list = bands
          .map(({ tier, share }, i) =>
            i === 0
              ? `${share}% teratas masuk ${tier}`
              : i === bands.length - 1
                ? `dan ${share}% terbawah masuk ${tier}`
                : `${share}% berikutnya ${tier}`,
          )
          .join(", ");
        return `Habis itu, hero diurutin sesuai skornya: ${list}. Hero dengan pick rate di bawah ${minPick} masuk daftar jarang di-pick.`;
      },
    },
    rateDelta: {
      notEnoughHistory: "Data sebelumnya belum cukup",
      notAvailable: "n/a",
      noChange: "Nggak berubah",
      up: (points) => `Naik ${points} poin`,
      down: (points) => `Turun ${points} poin`,
    },
  },
});
