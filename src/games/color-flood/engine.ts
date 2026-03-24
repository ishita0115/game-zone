import { DIFFICULTY_CONFIG, FloodColor, FLOOD_COLORS, GameState, PlayerState } from "./types";
import { Difficulty, PLAYER_COLORS } from "@/types/game";

function getStartPositions(playerCount: number, gs: number) {
  const last = gs - 1;
  return [{ row: 0, col: 0 }, { row: last, col: last }, { row: last, col: 0 }].slice(0, playerCount);
}

function randomBoard(gs: number): FloodColor[][] {
  return Array.from({ length: gs }, () =>
    Array.from({ length: gs }, () => FLOOD_COLORS[Math.floor(Math.random() * FLOOD_COLORS.length)])
  );
}

export function createInitialState(playerCount: number, playerNames: string[], difficulty: Difficulty = "medium"): GameState {
  const gs = DIFFICULTY_CONFIG[difficulty].gridSize;
  const board = randomBoard(gs);
  const ownership: (number | null)[][] = Array.from({ length: gs }, () => Array(gs).fill(null));
  const starts = getStartPositions(playerCount, gs);
  const players: PlayerState[] = [];
  const usedColors = new Set<FloodColor>();

  for (let i = 0; i < playerCount; i++) {
    let color = board[starts[i].row][starts[i].col];
    if (usedColors.has(color)) {
      for (const c of FLOOD_COLORS) { if (!usedColors.has(c)) { color = c; board[starts[i].row][starts[i].col] = c; break; } }
    }
    usedColors.add(color);
    ownership[starts[i].row][starts[i].col] = i;
    players.push({ name: playerNames[i] || `Player ${i + 1}`, color: PLAYER_COLORS[i], cellCount: 1, startRow: starts[i].row, startCol: starts[i].col });
  }

  return { board, ownership, players, currentPlayer: 0, playerCount, gridSize: gs, phase: "playing", winner: null, totalCells: gs * gs, difficulty };
}

function floodFill(ownership: (number | null)[][], board: FloodColor[][], playerIndex: number, newColor: FloodColor, gs: number) {
  const newBoard = board.map((r) => [...r]);
  const newOwnership = ownership.map((r) => [...r]);
  const queue: [number, number][] = [];
  const visited = Array.from({ length: gs }, () => Array(gs).fill(false));

  for (let r = 0; r < gs; r++) for (let c = 0; c < gs; c++) {
    if (newOwnership[r][c] === playerIndex) { newBoard[r][c] = newColor; queue.push([r, c]); visited[r][c] = true; }
  }

  let captured = 0;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = cr + dr, nc = cc + dc;
      if (nr >= 0 && nr < gs && nc >= 0 && nc < gs && !visited[nr][nc] && newOwnership[nr][nc] === null && newBoard[nr][nc] === newColor) {
        visited[nr][nc] = true; newOwnership[nr][nc] = playerIndex; captured++; queue.push([nr, nc]);
      }
    }
  }
  return { newBoard, newOwnership, captured };
}

export function pickColor(state: GameState, color: FloodColor): GameState | null {
  if (state.phase !== "playing") return null;
  const gs = state.gridSize;
  const curColor = state.board[state.players[state.currentPlayer].startRow][state.players[state.currentPlayer].startCol];
  if (color === curColor) return null;
  for (let i = 0; i < state.playerCount; i++) {
    if (i === state.currentPlayer) continue;
    if (color === state.board[state.players[i].startRow][state.players[i].startCol]) return null;
  }

  const { newBoard, newOwnership, captured } = floodFill(state.ownership, state.board, state.currentPlayer, color, gs);
  const newPlayers = state.players.map((p, i) => i === state.currentPlayer ? { ...p, cellCount: p.cellCount + captured } : { ...p });

  let totalOwned = 0;
  for (let r = 0; r < gs; r++) for (let c = 0; c < gs; c++) { if (newOwnership[r][c] !== null) totalOwned++; }
  const finished = totalOwned >= state.totalCells;
  let winner: number | null = null;
  if (finished) { let max = -1; newPlayers.forEach((p, i) => { if (p.cellCount > max) { max = p.cellCount; winner = i; } }); }

  return { ...state, board: newBoard, ownership: newOwnership, players: newPlayers, currentPlayer: (state.currentPlayer + 1) % state.playerCount, phase: finished ? "finished" : "playing", winner };
}

export function getAvailableColors(state: GameState): FloodColor[] {
  const cur = state.board[state.players[state.currentPlayer].startRow][state.players[state.currentPlayer].startCol];
  const others = new Set<FloodColor>();
  for (let i = 0; i < state.playerCount; i++) { if (i !== state.currentPlayer) others.add(state.board[state.players[i].startRow][state.players[i].startCol]); }
  return FLOOD_COLORS.filter((c) => c !== cur && !others.has(c));
}
