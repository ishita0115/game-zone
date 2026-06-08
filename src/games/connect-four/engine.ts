import { GameState, CellState, Player } from "./types";
import { PLAYER_COLORS } from "@/types/game";

export const ROWS = 6;
export const COLS = 7;

export function createInitialState(
  names: string[],
  prevPlayers?: Player[],
  round = 1
): GameState {
  return {
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null) as CellState[]),
    players: names.map((name, i) => ({
      name,
      color: PLAYER_COLORS[i],
      wins: prevPlayers?.[i]?.wins ?? 0,
    })),
    currentPlayer: 0,
    phase: "playing",
    winner: null,
    winCells: null,
    roundNumber: round,
    rows: ROWS,
    cols: COLS,
  };
}

export function getDropRow(state: GameState, col: number): number {
  for (let r = state.rows - 1; r >= 0; r--) {
    if (state.board[r][col] === null) return r;
  }
  return -1; // column full
}

export function dropToken(state: GameState, col: number): GameState | null {
  if (state.phase !== "playing") return null;
  const row = getDropRow(state, col);
  if (row === -1) return null;

  const board = state.board.map((r) => [...r]);
  board[row][col] = state.currentPlayer;

  const winCells = checkWin(board, row, col, state.currentPlayer, state.rows, state.cols);
  if (winCells) {
    const players = state.players.map((p, i) =>
      i === state.currentPlayer ? { ...p, wins: p.wins + 1 } : p
    );
    return { ...state, board, players, phase: "finished", winner: state.currentPlayer, winCells };
  }

  const isDraw = board[0].every((cell) => cell !== null);
  if (isDraw) {
    return { ...state, board, phase: "draw", winCells: null };
  }

  return {
    ...state,
    board,
    currentPlayer: (state.currentPlayer + 1) % state.players.length,
  };
}

function checkWin(
  board: CellState[][],
  row: number,
  col: number,
  player: number,
  rows: number,
  cols: number
): [number, number][] | null {
  const directions: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[row, col]];
    for (const sign of [1, -1] as const) {
      let r = row + dr * sign;
      let c = col + dc * sign;
      while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
        cells.push([r, c]);
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (cells.length >= 4) return cells;
  }
  return null;
}
