import { NextResponse } from "next/server";
import { z } from "zod";
import { AREAS, Q_AREA, QUESTION_COUNT, cleanRef, routeOffer, scoreAnswers, timeBack } from "@/lib/check";
import { TOOLS_Q } from "@/lib/copy";
import { buildPolicy } from "@/lib/policy";
import { policyDocxBuffer } from "@/lib/policy-docx";
import { db } from "@/lib/supabase-server";
import { sendAlert, sendResults } from "@/lib/email";

export const runtime = "nodejs";

const TOOL_VALUES = TOOLS_Q.options.map((o) => o.value) as [string, ...string[]];

const Body = z.object({
  lang: z.enum(["en", "fr"]),
  ref: z.string().nullish(),
  website: z.string().max(0).optional(), // honeypot: real people leave it empty
  contact: z.object({
    first_name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    firm: z.string().trim().max(200),
    consent: z.literal(true),
  }),
  profile: z.object({
    team_size: z.enum(["solo", "2-5", "6-9", "10-50", "50plus"]),
    sector: z.enum(["legal", "financial", "accounting", "insurance", "consulting", "recruitment", "property", "other"]),
    regulated: z.enum(["yes", "no", "unsure"]),
    role: z.enum(["owner", "manager", "member"]),
  }),
  tools: z.array(z.enum(TOOL_VALUES)).min(1).max(TOOL_VALUES.length),
  answers: z.array(z.number().int().min(1).max(4)).length(QUESTION_COUNT),
  time: z.object({
    people: z.number().int().min(1).max(200),
    email: z.number().int().min(0).max(20),
    notes: z.number().int().min(0).max(20),
    search: z.number().int().min(0).max(20),
    docs: z.number().int().min(0).max(20),
  }),
});

const areaSum = (answers: number[], area: string) =>
  Q_AREA.reduce((s, a, i) => (a === area ? s + (answers[i] ?? 0) : s), 0);

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Everything shown or stored is recomputed here; numbers from the browser are never trusted.
  const r = scoreAnswers(body.answers);
  const offer = routeOffer(body.profile.team_size, body.profile.sector, body.profile.regulated);
  const tb = timeBack(body.time);
  const ref = cleanRef(body.ref ?? null);
  const firm = body.contact.firm || null;
  const isTest = /\btest\b/i.test(`${body.contact.first_name} ${firm ?? ""}`);

  const row = {
    version: 2,
    lang: body.lang,
    ref,
    first_name: body.contact.first_name,
    email: body.contact.email,
    firm,
    ...body.profile,
    tools: body.tools,
    answers: body.answers,
    score_data: areaSum(body.answers, "data"),
    score_team: areaSum(body.answers, "team"),
    score_rules: areaSum(body.answers, "rules"),
    score_knowledge: areaSum(body.answers, "knowledge"),
    score_time: areaSum(body.answers, "time"),
    total: r.score,
    level: r.level,
    flags: r.fixFirst,
    weakest_area: r.weakest,
    time_inputs: body.time,
    hours_90d: tb.hours,
    offer,
    consent: true,
    is_test: isTest,
  };

  const { data, error } = await db().from("readiness_responses").insert(row).select("id").single();
  if (error || !data) {
    console.error("[submit] insert failed", error?.message);
    return NextResponse.json({ ok: false, error: "save" }, { status: 500 });
  }

  // Emails never block the person's result: failures are logged, the row stays, emailed_at stays empty.
  try {
    const policy = buildPolicy({
      lang: body.lang, firm: firm ?? "", ...body.profile, tools: body.tools, answers: body.answers, today: new Date().toISOString(),
    });
    const docx = await policyDocxBuffer(policy);
    await Promise.all([
      sendAlert({ row, id: data.id, areas: AREAS.map((a) => [a, r.averages[a]] as const) }),
      sendResults({ lang: body.lang, name: body.contact.first_name, to: body.contact.email, firm, score: r.score, level: r.level, fixFirst: r.fixFirst, hours: tb.hours, days: tb.days, docx }),
    ]);
    await db().from("readiness_responses").update({ emailed_at: new Date().toISOString() }).eq("id", data.id);
  } catch (e) {
    console.error("[submit] email failed", e instanceof Error ? e.message : e);
  }

  return NextResponse.json({ ok: true });
}
