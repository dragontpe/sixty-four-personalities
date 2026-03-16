import { describe, it, expect } from "vitest";
import {
  scoreQuestions,
  assembleTypeCode,
  scoreFromMBTI,
} from "./scoring";
import { ALL_QUESTIONS } from "../data/questions";

describe("scoreQuestions", () => {
  it("scores all-agree answers (all 1s) correctly", () => {
    // All 1s = strongly agree with everything
    const answers: Record<number, number> = {};
    for (const q of ALL_QUESTIONS) {
      answers[q.id] = 1;
    }
    const dims = scoreQuestions(answers, ALL_QUESTIONS);
    expect(dims).toHaveLength(6);
    // Each dimension should have a clear winner
    for (const d of dims) {
      expect(d.percentage).toBeGreaterThanOrEqual(50);
    }
  });

  it("scores all-disagree answers (all 7s) correctly", () => {
    const answers: Record<number, number> = {};
    for (const q of ALL_QUESTIONS) {
      answers[q.id] = 7;
    }
    const dims = scoreQuestions(answers, ALL_QUESTIONS);
    expect(dims).toHaveLength(6);
    for (const d of dims) {
      expect(d.percentage).toBeGreaterThanOrEqual(50);
    }
  });

  it("scores neutral answers (all 4s) as borderline", () => {
    const answers: Record<number, number> = {};
    for (const q of ALL_QUESTIONS) {
      answers[q.id] = 4;
    }
    const dims = scoreQuestions(answers, ALL_QUESTIONS);
    for (const d of dims) {
      // Neutral answers should be close to 50%
      expect(d.percentage).toBeLessThanOrEqual(55);
    }
  });

  it("strongly extraverted answers produce E winner", () => {
    // Answer E questions with 1 (agree) and I questions with 7 (disagree)
    const eiQuestions = ALL_QUESTIONS.filter((q) => q.dimension === "EI");
    const answers: Record<number, number> = {};
    for (const q of eiQuestions) {
      if (q.keyed === "E") {
        answers[q.id] = 1; // strongly agree
      } else {
        answers[q.id] = 7; // strongly disagree (reversed, so disagree with I)
      }
    }
    const dims = scoreQuestions(answers, eiQuestions);
    const ei = dims.find((d) => d.dimension === "EI");
    expect(ei).toBeDefined();
    expect(ei!.winner).toBe("E");
    expect(ei!.percentage).toBeGreaterThanOrEqual(70);
    expect(ei!.borderline).toBe(false);
  });

  it("strongly introverted answers produce I winner", () => {
    const eiQuestions = ALL_QUESTIONS.filter((q) => q.dimension === "EI");
    const answers: Record<number, number> = {};
    for (const q of eiQuestions) {
      if (q.keyed === "E") {
        answers[q.id] = 7; // strongly disagree with E
      } else {
        answers[q.id] = 1; // strongly agree with I
      }
    }
    const dims = scoreQuestions(answers, eiQuestions);
    const ei = dims.find((d) => d.dimension === "EI");
    expect(ei!.winner).toBe("I");
    expect(ei!.percentage).toBeGreaterThanOrEqual(70);
  });

  it("handles partial question sets", () => {
    const atQuestions = ALL_QUESTIONS.filter((q) => q.dimension === "AT");
    const csQuestions = ALL_QUESTIONS.filter((q) => q.dimension === "CS");
    const partial = [...atQuestions, ...csQuestions];
    const answers: Record<number, number> = {};
    for (const q of partial) {
      answers[q.id] = 2;
    }
    const dims = scoreQuestions(answers, partial);
    expect(dims).toHaveLength(2);
    expect(dims.map((d) => d.dimension)).toContain("AT");
    expect(dims.map((d) => d.dimension)).toContain("CS");
  });
});

describe("assembleTypeCode", () => {
  it("assembles a full type code from scored dimensions", () => {
    const dims = [
      { dimension: "EI" as const, winner: "I", winnerLabel: "Introversion", loserLabel: "Extraversion", percentage: 70, borderline: false },
      { dimension: "SN" as const, winner: "N", winnerLabel: "Intuition", loserLabel: "Sensing", percentage: 80, borderline: false },
      { dimension: "TF" as const, winner: "F", winnerLabel: "Feeling", loserLabel: "Thinking", percentage: 65, borderline: false },
      { dimension: "JP" as const, winner: "J", winnerLabel: "Judging", loserLabel: "Perceiving", percentage: 75, borderline: false },
      { dimension: "AT" as const, winner: "T_", winnerLabel: "Turbulent", loserLabel: "Assertive", percentage: 60, borderline: false },
      { dimension: "CS" as const, winner: "C", winnerLabel: "Cooperative", loserLabel: "Self-directed", percentage: 55, borderline: true },
    ];
    const { typeCode, fullCode } = assembleTypeCode(dims);
    expect(typeCode).toBe("INFJ");
    expect(fullCode).toBe("INFJ-TC");
  });

  it("handles S_ pole correctly", () => {
    const dims = [
      { dimension: "EI" as const, winner: "E", winnerLabel: "Extraversion", loserLabel: "Introversion", percentage: 70, borderline: false },
      { dimension: "SN" as const, winner: "S", winnerLabel: "Sensing", loserLabel: "Intuition", percentage: 60, borderline: false },
      { dimension: "TF" as const, winner: "T", winnerLabel: "Thinking", loserLabel: "Feeling", percentage: 65, borderline: false },
      { dimension: "JP" as const, winner: "P", winnerLabel: "Perceiving", loserLabel: "Judging", percentage: 75, borderline: false },
      { dimension: "AT" as const, winner: "A", winnerLabel: "Assertive", loserLabel: "Turbulent", percentage: 80, borderline: false },
      { dimension: "CS" as const, winner: "S_", winnerLabel: "Self-directed", loserLabel: "Cooperative", percentage: 70, borderline: false },
    ];
    const { typeCode, fullCode } = assembleTypeCode(dims);
    expect(typeCode).toBe("ESTP");
    expect(fullCode).toBe("ESTP-AS");
  });
});

describe("scoreFromMBTI", () => {
  it("sets MBTI dimensions at 75% from code", () => {
    const answers: Record<number, number> = {};
    const atCsQuestions = ALL_QUESTIONS.filter(
      (q) => q.dimension === "AT" || q.dimension === "CS"
    );
    for (const q of atCsQuestions) {
      answers[q.id] = 3;
    }

    const dims = scoreFromMBTI("ENFP", answers, ALL_QUESTIONS);
    expect(dims).toHaveLength(6);

    const ei = dims.find((d) => d.dimension === "EI");
    expect(ei!.winner).toBe("E");
    expect(ei!.percentage).toBe(75);
    expect(ei!.borderline).toBe(false);

    const sn = dims.find((d) => d.dimension === "SN");
    expect(sn!.winner).toBe("N");
    expect(sn!.percentage).toBe(75);

    const tf = dims.find((d) => d.dimension === "TF");
    expect(tf!.winner).toBe("F");

    const jp = dims.find((d) => d.dimension === "JP");
    expect(jp!.winner).toBe("P");

    // AT and CS should be scored from answers
    const at = dims.find((d) => d.dimension === "AT");
    expect(at).toBeDefined();
    const cs = dims.find((d) => d.dimension === "CS");
    expect(cs).toBeDefined();
  });
});
