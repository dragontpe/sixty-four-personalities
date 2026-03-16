# 64 Personalities

> **[Download for macOS](https://github.com/dragontpe/sixty-four-personalities/releases/latest/download/64.Personalities_0.1.0_universal.dmg)** — works on both Apple Silicon and Intel Macs. Open the DMG and drag to Applications.

A macOS desktop application that determines your six-dimension personality type through a 60-question assessment and generates a detailed PDF report.

Extends the classic 16-type MBTI framework with two additional dimensions (Identity: Assertive/Turbulent, Orientation: Cooperative/Self-directed) to produce 64 distinct personality profiles.

Fully offline. No API calls. No AI at runtime. All report text is built into the application.

## Features

- **60-question assessment** — 7-point Agree/Disagree scale across six dimensions
- **MBTI shortcut** — enter your known 4-letter type and answer only the 20 Identity/Orientation questions
- **64 unique profiles** — 16 base types x 2 identity styles x 2 orientation styles
- **PDF report generation** — group-colored cover page, full personality profile, modifier analysis, dimension breakdown
- **Four personality groups** — Analysts (purple), Diplomats (teal), Sentinels (blue), Explorers (orange)

## The Six Dimensions

| # | Name | Code | What It Measures |
|---|------|------|-----------------|
| 1 | Mind | E vs I | Where you direct your energy |
| 2 | Energy | S vs N | How you take in information |
| 3 | Nature | T vs F | How you make decisions |
| 4 | Tactics | J vs P | How you approach structure |
| 5 | Identity | A vs T | Your confidence and stress response |
| 6 | Orientation | C vs S | Your relationship to group vs independence |

## Tech Stack

- [Tauri v2](https://tauri.app) — Rust backend, WebView frontend
- [React](https://react.dev) + TypeScript — frontend
- [Vite](https://vite.dev) — build tool
- [pdf-lib](https://pdf-lib.js.org) — PDF generation (pure TypeScript)

## Architecture

```
src/
  screens/
    WelcomeScreen.tsx        — entry point with two assessment paths
    QuestionnaireScreen.tsx   — 60-question flow with progress bar
    ResultScreen.tsx          — type result display + PDF generation
  data/
    questions.ts             — all 60 questions with dimension mapping
    types.ts                 — type names, groups, colors, dimension labels
    content.ts               — all report text (16 overviews, strengths, growth edges, relationships, work + 4 modifiers)
  utils/
    scoring.ts               — scoring engine with reverse-scoring and borderline detection
    pdfgen.ts                — 4-page PDF renderer via pdf-lib
  components/
    ProgressBar.tsx
    AnswerScale.tsx
    DimensionBar.tsx
```

## Development

### Prerequisites

- [Rust](https://rustup.rs) (stable)
- [Node.js](https://nodejs.org) (v18+)
- [Tauri CLI](https://tauri.app/start/prerequisites/)

### Setup

```bash
git clone https://github.com/dragontpe/sixty-four-personalities.git
cd sixty-four-personalities
npm install
```

### Run

```bash
npm run tauri dev
```

### Test

```bash
npx vitest run
```

### Build

```bash
npm run tauri build
```

## License

MIT
