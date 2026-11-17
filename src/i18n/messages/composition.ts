import type { CheckStatus } from "@/lib/scoring/composition";
import type { Locale } from "../config";
import { defineMessages } from "../define";

/** Ids of the checks in src/config/composition-rules.ts. */
export type CompositionRuleId =
  | "lanes"
  | "frontline"
  | "hard_cc"
  | "damage_mix"
  | "peel"
  | "aoe_damage"
  | "pickoff"
  | "push"
  | "scaling";

type RuleText = {
  /** Name of the check: "Frontline". */
  label: string;
  /** What a missing or weak check means, in plain words. */
  hint: string;
};

/** "Hard CC" stays "hard CC" inside an Indonesian sentence. */
const lowerFirst = (text: string) =>
  text.charAt(0).toLowerCase() + text.slice(1);

/**
 * Texts of the team composition checklist, the Team composition page and the
 * "How the checklist and suggestions work" box (also on Draft master).
 *
 * The labels and hints of the checks are keyed by the check id from
 * src/config/composition-rules.ts. Show them with compositionRuleText(),
 * which takes any object with an id and a label (a rule, a CheckResult or a
 * CheckChange from the draft scoring).
 */
export const compositionText = defineMessages<{
  rules: Record<CompositionRuleId, RuleText>;
  /** A check label inside a sentence: "hard crowd control", "hard CC". */
  ruleInSentence: (label: string) => string;
  /** Status next to a check in the checklist: "Weak". */
  status: Record<CheckStatus, string>;
  /** Status inside a sentence or a chip: "weak". */
  statusWord: Record<CheckStatus, string>;
  checklist: {
    /** "4 (needs 5)": a tag total and the total an OK check needs. */
    tagDetail: (total: number, needed: number) => string;
    /** "Open: EXP lane, Roam", with the lane names already joined. */
    openLanes: (lanes: string) => string;
    lanesCovered: (covered: number, needed: number) => string;
    /** "1.5 physical, 2 magic", with the numbers already formatted. */
    damageDetail: (physical: string, magic: string) => string;
    /** Heroes without curated tags, names already joined. */
    untagged: (names: string, count: number) => string;
  };
  page: { title: string; description: string };
  view: {
    /** Heading of the team column. */
    yourTeam: string;
    /** The team in slot and button labels: "Remove Fanny from your team". */
    teamName: string;
    clear: string;
    addToTeam: (name: string) => string;
    teamFull: string;
    result: string;
    emptyTitle: string;
    emptyDescription: string;
    checklist: string;
    checklistPartial: (count: number, size: number) => string;
    swapsHeading: string;
    noSwaps: string;
    swapLine: (out: string, into: string) => string;
    swap: string;
    fillHeading: string;
    add: string;
  };
  method: {
    title: string;
    tags: string;
    check: string;
    okFrom: string;
    weakFrom: string;
    everyHero: string;
    oneShort: string;
    /** "1.5 of each" damage type, with the number already formatted. */
    ofEach: (amount: string) => string;
    /** Numbers already formatted for the language. */
    suggestions: (
      compositionPoints: string,
      teammateNotePoints: string,
      metaWeight: string,
    ) => string;
    strength: (
      composition: number,
      form: number,
      synergy: number,
      step: string,
    ) => string;
  };
}>({
  en: {
    rules: {
      lanes: {
        label: "Every lane covered",
        hint: "Two or more heroes want the same lane, so one lane has no specialist.",
      },
      frontline: {
        label: "Frontline",
        hint: "No one can take hits at the front, so fights start badly.",
      },
      hard_cc: {
        label: "Hard crowd control",
        hint: "Too little crowd control to start a fight or stop a diving enemy.",
      },
      damage_mix: {
        label: "Physical and magic damage",
        hint: "Nearly all damage is one type, so the enemy can stack one kind of defense.",
      },
      peel: {
        label: "Peel for carries",
        hint: "Little protection for the damage dealers when enemies dive them.",
      },
      aoe_damage: {
        label: "Area damage",
        hint: "Little damage that hits several enemies, so team fights drag on.",
      },
      pickoff: {
        label: "Pick-off",
        hint: "Few ways to catch a lone enemy out of position.",
      },
      push: {
        label: "Turret push",
        hint: "Slow at taking turrets once a fight is won.",
      },
      scaling: {
        label: "Late game",
        hint: "The team falls off late; aim to win the early game.",
      },
    },
    ruleInSentence: (label) => label.toLowerCase(),
    status: { ok: "OK", weak: "Weak", missing: "Missing" },
    statusWord: { ok: "OK", weak: "weak", missing: "missing" },
    checklist: {
      tagDetail: (total, needed) => `${total} (needs ${needed})`,
      openLanes: (lanes) => `Open: ${lanes}`,
      lanesCovered: (covered, needed) =>
        `${covered} of ${needed} ${needed === 1 ? "hero gets its" : "heroes get their"} own lane`,
      damageDetail: (physical, magic) => `${physical} physical, ${magic} magic`,
      untagged: (names, count) =>
        `No hero tags yet for ${names}, so the tag checks count ${count === 1 ? "this hero" : "these heroes"} as zero.`,
    },
    page: {
      title: "Team composition",
      description:
        "Pick up to five heroes and see what the lineup has, what it lacks, and which heroes fill the gaps.",
    },
    view: {
      yourTeam: "Your team",
      teamName: "your team",
      clear: "Clear",
      addToTeam: (name) => `Add ${name} to your team`,
      teamFull: "The team is full. Tap a hero above to remove it.",
      result: "Result",
      emptyTitle: "Add your first hero",
      emptyDescription:
        "Pick up to five heroes. The checklist shows what the lineup has and lacks, and the suggestions show which heroes fill the gaps.",
      checklist: "Checklist",
      checklistPartial: (count, size) => `Checklist for ${count} of ${size}`,
      swapsHeading: "Swaps that help",
      noSwaps: "No single swap improves the checklist.",
      swapLine: (out, into) => `Swap ${out} for ${into}`,
      swap: "Swap",
      fillHeading: "Heroes that fill the gaps",
      add: "Add",
    },
    method: {
      title: "How the checklist and suggestions work",
      tags: "Each hero has curated tags from 0 to 3 (frontline, crowd control, peel and so on). Each check adds up one tag across the team. Lanes come from the official hero data, and a team passes when every hero can take a lane of its own.",
      check: "Check",
      okFrom: "OK from",
      weakFrom: "Weak from",
      everyHero: "every hero",
      oneShort: "one short",
      ofEach: (amount) => `${amount} of each`,
      suggestions: (compositionPoints, teammateNotePoints, metaWeight) =>
        `Suggested heroes are ranked by points: how much the checklist score rises (times ${compositionPoints}), the win rate change with each teammate plus ${teammateNotePoints} for an official “best teammate” note, the edge against enemy picks when there are any, and ${metaWeight} per percentage point of adjusted win rate above 50%.`,
      strength: (composition, form, synergy, step) =>
        `Team strength out of 100: ${composition} for the share of checks passed, ${form} for how the heroes rank by adjusted win rate, and ${synergy} for synergy, which starts at 50% and moves ${step}% per point of win rate change between teammates.`,
    },
  },
  id: {
    rules: {
      lanes: {
        label: "Semua lane keisi",
        hint: "Ada dua hero atau lebih yang rebutan satu lane, jadi ada lane lain yang nggak dipegang spesialisnya.",
      },
      frontline: {
        label: "Frontline",
        hint: "Nggak ada yang kuat nahan damage di depan, jadi war udah berat dari awal.",
      },
      hard_cc: {
        label: "Hard CC",
        hint: "CC-nya kurang buat buka war atau nahan musuh yang nge-dive.",
      },
      damage_mix: {
        label: "Physical dan magic damage",
        hint: "Hampir semua damage-nya satu tipe, jadi musuh tinggal numpuk satu jenis item defense.",
      },
      peel: {
        label: "Jagain carry",
        hint: "Carry-nya kurang dilindungin pas di-dive musuh.",
      },
      aoe_damage: {
        label: "Damage area (AoE)",
        hint: "Damage yang kena banyak musuh sekaligus masih kurang, jadi war-nya lama kelarnya.",
      },
      pickoff: {
        label: "Nangkep musuh",
        hint: "Susah nangkep musuh yang jalan sendirian atau salah posisi.",
      },
      push: {
        label: "Push turret",
        hint: "Habis menang war, tim ini lambat ngancurin turret.",
      },
      scaling: {
        label: "Late game",
        hint: "Tim ini lemah di late game, jadi usahain menang di early game.",
      },
    },
    ruleInSentence: lowerFirst,
    status: { ok: "Aman", weak: "Kurang", missing: "Bolong" },
    statusWord: { ok: "aman", weak: "kurang", missing: "bolong" },
    checklist: {
      tagDetail: (total, needed) => `${total} (butuh ${needed})`,
      openLanes: (lanes) => `Lane kosong: ${lanes}`,
      lanesCovered: (covered, needed) =>
        `${covered} dari ${needed} hero dapet lane sendiri`,
      damageDetail: (physical, magic) => `${physical} physical, ${magic} magic`,
      untagged: (names) =>
        `${names} belum punya tag hero, jadi dihitung nol di semua cek tag.`,
    },
    page: {
      title: "Komposisi tim",
      description:
        "Pilih sampai lima hero, nanti kelihatan lineup-mu udah punya apa aja, masih kurang apa, dan hero mana yang bisa nutupin kekurangannya.",
    },
    view: {
      yourTeam: "Tim kamu",
      teamName: "tim kamu",
      clear: "Reset",
      addToTeam: (name) => `Tambah ${name} ke tim kamu`,
      teamFull:
        "Tim udah penuh. Tap salah satu hero di atas kalo mau dikeluarin.",
      result: "Hasil",
      emptyTitle: "Tambahin hero pertamamu",
      emptyDescription:
        "Pilih sampai lima hero. Checklist bakal nunjukin apa yang udah ada dan apa yang masih kurang, terus ada saran hero buat nutupin kekurangannya.",
      checklist: "Checklist",
      checklistPartial: (count, size) => `Checklist ${count} dari ${size} hero`,
      swapsHeading: "Saran ganti hero",
      noSwaps:
        "Ganti satu hero mana pun nggak bikin checklist-nya lebih bagus.",
      swapLine: (out, into) => `Ganti ${out} jadi ${into}`,
      swap: "Ganti",
      fillHeading: "Hero buat nutupin kekurangan",
      add: "Tambah",
    },
    method: {
      title: "Cara kerja checklist dan saran hero",
      tags: "Tiap hero dikasih tag manual dengan nilai 0 sampai 3 (frontline, CC, jagain carry, dan lain-lain). Satu cek ngejumlahin satu tag dari semua hero di tim. Lane-nya diambil dari data hero resmi, dan cek lane lolos kalo tiap hero bisa pegang lane sendiri.",
      check: "Cek",
      okFrom: "Aman mulai",
      weakFrom: "Kurang mulai",
      everyHero: "semua hero",
      oneShort: "kurang satu",
      ofEach: (amount) => `${amount} per tipe`,
      suggestions: (compositionPoints, teammateNotePoints, metaWeight) =>
        `Hero yang disaranin diurutin pake poin: kenaikan skor checklist (dikali ${compositionPoints}), perubahan win rate bareng tiap teman setim plus ${teammateNotePoints} kalo ada catatan resmi “teman setim terbaik”, keunggulan lawan hero musuh yang udah di-pick (kalo ada), dan ${metaWeight} tiap 1% win rate yang disesuaikan di atas 50%.`,
      strength: (composition, form, synergy, step) =>
        `Kekuatan tim maksimal 100 poin: ${composition} dari persentase cek yang lolos, ${form} dari peringkat hero-nya berdasarkan win rate yang disesuaikan, dan ${synergy} dari sinergi, yang mulai di 50% dan naik-turun ${step}% tiap 1 poin perubahan win rate antar teman setim.`,
    },
  },
});

const isRuleId = (id: string): id is CompositionRuleId =>
  Object.hasOwn(compositionText.en.rules, id);

/**
 * Label and hint of a composition check in a language, looked up by its id.
 * Takes a rule from COMPOSITION_RULES, a CheckResult or a CheckChange. An id
 * without a translation keeps the (English) texts the object carries.
 *
 *   const { label, hint } = compositionRuleText(locale, check);
 */
export function compositionRuleText(
  locale: Locale,
  check: { id: string; label: string; hint?: string },
): RuleText {
  return isRuleId(check.id)
    ? compositionText[locale].rules[check.id]
    : { label: check.label, hint: check.hint ?? "" };
}
