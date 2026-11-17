import { describe, expect, it } from "vitest";
import { COMPOSITION_RULES } from "@/config/composition-rules";
import { LOCALES } from "../config";
import { compositionRuleText, compositionText } from "./composition";
import { toolsText } from "./tools";

describe("composition texts", () => {
  it("has a label and a hint for every check in both languages", () => {
    for (const locale of LOCALES)
      for (const check of COMPOSITION_RULES.checks) {
        const text = compositionRuleText(locale, check);
        expect(text.label, `${locale} ${check.id}`).not.toBe("");
        expect(text.hint, `${locale} ${check.id}`).not.toBe("");
      }
  });

  it("keeps the config's English texts in sync with the messages", () => {
    for (const check of COMPOSITION_RULES.checks)
      expect(compositionRuleText("en", check)).toEqual({
        label: check.label,
        hint: check.hint,
      });
  });

  it("looks up a check change by id and falls back for unknown ids", () => {
    const change = { id: "hard_cc", label: "Hard crowd control" };
    expect(compositionRuleText("id", change).label).toBe("Hard CC");
    expect(
      compositionRuleText("id", { id: "custom", label: "Custom check" }),
    ).toEqual({ label: "Custom check", hint: "" });
  });

  it("keeps acronyms when a label goes inside an Indonesian sentence", () => {
    const id = compositionText.id;
    expect(id.ruleInSentence(id.rules.hard_cc.label)).toBe("hard CC");
    expect(id.ruleInSentence(id.rules.aoe_damage.label)).toBe(
      "damage area (AoE)",
    );
    expect(compositionText.en.ruleInSentence("Hard crowd control")).toBe(
      "hard crowd control",
    );
  });

  it("builds the improvement sentence in each language", () => {
    for (const locale of LOCALES) {
      const c = compositionText[locale];
      const t = toolsText[locale].suggestion;
      const sentence = t.improves([
        t.change(
          c.ruleInSentence(c.rules.frontline.label),
          c.statusWord.missing,
          c.statusWord.ok,
        ),
        t.change(
          c.ruleInSentence(c.rules.hard_cc.label),
          c.statusWord.weak,
          c.statusWord.ok,
        ),
      ]);
      expect(sentence).toBe(
        locale === "en"
          ? "Improves frontline from missing to OK, hard crowd control from weak to OK."
          : "Cek yang naik: frontline dari bolong jadi aman, hard CC dari kurang jadi aman.",
      );
    }
  });

  it("puts an article before the team only where English needs one", () => {
    const en = toolsText.en.slots;
    expect(en.removeHero("Fanny", "enemy team")).toBe(
      "Remove Fanny from the enemy team",
    );
    expect(en.removeHero("Fanny", "your team")).toBe(
      "Remove Fanny from your team",
    );
    expect(toolsText.id.slots.removeHero("Fanny", "tim musuh")).toBe(
      "Hapus Fanny dari tim musuh",
    );
  });

  it("counts lanes and untagged heroes in Indonesian without plurals", () => {
    const t = compositionText.id.checklist;
    expect(t.lanesCovered(3, 4)).toBe("3 dari 4 hero dapet lane sendiri");
    expect(t.untagged("Fanny, Ling", 2)).toBe(
      "Fanny, Ling belum punya tag hero, jadi dihitung nol di semua cek tag.",
    );
  });
});
