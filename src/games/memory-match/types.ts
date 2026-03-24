import { Difficulty } from "@/types/game";

export const CARD_EMOJIS = [
  "🐶", "🐱", "🐸", "🦊", "🐼", "🐨",
  "🦁", "🐯", "🐮", "🐷", "🐵", "🐔",
  "🦄", "🐙", "🦋", "🐢",
];

export interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export interface PlayerState {
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  cards: Card[];
  players: PlayerState[];
  currentPlayer: number;
  playerCount: number;
  flippedCards: number[];
  phase: "setup" | "playing" | "checking" | "finished";
  winner: number | null;
  totalPairs: number;
  matchedPairs: number;
  gridCols: number;
  difficulty: Difficulty;
}

export const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, cols: 4 },
  medium: { pairs: 12, cols: 6 },
  hard: { pairs: 16, cols: 8 },
} as const;

export const GRID_COLS = 6;
export const TOTAL_PAIRS = 12;
