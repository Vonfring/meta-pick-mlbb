import { defineMessages } from "../define";

/**
 * The About page (/about): where the data comes from and how the tools
 * decide. Tool names in the list come from common[locale].nav; the
 * disclaimer and attribution from common[locale].site.
 */
export const aboutText = defineMessages({
  en: {
    title: "About the data",
    metaDescription:
      "Where Metapick's hero, statistics and item data come from, how often they update, and what is curated by hand.",
    intro:
      "Metapick is a personal, non-commercial project. Here is where its numbers come from.",
    source: {
      heading: "Source",
      body: "Hero details, skills and ranked statistics come from the data behind the official Mobile Legends: Bang Bang website. Items, emblems, talents and battle spells come from the Liquipedia Mobile Legends wiki, because the official MLBB Academy that used to publish them closed in June 2026. Scheduled jobs fetch both sources at a gentle pace, statistics daily and the rest weekly, and keep a copy, so browsing Metapick never sends traffic to either site.",
      builds:
        "Recommended builds disappeared with the Academy and have no other official source, so hero pages do not show them for now.",
    },
    numbers: {
      heading: "What the numbers mean",
      body: "Win rate, pick rate and ban rate are percentages from ranked games in the chosen rank and time period. The official data does not include match counts, so Metapick cannot show sample sizes. Counter and teammate data covers each hero's strongest and weakest pairings, not every possible pair. When a suggestion rests on limited data, the page says so.",
    },
    curated: {
      heading: "Curated by hand",
      body: "Team composition checks use hero attributes such as frontline, crowd control and damage type. Those are not part of the official data, so they are maintained by hand and may lag behind balance changes.",
    },
    tools: {
      heading: "How the tools decide",
      body: "Every suggestion is rule-based: no hidden model, just a few weights applied to the numbers above. Each tool explains its own formula at the bottom of its page, written from the same settings the scores use:",
      tierList:
        "win, pick and ban rate compared with every hero in the same rank and period.",
      counterAndMatchup:
        "matchup statistics, official hero notes and hero tags, plus a little for current form.",
      compositionAndDraft:
        "the composition checklist, synergy between teammates and the same counter edges.",
      estimates:
        "Estimates such as “56% to 44%” explain a draft. They are not predictions of a game, which depends far more on the players.",
    },
    disclaimerHeading: "Disclaimer",
  },
  id: {
    title: "Tentang data",
    metaDescription:
      "Dari mana data hero, statistik, dan item di Metapick berasal, seberapa sering di-update, dan bagian mana yang diisi manual.",
    intro:
      "Metapick itu proyek pribadi dan nonkomersial. Di sini kamu bisa lihat dari mana semua angkanya berasal.",
    source: {
      heading: "Sumber data",
      body: "Detail hero, skill, dan statistik ranked diambil dari data di balik situs resmi Mobile Legends: Bang Bang. Sementara item, emblem, talent, dan battle spell datanya dari wiki Mobile Legends di Liquipedia, soalnya MLBB Academy resmi yang dulu nyediain data itu udah tutup sejak Juni 2026. Ada proses otomatis terjadwal yang ngambil data dari dua sumber itu pelan-pelan, statistik tiap hari dan sisanya tiap minggu, terus nyimpen salinannya. Jadi pas kamu buka-buka Metapick, nggak ada traffic yang dikirim ke situs mereka.",
      builds:
        "Rekomendasi build ikut hilang waktu Academy tutup, dan belum ada sumber resmi lain. Jadi sementara ini halaman hero belum nampilin build.",
    },
    numbers: {
      heading: "Arti angkanya",
      body: "Win rate, pick rate, dan ban rate itu persentase dari match ranked di rank dan periode yang kamu pilih. Data resminya nggak nyertain jumlah match, jadi Metapick nggak bisa nunjukin angkanya dihitung dari berapa match. Data counter dan teman setim cuma berisi pasangan terkuat dan terlemah tiap hero, bukan semua kombinasi yang ada. Kalo ada saran yang datanya terbatas, halamannya bakal ngasih tahu.",
    },
    curated: {
      heading: "Diisi manual",
      body: "Cek komposisi tim pake atribut hero kayak frontline, CC, dan tipe damage. Atribut ini nggak ada di data resmi, jadi diisi manual dan bisa telat ngikutin perubahan balance.",
    },
    tools: {
      heading: "Cara tools ngasih saran",
      body: "Semua saran dihitung pake rumus yang tetap: nggak ada model AI tersembunyi, cuma beberapa bobot yang diterapin ke angka-angka di atas. Tiap tool ngejelasin rumusnya sendiri di bagian bawah halamannya, ditulis langsung dari pengaturan yang dipake buat ngitung skor:",
      tierList:
        "win rate, pick rate, dan ban rate dibandingin sama semua hero di rank dan periode yang sama.",
      counterAndMatchup:
        "statistik matchup, catatan resmi hero, dan tag hero, plus sedikit bobot buat performa sekarang.",
      compositionAndDraft:
        "checklist komposisi, sinergi antar teman setim, plus hitungan counter yang sama.",
      estimates:
        "Perkiraan kayak “56% lawan 44%” itu buat ngejelasin draft, bukan prediksi hasil game. Menang kalahnya tetap jauh lebih ditentuin sama pemainnya.",
    },
    disclaimerHeading: "Disclaimer",
  },
});
