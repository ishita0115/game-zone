export type Direction = "up" | "down" | "left" | "right";
export type MirrorType = "/" | "\\";

export interface Position {
  row: number;
  col: number;
}

export interface LaserSource {
  pos: Position;
  direction: Direction;
  playerIndex: number;
}

export type CellContent =
  | { type: "empty" }
  | { type: "mirror"; mirrorType: MirrorType; playerIndex: number }
  | { type: "gem"; claimed: boolean; claimedBy: number | null }
  | { type: "laser-source"; playerIndex: number; direction: Direction };

export interface Cell {
  row: number;
  col: number;
  content: CellContent;
}

export interface LaserSegment {
  from: Position;
  to: Position;
  playerIndex: number;
}

export interface PlayerState {
  name: string;
  score: number;
  mirrorsLeft: number;
  color: string;
}

export interface GameState {
  board: Cell[][];
  players: PlayerState[];
  currentPlayer: number;
  playerCount: number;
  gridSize: number;
  laserSegments: LaserSegment[];
  selectedMirror: MirrorType;
  phase: "setup" | "playing" | "finished";
  winner: number | null;
  totalGems: number;
  claimedGems: number;
}

export const GRID_SIZE = 8;
export const MIRRORS_PER_PLAYER = 12;
export const GEM_COUNT = 8;
