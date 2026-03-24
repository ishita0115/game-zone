import { DIFFICULTY_CONFIG, GameState, LineDirection, PlayerState } from "./types";
import { Difficulty, PLAYER_COLORS } from "@/types/game";

export function createInitialState(playerCount: number, playerNames: string[], difficulty: Difficulty = "medium"): GameState {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const rows = cfg.rows;
  const cols = cfg.cols;

  const hLines: (number | null)[][] = Array.from({ length: rows }, () => Array(cols - 1).fill(null));
  const vLines: (number | null)[][] = Array.from({ length: rows - 1 }, () => Array(cols).fill(null));
  const boxes: (number | null)[][] = Array.from({ length: rows - 1 }, () => Array(cols - 1).fill(null));

  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({ name: playerNames[i] || `Player ${i + 1}`, color: PLAYER_COLORS[i], score: 0 });
  }

  return { hLines, vLines, boxes, players, currentPlayer: 0, playerCount, gridRows: rows, gridCols: cols, phase: "playing", winner: null, totalBoxes: (rows - 1) * (cols - 1), lastMove: null, difficulty };
}

export function drawLine(state: GameState, row: number, col: number, dir: LineDirection): GameState | null {
  if (state.phase !== "playing") return null;
  const { gridRows, gridCols } = state;

  if (dir === "h") {
    if (row < 0 || row >= gridRows || col < 0 || col >= gridCols - 1) return null;
    if (state.hLines[row][col] !== null) return null;
  } else {
    if (row < 0 || row >= gridRows - 1 || col < 0 || col >= gridCols) return null;
    if (state.vLines[row][col] !== null) return null;
  }

  const newH = state.hLines.map((r) => [...r]);
  const newV = state.vLines.map((r) => [...r]);
  const newB = state.boxes.map((r) => [...r]);
  const newP = state.players.map((p) => ({ ...p }));

  if (dir === "h") newH[row][col] = state.currentPlayer;
  else newV[row][col] = state.currentPlayer;

  let completed = 0;
  if (dir === "h") {
    if (row > 0 && newH[row - 1][col] !== null && newH[row][col] !== null && newV[row - 1][col] !== null && newV[row - 1][col + 1] !== null && newB[row - 1][col] === null) {
      newB[row - 1][col] = state.currentPlayer; newP[state.currentPlayer].score++; completed++;
    }
    if (row < gridRows - 1 && newH[row][col] !== null && newH[row + 1][col] !== null && newV[row][col] !== null && newV[row][col + 1] !== null && newB[row][col] === null) {
      newB[row][col] = state.currentPlayer; newP[state.currentPlayer].score++; completed++;
    }
  } else {
    if (col > 0 && newH[row][col - 1] !== null && newH[row + 1][col - 1] !== null && newV[row][col - 1] !== null && newV[row][col] !== null && newB[row][col - 1] === null) {
      newB[row][col - 1] = state.currentPlayer; newP[state.currentPlayer].score++; completed++;
    }
    if (col < gridCols - 1 && newH[row][col] !== null && newH[row + 1][col] !== null && newV[row][col] !== null && newV[row][col + 1] !== null && newB[row][col] === null) {
      newB[row][col] = state.currentPlayer; newP[state.currentPlayer].score++; completed++;
    }
  }

  const totalScored = newP.reduce((s, p) => s + p.score, 0);
  const finished = totalScored >= state.totalBoxes;
  let winner: number | null = null;
  if (finished) { let max = -1; newP.forEach((p, i) => { if (p.score > max) { max = p.score; winner = i; } }); }

  return { ...state, hLines: newH, vLines: newV, boxes: newB, players: newP, currentPlayer: completed > 0 ? state.currentPlayer : (state.currentPlayer + 1) % state.playerCount, phase: finished ? "finished" : "playing", winner, lastMove: { row, col, dir } };
}
