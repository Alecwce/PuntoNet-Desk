/**
 * Simple Sentiment Analysis "Fake" / Heuristic
 * Analyzes text for positive/negative keywords to determine "mood"
 */

export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "URGENT";

interface SentimentResult {
  score: number;
  sentiment: Sentiment;
  emoji: string;
  label: string;
  color: string;
}

const URGENT_KEYWORDS = [
  "urgente",
  "crítico",
  "inmediato",
  "ahora",
  "fuego",
  "caído",
  "roto",
  "error fatal",
  "producción",
];

const NEGATIVE_KEYWORDS = [
  "no funciona",
  "error",
  "fallo",
  "lento",
  "malo",
  "pésimo",
  "odio",
  "molesto",
  "triste",
  "imposible",
  "bug",
  "problema",
  "falla",
  "horrible",
  "desastre",
];

const POSITIVE_KEYWORDS = [
  "gracias",
  "excelente",
  "bueno",
  "rápido",
  "funciona",
  "genial",
  "resuelto",
  "felicidades",
  "mejor",
];

export const analyzeSentiment = (
  text: string | null | undefined
): SentimentResult => {
  if (!text)
    return {
      score: 0,
      sentiment: "NEUTRAL",
      emoji: "😐",
      label: "Neutral",
      color: "text-gray-400",
    };

  const lowerText = text.toLowerCase();

  // Check for Urgency first (Overrides sentiment)
  if (URGENT_KEYWORDS.some((k) => lowerText.includes(k))) {
    return {
      score: -2,
      sentiment: "URGENT",
      emoji: "🚨",
      label: "Urgente",
      color: "text-red-500 animate-pulse",
    }; // Animate urgent
  }

  let score = 0;

  NEGATIVE_KEYWORDS.forEach((k) => {
    if (lowerText.includes(k)) score--;
  });

  POSITIVE_KEYWORDS.forEach((k) => {
    if (lowerText.includes(k)) score++;
  });

  if (score > 0) {
    return {
      score,
      sentiment: "POSITIVE",
      emoji: "😃",
      label: "Positivo",
      color: "text-green-500",
    };
  } else if (score < 0) {
    return {
      score,
      sentiment: "NEGATIVE",
      emoji: "😡",
      label: "Negativo",
      color: "text-orange-500",
    };
  }

  return {
    score: 0,
    sentiment: "NEUTRAL",
    emoji: "😐",
    label: "Neutral",
    color: "text-gray-400",
  };
};
