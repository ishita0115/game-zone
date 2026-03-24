export const CARD_EMOJIS = [
  "🐶", "🐱", "🐸", "🦊", "🐼", "🐨",
  "🦁", "🐯", "🐮", "🐷", "🐵", "🐔",
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
  flippedCards: number[]; // indices of currently flipped cards (0-2)
  phase: "setup" | "playing" | "checking" | "finished";
  winner: number | null;
  totalPairs: number;
  matchedPairs: number;
}

export const GRID_COLS = 6;
export const TOTAL_PAIRS = 12; // 24 cards = 12 pairs
