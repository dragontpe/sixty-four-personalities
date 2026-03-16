import { useState } from "react";
import { VALID_MBTI_CODES } from "../data/types";

interface Props {
  onStartFull: () => void;
  onStartPartial: (mbtiCode: string) => void;
}

export function WelcomeScreen({ onStartFull, onStartPartial }: Props) {
  const [mbtiInput, setMbtiInput] = useState("");
  const [mbtiError, setMbtiError] = useState("");

  function handleMbtiChange(val: string) {
    const upper = val.toUpperCase().slice(0, 4);
    setMbtiInput(upper);
    if (mbtiError) setMbtiError("");
  }

  function handleMbtiSubmit() {
    if (mbtiInput.length !== 4) {
      setMbtiError("Enter a 4-letter type code");
      return;
    }
    if (!VALID_MBTI_CODES.includes(mbtiInput)) {
      setMbtiError("Not a valid MBTI type code");
      return;
    }
    onStartPartial(mbtiInput);
  }

  return (
    <div className="screen welcome">
      <div className="welcome-header">
        <h1 className="welcome-title">64 Personalities</h1>
        <p className="welcome-tagline">
          Discover your six-dimension personality type
        </p>
      </div>
      <div className="welcome-cards">
        <div className="welcome-card">
          <h3>Take the Full Assessment</h3>
          <p>
            Answer 60 questions to discover all six dimensions of your
            personality type.
          </p>
          <button className="btn btn-primary" onClick={onStartFull}>
            Begin Assessment
          </button>
        </div>
        <div className="welcome-card">
          <h3>I Know My MBTI Type</h3>
          <p>
            Enter your four-letter type and answer 20 questions for your
            identity and orientation.
          </p>
          <input
            type="text"
            className="mbti-input"
            value={mbtiInput}
            onChange={(e) => handleMbtiChange(e.target.value)}
            placeholder="INFJ"
            maxLength={4}
          />
          {mbtiError && <div className="input-error">{mbtiError}</div>}
          <button
            className="btn btn-primary"
            onClick={handleMbtiSubmit}
            disabled={mbtiInput.length < 4}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
