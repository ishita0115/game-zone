export const GRID_ROWS = 5; // dots vertically
export const GRID_COLS = 6; // dots horizontally
// boxes = (GRID_ROWS-1) x (GRID_COLS-1)

export type LineDirection = "h" | "v"; // horizontal or vertical

export interface Line {
  row: number;
  col: number;
  dir: LineDirection;
  drawnBy: number | null; // playerIndex or null
}

export interface Box {
  row: number; // top-left dot row
  col: number; // top-left dot col
  owner: number | null;
}

export interface PlayerState {
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  // horizontal lines: (GRID_ROWS) x (GRID_COLS-1)
  hLines: (number | null)[][];
  // vertical lines: (GRID_ROWS-1) x (GRID_COLS)
  vLines: (number | null)[][];
  boxes: (number | null)[][];
  players: PlayerState[];
  currentPlayer: number;
  playerCount: number;
  phase: "setup" | "playing" | "finished";
  winner: number | null;
  totalBoxes: number;
  lastMove: { row: number; col: number; dir: LineDirection } | null;
}
