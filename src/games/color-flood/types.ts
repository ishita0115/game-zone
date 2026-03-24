export const GRID_SIZE = 10;
export const FLOOD_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ec4899", // pink
] as const;

export type FloodColor = (typeof FLOOD_COLORS)[number];

export interface PlayerState {
  name: string;
  color: string;
  cellCount: number;
  startRow: number;
  startCol: number;
}

export interface GameState {
  board: FloodColor[][];
  ownership: (number | null)[][]; // playerIndex or null
  players: PlayerState[];
  currentPlayer: number;
  playerCount: number;
  gridSize: number;
  phase: "setup" | "playing" | "finished";
  winner: number | null;
  totalCells: number;
}
