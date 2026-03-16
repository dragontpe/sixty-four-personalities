import { type Dimension, type Question } from "../data/questions";

export interface ScoredDimension {
  dimension: Dimension;
  winner: string; // E, I, S, N, T, F, J, P, A, T_, C, S_
  winnerLabel: string; // full label like "Extraversion"
  loserLabel: string;
  percentage: number; // 50-100
  borderline: boolean;
}

export interface PersonalityResult {
  typeCode: string; // e.g. "INFJ"
  fullCode: string; // e.g. "INFJ-TC"
  dimensions: ScoredDimension[];
  name: string;
}

const DIMENSION_ORDER: Dimension[] = ["EI", "SN", "TF", "JP", "AT", "CS"];

const POLE_LABELS: Record<string, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
  A: "Assertive",
  T_: "Turbulent",
  C: "Cooperative",
  S_: "Self-directed",
};

const DIMENSION_POLES: Record<Dimension, [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
  AT: ["A", "T_"],
  CS: ["C", "S_"],
};

export function scoreQuestions(
  answers: Record<number, number>,
  questions: Question[]
): ScoredDimension[] {
  const results: ScoredDimension[] = [];

  for (const dim of DIMENSION_ORDER) {
    const dimQuestions = questions.filter((q) => q.dimension === dim);
    if (dimQuestions.length === 0) continue;

    const [poleA, poleB] = DIMENSION_POLES[dim];
    let scoreA = 0;
    let scoreB = 0;

    for (const q of dimQuestions) {
      const raw = answers[q.id];
      if (raw === undefined) continue;

      if (q.reverse) {
        // Reverse-scored: subtract from 8
        const adjusted = 8 - raw;
        if (q.keyed === poleB) {
          scoreB += adjusted;
        } else {
          scoreA += adjusted;
        }
      } else {
        if (q.keyed === poleA) {
          scoreA += raw;
        } else {
          scoreB += raw;
        }
      }
    }

    // For the scale: low scores on non-reversed = agree = that pole
    // Actually rethink: scale is 1=Strongly Agree, 7=Strongly Disagree
    // For a non-reversed E question: 1 (agree) = strong E signal
    // So LOW score = strong signal for the keyed pole
    // We need to invert: strength = 8 - raw for non-reversed
    // And for reversed: strength = raw (since 1=agree with opposite pole means 1 = weak for keyed)

    // Let me redo this properly:
    // Each question measures agreement with a statement.
    // 1 = Strongly Agree, 7 = Strongly Disagree
    // For non-reversed questions keyed to pole A:
    //   Agreement (low score) = strong A signal
    //   Signal for A = 8 - raw (so 1→7, 7→1)
    // For reversed questions keyed to pole B:
    //   Agreement (low score) = strong B signal
    //   Signal for B = 8 - raw

    scoreA = 0;
    scoreB = 0;

    for (const q of dimQuestions) {
      const raw = answers[q.id];
      if (raw === undefined) continue;

      const signal = 8 - raw; // 1→7 (strong agree), 7→1 (strong disagree)

      if (!q.reverse) {
        // Non-reversed: keyed pole gets the signal
        if (q.keyed === poleA) scoreA += signal;
        else scoreB += signal;
      } else {
        // Reversed: keyed pole gets the signal
        if (q.keyed === poleB) scoreB += signal;
        else scoreA += signal;
      }
    }

    const total = scoreA + scoreB;
    const winner = scoreA >= scoreB ? poleA : poleB;
    const loser = winner === poleA ? poleB : poleA;
    const winnerScore = Math.max(scoreA, scoreB);
    const percentage =
      total > 0 ? Math.round((winnerScore / total) * 100) : 50;
    const borderline = percentage < 55;

    results.push({
      dimension: dim,
      winner,
      winnerLabel: POLE_LABELS[winner],
      loserLabel: POLE_LABELS[loser],
      percentage: Math.max(50, percentage),
      borderline,
    });
  }

  return results;
}

export function assembleTypeCode(dimensions: ScoredDimension[]): {
  typeCode: string;
  fullCode: string;
} {
  const map: Record<string, string> = {};
  for (const d of dimensions) {
    map[d.dimension] = d.winner;
  }

  // Convert pole keys to type letters
  const letterMap: Record<string, string> = {
    E: "E", I: "I", S: "S", N: "N",
    T: "T", F: "F", J: "J", P: "P",
    A: "A", T_: "T", C: "C", S_: "S",
  };

  const ei = letterMap[map.EI] || "E";
  const sn = letterMap[map.SN] || "N";
  const tf = letterMap[map.TF] || "T";
  const jp = letterMap[map.JP] || "J";
  const at = letterMap[map.AT] || "A";
  const cs = letterMap[map.CS] || "C";

  const typeCode = `${ei}${sn}${tf}${jp}`;
  const fullCode = `${typeCode}-${at}${cs}`;

  return { typeCode, fullCode };
}

export function scoreFromMBTI(
  mbtiCode: string,
  answers: Record<number, number>,
  questions: Question[]
): ScoredDimension[] {
  // For the 4 MBTI dimensions, set from the code at 75%
  const mbtiDimensions: ScoredDimension[] = [];
  const code = mbtiCode.toUpperCase();

  const mbtiMap: { dim: Dimension; letter: string; pole: string }[] = [
    { dim: "EI", letter: code[0], pole: code[0] },
    { dim: "SN", letter: code[1], pole: code[1] },
    { dim: "TF", letter: code[2], pole: code[2] },
    { dim: "JP", letter: code[3], pole: code[3] },
  ];

  for (const { dim, pole } of mbtiMap) {
    const [poleA, poleB] = DIMENSION_POLES[dim];
    const winner = pole === poleA.replace("_", "") ? poleA : poleB;
    const loser = winner === poleA ? poleB : poleA;

    mbtiDimensions.push({
      dimension: dim,
      winner,
      winnerLabel: POLE_LABELS[winner],
      loserLabel: POLE_LABELS[loser],
      percentage: 75,
      borderline: false,
    });
  }

  // Score AT and CS from the questionnaire
  const atCsQuestions = questions.filter(
    (q) => q.dimension === "AT" || q.dimension === "CS"
  );
  const scoredAtCs = scoreQuestions(answers, atCsQuestions);

  return [...mbtiDimensions, ...scoredAtCs];
}
