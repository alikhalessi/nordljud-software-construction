import a2 from "../shared-content/verb-library/A2.json";
import b1 from "../shared-content/verb-library/B1.json";
import b2 from "../shared-content/verb-library/B2.json";
import c1 from "../shared-content/verb-library/C1.json";
import type { Level } from "./missions";
import type { VerbEntry } from "./verb-types";

const byLevel: Record<Level, VerbEntry[]> = {
  A2: a2 as VerbEntry[],
  B1: b1 as VerbEntry[],
  B2: b2 as VerbEntry[],
  C1: c1 as VerbEntry[]
};

export function getVerbsForLevel(level: Level): VerbEntry[] {
  return byLevel[level];
}

