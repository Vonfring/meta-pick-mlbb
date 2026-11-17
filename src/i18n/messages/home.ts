import { defineMessages } from "../define";

/**
 * The app's start page (/app), the shared Open Graph image and the app-wide
 * fallback (app/global-error.tsx). Tool and page names come from
 * common[locale].nav.
 */
export const homeText = defineMessages({
  en: {
    metaTitle: "Find counters and plan your draft",
    metaDescription:
      "Search the enemy heroes to find who beats them, then plan the draft, check a team or compare a matchup.",
    title: "Who are you facing?",
    intro:
      "Pick up to five enemy heroes and see who beats them, with the numbers behind every suggestion.",
    searchEnemies: "Search enemy heroes",
    planHeading: "Plan your draft",
    enemySide: "Enemy side",
    yourSide: "Your side",
    draftDescription:
      "Practice ranked ban and pick. Every turn suggests heroes based on counters, synergy and what your team is missing.",
    teamCompositionDescription:
      "Check five heroes for frontline, crowd control, damage mix and late game.",
    matchupDescription:
      "Compare two heroes, or see which team is favored and why.",
    browseHeading: "Browse the data",
    og: {
      alt: "Metapick MLBB: tier list, counter picks, matchups and a draft simulator for Mobile Legends",
      headline: "Know the counter before you play.",
      subline:
        "Tier list, counter picks, matchups and a ranked draft simulator for Mobile Legends, with the numbers behind every suggestion.",
    },
    globalError: {
      documentTitle: "Something went wrong | Metapick MLBB",
      title: "Metapick failed to load",
      body: "Reload the page. If it keeps failing, try again in a few minutes.",
      tryAgain: "Try again",
    },
  },
  id: {
    metaTitle: "Cari counter dan susun draft-mu",
    metaDescription:
      "Cari hero musuh buat tahu siapa yang bisa nge-counter mereka, terus susun draft, cek komposisi tim, atau bandingin matchup.",
    title: "Musuh pick siapa aja?",
    intro:
      "Pilih sampai lima hero musuh, terus lihat siapa yang paling ampuh buat nge-counter mereka. Tiap saran ada angkanya, jadi bukan asal tebak.",
    searchEnemies: "Cari hero musuh",
    planHeading: "Susun draft-mu",
    enemySide: "Tim musuh",
    yourSide: "Tim kamu",
    draftDescription:
      "Latihan ban pick ranked. Di tiap giliran ada saran hero, dilihat dari counter, sinergi, dan apa yang masih kurang di tim kamu.",
    teamCompositionDescription:
      "Cek lima hero dari sisi frontline, CC, campuran damage, sampai late game.",
    matchupDescription:
      "Bandingin dua hero, atau lihat tim mana yang lebih unggul dan kenapa.",
    browseHeading: "Cek datanya",
    og: {
      alt: "Metapick MLBB: tier list, counter pick, matchup, dan simulator draft buat Mobile Legends",
      headline: "Cek counter-nya dulu sebelum main.",
      subline:
        "Tier list, counter pick, matchup, dan simulator draft ranked buat Mobile Legends. Tiap saran ada angkanya, jadi bukan asal tebak.",
    },
    globalError: {
      documentTitle: "Ada yang error | Metapick MLBB",
      title: "Metapick gagal dimuat",
      body: "Coba reload halamannya. Kalo masih gagal juga, tunggu beberapa menit terus coba lagi.",
      tryAgain: "Coba lagi",
    },
  },
});
