import { useState } from "react";
import type { PersonalityResult } from "../utils/scoring";
import { TYPE_NAMES, TYPE_GROUPS, GROUP_COLORS } from "../data/types";
import { DimensionBar } from "../components/DimensionBar";
import { generatePDF } from "../utils/pdfgen";

interface Props {
  result: PersonalityResult;
  onStartOver: () => void;
  onNameChange: (name: string) => void;
}

export function ResultScreen({ result, onStartOver, onNameChange }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeName = TYPE_NAMES[result.typeCode] || "Unknown";
  const group = TYPE_GROUPS[result.typeCode] || "Unknown";
  const color = GROUP_COLORS[group] || "#333";

  async function handleGeneratePdf() {
    setGenerating(true);
    setError(null);
    try {
      const pdfBytes = await generatePDF(result);
      if (pdfBytes) {
        try {
          const { save } = await import("@tauri-apps/plugin-dialog");
          const { writeFile } = await import("@tauri-apps/plugin-fs");
          const path = await save({
            defaultPath: `${result.fullCode}_Report.pdf`,
            filters: [{ name: "PDF", extensions: ["pdf"] }],
          });
          if (path) {
            await writeFile(path, pdfBytes);
          }
        } catch (err) {
          console.error("Tauri save failed, browser fallback:", err);
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${result.fullCode}_Report.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    } catch (e) {
      console.error("PDF generation error:", e);
      setError(e instanceof Error ? e.message : "PDF generation failed");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="screen result">
      <div className="result-header">
        <input
          type="text"
          className="result-name-input"
          placeholder="Enter your name (optional)"
          value={result.name === "You" ? "" : result.name}
          onChange={(e) => onNameChange(e.target.value || "You")}
        />
        <div className="type-code" style={{ color }}>
          {result.fullCode}
        </div>
        <div className="type-name">{typeName}</div>
        <div className="type-group" style={{ color }}>
          {group}
        </div>
      </div>

      <div className="dimensions-section">
        <h3>Your Six Dimensions</h3>
        {result.dimensions.map((dim) => (
          <DimensionBar key={dim.dimension} dim={dim} color={color} />
        ))}
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontSize: 14, textAlign: "center", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <div className="result-actions">
        <button
          className="btn btn-colored"
          style={{ background: color }}
          onClick={handleGeneratePdf}
          disabled={generating}
        >
          {generating && <span className="spinner" />}
          {generating ? "Generating..." : "Generate PDF Report"}
        </button>
        <button className="btn btn-secondary" onClick={onStartOver}>
          Start Over
        </button>
      </div>
    </div>
  );
}
