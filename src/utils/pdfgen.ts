import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { PersonalityResult } from "./scoring";
import {
  TYPE_NAMES,
  TYPE_GROUPS,
  GROUP_COLORS,
  TYPE_TAGLINES,
  DIMENSION_LABELS,
} from "../data/types";
import {
  BASE_OVERVIEW,
  BASE_STRENGTHS,
  BASE_GROWTH,
  BASE_RELATIONSHIPS,
  BASE_WORK,
  GROUP_DESCRIPTIONS,
  MODIFIER_ASSERTIVE,
  MODIFIER_TURBULENT,
  MODIFIER_COOPERATIVE,
  MODIFIER_SELFDIRECTED,
} from "../data/content";

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 50;
const TEXT_W = A4_W - MARGIN * 2;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generatePDF(
  result: PersonalityResult
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);

  const typeName = TYPE_NAMES[result.typeCode] || "Unknown";
  const group = TYPE_GROUPS[result.typeCode] || "Unknown";
  const groupColor = GROUP_COLORS[group] || "#333333";
  const [cr, cg, cb] = hexToRgb(groupColor);
  const tagline = TYPE_TAGLINES[result.typeCode] || "";
  const displayName = result.name === "You" ? "" : result.name;
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Determine modifiers
  const atDim = result.dimensions.find((d) => d.dimension === "AT");
  const csDim = result.dimensions.find((d) => d.dimension === "CS");
  const isAssertive = atDim?.winner === "A";
  const isCooperative = csDim?.winner === "C";

  let y = 0;
  let page = doc.addPage([A4_W, A4_H]);
  let pageNum = 0;

  function newPage() {
    page = doc.addPage([A4_W, A4_H]);
    pageNum++;
    y = A4_H - MARGIN;
    return page;
  }

  function addFooter(p: typeof page, num: number) {
    if (num === 0) return; // no footer on cover
    const str = String(num);
    p.drawText(str, {
      x: (A4_W - helvetica.widthOfTextAtSize(str, 9)) / 2,
      y: 25,
      size: 9,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  function drawBody(text: string, font: PDFFont, size: number, leading: number) {
    const lines = wrapText(text, font, size, TEXT_W);
    for (const line of lines) {
      if (y < MARGIN + 20) {
        addFooter(page, pageNum);
        newPage();
      }
      page.drawText(line, {
        x: MARGIN,
        y,
        size,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= leading;
    }
  }

  function drawHeading(text: string, size: number) {
    if (y < MARGIN + 60) {
      addFooter(page, pageNum);
      newPage();
    }
    y -= 12;
    page.drawText(text, {
      x: MARGIN,
      y,
      size,
      font: helveticaBold,
      color: rgb(cr, cg, cb),
    });
    y -= size + 8;
  }

  function drawSubheading(text: string) {
    if (y < MARGIN + 40) {
      addFooter(page, pageNum);
      newPage();
    }
    y -= 6;
    page.drawText(text, {
      x: MARGIN,
      y,
      size: 13,
      font: helveticaBold,
      color: rgb(cr, cg, cb),
    });
    y -= 18;
  }

  // ========== PAGE 1: COVER ==========
  // Full-width header rectangle
  page.drawRectangle({
    x: 0,
    y: A4_H - 180,
    width: A4_W,
    height: 180,
    color: rgb(cr, cg, cb),
  });

  // Name
  if (displayName) {
    const nameW = helvetica.widthOfTextAtSize(displayName, 28);
    page.drawText(displayName, {
      x: (A4_W - nameW) / 2,
      y: A4_H - 80,
      size: 28,
      font: helvetica,
      color: rgb(1, 1, 1),
    });
  }

  // Type code
  const codeW = helveticaBold.widthOfTextAtSize(result.fullCode, 48);
  page.drawText(result.fullCode, {
    x: (A4_W - codeW) / 2,
    y: A4_H - 120,
    size: 48,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Type name
  const typeNameW = helveticaOblique.widthOfTextAtSize(typeName, 22);
  page.drawText(typeName, {
    x: (A4_W - typeNameW) / 2,
    y: A4_H - 155,
    size: 22,
    font: helveticaOblique,
    color: rgb(1, 1, 1),
  });

  // Group below header
  const groupW = helveticaBold.widthOfTextAtSize(group, 14);
  page.drawText(group, {
    x: (A4_W - groupW) / 2,
    y: A4_H - 210,
    size: 14,
    font: helveticaBold,
    color: rgb(cr, cg, cb),
  });

  // Tagline
  if (tagline) {
    const tagW = helveticaOblique.widthOfTextAtSize(tagline, 12);
    page.drawText(tagline, {
      x: (A4_W - tagW) / 2,
      y: A4_H - 240,
      size: 12,
      font: helveticaOblique,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Date
  const dateW = helvetica.widthOfTextAtSize(dateStr, 11);
  page.drawText(dateStr, {
    x: (A4_W - dateW) / 2,
    y: A4_H - 270,
    size: 11,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  });

  // ========== PAGE 2: YOUR PERSONALITY TYPE ==========
  newPage();
  drawHeading("Your Personality Type", 20);

  const subtitle = `${result.fullCode} \u2014 ${typeName}`;
  page.drawText(subtitle, {
    x: MARGIN,
    y,
    size: 14,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 24;

  drawSubheading("Overview");
  drawBody(BASE_OVERVIEW[result.typeCode] || "", helvetica, 11, 16);
  y -= 12;

  drawSubheading("Strengths");
  drawBody(BASE_STRENGTHS[result.typeCode] || "", helvetica, 11, 16);
  y -= 12;

  drawSubheading("Growth Edges");
  drawBody(BASE_GROWTH[result.typeCode] || "", helvetica, 11, 16);
  y -= 12;

  drawSubheading("In Relationships");
  drawBody(BASE_RELATIONSHIPS[result.typeCode] || "", helvetica, 11, 16);
  y -= 12;

  drawSubheading("At Work");
  drawBody(BASE_WORK[result.typeCode] || "", helvetica, 11, 16);

  // ========== PAGE 3: IDENTITY & ORIENTATION ==========
  addFooter(page, pageNum);
  newPage();
  drawHeading("Your Identity Style", 20);

  const identityLabel = isAssertive ? "Assertive" : "Turbulent";
  drawSubheading(identityLabel);
  drawBody(
    isAssertive ? MODIFIER_ASSERTIVE : MODIFIER_TURBULENT,
    helvetica,
    11,
    16
  );
  y -= 16;

  // Divider
  page.drawRectangle({
    x: MARGIN,
    y,
    width: TEXT_W,
    height: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  y -= 24;

  drawHeading("Your Orientation Style", 20);

  const orientLabel = isCooperative ? "Cooperative" : "Self-directed";
  drawSubheading(orientLabel);
  drawBody(
    isCooperative ? MODIFIER_COOPERATIVE : MODIFIER_SELFDIRECTED,
    helvetica,
    11,
    16
  );

  // ========== PAGE 4: DIMENSION PROFILE ==========
  addFooter(page, pageNum);
  newPage();
  drawHeading("Your Six Dimensions", 20);
  y -= 8;

  for (const dim of result.dimensions) {
    if (y < MARGIN + 80) {
      addFooter(page, pageNum);
      newPage();
    }

    const labels = DIMENSION_LABELS[dim.dimension];

    // Dimension name
    page.drawText(labels.name, {
      x: MARGIN,
      y,
      size: 12,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Percentage
    const pctStr = `${dim.winnerLabel} ${dim.percentage}%${dim.borderline ? " ~" : ""}`;
    const pctW = helvetica.widthOfTextAtSize(pctStr, 11);
    page.drawText(pctStr, {
      x: A4_W - MARGIN - pctW,
      y,
      size: 11,
      font: helvetica,
      color: rgb(cr, cg, cb),
    });
    y -= 16;

    // Pole labels
    page.drawText(labels.poleA, {
      x: MARGIN,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });
    const poleBW = helvetica.widthOfTextAtSize(labels.poleB, 9);
    page.drawText(labels.poleB, {
      x: MARGIN + 350 - poleBW,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });
    y -= 14;

    // Bar track
    const barX = MARGIN;
    const barW = 350;
    const barH = 18;

    // Background track
    page.drawRectangle({
      x: barX,
      y: y - barH,
      width: barW,
      height: barH,
      color: rgb(0.92, 0.92, 0.92),
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 0.5,
    });

    // Determine if winner is the left pole
    const winnerIsLeft =
      (dim.dimension === "EI" && dim.winner === "E") ||
      (dim.dimension === "SN" && dim.winner === "S") ||
      (dim.dimension === "TF" && dim.winner === "T") ||
      (dim.dimension === "JP" && dim.winner === "J") ||
      (dim.dimension === "AT" && dim.winner === "A") ||
      (dim.dimension === "CS" && dim.winner === "C");

    const fillW = (dim.percentage / 100) * barW;

    if (winnerIsLeft) {
      page.drawRectangle({
        x: barX,
        y: y - barH,
        width: fillW,
        height: barH,
        color: rgb(cr, cg, cb),
      });
    } else {
      page.drawRectangle({
        x: barX + barW - fillW,
        y: y - barH,
        width: fillW,
        height: barH,
        color: rgb(cr, cg, cb),
      });
    }

    y -= barH + 22;
  }

  // ========== GROUP CONTEXT ==========
  y -= 10;
  if (y < MARGIN + 100) {
    addFooter(page, pageNum);
    newPage();
  }
  drawHeading(`Your Group: ${group}`, 16);
  drawBody(GROUP_DESCRIPTIONS[group] || "", helvetica, 11, 16);

  // ========== CLOSING ==========
  y -= 20;
  if (y < MARGIN + 80) {
    addFooter(page, pageNum);
    newPage();
  }

  page.drawRectangle({
    x: MARGIN,
    y: y + 4,
    width: TEXT_W,
    height: 1,
    color: rgb(cr, cg, cb),
  });
  y -= 16;

  const nameRef = result.name === "You" ? "you" : result.name;
  const closingText = `As ${typeName === "Unknown" ? "a unique type" : `${typeName}`}, ${nameRef} bring${result.name === "You" ? "" : "s"} ${isAssertive ? "grounded confidence" : "driven sensitivity"} and ${isCooperative ? "collaborative strength" : "independent vision"} to everything ${result.name === "You" ? "you" : "they"} do. This is a rare and valuable combination.`;

  drawBody(closingText, timesRoman, 11, 16);

  addFooter(page, pageNum);

  return doc.save();
}
