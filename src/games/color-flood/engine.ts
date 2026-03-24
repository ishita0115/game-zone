import {
  FloodColor,
  FLOOD_COLORS,
  GameState,
  GRID_SIZE,
  PlayerState,
} from "./types";
import { PLAYER_COLORS } from "@/types/game";

function getStartPositions(playerCount: number): { row: number; col: number }[] {
  const last = GRID_SIZE - 1;
  const positions = [
    { row: 0, col: 0 },
    { row: last, col: last },
    { row: last, col: 0 },
  ];
  return positions.slice(0, playerCount);
}

function randomBoard(): FloodColor[][] {
  const board: FloodColor[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: FloodColor[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push(FLOOD_COLORS[Math.floor(Math.random() * FLOOD_COLORS.length)]);
    }
    board.push(row);
  }
  return board;
}

export function createInitialState(
  playerCount: number,
  playerNames: string[]
): GameState {
  const board = randomBoard();
  const ownership: (number | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );

  const starts = getStartPositions(playerCount);
  const players: PlayerState[] = [];

  // Ensure each start corner has a unique color
  const usedColors = new Set<FloodColor>();
  for (let i = 0; i < playerCount; i++) {
    let color = board[starts[i].row][starts[i].col];
    if (usedColors.has(color)) {
      // Pick a different color
      for (const c of FLOOD_COLORS) {
        if (!usedColors.has(c)) {
          color = c;
          board[starts[i].row][starts[i].col] = c;
          break;
        }
      }
    }
    usedColors.add(color);

    ownership[starts[i].row][starts[i].col] = i;
    players.push({
      name: playerNames[i] || `Player ${i + 1}`,
      color: PLAYER_COLORS[i],
      cellCount: 1,
      startRow: starts[i].row,
      startCol: starts[i].col,
    });
  }

  return {
    board,
    ownership,
    players,
    currentPlayer: 0,
    playerCount,
    gridSize: GRID_SIZE,
    phase: "playing",
    winner: null,
    totalCells: GRID_SIZE * GRID_SIZE,
  };
}

function floodFill(
  ownership: (number | null)[][],
  board: FloodColor[][],
  playerIndex: number,
  newColor: FloodColor
): { newBoard: FloodColor[][]; newOwnership: (number | null)[][]; captured: number } {
  const newBoard = board.map((r) => [...r]);
  const newOwnership = ownership.map((r) => [...r]);

  // Find all cells owned by this player
  const queue: [number, number][] = [];
  const visited = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(false)
  );

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newOwnership[r][c] === playerIndex) {
        newBoard[r][c] = newColor;
        queue.push([r, c]);
        visited[r][c] = true;
      }
    }
  }

  // BFS to absorb adjacent cells with the chosen color
  let captured = 0;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (
        nr >= 0 && nr < GRID_SIZE &&
        nc >= 0 && nc < GRID_SIZE &&
        !visited[nr][nc] &&
        newOwnership[nr][nc] === null &&
        newBoard[nr][nc] === newColor
      ) {
        visited[nr][nc] = true;
        newOwnership[nr][nc] = playerIndex;
        captured++;
        queue.push([nr, nc]);
      }
    }
  }

  return { newBoard, newOwnership, captured };
}

export function pickColor(
  state: GameState,
  color: FloodColor
): GameState | null {
  if (state.phase !== "playing") return null;

  // Can't pick a color that another player currently owns at their region
  const currentPlayerColor = state.board[state.players[state.currentPlayer].startRow][state.players[state.currentPlayer].startCol];
  if (color === currentPlayerColor) return null;

  // Can't pick a color that is the current color of another player's region
  for (let i = 0; i < state.playerCount; i++) {
    if (i === state.currentPlayer) continue;
    const otherColor = state.board[state.players[i].startRow][state.players[i].startCol];
    if (color === otherColor) return null;
  }

  const { newBoard, newOwnership, captured } = floodFill(
    state.ownership,
    state.board,
    state.currentPlayer,
    color
  );

  const newPlayers = state.players.map((p, i) => {
    if (i === state.currentPlayer) {
      return { ...p, cellCount: p.cellCount + captured };
    }
    return { ...p };
  });

  // Check if game is over (all cells owned)
  let totalOwned = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newOwnership[r][c] !== null) totalOwned++;
    }
  }

  const finished = totalOwned >= state.totalCells;
  let winner: number | null = null;

  if (finished) {
    let maxCells = -1;
    for (let i = 0; i < newPlayers.length; i++) {
      if (newPlayers[i].cellCount > maxCells) {
        maxCells = newPlayers[i].cellCount;
        winner = i;
      }
    }
  }

  return {
    ...state,
    board: newBoard,
    ownership: newOwnership,
    players: newPlayers,
    currentPlayer: (state.currentPlayer + 1) % state.playerCount,
    phase: finished ? "finished" : "playing",
    winner,
  };
}

export function getAvailableColors(state: GameState): FloodColor[] {
  const currentColor =
    state.board[state.players[state.currentPlayer].startRow][
      state.players[state.currentPlayer].startCol
    ];

  const otherPlayerColors = new Set<FloodColor>();
  for (let i = 0; i < state.playerCount; i++) {
    if (i === state.currentPlayer) continue;
    otherPlayerColors.add(
      state.board[state.players[i].startRow][state.players[i].startCol]
    );
  }

  return FLOOD_COLORS.filter(
    (c) => c !== currentColor && !otherPlayerColors.has(c)
  );
}
