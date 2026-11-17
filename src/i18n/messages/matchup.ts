import { defineMessages } from "../define";

/** A side of the board: blue plays first, red second. */
export type MatchupTeam = "blue" | "red";

/** The team colors inside an Indonesian sentence: "tim biru", "sisi merah". */
const colorWord: Record<MatchupTeam, string> = { blue: "biru", red: "merah" };

/**
 * Texts of the Matchup page (hero against hero and team against team), the
 * verdict banner (also on Draft master) and the "How the comparison works"
 * box.
 *
 * Generic tool texts ("Search heroes", "Current form", "Why Fanny") come from
 * toolsText in ./tools.ts, and the edge reasons from counterText in
 * ./counter.ts.
 */
export const matchupText = defineMessages<{
  page: {
    title: string;
    /** Meta description for search results and link previews. */
    metaDescription: string;
    /** Line under the page title. */
    description: string;
  };
  modes: { label: string; hero: string; team: string };
  verdict: {
    label: string;
    even: string;
    favored: (name: string) => string;
    slight: (name: string) => string;
    note: string;
  };
  /** Shared by both modes. */
  result: string;
  swap: string;
  clear: string;
  breakdown: string;
  total: string;
  hero: {
    heading: string;
    /** Label above each hero in the verdict banner. */
    sides: Record<MatchupTeam, string>;
    /** HeroSlots teamName, without an article: "blue side". */
    slots: Record<MatchupTeam, string>;
    pickFor: (name: string, side: MatchupTeam) => string;
    bothPicked: string;
    emptyTitle: string;
    emptyDescription: string;
    breakdownHint: (first: string, second: string) => string;
    headToHead: string;
    officialNotes: string;
    heroTags: string;
    why: string;
    noReasons: string;
    noMatchupStats: (rank: string) => string;
    noHeadToHead: string;
    noteSource: (name: string) => string;
    formHeading: (rank: string) => string;
    /** Screen reader name of the table's first column. */
    number: string;
    winRate: string;
    adjustedWinRate: string;
    pickRate: string;
    banRate: string;
  };
  team: {
    heading: string;
    /** Name of each team, also used (lowercased) as the HeroSlots teamName. */
    names: Record<MatchupTeam, string>;
    /** Picker placeholder. */
    addTo: (team: MatchupTeam) => string;
    pickerCaption: (team: MatchupTeam, rank: string) => string;
    addHero: (name: string, team: MatchupTeam) => string;
    bothFull: string;
    emptyTitle: string;
    emptyDescription: string;
    addingHere: string;
    count: (count: number, size: number) => string;
    even: string;
    /** "Blue 2.4": the side a number of points favors, number formatted. */
    sideEdge: (team: MatchupTeam, points: string) => string;
    pairWith: (hero: string, teammate: string) => string;
    counters: string;
    synergy: string;
    composition: string;
    /** Points already formatted: "+4.8". */
    formDetail: (blue: string, red: string) => string;
    countersDetail: (withData: number, total: number) => string;
    synergyDetail: (blue: number, red: number) => string;
    compositionPending: string;
    /** Shares already formatted: "78%". */
    compositionDetail: (blue: string, red: string) => string;
    notCounted: string;
    keyMatchups: string;
    keyMatchupsHint: (weight: string) => string;
    noKeyPairs: string;
    /** Between two hero names: "Khufra against Fanny". */
    against: string;
    onlySmallTags: string;
    synergyHint: string;
    noSynergy: string;
  };
  method: {
    title: string;
    /** Numbers already formatted for the language. */
    intro: (metaWeight: string) => string;
    teamsIntro: string;
    form: (weight: string) => string;
    counters: (weight: string) => string;
    synergy: (weight: string) => string;
    /** `checks` is the check names already joined. */
    composition: (checks: string, points: string) => string;
    estimate: (
      low: string,
      high: string,
      even: string,
      clear: string,
    ) => string;
  };
}>({
  en: {
    page: {
      title: "Matchup",
      metaDescription:
        "Compare two heroes head to head, or see which team is favored in a five against five game and why.",
      description:
        "Compare two heroes head to head, or two teams of five. Every verdict comes with the numbers behind it.",
    },
    modes: {
      label: "Compare",
      hero: "Hero against hero",
      team: "Team against team",
    },
    verdict: {
      label: "Verdict",
      even: "Even matchup",
      favored: (name) => `${name} is favored`,
      slight: (name) => `Slight edge to ${name}`,
      note: "Rule-based estimate from the breakdown below, not a prediction.",
    },
    result: "Result",
    swap: "Swap",
    clear: "Clear",
    breakdown: "Breakdown",
    total: "Total",
    hero: {
      heading: "Heroes",
      sides: { blue: "Blue side", red: "Red side" },
      slots: { blue: "blue side", red: "red side" },
      pickFor: (name, side) => `Pick ${name} for the ${side} side`,
      bothPicked: "Both heroes are picked. Tap one to change it.",
      emptyTitle: "Pick two heroes",
      emptyDescription:
        "The first hero plays on the blue side, the second on the red side. The comparison uses matchup statistics, official hero notes, hero tags and current form.",
      breakdownHint: (first, second) =>
        `Points up favor ${first}, points down favor ${second}.`,
      headToHead: "Head to head",
      officialNotes: "Official notes",
      heroTags: "Hero tags",
      why: "Why",
      noReasons:
        "Neither hero lists the other among its best or worst matchups, there is no official note, and their tags cancel out.",
      noMatchupStats: (rank) => `No matchup statistics for ${rank} yet.`,
      noHeadToHead:
        "No head-to-head numbers: the official data lists only each hero’s five best and five worst matchups.",
      noteSource: (name) => `From ${name}'s official hero page`,
      formHeading: (rank) => `Current form in ${rank}`,
      number: "Number",
      winRate: "Win rate",
      adjustedWinRate: "Adjusted win rate",
      pickRate: "Pick rate",
      banRate: "Ban rate",
    },
    team: {
      heading: "Teams",
      names: { blue: "Blue team", red: "Red team" },
      addTo: (team) => `Add to the ${team} team`,
      pickerCaption: (team, rank) =>
        `Adding to the ${team} team. Most picked in ${rank} first.`,
      addHero: (name, team) => `Add ${name} to the ${team} team`,
      bothFull: "Both teams are full. Tap a hero to remove it.",
      emptyTitle: "Add heroes to both teams",
      emptyDescription:
        "Pick up to five heroes a side. The comparison adds up current form, counters between the teams, synergy within each team and, once both teams are full, their composition.",
      addingHere: "Adding here",
      count: (count, size) => `${count} of ${size}`,
      even: "Even",
      sideEdge: (team, points) =>
        `${team === "blue" ? "Blue" : "Red"} ${points}`,
      pairWith: (hero, teammate) => `${hero} with ${teammate}`,
      counters: "Counters",
      synergy: "Synergy",
      composition: "Composition",
      formDetail: (blue, red) =>
        `Compared with 50%, adjusted win rates add up to ${blue} points for blue and ${red} for red.`,
      countersDetail: (withData, total) =>
        `${withData} of ${total} hero pairs have statistics or an official note; the rest use hero tags.`,
      synergyDetail: (blue, red) =>
        `${blue} blue and ${red} red teammate pairs have numbers.`,
      compositionPending: "Counts once both teams have five heroes.",
      compositionDetail: (blue, red) =>
        `Blue passes ${blue} of the checks, red ${red}.`,
      notCounted: "Not counted",
      keyMatchups: "Key matchups",
      keyMatchupsHint: (weight) =>
        `The hero pairs that move the counters score the most, before it is multiplied by ${weight}.`,
      noKeyPairs: "No pair has a clear edge either way.",
      against: "against",
      onlySmallTags: "Only small tag effects.",
      synergyHint:
        "How much a hero's win rate changes with each teammate, from the official data, which lists only the strongest pairs.",
      noSynergy: "No teammate pairs with numbers.",
    },
    method: {
      title: "How the comparison works",
      intro: (metaWeight) =>
        `Everything is counted in points, where one point is about one percentage point of win rate. Two heroes are compared with the same edge Counter pick uses (matchup statistics, official notes and hero tags), plus ${metaWeight} points per percentage point of difference in adjusted win rate.`,
      teamsIntro: "Two teams add up four parts:",
      form: (weight) =>
        `Current form: each hero's adjusted win rate above or below 50%, times ${weight}.`,
      counters: (weight) =>
        `Counters: the edge of every blue hero against every red hero, times ${weight}.`,
      synergy: (weight) =>
        `Synergy: the win rate change of every teammate pair with numbers, times ${weight}.`,
      composition: (checks, points) =>
        `Composition: once both teams have five heroes, the difference in the share of checks passed (${checks}), times ${points}.`,
      estimate: (low, high, even, clear) =>
        `The estimate is 50% plus the total, kept between ${low}% and ${high}%. Totals under ${even} ${even === "1" ? "point" : "points"} read as even, and from ${clear} points as clearly favored. It is a rule-based estimate to explain a draft, not a prediction of the game.`,
    },
  },
  id: {
    page: {
      title: "Matchup",
      metaDescription:
        "Adu dua hero satu lawan satu, atau lihat tim mana yang lebih unggul di game 5 lawan 5, lengkap sama alasannya.",
      description:
        "Adu dua hero satu lawan satu, atau dua tim lima lawan lima. Tiap hasilnya dijelasin lengkap sama angkanya.",
    },
    modes: {
      label: "Bandingin",
      hero: "Hero lawan hero",
      team: "Tim lawan tim",
    },
    verdict: {
      label: "Kesimpulan",
      even: "Matchup imbang",
      favored: (name) => `${name} lebih unggul`,
      slight: (name) => `${name} unggul tipis`,
      note: "Perkiraan dari rumus, dihitung dari rincian di bawah, bukan prediksi hasil game.",
    },
    result: "Hasil",
    swap: "Tukar",
    clear: "Reset",
    breakdown: "Rincian",
    total: "Total",
    hero: {
      heading: "Hero",
      sides: { blue: "Sisi biru", red: "Sisi merah" },
      slots: { blue: "sisi biru", red: "sisi merah" },
      pickFor: (name, side) => `Pilih ${name} buat sisi ${colorWord[side]}`,
      bothPicked: "Dua hero udah dipilih. Tap salah satu kalo mau ganti.",
      emptyTitle: "Pilih dua hero",
      emptyDescription:
        "Hero pertama main di sisi biru, yang kedua di sisi merah. Perbandingannya pake statistik matchup, catatan resmi hero, tag hero, dan performa sekarang.",
      breakdownHint: (first, second) =>
        `Poin naik berarti ${first} unggul, poin turun berarti ${second} unggul.`,
      headToHead: "Head to head",
      officialNotes: "Catatan resmi",
      heroTags: "Tag hero",
      why: "Kenapa",
      noReasons:
        "Dua hero ini nggak saling masuk daftar matchup terbaik atau terburuk, nggak ada catatan resmi, dan tag mereka saling impas.",
      noMatchupStats: (rank) => `Belum ada statistik matchup di ${rank}.`,
      noHeadToHead:
        "Nggak ada angka head to head, soalnya data resmi cuma ngasih lima matchup terbaik dan lima terburuk tiap hero.",
      noteSource: (name) => `Dari halaman resmi ${name}`,
      formHeading: (rank) => `Performa sekarang di ${rank}`,
      number: "Angka",
      winRate: "Win rate",
      adjustedWinRate: "Win rate yang disesuaikan",
      pickRate: "Pick rate",
      banRate: "Ban rate",
    },
    team: {
      heading: "Tim",
      names: { blue: "Tim biru", red: "Tim merah" },
      addTo: (team) => `Tambah ke tim ${colorWord[team]}`,
      pickerCaption: (team, rank) =>
        `Lagi ngisi tim ${colorWord[team]}. Diurutin dari yang paling sering di-pick di ${rank}.`,
      addHero: (name, team) => `Tambah ${name} ke tim ${colorWord[team]}`,
      bothFull: "Dua tim udah penuh. Tap salah satu hero kalo mau dikeluarin.",
      emptyTitle: "Isi hero di dua tim",
      emptyDescription:
        "Pilih sampai lima hero di tiap sisi. Perbandingannya ngitung performa sekarang, counter antar tim, sinergi di dalam tiap tim, dan komposisinya kalo dua tim udah lengkap.",
      addingHere: "Lagi diisi",
      count: (count, size) => `${count} dari ${size}`,
      even: "Imbang",
      sideEdge: (team, points) =>
        `${team === "blue" ? "Biru" : "Merah"} ${points}`,
      pairWith: (hero, teammate) => `${hero} bareng ${teammate}`,
      counters: "Counter",
      synergy: "Sinergi",
      composition: "Komposisi",
      formDetail: (blue, red) =>
        `Dibanding 50%, total win rate yang disesuaikan tim biru ${blue} poin, tim merah ${red} poin.`,
      countersDetail: (withData, total) =>
        `${withData} dari ${total} pasangan hero punya statistik atau catatan resmi, sisanya pake tag hero.`,
      synergyDetail: (blue, red) =>
        `Ada angka buat ${blue} pasangan teman setim di tim biru dan ${red} di tim merah.`,
      compositionPending: "Baru dihitung kalo dua tim udah lengkap lima hero.",
      compositionDetail: (blue, red) =>
        `Tim biru lolos ${blue} cek, tim merah ${red}.`,
      notCounted: "Nggak dihitung",
      keyMatchups: "Matchup kunci",
      keyMatchupsHint: (weight) =>
        `Pasangan hero yang paling ngaruh ke skor counter, sebelum dikali ${weight}.`,
      noKeyPairs: "Nggak ada pasangan yang jelas unggul di salah satu sisi.",
      against: "lawan",
      onlySmallTags: "Cuma efek tag kecil.",
      synergyHint:
        "Seberapa jauh win rate hero berubah kalo main bareng tiap teman setim, dari data resmi yang cuma ngasih pasangan paling kuat.",
      noSynergy: "Belum ada pasangan teman setim yang ada angkanya.",
    },
    method: {
      title: "Cara kerja perbandingannya",
      intro: (metaWeight) =>
        `Semuanya dihitung pake poin, dan satu poin kira-kira setara 1% win rate. Dua hero dibandingin pake hitungan keunggulan yang sama kayak di Counter pick (statistik matchup, catatan resmi, dan tag hero), plus ${metaWeight} poin tiap 1% selisih win rate yang disesuaikan.`,
      teamsIntro: "Buat dua tim, ada empat bagian yang dijumlahin:",
      form: (weight) =>
        `Performa sekarang: selisih win rate yang disesuaikan tiap hero dari 50%, dikali ${weight}.`,
      counters: (weight) =>
        `Counter: keunggulan tiap hero tim biru lawan tiap hero tim merah, dikali ${weight}.`,
      synergy: (weight) =>
        `Sinergi: perubahan win rate tiap pasangan teman setim yang ada angkanya, dikali ${weight}.`,
      composition: (checks, points) =>
        `Komposisi: kalo dua tim udah lengkap lima hero, selisih persentase cek yang lolos (${checks}), dikali ${points}.`,
      estimate: (low, high, even, clear) =>
        `Perkiraannya 50% ditambah total poinnya, dibatesin dari ${low}% sampai ${high}%. Total di bawah ${even} poin dianggap imbang, dan mulai ${clear} poin dianggap jelas unggul. Ini cuma perkiraan dari rumus buat ngejelasin draft, bukan prediksi hasil game.`,
    },
  },
});
