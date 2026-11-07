import { describe, expect, it } from "vitest";
import { progressNodeStates, resultNodeStates } from "./nodes";

describe("node states", () => {
  it("colours areas by average", () => {
    const s = resultNodeStates({ data: 3.5, team: 3.4, rules: 2.5, knowledge: 2.4, time: 4 }, []);
    expect(s).toEqual({ data: "on", team: "half", rules: "half", knowledge: "dark", time: "on" });
  });
  it("blocks an area holding a fix-first item", () => {
    const s = resultNodeStates({ data: 4, team: 4, rules: 4, knowledge: 4, time: 4 }, [5, 9]);
    expect(s.rules).toBe("blocked");
    expect(s.knowledge).toBe("blocked");
    expect(s.data).toBe("on");
  });
  it("progress follows question order data, rules, team, knowledge, time", () => {
    expect(progressNodeStates(6)).toEqual(["on", "on", "half", "dark", "dark"]);
  });
});
