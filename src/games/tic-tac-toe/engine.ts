import { CellValue, GameState, PlayerState, WIN_LINES } from "./types";
import { PLAYER_COLORS } from "@/types/game";

export function createInitialState(
  playerNames: string[],
  existingPlayers?: PlayerState[],
  roundNumber = 1
): GameState {
  const players: PlayerState[] = existingPlayers
    ? existingPlayers.map((p) => ({ ...p }))
    : [
        {
          name: playerNames[0] || "Player 1",
          color: PLAYER_COLORS[0],
          symbol: "✕",
          wins: 0,
        },
        {
          name: playerNames[1] || "Player 2",
          color: PLAYER_COLORS[1],
          symbol: "◯",
          wins: 0,
        },
      ];

  return {
    board: Array(9).fill(null),
    players,
    currentPlayer: (roundNumber - 1) % 2, // alternate who starts
    phase: "playing",
    winner: null,
    winLine: null,
    roundNumber,
  };
}

function checkWin(board: CellValue[]): { winner: number; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  return null;
}

export function makeMove(state: GameState, cellIndex: number): GameState | null {
  if (state.phase !== "playing") return null;
  if (state.board[cellIndex] !== null) return null;

  const newBoard = [...state.board];
  newBoard[cellIndex] = state.currentPlayer as CellValue;

  const result = checkWin(newBoard);

  if (result) {
    const newPlayers = state.players.map((p, i) =>
      i === result.winner ? { ...p, wins: p.wins + 1 } : { ...p }
    );
    return {
      ...state,
      board: newBoard,
      players: newPlayers,
      phase: "finished",
      winner: result.winner,
      winLine: result.line,
    };
  }

  // Check draw
  if (newBoard.every((c) => c !== null)) {
    return {
      ...state,
      board: newBoard,
      phase: "draw",
      winner: null,
      winLine: null,
    };
  }

  return {
    ...state,
    board: newBoard,
    currentPlayer: state.currentPlayer === 0 ? 1 : 0,
  };
}
