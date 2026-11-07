import "server-only";
import { Resend } from "resend";
import { BOOKING_URL, type AreaKey, type Lang, type LevelKey } from "@/lib/check";
import { BANDS, FIX_TEXT, TIPS } from "@/lib/copy";

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

// Copy approved in outline by Phil, 7 Nov 2026 (PS = the one change that would help most).
const LINKEDIN = "https://www.linkedin.com/in/philippearaujo";
const RESULTS = {
  en: {
    subject: (score: number, level: string) => `Your client data check: ${score}/100, ${level}`,
    hi: (n: string) => `Hi ${n},`,
    thanks: (score: number, level: string, text: string) => `Thanks for taking the check. Your firm came out at ${score}/100: ${level}. ${text}`,
    fix: "What to fix first:",
    none: "Nothing urgent came up in your answers.",
    time: (h: number, d: number) => `On your numbers, AI could give you back about ${h} hours in 90 days, roughly ${d} working days.`,
    policy: "Your draft AI policy is attached as a Word file. The yellow bits are for you to fill in. It's a starting draft, not legal advice.",
    call: (link: string) => `If you want to go through it together, <a href="${link}">book 30 minutes with me here</a>, or just reply to this email. If AI isn't worth it for your firm yet, I'll tell you.`,
    ps: "PS: The one change that would help most right now:",
    firm: "your firm",
  },
  fr: {
    subject: (score: number, level: string) => `Votre diagnostic données clients : ${score}/100, ${level}`,
    hi: (n: string) => `Bonjour ${n},`,
    thanks: (score: number, level: string, text: string) => `Merci d'avoir fait le diagnostic. Votre cabinet obtient ${score}/100 : ${level}. ${text}`,
    fix: "À traiter en premier :",
    none: "Aucun risque urgent dans vos réponses.",
    time: (h: number, d: number) => `Avec vos chiffres, l'IA pourrait vous rendre environ ${h} heures en 90 jours, soit environ ${d} jours de travail.`,
    policy: "Votre projet de charte IA est en pièce jointe, en Word. Les passages en jaune sont à compléter. C'est un premier projet, pas un avis juridique.",
    call: (link: string) => `Si vous voulez la parcourir ensemble, <a href="${link}">réservez 30 minutes avec moi ici</a>, ou répondez simplement à cet email. Si l'IA ne vaut pas encore le coup pour votre cabinet, je vous le dirai.`,
    ps: "PS : Le changement qui aiderait le plus en ce moment :",
    firm: "votre cabinet",
  },
} as const;

export async function sendResults(x: {
  lang: Lang; name: string; to: string; firm: string | null; score: number; level: LevelKey; weakest: AreaKey;
  fixFirst: number[]; hours: number; days: number; docx: Buffer;
}) {
  const c = RESULTS[x.lang];
  const level = BANDS[x.level].name[x.lang];
  const levelText = BANDS[x.level].text[x.lang];
  const fixes = x.fixFirst.map((n) => FIX_TEXT[n]?.[x.lang]).filter(Boolean) as string[];
  const p = (s: string) => `<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;margin:0 0 14px">${s}</p>`;
  const html = [
    p(esc(c.hi(x.name))),
    p(esc(c.thanks(x.score, level, levelText))),
    fixes.length
      ? p(`<strong>${esc(c.fix)}</strong>`) + `<ul style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;margin:0 0 14px">${fixes.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`
      : p(esc(c.none)),
    p(esc(c.time(x.hours, x.days))),
    p(esc(c.policy)),
    p(c.call(BOOKING_URL)),
    p(`Phil<br><a href="${LINKEDIN}" style="color:#667">linkedin.com/in/philippearaujo</a>`),
    p(`${esc(c.ps)} ${esc(TIPS[x.weakest][x.lang])}`),
  ].join("");
  const file = `${(x.firm || c.firm).replace(/[^\p{L}\p{N}]+/gu, "-")}-${x.lang === "fr" ? "charte-IA" : "AI-policy"}.docx`;
  const { error } = await client().emails.send({
    from: FROM(), to: x.to, replyTo: REPLY_TO, subject: c.subject(x.score, level), html,
    attachments: [{ filename: file, content: x.docx }],
  });
  if (error) throw new Error(`results: ${error.message}`);
}
