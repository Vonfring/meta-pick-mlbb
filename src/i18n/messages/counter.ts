import type { CounterTagRuleId } from "@/config/counter-scoring";
import { defineMessages } from "../define";

/**
 * Texts of the Counter pick page and its "How the score works" box, plus the
 * reason sentences under every edge (src/lib/scoring/explain.ts), which
 * Matchup and the suggestion rows show too.
 *
 * Generic tool texts ("Why Fanny", "Against Fanny", "Current form", "score")
 * come from toolsText in ./tools.ts.
 */
export const counterText = defineMessages<{
  page: {
    title: string;
    /** Meta description for search results and link previews. */
    metaDescription: string;
    /** Line under the page title. */
    description: string;
  };
  view: {
    enemyTeam: string;
    /** HeroSlots teamName, without an article: "enemy team". */
    teamName: string;
    clear: string;
    searchEnemies: string;
    addToEnemies: (name: string) => string;
    enemiesFull: string;
    bestCounters: string;
    allRoles: string;
    allLanes: string;
    roleFilter: string;
    laneFilter: string;
    emptyTitle: string;
    emptyDescription: string;
    noMatch: string;
    showMore: (count: number) => string;
    weakest: string;
    /** Marks a hero with no statistics or official note against any enemy. */
    tagsAndMetaOnly: string;
    metaOnly: string;
    /** `rate` is already formatted: "52.3%". */
    adjustedWinRate: (rate: string, rank: string) => string;
    noStats: (rank: string) => string;
  };
  method: {
    title: string;
    intro: string;
    /** "1.5 points", with the number already formatted. */
    points: (value: string) => string;
    /** Each takes a `points` text already built with `points()`. */
    statistics: (points: string) => string;
    notes: (points: string) => string;
    /** `rules` is the tag rule phrases already joined. */
    tags: (rules: string, maxPoints: string) => string;
    meta: (points: string) => string;
    limited: (label: string) => string;
  };
  /**
   * The tag rules of src/config/counter-scoring.ts, keyed by rule id, as
   * they read inside a sentence: "hard crowd control against a mobile hero".
   */
  tagRules: Record<CounterTagRuleId, string>;
  /** Sentences of edgeLines(); numbers are already formatted. */
  reasons: {
    winRate: (
      hero: string,
      rises: boolean,
      points: string,
      opponent: string,
    ) => string;
    officialNote: (who: string, strong: boolean, whom: string) => string;
    /** A tag rule phrase from `tagRules`, credited to the hero it favors. */
    tag: (hero: string, rule: string) => string;
    smallerTagEffects: string;
  };
}>({
  en: {
    page: {
      title: "Counter pick",
      metaDescription:
        "Pick up to five enemy heroes and get counters ranked by score, with the reasons behind each one.",
      description:
        "Add the enemy heroes you are facing. Counters are ranked by score, and each one shows the numbers behind it.",
    },
    view: {
      enemyTeam: "Enemy team",
      teamName: "enemy team",
      clear: "Clear",
      searchEnemies: "Search enemy heroes",
      addToEnemies: (name) => `Add ${name} to the enemy team`,
      enemiesFull: "The enemy team is full. Tap a hero above to remove it.",
      bestCounters: "Best counters",
      allRoles: "All roles",
      allLanes: "All lanes",
      roleFilter: "Role of the suggested heroes",
      laneFilter: "Lane of the suggested heroes",
      emptyTitle: "Add an enemy hero to start",
      emptyDescription:
        "Pick up to five enemies. Counters are ranked by matchup statistics, official hero notes and hero tags, and each one shows why.",
      noMatch: "No hero matches this role and lane.",
      showMore: (count) => `Show ${count} more`,
      weakest: "Weakest picks into this team",
      tagsAndMetaOnly: "Tags and meta only",
      metaOnly: "Meta only",
      adjustedWinRate: (rate, rank) => `Adjusted win rate ${rate} in ${rank}`,
      noStats: (rank) => `No statistics in ${rank} yet`,
    },
    method: {
      title: "How the score works",
      intro:
        "The score adds up how a hero does against each enemy, plus a little for current form. One point is about one percentage point of win rate.",
      points: (value) => (value === "1" ? "1 point" : `${value} points`),
      statistics: (points) =>
        `Statistics: ${points} per percentage point the win rate changes when the two heroes meet. The official data lists each hero's five best and five worst matchups, so many pairs have no number.`,
      notes: (points) =>
        `Official notes: ${points} when a hero's page says it is strong against the enemy, or the enemy's page says it is weak against the hero. The opposite notes take the same away.`,
      tags: (rules, maxPoints) =>
        `Hero tags: ${rules}. Each is worth up to ${maxPoints} when both heroes are at the top of the scale, and counts against the hero when the enemy has the edge.`,
      meta: (points) =>
        `Meta: ${points} per percentage point of adjusted win rate above 50%, the same win rate the tier list uses.`,
      limited: (label) =>
        `Heroes with no statistics or official note against any of the enemies are marked “${label}”.`,
    },
    tagRules: {
      lockdown: "hard crowd control against a mobile hero",
      burst: "burst against a hero with little frontline",
      peel: "peel against a diving assassin",
    },
    reasons: {
      winRate: (hero, rises, points, opponent) =>
        `${hero}'s win rate ${rises ? "rises" : "falls"} ${points} points against ${opponent}`,
      officialNote: (who, strong, whom) =>
        `Official note: ${who} is ${strong ? "strong" : "weak"} against ${whom}`,
      tag: (hero, rule) => `${hero}: ${rule}`,
      smallerTagEffects: "Smaller tag effects",
    },
  },
  id: {
    page: {
      title: "Counter pick",
      metaDescription:
        "Pilih sampai lima hero musuh dan dapetin daftar counter yang diurutin dari skornya, lengkap sama alasan di balik tiap hero.",
      description:
        "Masukin hero musuh yang bakal kamu lawan. Counter-nya diurutin dari skor tertinggi, lengkap sama angka di balik tiap pilihan.",
    },
    view: {
      enemyTeam: "Tim musuh",
      teamName: "tim musuh",
      clear: "Reset",
      searchEnemies: "Cari hero musuh",
      addToEnemies: (name) => `Tambah ${name} ke tim musuh`,
      enemiesFull:
        "Tim musuh udah penuh. Tap salah satu hero di atas kalo mau dikeluarin.",
      bestCounters: "Counter terbaik",
      allRoles: "Semua role",
      allLanes: "Semua lane",
      roleFilter: "Role hero yang disaranin",
      laneFilter: "Lane hero yang disaranin",
      emptyTitle: "Tambahin hero musuh dulu",
      emptyDescription:
        "Pilih sampai lima hero musuh. Counter-nya diurutin pake statistik matchup, catatan resmi hero, dan tag hero, lengkap sama alasannya.",
      noMatch: "Nggak ada hero yang cocok sama role dan lane ini.",
      showMore: (count) => `Lihat ${count} lagi`,
      weakest: "Pick paling lemah lawan tim ini",
      tagsAndMetaOnly: "Cuma tag dan meta",
      metaOnly: "Cuma meta",
      adjustedWinRate: (rate, rank) =>
        `Win rate yang disesuaikan ${rate} di ${rank}`,
      noStats: (rank) => `Belum ada statistik di ${rank}`,
    },
    method: {
      title: "Cara ngitung skornya",
      intro:
        "Skornya ngejumlahin seberapa bagus hero itu lawan tiap musuh, plus sedikit tambahan dari performanya sekarang. Satu poin kira-kira setara 1% win rate.",
      points: (value) => `${value} poin`,
      statistics: (points) =>
        `Statistik: ${points} tiap 1% perubahan win rate pas dua hero itu ketemu. Data resmi cuma ngasih lima matchup terbaik dan lima terburuk tiap hero, jadi banyak pasangan yang nggak ada angkanya.`,
      notes: (points) =>
        `Catatan resmi: ${points} kalo halaman resmi hero bilang dia kuat lawan musuh itu, atau halaman musuhnya bilang dia lemah lawan hero itu. Kalo catatannya kebalikannya, skornya dikurangin segitu juga.`,
      tags: (rules, maxPoints) =>
        `Tag hero: ${rules}. Masing-masing bisa nyumbang sampai ${maxPoints} kalo level tag dua hero-nya sama-sama mentok, dan malah ngurangin skor kalo musuhnya yang unggul.`,
      meta: (points) =>
        `Meta: ${points} tiap 1% win rate yang disesuaikan di atas 50%, sama kayak win rate yang dipake di tier list.`,
      limited: (label) =>
        `Hero yang nggak punya statistik atau catatan resmi lawan musuh mana pun dikasih label “${label}”.`,
    },
    tagRules: {
      lockdown: "hard CC lawan hero yang lincah",
      burst: "burst lawan hero yang tipis",
      peel: "jagain carry dari assassin yang nge-dive",
    },
    reasons: {
      winRate: (hero, rises, points, opponent) =>
        `Win rate ${hero} ${rises ? "naik" : "turun"} ${points} poin lawan ${opponent}`,
      officialNote: (who, strong, whom) =>
        `Catatan resmi: ${who} ${strong ? "kuat" : "lemah"} lawan ${whom}`,
      tag: (hero, rule) => `${hero}: ${rule}`,
      smallerTagEffects: "Efek tag kecil lainnya",
    },
  },
});
