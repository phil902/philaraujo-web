import { describe, it, expect } from "vitest";
import { cleanRef, routeOffer, scoreAnswers, timeBack, toggleTool } from "./check";

const all = (v: number) => Array(12).fill(v) as number[];

describe("scoring", () => {
  it("score is (total - 12) / 36 * 100, rounded", () => {
    expect(scoreAnswers(all(1)).score).toBe(0);
    expect(scoreAnswers(all(4)).score).toBe(100);
    expect(scoreAnswers(all(2)).score).toBe(33);
  });
  it("levels: 0-33 exposed, 34-58 careful, 59-79 covered, 80-100 ready", () => {
    // all 1s on Q7 to avoid the override
    const mk = (extra: number) => { const a = all(1); for (let i = 0; i < extra; i++) a[[0,1,2,3,4,5,7,8,9,10,11][i % 11]!]! += 1; return a; };
    expect(scoreAnswers(all(2)).level).toBe("exposed"); // 33
    expect(scoreAnswers(mk(13)).score).toBe(36);
    expect(scoreAnswers(mk(13)).level).toBe("careful");
    expect(scoreAnswers(all(3)).level).toBe("covered"); // 67
    expect(scoreAnswers(all(4)).level).toBe("ready");
    const a = all(4); a[0] = 1; a[1] = 1; a[2] = 2; a[3] = 3; a[4] = 3; // total 38 -> 72
    expect(scoreAnswers(a).level).toBe("exposed"); // override: Q7=4, Q1-6 avg 2.67
  });
  it("override: Q7 >= 3 with Q1-6 average below 3 is exposed", () => {
    const a = [2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4]; // score 67, would be covered
    expect(scoreAnswers(a).score).toBe(67);
    expect(scoreAnswers(a).level).toBe("exposed");
    a[6] = 2; // Q7 = B, no override
    expect(scoreAnswers(a).level).toBe("covered");
    const b = [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]; // avg exactly 3: no override
    expect(scoreAnswers(b).level).toBe("ready");
  });
  it("weakest area is the lowest average, ties go to first", () => {
    expect(scoreAnswers(all(3)).weakest).toBe("data");
    const a = all(3); a[8] = 1; a[9] = 1;
    expect(scoreAnswers(a).weakest).toBe("knowledge");
  });
});

describe("fix first", () => {
  it("Q1-5 on A or B, Q6 and Q9 on A only, max three in question order", () => {
    const a = all(4); a[5] = 2; a[8] = 2; // Q6 B, Q9 B: not flagged
    expect(scoreAnswers(a).fixFirst).toEqual([]);
    a[5] = 1; a[8] = 1;
    expect(scoreAnswers(a).fixFirst).toEqual([6, 9]);
    expect(scoreAnswers(all(1)).fixFirst).toEqual([1, 2, 3]);
    const b = all(4); b[2] = 3; b[3] = 2; b[4] = 1;
    expect(scoreAnswers(b).fixFirst).toEqual([4, 5]);
  });
});

describe("offer routing (unchanged)", () => {
  it("routes", () => {
    expect(routeOffer("2-5", "legal", "yes")).toBe("personal");
    expect(routeOffer("6-9", "property", "yes")).toBe("brain");
    expect(routeOffer("50plus", "consulting", "no")).toBe("brain");
    expect(routeOffer("6-9", "legal", "no")).toBe("training");
  });
});

describe("time back (unchanged)", () => {
  it("computes", () => {
    expect(timeBack({ people: 8, email: 5, notes: 3, search: 3, docs: 3 })).toEqual({ hours: 364, days: 49 });
  });
});

describe("seller code and tools", () => {
  it("cleans ref", () => {
    expect(cleanRef("NA2")).toBe("na2");
    expect(cleanRef("a b")).toBeNull();
    expect(cleanRef("x".repeat(33))).toBeNull();
    expect(cleanRef("seller-1")).toBe("seller-1");
  });
  it("none is exclusive", () => {
    expect(toggleTool(["chatgpt"], "none")).toEqual(["none"]);
    expect(toggleTool(["none"], "claude")).toEqual(["claude"]);
  });
});
