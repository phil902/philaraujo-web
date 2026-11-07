import { describe, expect, it } from "vitest";
import { buildPolicy, type PolicyInput } from "./policy";

const base: PolicyInput = { lang: "en", firm: "Acme LLP", team_size: "6-9", sector: "legal", regulated: "yes", tools: ["chatgpt", "notetaker"], answers: Array(12).fill(4), today: "2026-11-06T12:00:00Z" };
const text = (x: PolicyInput) => JSON.stringify(buildPolicy(x));

describe("policy", () => {
  it("fills firm name and has no instruction brackets", () => {
    const s = text(base);
    expect(s).toContain("Acme LLP");
    expect(s).not.toContain("Pre-filled");
    expect(s).not.toContain("[legal");
    expect(s).toContain("and privileged material.");
  });
  it("no urgent actions when all D", () => {
    expect(text(base)).toContain("No urgent actions from your answers.");
  });
  it("action plan groups by date", () => {
    const a = Array(12).fill(4); a[0] = 1; a[1] = 2;
    const s = text({ ...base, answers: a });
    expect(s).toContain("Within 7 days (by 13 November 2026)");
    expect(s).toContain("Within 30 days (by 6 December 2026)");
    expect(s).not.toContain("Within 90 days");
    expect(s).toContain("Everyone moves to firm accounts within 30 days");
  });
  it("solo drops appendix 2; non-regulated has no sector annex but keeps EU", () => {
    const s = text({ ...base, team_size: "solo", regulated: "no" });
    expect(s).not.toContain("Appendix 2");
    expect(s).toContain("The AI owner and the checker are the same person.");
    expect(s).not.toContain("SRA-regulated");
    expect(s).toContain("Clients in the EU.");
  });
  it("French uses French dates and tools", () => {
    const s = text({ ...base, lang: "fr", answers: [1, ...Array(11).fill(4)] });
    expect(s).toContain("Sous 7 jours (avant le 13 novembre 2026)");
    expect(s).toContain("Outil de prise de notes en réunion");
  });
});
