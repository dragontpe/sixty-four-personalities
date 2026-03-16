import { useState } from "react";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { QuestionnaireScreen } from "./screens/QuestionnaireScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ALL_QUESTIONS } from "./data/questions";
import {
  scoreQuestions,
  scoreFromMBTI,
  assembleTypeCode,
  type PersonalityResult,
} from "./utils/scoring";

type Screen = "welcome" | "questionnaire" | "result";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [mbtiCode, setMbtiCode] = useState("");
  const [result, setResult] = useState<PersonalityResult | null>(null);

  function handleStartFull() {
    setMode("full");
    setScreen("questionnaire");
  }

  function handleStartPartial(code: string) {
    setMode("partial");
    setMbtiCode(code);
    setScreen("questionnaire");
  }

  function handleComplete(answers: Record<number, number>) {
    let dimensions;
    if (mode === "full") {
      dimensions = scoreQuestions(answers, ALL_QUESTIONS);
    } else {
      dimensions = scoreFromMBTI(mbtiCode, answers, ALL_QUESTIONS);
    }

    const { typeCode, fullCode } = assembleTypeCode(dimensions);

    setResult({
      typeCode,
      fullCode,
      dimensions,
      name: "You",
    });
    setScreen("result");
  }

  function handleStartOver() {
    setScreen("welcome");
    setMode("full");
    setMbtiCode("");
    setResult(null);
  }

  function handleNameChange(name: string) {
    if (result) {
      setResult({ ...result, name });
    }
  }

  switch (screen) {
    case "welcome":
      return (
        <WelcomeScreen
          onStartFull={handleStartFull}
          onStartPartial={handleStartPartial}
        />
      );
    case "questionnaire":
      return (
        <QuestionnaireScreen
          mode={mode}
          onComplete={handleComplete}
          onBack={handleStartOver}
        />
      );
    case "result":
      return result ? (
        <ResultScreen
          result={result}
          onStartOver={handleStartOver}
          onNameChange={handleNameChange}
        />
      ) : null;
  }
}

export default App;
