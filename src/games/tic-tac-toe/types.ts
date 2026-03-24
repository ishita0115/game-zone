export type CellValue = null | 0 | 1; // null=empty, 0=player1, 1=player2

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
  winLine: number[] | null; // indices of winning 3 cells
  roundNumber: number;
}

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
];
