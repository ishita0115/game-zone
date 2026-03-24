import { Difficulty } from "@/types/game";

export type LineDirection = "h" | "v";

export interface Line {
  row: number;
  col: number;
  dir: LineDirection;
  drawnBy: number | null;
}

export interface Box {
  row: number;
  col: number;
  owner: number | null;
}

export interface PlayerState {
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  hLines: (number | null)[][];
  vLines: (number | null)[][];
  boxes: (number | null)[][];
  players: PlayerState[];
  currentPlayer: number;
  playerCount: number;
  gridRows: number;
  gridCols: number;
  phase: "setup" | "playing" | "finished";
  winner: number | null;
  totalBoxes: number;
  lastMove: { row: number; col: number; dir: LineDirection } | null;
  difficulty: Difficulty;
}

export const DIFFICULTY_CONFIG = {
  easy: { rows: 4, cols: 4 },
  medium: { rows: 5, cols: 6 },
  hard: { rows: 6, cols: 8 },
} as const;

export const GRID_ROWS = 5;
export const GRID_COLS = 6;
