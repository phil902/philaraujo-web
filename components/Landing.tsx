import type { Lang } from "@/lib/check";
import { BOOKING_URL } from "@/lib/check";
import { tr } from "@/lib/i18n";
import { LANDING as L } from "@/lib/landing";

const label = "mono-label font-semibold text-teal";
const card = "rounded-lg border border-rail bg-white/[0.03] p-5 sm:p-6";

/** Everything from the one-pager, under the hero. */
export function Landing({ lang, onStart }: { lang: Lang; onStart: () => void }) {
  const t = (x: { en: string; fr: string }) => tr(x, lang);
  return (
    <div className="relative mx-auto w-full max-w-5xl space-y-16 px-5 pb-20">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <div className="space-y-4">
          <p className={label}>{t(L.eyebrow)}</p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{t(L.title)}</h2>
          <p className="text-lg leading-relaxed text-soft">{t(L.sub)}</p>
        </div>
        <div className="space-y-4">
          <ol className="divide-y divide-rail border-y border-rail">
            {L.questions.map((q, i) => (
              <li key={i} className="flex gap-4 py-3">
                <span className="font-mono text-sm font-semibold leading-6 text-teal">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold leading-snug text-ink">{t(q)}</span>
              </li>
            ))}
          </ol>
          <p className="leading-relaxed text-soft">{t(L.pause)}</p>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-12">
        <div className="space-y-3">
          <p className={label}>{t(L.whatLabel)}</p>
          <p className="text-lg leading-relaxed text-ink">{t(L.what)}</p>
        </div>
        <div className={card}>
          <p className={`${label} mb-4`}>{t(L.safeLabel)}</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {L.safe.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal" />
                <p className="leading-snug text-soft"><strong className="font-semibold text-ink">{t(s.title)}</strong> {t(s.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12">
        <div className={`${card} space-y-3`}>
          <p className={label}>{t(L.callLabel)}</p>
          <h2 className="font-display text-2xl font-extrabold text-ink">{t(L.callTitle)}</h2>
          <p className="leading-relaxed text-soft">{t(L.callText)}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            {BOOKING_URL && (
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal px-6 font-semibold text-on-teal transition hover:opacity-90">
                {t(L.callButton)}
              </a>
            )}
            <button onClick={onStart} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-rail px-6 font-semibold text-ink transition hover:border-teal">
              {t(L.orCheck)}
            </button>
          </div>
        </div>
        <div className="flex gap-5">
          <img src="/phil.jpg" alt="Phil Araujo" width={88} height={88} className="h-22 w-22 shrink-0 rounded-full border-2 border-rail object-cover" />
          <div className="space-y-3">
            <p className="font-display text-xl font-bold text-ink">Phil Araujo</p>
            <p className="leading-snug text-soft">{t(L.aboutLine)}</p>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-3 pt-1">
              {L.stats.map((s, i) => (
                <div key={i}>
                  <dt className="font-display text-lg font-extrabold text-teal">{t(s.big)}</dt>
                  <dd className="text-sm leading-snug text-soft">{t(s.small)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
