import type { Lang } from "./check";

/** French typography: a non-breaking space before ? ! : ; and after « so they never sit alone on a line. */
export function frSpace(s: string): string {
  return s.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
}

export function tr(x: { en: string; fr: string }, lang: Lang): string {
  return lang === "fr" ? frSpace(x.fr) : x.en;
}

/** 4.0 in English, 4,0 in French. */
export function num1(v: number, lang: Lang): string {
  return v.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
