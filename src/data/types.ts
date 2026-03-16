export const TYPE_NAMES: Record<string, string> = {
  INTJ: "The Architect",
  INTP: "The Logician",
  ENTJ: "The Commander",
  ENTP: "The Debater",
  INFJ: "The Advocate",
  INFP: "The Mediator",
  ENFJ: "The Protagonist",
  ENFP: "The Campaigner",
  ISTJ: "The Logistician",
  ISFJ: "The Defender",
  ESTJ: "The Executive",
  ESFJ: "The Consul",
  ISTP: "The Virtuoso",
  ISFP: "The Adventurer",
  ESTP: "The Entrepreneur",
  ESFP: "The Entertainer",
};

export const TYPE_TAGLINES: Record<string, string> = {
  INTJ: "Every system has a flaw \u2014 and I already found it.",
  INTP: "Let me think about that for approximately three years.",
  ENTJ: "Here is the plan. There is no plan B.",
  ENTP: "I\u2019m not arguing \u2014 I\u2019m just explaining why I\u2019m right.",
  INFJ: "I see you more clearly than you see yourself.",
  INFP: "There is goodness in everyone if you look the right way.",
  ENFJ: "I believe in you more than you believe in yourself.",
  ENFP: "Everything is connected \u2014 let me show you how.",
  ISTJ: "It works because it was done properly.",
  ISFJ: "If I can help, I will. That is simply who I am.",
  ESTJ: "Standards exist for a reason. Let us apply them.",
  ESFJ: "Everyone should feel welcome here. That is my job.",
  ISTP: "Show me how it works and I will show you how to make it better.",
  ISFP: "Beauty is real and the present moment is where it lives.",
  ESTP: "Opportunity does not wait. Neither do I.",
  ESFP: "Life is too short not to enjoy it properly.",
};

export const TYPE_GROUPS: Record<string, string> = {
  INTJ: "Analysts",
  INTP: "Analysts",
  ENTJ: "Analysts",
  ENTP: "Analysts",
  INFJ: "Diplomats",
  INFP: "Diplomats",
  ENFJ: "Diplomats",
  ENFP: "Diplomats",
  ISTJ: "Sentinels",
  ISFJ: "Sentinels",
  ESTJ: "Sentinels",
  ESFJ: "Sentinels",
  ISTP: "Explorers",
  ISFP: "Explorers",
  ESTP: "Explorers",
  ESFP: "Explorers",
};

export const GROUP_COLORS: Record<string, string> = {
  Analysts: "#5B2D8E",
  Diplomats: "#00695C",
  Sentinels: "#1565C0",
  Explorers: "#E65100",
};

export const VALID_MBTI_CODES = Object.keys(TYPE_NAMES);

export const DIMENSION_LABELS: Record<string, { name: string; poleA: string; poleB: string }> = {
  EI: { name: "Mind", poleA: "Extraversion", poleB: "Introversion" },
  SN: { name: "Energy", poleA: "Sensing", poleB: "Intuition" },
  TF: { name: "Nature", poleA: "Thinking", poleB: "Feeling" },
  JP: { name: "Tactics", poleA: "Judging", poleB: "Perceiving" },
  AT: { name: "Identity", poleA: "Assertive", poleB: "Turbulent" },
  CS: { name: "Orientation", poleA: "Cooperative", poleB: "Self-directed" },
};
