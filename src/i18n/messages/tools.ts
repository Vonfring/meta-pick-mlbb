import { defineMessages } from "../define";

/** "the enemy team", but "your team" stays as it is. */
const withThe = (team: string) =>
  /^(the|your|my|our)\b/i.test(team) ? team : `the ${team}`;

/**
 * Texts of the components shared by Counter pick, Matchup, Team composition
 * and Draft master (src/components/tools): the hero picker, the team slots,
 * the lane filter, the strength card and the suggestion rows.
 */
export const toolsText = defineMessages<{
  /** nameOf() fallback for an id missing from the hero list. */
  unknownHero: string;
  picker: {
    /** Placeholder for a picker over every hero. */
    searchHeroes: string;
    /** Caption for a picker sorted by pick rate in a rank. */
    mostPickedFirst: (rank: string) => string;
    matches: (count: number) => string;
    alreadyPicked: (name: string) => string;
    noMatch: (query: string) => string;
  };
  slots: {
    /** `team` is the HeroSlots teamName: "enemy team", "tim musuh". */
    removeHero: (name: string, team: string) => string;
    emptySlot: (team: string) => string;
  };
  laneFilter: { label: string; open: string; any: string };
  strength: {
    title: string;
    composition: (points: number) => string;
    form: (points: number) => string;
    synergy: (points: number) => string;
    explainer: string;
    empty: string;
  };
  suggestion: {
    fixesLabel: string;
    /** "Frontline OK": a check label and the status a hero brings it to. */
    fixChip: (label: string, status: string) => string;
    noOpenLane: string;
    score: string;
    why: (name: string) => string;
    composition: string;
    counters: string;
    synergy: string;
    currentForm: string;
    /** One improved check; the label is already cased for a sentence. */
    change: (label: string, from: string, to: string) => string;
    improves: (changes: string[]) => string;
    worse: string;
    neutral: string;
    against: (name: string) => string;
    noEdgeReasons: string;
    /** `points` is already formatted: "+1.2". */
    synergyDelta: (name: string, points: string) => string;
    synergyNote: (name: string) => string;
    noSynergy: string;
    adjustedWinRate: (rate: string, rank: string) => string;
    noStats: (rank: string) => string;
  };
}>({
  en: {
    unknownHero: "Unknown hero",
    picker: {
      searchHeroes: "Search heroes",
      mostPickedFirst: (rank) => `Most picked in ${rank} first.`,
      matches: (count) => `${count} ${count === 1 ? "match" : "matches"}`,
      alreadyPicked: (name) => `${name}, already picked`,
      noMatch: (query) => `No hero matches “${query}”.`,
    },
    slots: {
      removeHero: (name, team) => `Remove ${name} from ${withThe(team)}`,
      emptySlot: (team) => `Empty slot in ${withThe(team)}`,
    },
    laneFilter: {
      label: "Lanes of the suggested heroes",
      open: "Open lanes only",
      any: "Any lane",
    },
    strength: {
      title: "Team strength",
      composition: (points) => `Composition (${points} points)`,
      form: (points) => `Form (${points} points)`,
      synergy: (points) => `Synergy (${points} points)`,
      explainer:
        "Composition is the share of checks passed. Form is how the heroes rank by adjusted win rate among all heroes. Synergy starts at 50% and moves with the win rate changes between teammates.",
      empty: "Add a hero to see the score.",
    },
    suggestion: {
      fixesLabel: "Checks it improves",
      fixChip: (label, status) => `${label} ${status}`,
      noOpenLane: "No open lane",
      score: "score",
      why: (name) => `Why ${name}`,
      composition: "Composition",
      counters: "Counters",
      synergy: "Synergy",
      currentForm: "Current form",
      change: (label, from, to) => `${label} from ${from} to ${to}`,
      improves: (changes) => `Improves ${changes.join(", ")}.`,
      worse: "Makes the checklist worse, usually by doubling up a lane.",
      neutral: "Adds to the team's tag totals without changing a check.",
      against: (name) => `Against ${name}`,
      noEdgeReasons:
        "No statistics, official notes or tag effects for this pair.",
      synergyDelta: (name, points) =>
        `Win rate with ${name} changes ${points} points`,
      synergyNote: (name) => `Official note: good with ${name}`,
      noSynergy: "No numbers or official notes with the heroes already picked.",
      adjustedWinRate: (rate, rank) => `Adjusted win rate ${rate} in ${rank}.`,
      noStats: (rank) => `No statistics in ${rank} yet.`,
    },
  },
  id: {
    unknownHero: "Hero nggak dikenal",
    picker: {
      searchHeroes: "Cari hero",
      mostPickedFirst: (rank) =>
        `Diurutin dari yang paling sering di-pick di ${rank}.`,
      matches: (count) => `Ketemu ${count} hero`,
      alreadyPicked: (name) => `${name}, udah di-pick`,
      noMatch: (query) => `Nggak ada hero yang cocok sama “${query}”.`,
    },
    slots: {
      removeHero: (name, team) => `Hapus ${name} dari ${team}`,
      emptySlot: (team) => `Slot kosong di ${team}`,
    },
    laneFilter: {
      label: "Lane hero yang disaranin",
      open: "Lane kosong aja",
      any: "Semua lane",
    },
    strength: {
      title: "Kekuatan tim",
      composition: (points) => `Komposisi (${points} poin)`,
      form: (points) => `Performa (${points} poin)`,
      synergy: (points) => `Sinergi (${points} poin)`,
      explainer:
        "Komposisi itu persentase cek yang lolos. Performa itu peringkat hero-nya berdasarkan win rate yang disesuaikan, dibanding semua hero. Sinergi mulai dari 50% dan naik-turun ngikutin perubahan win rate antar teman setim.",
      empty: "Tambahin hero dulu buat lihat skornya.",
    },
    suggestion: {
      fixesLabel: "Cek yang naik",
      fixChip: (label, status) => `${label}: ${status}`,
      noOpenLane: "Lane-nya udah keisi",
      score: "skor",
      why: (name) => `Kenapa ${name}`,
      composition: "Komposisi",
      counters: "Counter",
      synergy: "Sinergi",
      currentForm: "Performa sekarang",
      change: (label, from, to) => `${label} dari ${from} jadi ${to}`,
      improves: (changes) => `Cek yang naik: ${changes.join(", ")}.`,
      worse:
        "Malah bikin checklist-nya turun, biasanya gara-gara rebutan lane.",
      neutral: "Nambah total tag tim, tapi nggak ngubah status cek mana pun.",
      against: (name) => `Lawan ${name}`,
      noEdgeReasons:
        "Belum ada statistik, catatan resmi, atau efek tag buat matchup ini.",
      synergyDelta: (name, points) =>
        `Win rate bareng ${name} berubah ${points} poin`,
      synergyNote: (name) => `Catatan resmi: cocok bareng ${name}`,
      noSynergy:
        "Belum ada angka atau catatan resmi bareng hero yang udah di-pick.",
      adjustedWinRate: (rate, rank) =>
        `Win rate yang disesuaikan ${rate} di ${rank}.`,
      noStats: (rank) => `Belum ada statistik di ${rank}.`,
    },
  },
});
