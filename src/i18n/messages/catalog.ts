import { defineMessages } from "../define";

/**
 * Texts of the item and emblem pages. Item, emblem, talent and battle spell
 * names, stats, passives and descriptions are source data and stay as the
 * source gives them; only the labels around them are translated.
 */
export const catalogText = defineMessages<{
  /** The cooldown as the source gives it, in seconds: "75", "1.5". */
  cooldown: (seconds: string) => string;
  stats: string;
  items: {
    title: string;
    description: string;
    metaDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    search: string;
    searchPlaceholder: string;
    category: string;
    all: string;
    /** "12 of 120 items. Final items first, then by price." */
    summary: (shown: number, total: number, filtered: boolean) => string;
    noMatchTitle: string;
    noMatchDescription: string;
    clearSearch: string;
    /** Shop tiers 1 to 3. */
    tiers: Record<number, string>;
    tierFallback: (tier: number) => string;
    free: string;
    /** Screen reader text after the price, with its leading space. */
    gold: string;
    builtFrom: string;
    buildsInto: string;
  };
  emblems: {
    title: string;
    description: string;
    metaDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    battleSpells: string;
    battleSpellsDescription: string;
    role: string;
    allRoles: string;
    recommended: string;
    sharedSet: string;
    /** roles: "Fighter and Assassin" */
    madeFor: (roles: string) => string;
    noRole: string;
    setName: (name: string) => string;
    anySet: string;
    pickRole: string;
    recommendedSet: (set: string, role: string) => string;
    noSetForRole: (role: string) => string;
    sets: string;
    talents: string;
    talentsDescription: string;
    /** Talent tiers 1 to 3. */
    tiers: Record<number, string>;
    tierFallback: (tier: number) => string;
  };
}>({
  en: {
    cooldown: (seconds) => `Cooldown ${seconds}s`,
    stats: "Stats",
    items: {
      title: "Items",
      description:
        "Every item in the shop by category. Search for a name, a stat such as Crit Chance, or a word from a passive.",
      metaDescription:
        "Every Mobile Legends item by shop category, with stats, passives, price and build path.",
      emptyTitle: "No items yet",
      emptyDescription: "Item data appears here after the next catalog update.",
      search: "Search items",
      searchPlaceholder: "Search by name, stat or passive",
      category: "Category",
      all: "All",
      summary: (shown, total, filtered) =>
        `${filtered ? `${shown} of ${total} items` : `${total} items`}. Final items first, then by price.`,
      noMatchTitle: "No item matches this search",
      noMatchDescription:
        "Try an item name, a stat such as Crit Chance, or a word from a passive.",
      clearSearch: "Clear search",
      tiers: { 1: "Basic", 2: "Intermediate", 3: "Final" },
      tierFallback: (tier) => `Tier ${tier}`,
      free: "Free",
      gold: " gold",
      builtFrom: "Built from",
      buildsInto: "Builds into",
    },
    emblems: {
      title: "Emblems",
      description:
        "Each emblem set gives fixed stats and a choice of talents. Pick your role to see the set made for it.",
      metaDescription:
        "Mobile Legends emblem sets and talents, the set each role runs, and every battle spell.",
      emptyTitle: "No emblem data yet",
      emptyDescription:
        "Emblem sets and talents appear here after the next catalog update.",
      battleSpells: "Battle spells",
      battleSpellsDescription: "Every hero takes one spell into the match.",
      role: "Role",
      allRoles: "All roles",
      recommended: "Recommended",
      sharedSet: "No role of its own. Every set can take its talents.",
      madeFor: (roles) => `Made for ${roles} heroes`,
      noRole: "No role listed",
      setName: (name) => `${name} set`,
      anySet: "Any set",
      pickRole:
        "Pick a role to see the set made for it and the talents that set can take.",
      recommendedSet: (set, role) =>
        `The ${set} set is made for ${role} heroes. A loadout takes one talent per tier, from the ${set} set or from the talents every set can take.`,
      noSetForRole: (role) =>
        `No set lists the ${role} role. The shared talents are below.`,
      sets: "Sets",
      talents: "Talents",
      talentsDescription: "Pick one talent for each tier.",
      tiers: { 1: "Tier 1", 2: "Tier 2", 3: "Core" },
      tierFallback: (tier) => `Tier ${tier}`,
    },
  },
  id: {
    cooldown: (seconds) => `Cooldown ${seconds.replace(/\./g, ",")} detik`,
    stats: "Stat",
    items: {
      title: "Item",
      description:
        "Semua item di shop, dikelompokin per kategori. Cari pake nama, stat kayak Crit Chance, atau kata dari pasifnya.",
      metaDescription:
        "Semua item Mobile Legends per kategori shop, lengkap sama stat, pasif, harga, dan item komponennya.",
      emptyTitle: "Belum ada item",
      emptyDescription:
        "Data item bakal muncul di sini habis update katalog berikutnya.",
      search: "Cari item",
      searchPlaceholder: "Cari nama, stat, atau pasif",
      category: "Kategori",
      all: "Semua",
      summary: (shown, total, filtered) =>
        `${filtered ? `${shown} dari ${total} item` : `${total} item`}. Item jadi paling atas, terus diurut dari yang paling mahal.`,
      noMatchTitle: "Nggak ada item yang cocok",
      noMatchDescription:
        "Coba nama item, stat kayak Crit Chance, atau kata dari pasifnya.",
      clearSearch: "Hapus pencarian",
      tiers: { 1: "Item dasar", 2: "Item menengah", 3: "Item jadi" },
      tierFallback: (tier) => `Tier ${tier}`,
      free: "Gratis",
      gold: " gold",
      builtFrom: "Dirakit dari",
      buildsInto: "Bisa dirakit jadi",
    },
    emblems: {
      title: "Emblem",
      description:
        "Tiap set emblem ngasih stat tetap dan beberapa pilihan talent. Pilih role kamu, nanti kelihatan set yang pas buat role itu.",
      metaDescription:
        "Set emblem dan talent Mobile Legends, set yang dipake tiap role, plus semua battle spell.",
      emptyTitle: "Belum ada data emblem",
      emptyDescription:
        "Set emblem dan talent bakal muncul di sini habis update katalog berikutnya.",
      battleSpells: "Battle spell",
      battleSpellsDescription:
        "Tiap hero cuma bisa bawa satu battle spell per match.",
      role: "Role",
      allRoles: "Semua role",
      recommended: "Rekomendasi",
      sharedSet:
        "Bukan buat role tertentu. Talent-nya bisa dipake di semua set.",
      madeFor: (roles) => `Dibikin buat hero ${roles}`,
      noRole: "Role-nya nggak dicantumin",
      setName: (name) => `Set ${name}`,
      anySet: "Set apa aja",
      pickRole:
        "Pilih role buat lihat set yang pas, plus talent apa aja yang bisa dipake set itu.",
      recommendedSet: (set, role) =>
        `Set ${set} dibikin buat hero ${role}. Di tiap tier kamu ambil satu talent, dari set ${set} atau dari talent yang bisa dipake semua set.`,
      noSetForRole: (role) =>
        `Nggak ada set yang khusus buat role ${role}. Talent yang bisa dipake semua set ada di bawah.`,
      sets: "Set",
      talents: "Talent",
      talentsDescription: "Pilih satu talent di tiap tier.",
      tiers: { 1: "Tier 1", 2: "Tier 2", 3: "Core" },
      tierFallback: (tier) => `Tier ${tier}`,
    },
  },
});
