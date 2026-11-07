import { AREAS, Q_AREA, type AreaKey } from "./check";

export type NodeState = "on" | "half" | "dark" | "blocked";

/** Results graph: avg >= 3.5 on, >= 2.5 half, else dark; an area with a fix-first item is blocked. */
export function resultNodeStates(averages: Record<AreaKey, number>, fixFirst: number[]): Record<AreaKey, NodeState> {
  const out = {} as Record<AreaKey, NodeState>;
  for (const a of AREAS) {
    const flagged = fixFirst.some((q) => Q_AREA[q - 1] === a);
    const s = averages[a];
    out[a] = flagged ? "blocked" : s >= 3.5 ? "on" : s >= 2.5 ? "half" : "dark";
  }
  return out;
}

/** Areas in the order the questions visit them. */
export const PATH_ORDER: AreaKey[] = ["data", "rules", "team", "knowledge", "time"];

/** Progress path (in PATH_ORDER): completed areas on, current half, future dark. */
export function progressNodeStates(idx: number): NodeState[] {
  const cur = PATH_ORDER.indexOf(Q_AREA[idx] ?? "data");
  return PATH_ORDER.map((_, i) => (i < cur ? "on" : i === cur ? "half" : "dark"));
}
