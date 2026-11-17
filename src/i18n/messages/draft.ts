import type {
  DraftAction,
  DraftPresetId,
  DraftTeam,
} from "@/config/draft-order";
import type { Verdict } from "@/lib/scoring/matchup";
import { defineMessages } from "../define";

/** A team at the start of a heading or label. */
const enTeam: Record<DraftTeam, string> = {
  blue: "Blue team",
  red: "Red team",
};
const idTeamTitle: Record<DraftTeam, string> = {
  blue: "Tim biru",
  red: "Tim merah",
};

/** The team inside an Indonesian sentence: "Giliran tim biru". */
const idTeam: Record<DraftTeam, string> = {
  blue: "tim biru",
  red: "tim merah",
};

const verbs: Record<DraftAction, string> = { ban: "Ban", pick: "Pick" };

/** Blue is the first side of the draft's matchup, red the second. */
const favoredTeam = (verdict: Pick<Verdict, "favored">): DraftTeam | null =>
  verdict.favored === null
    ? null
    : verdict.favored === "first"
      ? "blue"
      : "red";

/**
 * Texts of Draft master: the page, the order presets (keyed by the preset
 * ids in src/config/draft-order.ts), the board, the turn banner, the picker,
 * the suggestion list and the result.
 */
export const draftText = defineMessages<{
  page: {
    title: string;
    description: string;
    metaDescription: string;
    /** Title of the CompositionMethod box under the board. */
    methodTitle: string;
  };
  presets: Record<DraftPresetId, { label: string; description: string }>;
  /** A team at the start of a heading or label: "Blue team". */
  teams: Record<DraftTeam, string>;
  controls: {
    order: string;
    /** Accessible name of the side chips. */
    side: string;
    sides: Record<DraftTeam, string>;
    reset: string;
  };
  board: {
    label: string;
    /** Accessible name of a team panel: "Blue team (you)". */
    panel: (team: DraftTeam, you: boolean) => string;
    /** After the team heading of the visitor's side. */
    you: string;
    strength: string;
    bans: (team: DraftTeam) => string;
    picks: (team: DraftTeam) => string;
    pickingNow: string;
    pickPending: string;
    banningNow: string;
    banPending: string;
    /** A ban slot that was skipped. */
    skipped: string;
    banned: (name: string) => string;
  };
  turn: {
    /** "Ban phase 1, blind", "Pick phase 2"; `number` counts the phases of one action. */
    phase: (action: DraftAction, number: number, blind: boolean) => string;
    /** "Your turn: ban 1 of 3", "Red team's turn: pick 2 of 2". */
    turn: (
      team: DraftTeam,
      you: boolean,
      action: DraftAction,
      number: number,
      of: number,
    ) => string;
    complete: string;
    /** Button that skips a ban. */
    skipBan: string;
    undo: string;
    blindOwn: string;
    blindEnemy: string;
    estimateNote: string;
  };
  picker: {
    /** "Ban for the blue team": the search placeholder and the drawer title. */
    label: (action: DraftAction, team: DraftTeam) => string;
    /** "Ban Fanny for the blue team": portrait and suggestion buttons. */
    action: (action: DraftAction, name: string, team: DraftTeam) => string;
    inlineCaption: string;
    drawerDescription: string;
    complete: string;
  };
  suggestions: {
    picks: string;
    bans: string;
    watchOut: string;
    pickDescription: string;
    firstBanDescription: (rank: string) => string;
    banDescription: string;
    enemyPickDescription: (team: DraftTeam) => string;
    enemyFirstBanDescription: (rank: string) => string;
    enemyBanDescription: string;
    /** Text of the button on each suggestion. */
    verbs: Record<DraftAction, string>;
    /** Rates already formatted: "52.3%". */
    metaLine: (winRate: string, banRate: string) => string;
  };
  result: {
    title: string;
    /** "Blue team is favored": blue is the first side of the matchup. */
    verdict: (verdict: Pick<Verdict, "favored" | "strength">) => string;
    note: string;
    breakdown: string;
    strength: (team: DraftTeam) => string;
  };
}>({
  en: {
    page: {
      title: "Draft master",
      description:
        "Practice a ranked ban and pick. Enter both teams' heroes as they happen; every turn suggests heroes and shows why.",
      metaDescription:
        "Practice ranked ban and pick with suggestions on every turn and a strength score for both teams.",
      methodTitle: "How suggestions and strength work",
    },
    presets: {
      mythic: {
        label: "Ranked: Mythic and above",
        description:
          "5 bans a team in two blind waves (3, then 2), then picks in snake order.",
      },
      legend: {
        label: "Ranked: Legend",
        description: "4 blind bans a team, then picks in snake order.",
      },
      epic: {
        label: "Ranked: Epic",
        description: "3 blind bans a team, then picks in snake order.",
      },
      mpl: {
        label: "Tournament (MPL)",
        description:
          "3 bans each in turn, 3 picks each, 2 more bans each, then the last 2 picks each.",
      },
    },
    teams: enTeam,
    controls: {
      order: "Draft order",
      side: "Your side",
      sides: { blue: "I play blue", red: "I play red" },
      reset: "Reset",
    },
    board: {
      label: "Board",
      panel: (team, you) => `${enTeam[team]}${you ? " (you)" : ""}`,
      you: "(you)",
      strength: "Strength",
      bans: (team) => `${enTeam[team]} bans`,
      picks: (team) => `${enTeam[team]} picks`,
      pickingNow: "Picking now",
      pickPending: "Pick not made yet",
      banningNow: "Banning now",
      banPending: "Ban not made yet",
      skipped: "No ban",
      banned: (name) => `${name} banned`,
    },
    turn: {
      phase: (action, number, blind) =>
        `${verbs[action]} phase ${number}${blind ? ", blind" : ""}`,
      turn: (team, you, action, number, of) =>
        `${you ? "Your turn" : `${enTeam[team]}'s turn`}: ${action} ${number} of ${of}`,
      complete: "Draft complete",
      skipBan: "No ban",
      undo: "Undo",
      blindOwn: "Blind bans: the enemy only sees them when the phase ends.",
      blindEnemy:
        "Enter the enemy's bans. In the game both teams ban at the same time, so the same hero can be banned twice.",
      estimateNote: "Rule-based estimate from the picks so far.",
    },
    picker: {
      label: (action, team) => `${verbs[action]} for the ${team} team`,
      action: (action, name, team) =>
        `${verbs[action]} ${name} for the ${team} team`,
      inlineCaption: "Type a hero's name, or pick from the suggestions.",
      drawerDescription:
        "Search, or tap a portrait. The most picked heroes come first.",
      complete: "The draft is complete. Undo to change a step.",
    },
    suggestions: {
      picks: "Suggested picks",
      bans: "Suggested bans",
      watchOut: "Watch out for",
      pickDescription:
        "Ranked by counters, synergy, what the team still lacks and current form.",
      firstBanDescription: (rank) =>
        `The strongest heroes in ${rank} by tier score.`,
      banDescription: "What each hero would bring to the enemy team.",
      enemyPickDescription: (team) =>
        `The heroes that would help the ${team} team most. Tap one if the enemy took it, or search above.`,
      enemyFirstBanDescription: (rank) =>
        `The strongest heroes in ${rank}, which the enemy is likely to ban.`,
      enemyBanDescription:
        "The heroes that would help your team most, which the enemy may ban.",
      verbs,
      metaLine: (winRate, banRate) =>
        `Win rate ${winRate}, banned in ${banRate} of games`,
    },
    result: {
      title: "Result",
      verdict: (verdict) => {
        const team = favoredTeam(verdict);
        if (!team) return "Even matchup";
        return verdict.strength === "clear"
          ? `${enTeam[team]} is favored`
          : `Slight edge to ${enTeam[team]}`;
      },
      note: "Rule-based estimate from form, counters, synergy and composition, not a prediction.",
      breakdown: "See the full breakdown in Matchup",
      strength: (team) => `${enTeam[team]} strength`,
    },
  },
  id: {
    page: {
      title: "Draft master",
      description:
        "Latihan ban pick kayak di ranked. Masukin ban dan pick dua tim sambil draft-nya jalan, nanti tiap giliran ada saran hero lengkap sama alasannya.",
      metaDescription:
        "Latihan ban pick ranked, lengkap sama saran hero di tiap giliran dan skor kekuatan buat dua tim.",
      methodTitle: "Cara kerja saran hero dan skor kekuatan",
    },
    presets: {
      mythic: {
        label: "Ranked: Mythic ke atas",
        description:
          "Tiap tim dapet 5 ban lewat dua kali blind ban (3 dulu, terus 2), habis itu pick gantian pake pola 1-2-2-2-2-1.",
      },
      legend: {
        label: "Ranked: Legend",
        description:
          "Tiap tim dapet 4 blind ban, habis itu pick gantian pake pola 1-2-2-2-2-1.",
      },
      epic: {
        label: "Ranked: Epic",
        description:
          "Tiap tim dapet 3 blind ban, habis itu pick gantian pake pola 1-2-2-2-2-1.",
      },
      mpl: {
        label: "Turnamen (MPL)",
        description:
          "Ban gantian 3 per tim, pick 3 per tim, ban lagi 2 per tim, terus 2 pick terakhir per tim.",
      },
    },
    teams: idTeamTitle,
    controls: {
      order: "Urutan draft",
      side: "Sisi kamu",
      sides: { blue: "Aku tim biru", red: "Aku tim merah" },
      reset: "Reset",
    },
    board: {
      label: "Papan draft",
      panel: (team, you) => `${idTeamTitle[team]}${you ? " (kamu)" : ""}`,
      you: "(kamu)",
      strength: "Kekuatan",
      bans: (team) => `Ban ${idTeam[team]}`,
      picks: (team) => `Pick ${idTeam[team]}`,
      pickingNow: "Giliran pick sekarang",
      pickPending: "Belum ada pick",
      banningNow: "Giliran ban sekarang",
      banPending: "Belum ada ban",
      skipped: "Ban di-skip",
      banned: (name) => `${name} di-ban`,
    },
    turn: {
      phase: (action, number, blind) =>
        blind ? `Fase blind ban ${number}` : `Fase ${action} ${number}`,
      turn: (team, you, action, number, of) =>
        `Giliran ${you ? "kamu" : idTeam[team]}: ${action} ${number} dari ${of}`,
      complete: "Draft selesai",
      skipBan: "Skip ban",
      undo: "Undo",
      blindOwn: "Blind ban: musuh baru tahu ban kamu pas fase ini selesai.",
      blindEnemy:
        "Masukin ban musuh. Di game, dua tim nge-ban barengan, jadi satu hero bisa aja di-ban dua kali.",
      estimateNote: "Perkiraan dari rumus, dihitung dari pick yang udah masuk.",
    },
    picker: {
      label: (action, team) => `${verbs[action]} buat ${idTeam[team]}`,
      action: (action, name, team) =>
        `${verbs[action]} ${name} buat ${idTeam[team]}`,
      inlineCaption: "Ketik nama hero, atau pilih dari saran di bawah.",
      drawerDescription:
        "Cari nama hero, atau langsung tap fotonya. Hero yang paling sering di-pick ada di urutan atas.",
      complete: "Draft udah selesai. Tekan Undo kalo mau ganti pilihan.",
    },
    suggestions: {
      picks: "Saran pick",
      bans: "Saran ban",
      watchOut: "Hati-hati sama hero ini",
      pickDescription:
        "Urutannya dilihat dari counter, sinergi, apa yang masih kurang di tim, dan performa sekarang.",
      firstBanDescription: (rank) =>
        `Hero paling kuat di ${rank} menurut skor tier.`,
      banDescription: "Seberapa besar tiap hero ini bakal ngebantu tim musuh.",
      enemyPickDescription: (team) =>
        `Hero yang paling ngebantu ${idTeam[team]}. Kalo musuh ambil salah satunya, tap aja hero itu, atau cari di atas.`,
      enemyFirstBanDescription: (rank) =>
        `Hero paling kuat di ${rank}, kemungkinan besar bakal di-ban musuh.`,
      enemyBanDescription:
        "Hero yang paling ngebantu tim kamu, jadi bisa aja di-ban musuh.",
      verbs,
      metaLine: (winRate, banRate) =>
        `Win rate ${winRate}, kena ban di ${banRate} game`,
    },
    result: {
      title: "Hasil",
      verdict: (verdict) => {
        const team = favoredTeam(verdict);
        if (!team) return "Dua tim imbang";
        return verdict.strength === "clear"
          ? `${idTeamTitle[team]} lebih unggul`
          : `${idTeamTitle[team]} unggul tipis`;
      },
      note: "Perkiraan dari rumus (performa, counter, sinergi, dan komposisi), bukan prediksi hasil game.",
      breakdown: "Lihat rincian lengkapnya di Matchup",
      strength: (team) => `Kekuatan ${idTeam[team]}`,
    },
  },
});
