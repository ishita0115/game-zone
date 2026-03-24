import {
  GameState,
  GRID_COLS,
  GRID_ROWS,
  LineDirection,
  PlayerState,
} from "./types";
import { PLAYER_COLORS } from "@/types/game";

export function createInitialState(
  playerCount: number,
  playerNames: string[]
): GameState {
  // horizontal lines: GRID_ROWS rows, each has GRID_COLS-1 lines
  const hLines: (number | null)[][] = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS - 1).fill(null)
  );
  // vertical lines: GRID_ROWS-1 rows, each has GRID_COLS lines
  const vLines: (number | null)[][] = Array.from({ length: GRID_ROWS - 1 }, () =>
    Array(GRID_COLS).fill(null)
  );
  // boxes: (GRID_ROWS-1) x (GRID_COLS-1)
  const boxes: (number | null)[][] = Array.from({ length: GRID_ROWS - 1 }, () =>
    Array(GRID_COLS - 1).fill(null)
  );

  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      name: playerNames[i] || `Player ${i + 1}`,
      color: PLAYER_COLORS[i],
      score: 0,
    });
  }

  return {
    hLines,
    vLines,
    boxes,
    players,
    currentPlayer: 0,
    playerCount,
    phase: "playing",
    winner: null,
    totalBoxes: (GRID_ROWS - 1) * (GRID_COLS - 1),
    lastMove: null,
  };
}

export function drawLine(
  state: GameState,
  row: number,
  col: number,
  dir: LineDirection
): GameState | null {
  if (state.phase !== "playing") return null;

  // Check if line already drawn
  if (dir === "h") {
    if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS - 1) return null;
    if (state.hLines[row][col] !== null) return null;
  } else {
    if (row < 0 || row >= GRID_ROWS - 1 || col < 0 || col >= GRID_COLS) return null;
    if (state.vLines[row][col] !== null) return null;
  }

  const newHLines = state.hLines.map((r) => [...r]);
  const newVLines = state.vLines.map((r) => [...r]);
  const newBoxes = state.boxes.map((r) => [...r]);
  const newPlayers = state.players.map((p) => ({ ...p }));

  if (dir === "h") {
    newHLines[row][col] = state.currentPlayer;
  } else {
    newVLines[row][col] = state.currentPlayer;
  }

  // Check if any boxes were completed
  let boxesCompleted = 0;

  if (dir === "h") {
    // A horizontal line at (row, col) can complete:
    // box above: top-left dot at (row-1, col)
    if (row > 0) {
      if (
        newHLines[row - 1][col] !== null &&
        newHLines[row][col] !== null &&
        newVLines[row - 1][col] !== null &&
        newVLines[row - 1][col + 1] !== null &&
        newBoxes[row - 1][col] === null
      ) {
        newBoxes[row - 1][col] = state.currentPlayer;
        newPlayers[state.currentPlayer].score++;
        boxesCompleted++;
      }
    }
    // box below: top-left dot at (row, col)
    if (row < GRID_ROWS - 1) {
      if (
        newHLines[row][col] !== null &&
        newHLines[row + 1][col] !== null &&
        newVLines[row][col] !== null &&
        newVLines[row][col + 1] !== null &&
        newBoxes[row][col] === null
      ) {
        newBoxes[row][col] = state.currentPlayer;
        newPlayers[state.currentPlayer].score++;
        boxesCompleted++;
      }
    }
  } else {
    // A vertical line at (row, col) can complete:
    // box to the left: top-left dot at (row, col-1)
    if (col > 0) {
      if (
        newHLines[row][col - 1] !== null &&
        newHLines[row + 1][col - 1] !== null &&
        newVLines[row][col - 1] !== null &&
        newVLines[row][col] !== null &&
        newBoxes[row][col - 1] === null
      ) {
        newBoxes[row][col - 1] = state.currentPlayer;
        newPlayers[state.currentPlayer].score++;
        boxesCompleted++;
      }
    }
    // box to the right: top-left dot at (row, col)
    if (col < GRID_COLS - 1) {
      if (
        newHLines[row][col] !== null &&
        newHLines[row + 1][col] !== null &&
        newVLines[row][col] !== null &&
        newVLines[row][col + 1] !== null &&
        newBoxes[row][col] === null
      ) {
        newBoxes[row][col] = state.currentPlayer;
        newPlayers[state.currentPlayer].score++;
        boxesCompleted++;
      }
    }
  }

  // Check if game is over
  const totalScored = newPlayers.reduce((s, p) => s + p.score, 0);
  const totalBoxes = (GRID_ROWS - 1) * (GRID_COLS - 1);
  const finished = totalScored >= totalBoxes;

  let winner: number | null = null;
  if (finished) {
    let maxScore = -1;
    for (let i = 0; i < newPlayers.length; i++) {
      if (newPlayers[i].score > maxScore) {
        maxScore = newPlayers[i].score;
        winner = i;
      }
    }
  }

  // If a box was completed, the same player goes again!
  const nextPlayer =
    boxesCompleted > 0
      ? state.currentPlayer
      : (state.currentPlayer + 1) % state.playerCount;

  return {
    ...state,
    hLines: newHLines,
    vLines: newVLines,
    boxes: newBoxes,
    players: newPlayers,
    currentPlayer: nextPlayer,
    phase: finished ? "finished" : "playing",
    winner,
    lastMove: { row, col, dir },
  };
}
