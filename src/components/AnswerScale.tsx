interface Props {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function AnswerScale({ value, onChange }: Props) {
  return (
    <div className="answer-area">
      <div className="scale-row">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            type="button"
            className={`scale-btn ${value === n ? "selected" : ""}`}
            onClick={() => onChange(n)}
            aria-label={`${n}`}
          />
        ))}
      </div>
      <div className="scale-labels">
        <span>Strongly Agree</span>
        <span>Strongly Disagree</span>
      </div>
    </div>
  );
}
