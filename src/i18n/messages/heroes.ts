import type { HeroRelationKind } from "@/types/data";
import { defineMessages } from "../define";

type HeroSortKey = "name" | "tier" | "win";

/**
 * Texts of the hero list, the hero pages and the hero share image. Hero
 * names, skills, specialties, lore and the official notes are source data
 * and stay as the source gives them. Numbers and dates are formatted with
 * the page's language before they are passed in.
 */
export const heroesText = defineMessages<{
  /** "Mythic, last 7 days" */
  snapshot: (bracket: string, period: string) => string;
  /** "Mythic, last 7 days, updated 14 Oct 2026" */
  snapshotUpdated: (snapshot: string, date: string) => string;
  winRate: string;
  pickRate: string;
  banRate: string;
  list: {
    title: string;
    description: string;
    metaDescription: string;
    /** Takes the place of the snapshot in the summary line. */
    noStats: string;
    search: string;
    sortBy: string;
    sorts: Record<HeroSortKey, string>;
    role: string;
    lane: string;
    allRoles: string;
    allLanes: string;
    /** "12 of 131 heroes. Tiers and win rates: Mythic, last 7 days, updated 14 Oct 2026." */
    summary: (
      shown: number,
      total: number,
      filtered: boolean,
      context: string,
    ) => string;
    emptyTitle: string;
    emptyDescription: string;
    clearFilters: string;
  };
  detail: {
    notFoundTitle: string;
    metaDescription: (name: string, roles: string) => string;
    allHeroes: string;
    loading: string;
    specialties: string;
    noStats: string;
    rarelyPicked: string;
    matchups: string;
    matchupsDescription: (name: string, context: string | null) => string;
    strongAgainst: string;
    counteredBy: string;
    noFavorable: string;
    noUnfavorable: string;
    bestTeammates: string;
    bestTeammatesDescription: (name: string, context: string | null) => string;
    noTeammates: string;
    skills: string;
    passive: string;
    /** The cooldown as the source gives it, in seconds: "7.5". */
    cooldown: (seconds: string) => string;
    skillEffects: string;
    officialNotes: string;
    officialNotesDescription: string;
    relations: Record<HeroRelationKind, string>;
    byRank: string;
    columns: { rank: string; tier: string; win: string; ban: string };
    ratings: string;
    ratingsDescription: string;
    teamRole: string;
    teamRoleDescription: string;
    needsReview: string;
  };
  og: {
    tier: (tier: string) => string;
    winRate: (rate: string, bracket: string) => string;
  };
}>({
  en: {
    snapshot: (bracket, period) => `${bracket}, ${period.toLowerCase()}`,
    snapshotUpdated: (snapshot, date) => `${snapshot}, updated ${date}`,
    winRate: "Win rate",
    pickRate: "Pick rate",
    banRate: "Ban rate",
    list: {
      title: "Heroes",
      description:
        "Find a hero by name, role or lane. Open one for skills, counters and best teammates.",
      metaDescription:
        "Every Mobile Legends hero with role, lane, tier and win rate, plus skills, counters and best teammates on each hero's page.",
      noStats: "no statistics yet",
      search: "Search heroes",
      sortBy: "Sort by",
      sorts: { name: "Name", tier: "Tier", win: "Win rate" },
      role: "Role",
      lane: "Lane",
      allRoles: "All roles",
      allLanes: "All lanes",
      summary: (shown, total, filtered, context) =>
        `${filtered ? `${shown} of ${total} heroes` : `${total} heroes`}. Tiers and win rates: ${context}.`,
      emptyTitle: "No hero matches these filters",
      emptyDescription: "Try another name, or clear the role and lane filters.",
      clearFilters: "Clear filters",
    },
    detail: {
      notFoundTitle: "Hero not found",
      metaDescription: (name, roles) =>
        `${name} (${roles}) in Mobile Legends: win rate, tier, the heroes ${name} beats and loses to, best teammates and skills.`,
      allHeroes: "All heroes",
      loading: "Loading hero",
      specialties: "Specialties",
      noStats: "No stats yet",
      rarelyPicked: "Rarely picked",
      matchups: "Matchups",
      matchupsDescription: (name, context) =>
        `How ${name}'s win rate changes against each hero, in percentage points${context ? ` (${context})` : ""}. The official data lists each hero's five best and five worst matchups.`,
      strongAgainst: "Strong against",
      counteredBy: "Countered by",
      noFavorable: "No favorable matchups in the data.",
      noUnfavorable: "No unfavorable matchups in the data.",
      bestTeammates: "Best teammates",
      bestTeammatesDescription: (name, context) =>
        `Heroes that raise ${name}'s win rate most when on the same team${context ? ` (${context})` : ""}.`,
      noTeammates: "No teammate data for this hero yet.",
      skills: "Skills",
      passive: "Passive",
      cooldown: (seconds) => `Cooldown ${seconds}s`,
      skillEffects: "Skill effects",
      officialNotes: "Official notes",
      officialNotesDescription:
        "What the official hero guide says about pairings.",
      relations: {
        best_teammate: "Works well with",
        strong_against: "Strong against",
        weak_against: "Weak against",
      },
      byRank: "By rank",
      columns: { rank: "Rank", tier: "Tier", win: "Win", ban: "Ban" },
      ratings: "Hero ratings",
      ratingsDescription: "Official ratings from 0 to 100.",
      teamRole: "Team role",
      teamRoleDescription:
        "Rated by hand from 0 to 3 for the team composition check and draft suggestions.",
      needsReview: "These values still need a check against recent games.",
    },
    og: {
      tier: (tier) => `Tier ${tier}`,
      winRate: (rate, bracket) => `Win rate ${rate} in ${bracket}`,
    },
  },
  id: {
    snapshot: (bracket, period) => `${bracket}, ${period.toLowerCase()}`,
    snapshotUpdated: (snapshot, date) => `${snapshot}, di-update ${date}`,
    winRate: "Win rate",
    pickRate: "Pick rate",
    banRate: "Ban rate",
    list: {
      title: "Hero",
      description:
        "Cari hero lewat nama, role, atau lane. Buka salah satu buat lihat skill, counter, dan teman setim terbaiknya.",
      metaDescription:
        "Semua hero Mobile Legends lengkap sama role, lane, tier, dan win rate-nya. Buka halaman tiap hero buat lihat skill, counter, dan teman setim terbaiknya.",
      noStats: "belum ada statistik",
      search: "Cari hero",
      sortBy: "Urutin",
      sorts: { name: "Nama", tier: "Tier", win: "Win rate" },
      role: "Role",
      lane: "Lane",
      allRoles: "Semua role",
      allLanes: "Semua lane",
      summary: (shown, total, filtered, context) =>
        `${filtered ? `${shown} dari ${total} hero` : `${total} hero`}. Tier dan win rate: ${context}.`,
      emptyTitle: "Nggak ada hero yang cocok sama filter ini",
      emptyDescription: "Coba nama lain, atau hapus filter role dan lane-nya.",
      clearFilters: "Hapus filter",
    },
    detail: {
      notFoundTitle: "Hero nggak ketemu",
      metaDescription: (name, roles) =>
        `Win rate, tier, dan skill ${name} (${roles}) di Mobile Legends, plus hero yang gampang dia kalahin, hero yang nge-counter dia, dan teman setim terbaiknya.`,
      allHeroes: "Semua hero",
      loading: "Hero lagi dimuat",
      specialties: "Spesialisasi",
      noStats: "Belum ada statistik",
      rarelyPicked: "Jarang di-pick",
      matchups: "Matchup",
      matchupsDescription: (name, context) =>
        `Naik-turunnya win rate ${name} pas ketemu tiap hero, dalam poin persen${context ? ` (${context})` : ""}. Data resmi cuma ngasih lima matchup terbaik dan lima terburuk tiap hero.`,
      strongAgainst: "Kuat lawan",
      counteredBy: "Di-counter sama",
      noFavorable: "Belum ada matchup yang nguntungin di datanya.",
      noUnfavorable: "Belum ada matchup yang ngerugiin di datanya.",
      bestTeammates: "Teman setim terbaik",
      bestTeammatesDescription: (name, context) =>
        `Hero yang paling ngangkat win rate ${name} kalo satu tim${context ? ` (${context})` : ""}.`,
      noTeammates: "Belum ada data teman setim buat hero ini.",
      skills: "Skill",
      passive: "Pasif",
      cooldown: (seconds) => `Cooldown ${seconds.replace(/\./g, ",")} detik`,
      skillEffects: "Efek skill",
      officialNotes: "Catatan resmi",
      officialNotesDescription:
        "Apa kata panduan hero resmi soal teman setim dan lawan.",
      relations: {
        best_teammate: "Cocok bareng",
        strong_against: "Kuat lawan",
        weak_against: "Lemah lawan",
      },
      byRank: "Per rank",
      columns: { rank: "Rank", tier: "Tier", win: "Win", ban: "Ban" },
      ratings: "Rating hero",
      ratingsDescription: "Rating resmi dari 0 sampai 100.",
      teamRole: "Peran di tim",
      teamRoleDescription:
        "Dinilai manual dari 0 sampai 3, dipake buat cek komposisi tim dan saran draft.",
      needsReview: "Nilainya masih perlu dicek ulang pake match terbaru.",
    },
    og: {
      tier: (tier) => `Tier ${tier}`,
      winRate: (rate, bracket) => `Win rate ${rate} di ${bracket}`,
    },
  },
});
