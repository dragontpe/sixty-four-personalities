import { useState } from "react";
import { ALL_QUESTIONS } from "../data/questions";
import { ProgressBar } from "../components/ProgressBar";
import { AnswerScale } from "../components/AnswerScale";

interface Props {
  mode: "full" | "partial";
  onComplete: (answers: Record<number, number>) => void;
  onBack: () => void;
}

export function QuestionnaireScreen({ mode, onComplete, onBack }: Props) {
  const questions =
    mode === "full"
      ? ALL_QUESTIONS
      : ALL_QUESTIONS.filter(
          (q) => q.dimension === "AT" || q.dimension === "CS"
        );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const question = questions[currentIdx];
  const total = questions.length;
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;
  const hasAnswer = answers[question.id] !== undefined;

  function handleAnswer(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleNext() {
    if (!hasAnswer) return;
    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  function handlePrev() {
    if (!isFirst) setCurrentIdx((i) => i - 1);
  }

  return (
    <div className="screen questionnaire">
      <ProgressBar current={currentIdx + 1} total={total} />

      <div className="question-area">
        <p className="question-text">{question.text}</p>
      </div>

      <div>
        <AnswerScale
          value={answers[question.id]}
          onChange={handleAnswer}
        />
        <div className="nav-buttons">
          <button
            className="btn btn-secondary"
            onClick={isFirst ? onBack : handlePrev}
          >
            {isFirst ? "Back" : "Previous"}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!hasAnswer}
          >
            {isLast ? "See My Results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
