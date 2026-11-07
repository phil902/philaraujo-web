export const BOOKING_URL = "";

export type Lang = "en" | "fr";
export type AreaKey = "data" | "team" | "rules" | "knowledge" | "time";
export type LevelKey = "exposed" | "careful" | "covered" | "ready";
export type OfferKey = "personal" | "training" | "brain";

export const AREAS: AreaKey[] = ["data", "team", "rules", "knowledge", "time"];
export const QUESTION_COUNT = 12;
/** Area of each question, Q1..Q12 */
export const Q_AREA: AreaKey[] = ["data", "data", "data", "rules", "rules", "rules", "team", "team", "knowledge", "knowledge", "time", "time"];

/** Fix-first rule per question number: max answer value that triggers it. Order matters. */
export const FIX_RULES: [number, number][] = [[1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [9, 1]];

const avg = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / xs.length;

export function scoreAnswers(answers: number[]) {
  const a = (q: number) => answers[q - 1] ?? 0;
  const averages = {} as Record<AreaKey, number>;
  for (const area of AREAS) averages[area] = avg(Q_AREA.map((x, i) => (x === area ? a(i + 1) : NaN)).filter((v) => !Number.isNaN(v)));
  const total = answers.reduce((s, v) => s + v, 0);
  const score = Math.round(((total - 12) / 36) * 100);
  let level: LevelKey = score <= 33 ? "exposed" : score <= 58 ? "careful" : score <= 79 ? "covered" : "ready";
  if (a(7) >= 3 && avg([1, 2, 3, 4, 5, 6].map(a)) < 3) level = "exposed";
  let weakest: AreaKey = AREAS[0]!;
  for (const area of AREAS) if (averages[area] < averages[weakest]) weakest = area;
  const fixFirst = FIX_RULES.filter(([q, max]) => a(q) >= 1 && a(q) <= max).map(([q]) => q).slice(0, 3);
  return { averages, total, score, level, weakest, fixFirst };
}

const BRAIN_SECTORS = ["legal", "financial", "accounting", "insurance", "consulting"];

export function routeOffer(teamSize: string, sector: string, regulated: string): OfferKey {
  if (teamSize === "solo" || teamSize === "2-5") return "personal";
  if (regulated === "yes") return "brain";
  if ((teamSize === "10-50" || teamSize === "50plus") && BRAIN_SECTORS.includes(sector)) return "brain";
  return "training";
}

export const DEFAULT_PEOPLE: Record<string, number> = { solo: 1, "2-5": 4, "6-9": 8, "10-50": 20, "50plus": 60 };

export type TimeInputs = { people: number; email: number; notes: number; search: number; docs: number };

export function timeBack(x: TimeInputs) {
  const hours = Math.round(x.people * (x.email + x.notes + x.search + x.docs) * 0.25 * 13);
  return { hours, days: Math.round(hours / 7.5) };
}

/** Seller code: lowercase, letters/digits/hyphens only, max 32. Invalid -> null. */
export function cleanRef(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return /^[a-z0-9-]{1,32}$/.test(v) ? v : null;
}

/** "none" is exclusive. */
export function toggleTool(cur: string[], v: string): string[] {
  if (cur.includes(v)) return cur.filter((x) => x !== v);
  if (v === "none") return ["none"];
  return [...cur.filter((x) => x !== "none"), v];
}
