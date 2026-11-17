import { describe, expect, it } from "vitest";
import { DRAFT_PRESETS, type DraftPresetId } from "@/config/draft-order";
import { LOCALES } from "../config";
import { draftText } from "./draft";

describe("draft texts", () => {
  it("names and describes every preset in both languages", () => {
    for (const locale of LOCALES)
      for (const id of Object.keys(DRAFT_PRESETS) as DraftPresetId[]) {
        const preset = draftText[locale].presets[id];
        expect(preset.label, `${locale} ${id}`).not.toBe("");
        expect(preset.description, `${locale} ${id}`).not.toBe("");
      }
  });

  it("keeps the English turn banner the tests look for", () => {
    const t = draftText.en.turn;
    expect(t.turn("blue", true, "ban", 1, 3)).toBe("Your turn: ban 1 of 3");
    expect(t.turn("red", false, "pick", 1, 1)).toBe(
      "Red team's turn: pick 1 of 1",
    );
    expect(t.phase("ban", 1, true)).toBe("Ban phase 1, blind");
    expect(t.phase("pick", 2, false)).toBe("Pick phase 2");
  });

  it("builds the turn banner in Indonesian", () => {
    const t = draftText.id.turn;
    expect(t.turn("blue", true, "ban", 1, 3)).toBe(
      "Giliran kamu: ban 1 dari 3",
    );
    expect(t.turn("red", false, "pick", 2, 2)).toBe(
      "Giliran tim merah: pick 2 dari 2",
    );
    expect(t.phase("ban", 1, true)).toBe("Fase blind ban 1");
    expect(t.phase("ban", 2, false)).toBe("Fase ban 2");
  });

  it("starts every action label with the verb in both languages", () => {
    expect(draftText.en.picker.action("ban", "Fanny", "blue")).toBe(
      "Ban Fanny for the blue team",
    );
    expect(draftText.id.picker.action("pick", "Fanny", "red")).toBe(
      "Pick Fanny buat tim merah",
    );
    expect(draftText.id.picker.label("ban", "blue")).toBe("Ban buat tim biru");
  });

  it("names the favored team, blue being the first side", () => {
    const en = draftText.en.result;
    const id = draftText.id.result;
    expect(en.verdict({ favored: "first", strength: "clear" })).toBe(
      "Blue team is favored",
    );
    expect(en.verdict({ favored: "second", strength: "slight" })).toBe(
      "Slight edge to Red team",
    );
    expect(id.verdict({ favored: "second", strength: "slight" })).toBe(
      "Tim merah unggul tipis",
    );
    expect(id.verdict({ favored: null, strength: "even" })).toBe(
      "Dua tim imbang",
    );
    expect(id.strength("blue")).toBe("Kekuatan tim biru");
  });
});
