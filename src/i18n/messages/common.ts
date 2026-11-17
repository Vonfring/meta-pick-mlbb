import type { TagLevelKey } from "@/types/data";
import type {
  DamageType,
  HeroLane,
  HeroRole,
  ItemCategory,
  PeriodDays,
  RankBracket,
} from "@/types/domain";
import { defineMessages } from "../define";

/** Routes in the navigation, in the order of src/config/navigation.ts. */
export type NavHref =
  | "/tier-list"
  | "/statistics"
  | "/heroes"
  | "/items"
  | "/emblems"
  | "/counter-pick"
  | "/matchup"
  | "/team-composition"
  | "/draft";

export type NavGroupId = "meta" | "database" | "tools";

type NavText = { label: string; shortLabel?: string; description: string };

type RatingKey = "durability" | "offense" | "control_effect" | "difficulty";

type ThemeKey = "system" | "light" | "dark";

/**
 * Vocabulary shared across the app: the shell and navigation, site-wide
 * notices, and the labels for roles, lanes, ranks, periods and tags.
 * See docs/i18n.md for the Indonesian style guide.
 */
export const common = defineMessages<{
  site: {
    titleDefault: string;
    description: string;
    disclaimer: string;
    attribution: string;
    /** "{before} Liquipedia {middle} CC BY-SA 3.0{after}", around the two links. */
    catalogCredit: { before: string; middle: string; after: string };
  };
  shell: {
    skipToContent: string;
    mainNav: string;
    footerNav: string;
    homeSuffix: string;
    more: string;
    moreDescription: string;
    aboutData: string;
    whatMetapickDoes: string;
    theme: string;
    themeOptions: Record<ThemeKey, string>;
    themeGroup: string;
    themeCycle: (current: string, next: string) => string;
    language: string;
  };
  nav: {
    groups: Record<NavGroupId, string>;
    items: Record<NavHref, NavText>;
  };
  notFound: {
    title: string;
    body: string;
    browseHeroes: string;
    openApp: string;
  };
  error: {
    title: string;
    body: string;
    tryAgain: string;
    openApp: string;
  };
  roles: Record<HeroRole, string>;
  lanes: Record<HeroLane, string>;
  brackets: Record<RankBracket, string>;
  periods: Record<PeriodDays, string>;
  itemCategories: Record<ItemCategory, string>;
  damageTypes: Record<DamageType, string>;
  tags: Record<TagLevelKey, string>;
  ratings: Record<RatingKey, string>;
  /** Joins a list: "Fighter and Tank", "EXP lane or Roam". */
  and: string;
  or: string;
  noData: string;
}>({
  en: {
    site: {
      titleDefault: "Metapick MLBB: meta tier list, counters and draft tools",
      description:
        "Hero data, a meta tier list, counter picks, matchups, team composition checks and a ranked draft simulator for Mobile Legends: Bang Bang.",
      disclaimer: "Not affiliated with or endorsed by Moonton.",
      attribution:
        "Hero data and ranked statistics come from the official Mobile Legends: Bang Bang website. Hero images belong to Moonton.",
      catalogCredit: {
        before: "Item, emblem and battle spell data from",
        middle: "contributors, licensed",
        after: ".",
      },
    },
    shell: {
      skipToContent: "Skip to content",
      mainNav: "Main",
      footerNav: "Footer",
      homeSuffix: " home",
      more: "More",
      moreDescription: "Every page, plus language and theme settings.",
      aboutData: "About the data",
      whatMetapickDoes: "What Metapick does",
      theme: "Theme",
      themeOptions: { system: "System", light: "Light", dark: "Dark" },
      themeGroup: "Color theme",
      themeCycle: (current, next) =>
        `Theme: ${current}. Switch to ${next.toLowerCase()}`,
      language: "Language",
    },
    nav: {
      groups: { meta: "Meta", database: "Database", tools: "Tools" },
      items: {
        "/tier-list": {
          label: "Tier list",
          shortLabel: "Tiers",
          description:
            "Every hero ranked SS to D from win, pick and ban rates.",
        },
        "/statistics": {
          label: "Statistics",
          description: "Win, pick and ban rates by rank and period.",
        },
        "/heroes": {
          label: "Heroes",
          description: "Skills, statistics, counters and best teammates.",
        },
        "/items": {
          label: "Items",
          description: "Every item with stats, passives and price.",
        },
        "/emblems": {
          label: "Emblems",
          description: "Emblem sets, talents and picks per role.",
        },
        "/counter-pick": {
          label: "Counter pick",
          shortLabel: "Counter",
          description: "Pick up to five enemies and get heroes that beat them.",
        },
        "/matchup": {
          label: "Matchup",
          description: "Hero against hero, or team against team.",
        },
        "/team-composition": {
          label: "Team composition",
          shortLabel: "Team comp",
          description: "Check a lineup for missing roles and weak spots.",
        },
        "/draft": {
          label: "Draft master",
          shortLabel: "Draft",
          description: "Practice ranked ban and pick with live suggestions.",
        },
      },
    },
    notFound: {
      title: "This page does not exist",
      body: "The link may be old, or the hero name may be spelled differently.",
      browseHeroes: "Browse heroes",
      openApp: "Open the app",
    },
    error: {
      title: "This page failed to load",
      body: "Try again. If it keeps failing, the data service may be down for a moment.",
      tryAgain: "Try again",
      openApp: "Open the app",
    },
    roles: {
      tank: "Tank",
      fighter: "Fighter",
      assassin: "Assassin",
      mage: "Mage",
      marksman: "Marksman",
      support: "Support",
    },
    lanes: {
      exp: "EXP lane",
      mid: "Mid lane",
      roam: "Roam",
      jungle: "Jungle",
      gold: "Gold lane",
    },
    brackets: {
      all: "All ranks",
      epic: "Epic",
      legend: "Legend",
      mythic: "Mythic",
      honor: "Mythical Honor",
      glory: "Mythical Glory",
    },
    periods: {
      1: "Last day",
      3: "Last 3 days",
      7: "Last 7 days",
      15: "Last 15 days",
      30: "Last 30 days",
    },
    itemCategories: {
      attack: "Attack",
      magic: "Magic",
      defense: "Defense",
      movement: "Movement",
      jungle: "Jungle",
      roam: "Roam",
    },
    damageTypes: {
      physical: "Physical damage",
      magic: "Magic damage",
      mixed: "Mixed damage",
    },
    tags: {
      frontline: "Frontline",
      hard_cc: "Hard crowd control",
      peel: "Peel",
      aoe_damage: "Area damage",
      pickoff: "Pick-off",
      push: "Turret push",
      mobility: "Mobility",
      sustain: "Sustain",
      burst: "Burst",
      scaling: "Late game",
    },
    ratings: {
      durability: "Durability",
      offense: "Offense",
      control_effect: "Control effects",
      difficulty: "Difficulty",
    },
    and: "and",
    or: "or",
    noData: "No data",
  },
  id: {
    site: {
      titleDefault: "Metapick MLBB: tier list meta, counter, dan tools draft",
      description:
        "Data hero, tier list meta, counter pick, matchup, cek komposisi tim, dan simulator draft ranked buat Mobile Legends: Bang Bang.",
      disclaimer:
        "Situs ini nggak berafiliasi sama Moonton dan bukan situs resmi.",
      attribution:
        "Data hero dan statistik ranked diambil dari situs resmi Mobile Legends: Bang Bang. Gambar hero punya Moonton.",
      catalogCredit: {
        before: "Data item, emblem, dan battle spell dari kontributor",
        middle: "dengan lisensi",
        after: ".",
      },
    },
    shell: {
      skipToContent: "Langsung ke konten",
      mainNav: "Utama",
      footerNav: "Footer",
      homeSuffix: " (beranda)",
      more: "Lainnya",
      moreDescription: "Semua halaman, plus pengaturan bahasa dan tema.",
      aboutData: "Tentang data",
      whatMetapickDoes: "Apa itu Metapick",
      theme: "Tema",
      themeOptions: { system: "Sistem", light: "Terang", dark: "Gelap" },
      themeGroup: "Tema warna",
      themeCycle: (current, next) =>
        `Tema: ${current}. Ganti ke ${next.toLowerCase()}`,
      language: "Bahasa",
    },
    nav: {
      groups: { meta: "Meta", database: "Database", tools: "Tools" },
      items: {
        "/tier-list": {
          label: "Tier list",
          shortLabel: "Tier",
          description:
            "Semua hero dikasih tier SS sampai D, dihitung dari win rate, pick rate, dan ban rate.",
        },
        "/statistics": {
          label: "Statistik",
          description:
            "Win rate, pick rate, dan ban rate per rank dan periode.",
        },
        "/heroes": {
          label: "Hero",
          description: "Skill, statistik, counter, dan teman setim terbaik.",
        },
        "/items": {
          label: "Item",
          description: "Semua item lengkap sama stat, pasif, dan harganya.",
        },
        "/emblems": {
          label: "Emblem",
          description: "Set emblem, talent, dan rekomendasi buat tiap role.",
        },
        "/counter-pick": {
          label: "Counter pick",
          shortLabel: "Counter",
          description:
            "Pilih sampai lima hero musuh, terus lihat hero yang bisa nge-counter mereka.",
        },
        "/matchup": {
          label: "Matchup",
          description: "Hero lawan hero, atau tim lawan tim.",
        },
        "/team-composition": {
          label: "Komposisi tim",
          shortLabel: "Komposisi",
          description:
            "Cek lineup tim kamu: ada role yang bolong atau titik lemah nggak.",
        },
        "/draft": {
          label: "Draft master",
          shortLabel: "Draft",
          description:
            "Latihan ban pick ranked, lengkap sama saran di tiap giliran.",
        },
      },
    },
    notFound: {
      title: "Halamannya nggak ada",
      body: "Mungkin link-nya udah lama, atau nama hero-nya beda ejaan.",
      browseHeroes: "Lihat daftar hero",
      openApp: "Buka app",
    },
    error: {
      title: "Halaman ini gagal dimuat",
      body: "Coba lagi ya. Kalo masih gagal terus, mungkin server datanya lagi down sebentar.",
      tryAgain: "Coba lagi",
      openApp: "Buka app",
    },
    roles: {
      tank: "Tank",
      fighter: "Fighter",
      assassin: "Assassin",
      mage: "Mage",
      marksman: "Marksman",
      support: "Support",
    },
    lanes: {
      exp: "EXP Lane",
      mid: "Mid Lane",
      roam: "Roam",
      jungle: "Jungle",
      gold: "Gold Lane",
    },
    brackets: {
      all: "Semua rank",
      epic: "Epic",
      legend: "Legend",
      mythic: "Mythic",
      honor: "Mythical Honor",
      glory: "Mythical Glory",
    },
    periods: {
      1: "1 hari terakhir",
      3: "3 hari terakhir",
      7: "7 hari terakhir",
      15: "15 hari terakhir",
      30: "30 hari terakhir",
    },
    itemCategories: {
      attack: "Attack",
      magic: "Magic",
      defense: "Defense",
      movement: "Movement",
      jungle: "Jungle",
      roam: "Roam",
    },
    damageTypes: {
      physical: "Physical damage",
      magic: "Magic damage",
      mixed: "Damage campuran",
    },
    tags: {
      frontline: "Frontline",
      hard_cc: "Hard CC",
      peel: "Jagain carry",
      aoe_damage: "Damage area (AoE)",
      pickoff: "Nangkep musuh",
      push: "Push turret",
      mobility: "Mobilitas",
      sustain: "Sustain",
      burst: "Burst",
      scaling: "Late game",
    },
    ratings: {
      durability: "Ketahanan",
      offense: "Serangan",
      control_effect: "Efek kontrol",
      difficulty: "Kesulitan",
    },
    and: "dan",
    or: "atau",
    noData: "Belum ada data",
  },
});
