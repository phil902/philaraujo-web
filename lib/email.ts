import "server-only";
import { Resend } from "resend";
import type { Lang, LevelKey } from "@/lib/check";
import { BANDS, FIX_TEXT } from "@/lib/copy";

let resend: Resend | undefined;
const client = () => (resend ??= new Resend(process.env.RESEND_API_KEY));
const FROM = () => process.env.RESEND_FROM ?? "Phil Araujo <check@send.philaraujo.com>";
const ALERT_TO = () => process.env.ALERT_TO ?? "phil@prodheroes.com";
const REPLY_TO = "phil@prodheroes.com";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Alert to Phil: everything he needs to decide whether to follow up, in one screen. */
export async function sendAlert(x: { row: Record<string, unknown>; id: string; areas: readonly (readonly [string, number])[] }) {
  const r = x.row;
  const lines: [string, unknown][] = [
    ["Name", r.first_name], ["Email", r.email], ["Firm", r.firm ?? "-"], ["Seller code", r.ref ?? "-"],
    ["Size", r.team_size], ["Sector", r.sector], ["Regulated", r.regulated], ["Role", r.role],
    ["Tools", (r.tools as string[]).join(", ")], ["Score", `${r.total}/100, ${r.level}`],
    ["Fix first", (r.flags as number[]).map((n) => `Q${n}`).join(", ") || "none"],
    ["Hours back in 90 days", r.hours_90d], ["Offer shown", r.offer], ["Language", r.lang],
    ["Test", r.is_test ? "yes" : "no"], ["Row id", x.id],
  ];
  const areas = x.areas.map(([a, v]) => `${a} ${v.toFixed(1)}`).join(" · ");
  const subject = `${r.is_test ? "[TEST] " : ""}Check: ${r.first_name}${r.firm ? `, ${r.firm}` : ""} (${r.total}/100, ${r.level})`;
  const html = `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${lines
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#667">${esc(k)}</td><td style="padding:4px 0">${esc(String(v))}</td></tr>`)
    .join("")}</table><p style="font-family:Arial,sans-serif;font-size:13px;color:#667">${esc(areas)}</p>`;
  const { error } = await client().emails.send({ from: FROM(), to: ALERT_TO(), replyTo: String(r.email), subject, html });
  if (error) throw new Error(`alert: ${error.message}`);
}

// DRAFT COPY, for Phil to check in his own words before launch.
const RESULTS = {
  en: {
    subject: (score: number, level: string) => `Your client data check: ${score}/100, ${level}`,
    hi: (n: string) => `Hi ${n},`,
    thanks: (score: number, level: string) => `Thanks for taking the check. Your firm came out at ${score}/100, ${level}.`,
    fix: "What to fix first:",
    none: "Nothing urgent came up in your answers.",
    time: (h: number, d: number) => `On your numbers, AI could give you back about ${h} hours in 90 days, roughly ${d} working days.`,
    policy: (f: string) => `Your draft AI policy for ${f} is attached as a Word file. Edit it, then adopt it. It's a starting draft, not legal advice.`,
    call: "If you want to go through it together, reply to this email and we'll find 30 minutes.",
    firm: "your firm",
  },
  fr: {
    subject: (score: number, level: string) => `Votre diagnostic données clients : ${score}/100, ${level}`,
    hi: (n: string) => `Bonjour ${n},`,
    thanks: (score: number, level: string) => `Merci d'avoir fait le diagnostic. Votre cabinet obtient ${score}/100, ${level}.`,
    fix: "À traiter en premier :",
    none: "Aucun risque urgent dans vos réponses.",
    time: (h: number, d: number) => `Avec vos chiffres, l'IA pourrait vous rendre environ ${h} heures en 90 jours, soit environ ${d} jours de travail.`,
    policy: (f: string) => `Votre projet de charte IA pour ${f} est en pièce jointe, en Word. Modifiez-la, puis adoptez-la. C'est un premier projet, pas un avis juridique.`,
    call: "Si vous voulez la parcourir ensemble, répondez à cet email et on trouve 30 minutes.",
    firm: "votre cabinet",
  },
} as const;

export async function sendResults(x: {
  lang: Lang; name: string; to: string; firm: string | null; score: number; level: LevelKey;
  fixFirst: number[]; hours: number; days: number; docx: Buffer;
}) {
  const c = RESULTS[x.lang];
  const level = BANDS[x.level].name[x.lang];
  const fixes = x.fixFirst.map((n) => FIX_TEXT[n]?.[x.lang]).filter(Boolean) as string[];
  const p = (s: string) => `<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;margin:0 0 14px">${s}</p>`;
  const html = [
    p(esc(c.hi(x.name))),
    p(esc(c.thanks(x.score, level))),
    fixes.length
      ? p(`<strong>${esc(c.fix)}</strong>`) + `<ul style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;margin:0 0 14px">${fixes.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`
      : p(esc(c.none)),
    p(esc(c.time(x.hours, x.days))),
    p(esc(c.policy(x.firm || c.firm))),
    p(esc(c.call)),
    p("Phil"),
  ].join("");
  const file = `${(x.firm || c.firm).replace(/[^\p{L}\p{N}]+/gu, "-")}-${x.lang === "fr" ? "charte-IA" : "AI-policy"}.docx`;
  const { error } = await client().emails.send({
    from: FROM(), to: x.to, replyTo: REPLY_TO, subject: c.subject(x.score, level), html,
    attachments: [{ filename: file, content: x.docx }],
  });
  if (error) throw new Error(`results: ${error.message}`);
}
