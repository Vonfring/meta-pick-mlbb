import { describe, expect, it } from "vitest";
import { metaText, type TierBand } from "./meta";

const bands: TierBand[] = [
  { tier: "SS", share: 5 },
  { tier: "S", share: 15 },
  { tier: "A", share: 25 },
  { tier: "B", share: 25 },
  { tier: "C", share: 20 },
  { tier: "D", share: 10 },
];

describe("tierMethod.ranking", () => {
  it("lists the bands in English", () => {
    expect(metaText.en.tierMethod.ranking(bands, "0.1%")).toBe(
      "Heroes are then sorted by score: the top 5% are SS, the next 15% S, the next 25% A, the next 25% B, the next 20% C, and the last 10% are D. Heroes with under 0.1% of all picks are listed as rarely picked.",
    );
  });

  it("lists the bands in Indonesian", () => {
    expect(metaText.id.tierMethod.ranking(bands, "0,1%")).toBe(
      "Habis itu, hero diurutin sesuai skornya: 5% teratas masuk SS, 15% berikutnya S, 25% berikutnya A, 25% berikutnya B, 20% berikutnya C, dan 10% terbawah masuk D. Hero dengan pick rate di bawah 0,1% masuk daftar jarang di-pick.",
    );
  });
});

describe("snapshot", () => {
  it("says when the numbers were updated, in Indonesian", () => {
    const t = metaText.id.snapshot;
    expect(t.updated("Mythic", "7 hari terakhir", "16 Okt 2026", null)).toBe(
      "Mythic, 7 hari terakhir. Di-update 16 Okt 2026.",
    );
    expect(
      t.updated("Mythic", "7 hari terakhir", "16 Okt 2026", "14 Okt 2026"),
    ).toBe(
      "Mythic, 7 hari terakhir. Di-update 16 Okt 2026 (angkanya nggak berubah sejak 14 Okt 2026).",
    );
  });

  it("keeps the English wording", () => {
    const t = metaText.en.snapshot;
    expect(
      t.updated("Mythic", "Last 7 days", "16 Oct 2026", "14 Oct 2026"),
    ).toBe(
      "Mythic, last 7 days. Updated 16 Oct 2026 (numbers unchanged since 14 Oct 2026).",
    );
    expect(t.changesLater(1)).toBe(
      "Changes appear once there are numbers from the day before.",
    );
  });

  it("names one day and several days naturally in Indonesian", () => {
    const t = metaText.id.snapshot;
    expect(t.changesLater(1)).toBe(
      "Perubahannya baru muncul kalo udah ada data dari sehari sebelumnya.",
    );
    expect(t.changesLater(7)).toBe(
      "Perubahannya baru muncul kalo udah ada data dari 7 hari sebelumnya.",
    );
  });
});
