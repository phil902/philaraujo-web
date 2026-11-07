import { describe, it, expect } from "vitest";
import { frSpace, num1, tr } from "./i18n";

describe("i18n", () => {
  it("keeps ? with its word in French", () => {
    expect(frSpace("Combien de temps l'IA pourrait-elle vous rendre ?")).toBe("Combien de temps l'IA pourrait-elle vous rendre ?");
    expect(tr({ en: "Why?", fr: "Pourquoi ?" }, "en")).toBe("Why?");
  });
  it("formats decimals per language", () => {
    expect(num1(4, "en")).toBe("4.0");
    expect(num1(3.5, "fr")).toBe("3,5");
  });
});
