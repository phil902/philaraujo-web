const lion = "/lion.png";
import { AREAS, type AreaKey, type Lang } from "@/lib/check";
import { BRAND, NODE_LABELS } from "@/lib/copy";
import { PATH_ORDER, type NodeState } from "@/lib/nodes";

/* deterministic star field, seeded so server and client match */
function makeStars(seed: number) {
  let x = seed;
  const r = () => ((x = (x * 16807) % 2147483647) / 2147483647);
  const pts = Array.from({ length: 90 }, () => ({ x: r() * 1000, y: r() * 1000, s: r() < 0.8 ? 0.9 : 1.6 }));
  const links: [number, number][] = [];
  for (let i = 0; i < pts.length && links.length < 14; i += 6) {
    let best = -1, bd = 1e9;
    pts.forEach((p, j) => {
      if (j === i) return;
      const d = (p.x - pts[i]!.x) ** 2 + (p.y - pts[i]!.y) ** 2;
      if (d < bd) { bd = d; best = j; }
    });
    if (bd < 9000) links.push([i, best]);
  }
  return { pts, links };
}
const STARS = makeStars(42);

export function StarField() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      {STARS.links.map(([a, b], i) => (
        <line key={i} x1={STARS.pts[a]!.x} y1={STARS.pts[a]!.y} x2={STARS.pts[b]!.x} y2={STARS.pts[b]!.y} stroke="var(--link)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
      ))}
      {STARS.pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="var(--star)" />
      ))}
    </svg>
  );
}

export function Node({ state, cx, cy, r = 7, color = "var(--teal)" }: { state: NodeState; cx: number; cy: number; r?: number; color?: string }) {
  if (state === "on")
    return (
      <g>
        <circle cx={cx} cy={cy} r={r * 2.1} fill={color} style={{ opacity: "var(--halo-opacity)" }} />
        <circle cx={cx} cy={cy} r={r} fill={color} />
      </g>
    );
  if (state === "half")
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={r * 0.4} fill={color} />
      </g>
    );
  if (state === "blocked")
    return (
      <g>
        <circle cx={cx} cy={cy} r={r * 2} fill="none" stroke="var(--crimson)" strokeWidth={1.2} strokeDasharray="3 3" />
        <circle cx={cx} cy={cy} r={r} fill="var(--crimson)" />
      </g>
    );
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rail)" strokeWidth={2} />;
}

const W = 360, H = 280, CX = 180, CY = 138, R = 98;
const POS = AREAS.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

export function NodeGraph({ lang, states }: { lang: Lang; states: Record<AreaKey, NodeState> }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[360px] overflow-visible" role="img" aria-label={AREAS.map((a) => NODE_LABELS[a][lang]).join(", ")}>
      {POS.map((p, i) => {
        const mx = (CX + p.x) / 2, my = (CY + p.y) / 2;
        const dx = p.y - CY, dy = -(p.x - CX);
        return <path key={i} d={`M${CX},${CY} Q${mx + dx * 0.25},${my + dy * 0.25} ${p.x},${p.y}`} fill="none" stroke="var(--rail)" strokeWidth={1.5} />;
      })}
      {POS.map((p, i) => {
        const n = POS[(i + 1) % 5]!;
        return <path key={`r${i}`} d={`M${p.x},${p.y} Q${(p.x + n.x) / 2 + (((p.x + n.x) / 2 - CX) * 0.18)},${(p.y + n.y) / 2 + (((p.y + n.y) / 2 - CY) * 0.18)} ${n.x},${n.y}`} fill="none" stroke="var(--rail)" strokeWidth={1} strokeDasharray="2 4" />;
      })}
      <Node state="on" cx={CX} cy={CY} r={10} color="var(--core)" />
      {AREAS.map((a, i) => {
        const p = POS[i]!;
        const below = p.y >= CY - 10;
        return (
          <g key={a}>
            <Node state={states[a]} cx={p.x} cy={p.y} />
            <text x={p.x} y={below ? p.y + 30 : p.y - 22} textAnchor="middle" fill="var(--soft)" style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em" }}>
              {NODE_LABELS[a][lang]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ProgressPath({ lang, states }: { lang: Lang; states: NodeState[] }) {
  return (
    <div className="relative">
      <svg aria-hidden className="absolute left-[10%] top-0 h-6 w-[80%]" viewBox="0 0 400 24" preserveAspectRatio="none">
        <path d="M0,12 C50,0 50,24 100,12 S150,0 200,12 S250,24 300,12 S350,0 400,12" fill="none" stroke="var(--rail)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="relative grid grid-cols-5 gap-1">
        {PATH_ORDER.map((a, i) => (
          <li key={a} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
            <svg width="24" height="24" viewBox="0 0 24 24" className="overflow-visible">
              <Node state={states[i]!} cx={12} cy={12} r={6} />
            </svg>
            <span className={`mono-label break-words text-[10px] leading-tight ${states[i] === "dark" ? "text-soft" : "text-ink"}`}>{NODE_LABELS[a][lang]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Header({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark: boolean }) {
  return (
    <header className="relative mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src={lion} alt="" width={32} height={32} className={`h-8 w-8 shrink-0 ${dark ? "logo-white" : ""}`} />
        <span className="truncate font-display text-base font-bold text-ink">Phil Araujo</span>
      </div>
      <div className="flex rounded-md border border-rail p-0.5" role="group" aria-label="Language">
        {(["en", "fr"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`mono-label rounded px-2.5 py-1 font-semibold transition ${lang === l ? (dark ? "bg-ink text-on-teal" : "bg-navy text-on-navy") : "text-soft hover:text-ink"}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="relative mx-auto w-full max-w-5xl px-5 pb-8">
      <div className="flex flex-col gap-3 border-t border-rail pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex min-w-0 items-start gap-2 text-sm text-soft">
          <span className="mono-label shrink-0 rounded border border-crimson px-1.5 py-0.5 font-semibold text-crimson">{BRAND.ruleTag[lang]}</span>
          <span>{BRAND.ruleText[lang]}</span>
        </p>
        <span className="mono-label shrink-0 tracking-[0.2em] text-soft">PHILARAUJO.COM</span>
      </div>
    </footer>
  );
}
