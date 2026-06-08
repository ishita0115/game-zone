export type CellState = number | null; // player index
export type Phase = "playing" | "finished" | "draw";

export interface Player {
  name: string;
  color: string;
  wins: number;
}

export interface GameState {
  board: CellState[][];   // [row][col], row 0 = top
  players: Player[];
  currentPlayer: number;
  phase: Phase;
  winner: number | null;
  winCells: [number, number][] | null;
  roundNumber: number;
  rows: number;
  cols: number;
}
