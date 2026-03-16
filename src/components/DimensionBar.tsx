import type { ScoredDimension } from "../utils/scoring";
import { DIMENSION_LABELS } from "../data/types";

interface Props {
  dim: ScoredDimension;
  color: string;
}

export function DimensionBar({ dim, color }: Props) {
  const labels = DIMENSION_LABELS[dim.dimension];

  // Check if winner is the first pole (left side)
  const winnerIsLeft =
    (dim.dimension === "EI" && dim.winner === "E") ||
    (dim.dimension === "SN" && dim.winner === "S") ||
    (dim.dimension === "TF" && dim.winner === "T") ||
    (dim.dimension === "JP" && dim.winner === "J") ||
    (dim.dimension === "AT" && dim.winner === "A") ||
    (dim.dimension === "CS" && dim.winner === "C");

  return (
    <div className="dimension-row">
      <div className="dimension-header">
        <span className="dimension-name">{labels.name}</span>
        <span className="dimension-pct" style={{ color }}>
          {dim.winnerLabel} {dim.percentage}%
          {dim.borderline && <span className="borderline-mark">~</span>}
        </span>
      </div>
      <div className="dimension-poles">
        <span>{labels.poleA}</span>
        <span>{labels.poleB}</span>
      </div>
      <div className="bar-track">
        {winnerIsLeft ? (
          <div
            className="bar-fill"
            style={{
              width: `${dim.percentage}%`,
              background: color,
            }}
          />
        ) : (
          <div
            className="bar-fill"
            style={{
              width: `${dim.percentage}%`,
              background: color,
              marginLeft: `${100 - dim.percentage}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
