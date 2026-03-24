import { Difficulty } from "@/types/game";

export type CellValue = null | 0 | 1;

export interface PlayerState {
  name: string;
  color: string;
  symbol: string;
  wins: number;
}

export interface GameState {
  board: CellValue[];
  players: PlayerState[];
  currentPlayer: number;
  phase: "playing" | "finished" | "draw";
  winner: number | null;
  winLine: number[] | null;
  roundNumber: number;
  boardSize: number;
  winLength: number;
  difficulty: Difficulty;
}

export function getWinLines(size: number, winLen: number): number[][] {
  const lines: number[][] = [];
  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      lines.push(Array.from({ length: winLen }, (_, i) => r * size + c + i));
    }
  }
  // Cols
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLen; r++) {
      lines.push(Array.from({ length: winLen }, (_, i) => (r + i) * size + c));
    }
  }
  // Diag ↘
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      lines.push(Array.from({ length: winLen }, (_, i) => (r + i) * size + c + i));
    }
  }
  // Diag ↗
  for (let r = winLen - 1; r < size; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      lines.push(Array.from({ length: winLen }, (_, i) => (r - i) * size + c + i));
    }
  }
  return lines;
}

export const DIFFICULTY_CONFIG = {
  easy: { size: 3, winLen: 3 },
  medium: { size: 4, winLen: 3 },
  hard: { size: 5, winLen: 4 },
} as const;

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
