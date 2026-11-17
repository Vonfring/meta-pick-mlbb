/**
 * Ban and pick order presets for Draft master (docs/activity-draft-master.md).
 *
 * A preset is a list of phases. Blind ban phases are entered by both teams
 * without seeing each other's bans, as in ranked; the board asks for your
 * team's bans first. In turn-based phases each letter is one step, in order:
 * "B" for blue, "R" for red.
 *
 * The name and description of each preset, in every language, are in
 * src/i18n/messages/draft.ts, keyed by the preset id.
 */
export type DraftTeam = "blue" | "red";
export type DraftAction = "ban" | "pick";

export type DraftPhase =
  | { action: "ban"; blind: true; perTeam: number }
  | { action: DraftAction; blind: false; order: string };

export type DraftPreset = {
  phases: readonly DraftPhase[];
};

/** Snake order: Blue 1, Red 2, Blue 2, Red 2, Blue 2, Red 1. */
const RANKED_PICKS = "BRRBBRRBBR";

export const DRAFT_PRESETS = {
  mythic: {
    phases: [
      { action: "ban", blind: true, perTeam: 3 },
      { action: "ban", blind: true, perTeam: 2 },
      { action: "pick", blind: false, order: RANKED_PICKS },
    ],
  },
  legend: {
    phases: [
      { action: "ban", blind: true, perTeam: 4 },
      { action: "pick", blind: false, order: RANKED_PICKS },
    ],
  },
  epic: {
    phases: [
      { action: "ban", blind: true, perTeam: 3 },
      { action: "pick", blind: false, order: RANKED_PICKS },
    ],
  },
  mpl: {
    phases: [
      { action: "ban", blind: false, order: "BRBRBR" },
      { action: "pick", blind: false, order: "BRRBBR" },
      { action: "ban", blind: false, order: "RBRB" },
      { action: "pick", blind: false, order: "RBBR" },
    ],
  },
} as const satisfies Record<string, DraftPreset>;

export type DraftPresetId = keyof typeof DRAFT_PRESETS;

export const DEFAULT_PRESET: DraftPresetId = "mythic";
export const DEFAULT_SIDE: DraftTeam = "blue";
