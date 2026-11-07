"use client";

import type React from "react";
import { Footer, Header, NodeGraph, ProgressPath, StarField } from "@/components/Brand";
import { progressNodeStates, resultNodeStates } from "@/lib/nodes";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  AREAS, BOOKING_URL, DEFAULT_PEOPLE, QUESTION_COUNT, Q_AREA, cleanRef, routeOffer, scoreAnswers, timeBack, toggleTool,
  type Lang, type TimeInputs,
} from "@/lib/check";
import { BRAND, AREA_NAMES, BANDS, FIX_TEXT, OFFERS, PAGE, POLICY_UI, PROFILE, QUESTION_TEXT, TIME_FIELDS, TIPS, TOOLS_Q, UI, type ProfileKey } from "@/lib/copy";
import { buildPolicy, POLICY_STORAGE_KEY, type PolicyInput } from "@/lib/policy";
import { num1, tr } from "@/lib/i18n";

type Step = "intro" | "profile" | "questions" | "time" | "contact" | "results";
type Profile = Record<ProfileKey, string>;

const contactSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  firm: z.string().trim().max(200),
  consent: z.literal(true),
});

const btnPrimary =
  "inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-navy px-6 text-base font-semibold text-on-navy transition hover:opacity-90 disabled:opacity-40 sm:w-auto";
const btnBack = "shrink-0 text-sm font-semibold text-soft hover:text-ink";

const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

export default function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [ref, setRef] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("intro");
  const [profile, setProfile] = useState<Profile>({ team_size: "", sector: "", regulated: "", role: "" });
  const [tools, setTools] = useState<string[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState<TimeInputs>({ people: 1, email: 5, notes: 3, search: 3, docs: 3 });
  const [timeTouched, setTimeTouched] = useState(false);
  const [contact, setContact] = useState({ first_name: "", email: "", firm: "", consent: false });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    if (navigator.language?.toLowerCase().startsWith("fr")) setLang("fr");
    try {
      const fromUrl = cleanRef(new URLSearchParams(window.location.search).get("ref"));
      if (fromUrl) sessionStorage.setItem("ref", fromUrl);
      setRef(fromUrl ?? cleanRef(sessionStorage.getItem("ref")));
    } catch { /* storage blocked */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = PAGE.title[lang];
    document.querySelector('meta[name="description"]')?.setAttribute("content", PAGE.description[lang]);
  }, [lang]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [step]);

  const t = (x: { en: string; fr: string }) => tr(x, lang);

  const pick = (v: number) => {
    const next = [...answers];
    next[idx] = v;
    setAnswers(next);
    if (idx < QUESTION_COUNT - 1) setIdx(idx + 1);
    else {
      if (!timeTouched) setTime((p) => ({ ...p, people: DEFAULT_PEOPLE[profile.team_size] ?? 1 }));
      setStep("time");
    }
  };

  const submit = async () => {
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      const e: Record<string, boolean> = {};
      parsed.error.issues.forEach((i) => (e[String(i.path[0])] = true));
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);
    setSaveError(false);
    let ok = false;
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, ref, website: honeypot, contact: parsed.data, profile, tools, answers, time }),
      });
      ok = res.ok;
    } catch { ok = false; }
    setSaving(false);
    if (!ok) { setSaveError(true); return; }
    setStep("results");
  };

  const tb = timeBack(time);

  const dark = step === "intro";
  const head = <Header lang={lang} setLang={setLang} dark={dark || step === "results"} />;

  return (
    <div className={`relative flex min-h-screen flex-col overflow-x-hidden ${dark ? "surface-dark" : "surface-light"}`}>
      <StarField />
      {step !== "results" && head}

      {step === "intro" && (
        <main className="relative mx-auto grid w-full max-w-5xl content-start gap-10 md:flex-1 px-5 pb-16 pt-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:content-center md:items-center">
          <section className="min-w-0 space-y-7">
            <p className="mono-label font-semibold text-teal">{t(BRAND.eyebrow)}</p>
            <h1 className="font-display text-[40px] font-extrabold leading-[1.05] text-ink sm:text-6xl sm:[&>span]:whitespace-nowrap">
              {(() => { const w = t(UI.introTitle).split(" "); const h = Math.ceil(w.length / 2); return <><span>{w.slice(0, h).join(" ")}</span><br /><span>{w.slice(h).join(" ")}</span></>; })()}
            </h1>
            <p className="font-display text-xl font-bold leading-snug text-ink">{t(UI.subtitle)}</p>
            <p className="text-lg leading-relaxed text-soft">
              {(() => {
                const txt = t(UI.introText), ph = t(BRAND.boldPhrase), k = txt.indexOf(ph);
                if (k < 0) return txt;
                return <>{txt.slice(0, k)}<strong className="font-semibold text-ink">{ph}</strong>{txt.slice(k + ph.length)}</>;
              })()}
            </p>
            <button className="inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-teal px-10 text-lg font-semibold text-on-teal transition hover:opacity-90 sm:w-auto" onClick={() => setStep("profile")}>{t(UI.start)}</button>
          </section>
          <div className="relative flex justify-center">
            <div aria-hidden className="glow absolute inset-0 -m-6" />
            <div className="relative w-full max-w-[360px]">
              <NodeGraph lang={lang} states={{ data: "dark", team: "dark", rules: "dark", knowledge: "dark", time: "dark" }} />
            </div>
          </div>
        </main>
      )}

      {step !== "intro" && step !== "results" && (
        <main className="relative mx-auto w-full max-w-xl flex-1 px-5 pb-16 pt-4">
          {step === "profile" && (
            <section className="space-y-10">
              {PROFILE.map((q) => (
                <fieldset key={q.key} className="space-y-3">
                  <legend className="mb-3 font-display text-xl font-bold leading-snug text-ink">{t(q.q)}</legend>
                  <div className="grid gap-2">
                    {q.options.map((o) => {
                      const sel = profile[q.key] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          aria-pressed={sel}
                          onClick={() => setProfile({ ...profile, [q.key]: o.value })}
                          className={`min-h-12 rounded-lg border px-4 py-3 text-left text-base transition ${sel ? "border-navy bg-navy font-semibold text-on-navy" : "border-rail bg-tile text-ink hover:border-teal"}`}
                        >
                          {t(o)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
              <fieldset className="space-y-3">
                <legend className="mb-3 font-display text-xl font-bold leading-snug text-ink">{t(TOOLS_Q.q)}</legend>
                <div className="grid gap-2">
                  {TOOLS_Q.options.map((o) => {
                    const sel = tools.includes(o.value);
                    return (
                      <button key={o.value} type="button" role="checkbox" aria-checked={sel} onClick={() => setTools(toggleTool(tools, o.value))}
                        className={`flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-left text-base transition ${sel ? "border-navy bg-navy font-semibold text-on-navy" : "border-rail bg-tile text-ink hover:border-teal"}`}>
                        <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded border text-xs ${sel ? "border-on-navy" : "border-rail"}`}>{sel ? "✓" : ""}</span>
                        <span>{t(o)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="flex items-center gap-4">
                <button className={btnBack} onClick={() => setStep("intro")}>{t(UI.back)}</button>
                <button
                  className={btnPrimary}
                  disabled={!profile.team_size || !profile.sector || !profile.regulated || !profile.role || tools.length === 0}
                  onClick={() => { setIdx(0); setStep("questions"); }}
                >
                  {t(UI.next)}
                </button>
              </div>
            </section>
          )}

          {step === "questions" && (
            <section className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-end">
                  <span className="mono-label font-semibold tabular-nums text-soft">{idx + 1} / {QUESTION_COUNT}</span>
                </div>
                <ProgressPath lang={lang} states={progressNodeStates(idx)} />
              </div>
              <div className="space-y-3">
                <p className="mono-label font-semibold text-teal-ink">{t(AREA_NAMES[Q_AREA[idx] ?? "data"])}</p>
                <h2 key={idx} className="font-display text-[26px] font-bold leading-tight text-ink animate-in fade-in duration-300 sm:text-[30px]">
                  {t((QUESTION_TEXT[idx] ?? QUESTION_TEXT[0]!).q)}
                </h2>
                <p className="text-sm text-soft">{t(UI.instruction)}</p>
              </div>
              <div key={`o${idx}`} className="grid gap-2">
                {(QUESTION_TEXT[idx] ?? QUESTION_TEXT[0]!).options.map((o, i) => {
                  const v = i + 1, sel = answers[idx] === v;
                  return (
                    <button key={v} onClick={() => pick(v)} aria-pressed={sel}
                      className={`flex min-h-14 items-start gap-4 rounded-lg border px-4 py-4 text-left text-base leading-snug transition ${sel ? "border-navy bg-navy text-on-navy" : "border-rail bg-tile text-ink hover:border-teal"}`}>
                      <span className={`font-mono text-sm font-semibold leading-6 ${sel ? "text-on-navy" : "text-teal-ink"}`}>{"ABCD"[i]}</span>
                      <span>{t(o)}</span>
                    </button>
                  );
                })}
              </div>
              <button className={btnBack} onClick={() => (idx === 0 ? setStep("profile") : setIdx(idx - 1))}>
                {t(UI.back)}
              </button>
            </section>
          )}

          {step === "time" && (
            <section className="space-y-8">
              <div className="space-y-2">
                <h1 className="font-display text-3xl font-bold leading-tight text-ink">{t(UI.timeTitle)}</h1>
                <p className="text-soft">{t(UI.timeText)}</p>
              </div>
              {TIME_FIELDS.map((f) => {
                const min = f.key === "people" ? 1 : 0;
                const set = (raw: string) => {
                  const n = Math.round(Number(raw));
                  const v = Number.isFinite(n) ? Math.min(f.max, Math.max(min, n)) : min;
                  setTimeTouched(true);
                  setTime((p) => ({ ...p, [f.key]: v }));
                };
                return (
                  <div key={f.key} className="space-y-2">
                    <label htmlFor={`t-${f.key}`} className="block text-sm font-semibold leading-snug text-ink">{t(f.label)}</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min={min} max={f.max} value={time[f.key]}
                        aria-label={t(f.label)}
                        onChange={(e) => set(e.target.value)}
                        className="h-2 min-w-0 flex-1"
                      />
                      <input
                        id={`t-${f.key}`} type="number" inputMode="numeric" min={min} max={f.max} value={time[f.key]}
                        onChange={(e) => set(e.target.value)}
                        className={`${inputCls} w-20 shrink-0 px-3 tabular-nums`}
                      />
                    </div>
                  </div>
                );
              })}
              <TimeFigure lang={lang} hours={tb.hours} days={tb.days} />
              <div className="flex items-center gap-4">
                <button className={btnBack} onClick={() => { setIdx(QUESTION_COUNT - 1); setStep("questions"); }}>{t(UI.back)}</button>
                <button className={btnPrimary} onClick={() => setStep("contact")}>{t(UI.next)}</button>
              </div>
            </section>
          )}

          {step === "contact" && (
            <section className="space-y-6">
              <h1 className="font-display text-3xl font-bold leading-tight text-ink">{t(UI.contactTitle)}</h1>
              {([
                ["first_name", UI.firstName, "text", "given-name"],
                ["email", UI.email, "email", "email"],
                ["firm", UI.firm, "text", "organization"],
              ] as const).map(([k, label, type, ac]) => (
                <div key={k} className="block space-y-1.5">
                  <label htmlFor={`c-${k}`} className="block text-sm font-semibold text-ink">{t(label)}</label>
                  <input
                    id={`c-${k}`}
                    name={k}
                    type={type}
                    autoComplete={ac}
                    maxLength={k === "firm" ? 200 : k === "email" ? 255 : 100}
                    value={contact[k]}
                    onChange={(e) => setContact({ ...contact, [k]: e.target.value })}
                    className={`${inputCls} block w-full px-4 ${errors[k] ? "border-crimson" : ""}`}
                  />
                  {errors[k] && <span className="text-sm text-crimson">{k === "email" ? t(UI.errEmail) : t(UI.errRequired)}</span>}
                </div>
              ))}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" />
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={contact.consent}
                  onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
                  className="mt-1 h-5 w-5 shrink-0 accent-teal"
                />
                <span className={`text-sm leading-relaxed ${errors["consent"] ? "text-crimson" : "text-ink"}`}>{t(UI.consent)}</span>
              </label>
              <p className="text-xs leading-relaxed text-soft">{t(UI.privacy)}</p>
              {saveError && <p className="text-sm text-crimson">{t(UI.errSave)}</p>}
              <div className="flex items-center gap-4">
                <button className={btnBack} onClick={() => setStep("time")}>{t(UI.back)}</button>
                <button className={btnPrimary} disabled={saving} onClick={submit}>{t(UI.submit)}</button>
              </div>
            </section>
          )}
        </main>
      )}

      {step === "results" && <Results lang={lang} header={head} answers={answers} profile={profile} tools={tools} time={time} name={contact.first_name.trim()} firm={contact.firm.trim()} />}

      <div className="flex-1" />
      <Footer lang={lang} />
    </div>
  );
}

const inputCls =
  "min-h-12 rounded-lg border border-rail bg-tile text-base text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/40";

function TimeFigure({ lang, hours, days }: { lang: Lang; hours: number; days: number }) {
  return (
    <div className="space-y-2 rounded-lg border border-rail bg-tile p-5">
      <p className="font-display text-7xl font-extrabold leading-none text-teal tabular-nums">{hours}</p>
      <p className="mono-label font-semibold text-teal-ink">{tr(BRAND.hoursLabel, lang)}</p>
      <p className="pt-2 text-base font-semibold text-ink">{fill(tr(UI.timeLine, lang), { hours, days })}</p>
      <p className="text-xs leading-relaxed text-soft">{tr(UI.timeNote, lang)}</p>
    </div>
  );
}

function areaSum(answers: number[], area: string) {
  return Q_AREA.reduce((s, a, i) => (a === area ? s + (answers[i] ?? 0) : s), 0);
}

function Results({ lang, header, answers, profile, tools, time, name, firm }: { lang: Lang; header: React.ReactNode; answers: number[]; profile: Profile; tools: string[]; time: TimeInputs; name: string; firm: string }) {
  const t = (x: { en: string; fr: string }) => tr(x, lang);
  const r = scoreAnswers(answers);
  const offer = routeOffer(profile.team_size, profile.sector, profile.regulated);
  const band = BANDS[r.level];
  const [busy, setBusy] = useState(false);
  const policyInput = (): PolicyInput => ({ lang, firm, team_size: profile.team_size, sector: profile.sector, regulated: profile.regulated, tools, answers, today: new Date().toISOString() });
  const downloadWord = async () => {
    setBusy(true);
    try {
      const { policyDocx } = await import("@/lib/policy-docx");
      const blob = await policyDocx(buildPolicy(policyInput()));
      const url = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = url;
      el.download = `${(firm || (lang === "fr" ? "cabinet" : "firm")).replace(/[^\p{L}\p{N}]+/gu, "-")}-${lang === "fr" ? "charte-IA" : "AI-policy"}.docx`;
      el.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally { setBusy(false); }
  };
  const openPrint = () => {
    const v = JSON.stringify(policyInput());
    try { sessionStorage.setItem(POLICY_STORAGE_KEY, v); localStorage.setItem(POLICY_STORAGE_KEY, v); } catch { /* ignore */ }
    window.open("/policy", "_blank");
  };
  const tb = timeBack(time);
  const label = "mono-label font-semibold text-teal-ink";

  return (
    <>
      <div className="surface-dark relative overflow-hidden">
        <StarField />
        {header}
        <section className="relative mx-auto grid w-full max-w-5xl items-center gap-8 px-5 pb-12 pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4">
            <p className="text-base text-soft">{fill(t(UI.hi), { name })}</p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-8xl font-extrabold leading-none text-ink tabular-nums">{r.score}</span>
              <span className="font-display text-2xl font-bold text-soft">/ 100</span>
            </p>
            <h1 className="font-display text-3xl font-bold text-teal">{t(band.name)}</h1>
            <p className="text-lg leading-relaxed text-ink">{t(band.text)}</p>
          </div>
          <div className="relative flex justify-center">
            <div aria-hidden className="glow absolute inset-0 -m-6" />
            <div className="relative w-full max-w-[360px]">
              <NodeGraph lang={lang} states={resultNodeStates(r.averages, r.fixFirst)} />
            </div>
          </div>
        </section>
      </div>

      <main className="relative mx-auto w-full max-w-xl flex-1 space-y-12 px-5 pb-16 pt-10">
        <div className="space-y-5">
          {AREAS.map((a) => (
            <div key={a} className="space-y-2">
              <div className="flex justify-between gap-3">
                <span className={`mono-label ${a === r.weakest ? "font-semibold text-ink" : "text-soft"}`}>{t(AREA_NAMES[a])}</span>
                <span className="mono-label tabular-nums text-soft">{num1(r.averages[a], lang)} / 4</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-rail">
                <div className="h-full rounded-full bg-teal" style={{ width: `${(r.averages[a] / 4) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">{t(UI.fixFirst)}</h2>
          {r.fixFirst.length === 0 ? (
            <p className="text-base text-ink">{t(UI.noRisk)}</p>
          ) : (
            <ul className="space-y-3">
              {r.fixFirst.map((n) => (
                <li key={n} className="flex items-start gap-3 text-ink">
                  <span className="mono-label mt-0.5 shrink-0 rounded border border-crimson px-1.5 py-0.5 font-semibold text-crimson">{BRAND.fixTag[lang]}</span>
                  <span className="font-semibold">{t(FIX_TEXT[n]!)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-rail bg-tile p-6">
          <h2 className="font-display text-2xl font-bold text-ink">{t(POLICY_UI.heading)}</h2>
          <p className="leading-relaxed text-ink">{fill(t(POLICY_UI.text), { firm: firm || (lang === "fr" ? "votre cabinet" : "your firm") })}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className={btnPrimary} disabled={busy} onClick={downloadWord}>{t(POLICY_UI.word)}</button>
            <button className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-navy px-6 text-base font-semibold text-ink transition hover:border-teal sm:w-auto" onClick={openPrint}>{t(POLICY_UI.print)}</button>
          </div>
          <p className="text-xs text-soft">{t(POLICY_UI.note)}</p>
        </div>

        <div className="space-y-2">
          <h2 className={label}>{t(UI.oneChange)}</h2>
          <p className="font-display text-2xl font-bold text-ink">{t(AREA_NAMES[r.weakest])}</p>
          <p className="text-base leading-relaxed text-ink">{t(TIPS[r.weakest])}</p>
        </div>

        <div className="space-y-3">
          <h2 className={label}>{t(AREA_NAMES.time)}</h2>
          <TimeFigure lang={lang} hours={tb.hours} days={tb.days} />
        </div>

        <div className="overflow-hidden rounded-lg border border-rail bg-tile">
          <h2 className="bg-navy px-6 py-4 font-display text-xl font-bold leading-snug text-on-navy">{t(OFFERS[offer].title)}</h2>
          <div className="space-y-3 p-6">
            <p className="leading-relaxed text-soft">{t(OFFERS[offer].text)}</p>
            {(profile.role === "manager" || profile.role === "member") && (
              <p className="text-sm font-semibold text-ink">{t(UI.share)}</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {offer === "personal" ? (
            <p className="text-base leading-relaxed text-ink">{t(UI.personalNext)}</p>
          ) : BOOKING_URL ? (
            <>
              <p className="text-base leading-relaxed text-ink">{t(UI.callBooking)}</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={btnPrimary}>{t(UI.bookButton)}</a>
            </>
          ) : (
            <p className="text-base leading-relaxed text-ink">{t(UI.callNoBooking)}</p>
          )}
        </div>
      </main>
    </>
  );
}
