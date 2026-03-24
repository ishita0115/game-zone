import { CellValue, DIFFICULTY_CONFIG, GameState, getWinLines, PlayerState } from "./types";
import { Difficulty, PLAYER_COLORS } from "@/types/game";

export function createInitialState(playerNames: string[], existingPlayers?: PlayerState[], roundNumber = 1, difficulty: Difficulty = "easy"): GameState {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const players: PlayerState[] = existingPlayers
    ? existingPlayers.map((p) => ({ ...p }))
    : [
        { name: playerNames[0] || "Player 1", color: PLAYER_COLORS[0], symbol: "✕", wins: 0 },
        { name: playerNames[1] || "Player 2", color: PLAYER_COLORS[1], symbol: "◯", wins: 0 },
      ];

  return { board: Array(cfg.size * cfg.size).fill(null), players, currentPlayer: (roundNumber - 1) % 2, phase: "playing", winner: null, winLine: null, roundNumber, boardSize: cfg.size, winLength: cfg.winLen, difficulty };
}

export function makeMove(state: GameState, cellIndex: number): GameState | null {
  if (state.phase !== "playing" || state.board[cellIndex] !== null) return null;

  const newBoard = [...state.board];
  newBoard[cellIndex] = state.currentPlayer as CellValue;

  const lines = getWinLines(state.boardSize, state.winLength);
  for (const line of lines) {
    if (line.every((i) => newBoard[i] === state.currentPlayer)) {
      const newPlayers = state.players.map((p, i) => i === state.currentPlayer ? { ...p, wins: p.wins + 1 } : { ...p });
      return { ...state, board: newBoard, players: newPlayers, phase: "finished", winner: state.currentPlayer, winLine: line };
    }
  }

  if (newBoard.every((c) => c !== null)) return { ...state, board: newBoard, phase: "draw", winner: null, winLine: null };

  return { ...state, board: newBoard, currentPlayer: state.currentPlayer === 0 ? 1 : 0 };
}
