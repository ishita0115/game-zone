import {
  Cell,
  DIFFICULTY_CONFIG,
  Direction,
  GameState,
  LaserSegment,
  LaserSource,
  MirrorType,
  PlayerState,
  Position,
} from "./types";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Difficulty, PLAYER_COLORS } from "@/types/game";

function getLaserSources(playerCount: number, gridSize: number): LaserSource[] {
  const mid = Math.floor(gridSize / 2);
  const sources: LaserSource[] = [
    { pos: { row: mid - 1, col: -1 }, direction: "right", playerIndex: 0 },
    { pos: { row: mid, col: gridSize }, direction: "left", playerIndex: 1 },
  ];
  if (playerCount >= 3) {
    sources.push({ pos: { row: -1, col: mid }, direction: "down", playerIndex: 2 });
  }
  return sources;
}

function placeGems(board: Cell[][], count: number, gridSize: number): void {
  const available: Position[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c].content.type === "empty") available.push({ row: r, col: c });
    }
  }
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  for (const pos of available.slice(0, count)) {
    board[pos.row][pos.col].content = { type: "gem", claimed: false, claimedBy: null };
  }
}

export function createInitialState(
  playerCount: number,
  playerNames: string[],
  difficulty: Difficulty = "medium"
): GameState {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const gridSize = cfg.gridSize;
  const board: Cell[][] = [];

  for (let r = 0; r < gridSize; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < gridSize; c++) {
      row.push({ row: r, col: c, content: { type: "empty" } });
    }
    board.push(row);
  }

  placeGems(board, cfg.gems, gridSize);

  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      name: playerNames[i] || `Player ${i + 1}`,
      score: 0,
      mirrorsLeft: cfg.mirrors,
      color: PLAYER_COLORS[i],
    });
  }

  const state: GameState = {
    board, players, currentPlayer: 0, playerCount, gridSize,
    laserSegments: [], selectedMirror: "/",
    phase: "playing", winner: null,
    totalGems: cfg.gems, claimedGems: 0, difficulty: difficulty,
  };

  state.laserSegments = traceAllLasers(state);
  return state;
}

function move(pos: Position, dir: Direction): Position {
  switch (dir) {
    case "up": return { row: pos.row - 1, col: pos.col };
    case "down": return { row: pos.row + 1, col: pos.col };
    case "left": return { row: pos.row, col: pos.col - 1 };
    case "right": return { row: pos.row, col: pos.col + 1 };
  }
}

function reflect(dir: Direction, mirror: MirrorType): Direction {
  if (mirror === "/") {
    switch (dir) { case "right": return "up"; case "left": return "down"; case "up": return "right"; case "down": return "left"; }
  } else {
    switch (dir) { case "right": return "down"; case "left": return "up"; case "up": return "left"; case "down": return "right"; }
  }
}

function inBounds(pos: Position, gs: number): boolean {
  return pos.row >= 0 && pos.row < gs && pos.col >= 0 && pos.col < gs;
}

function traceLaser(source: LaserSource, board: Cell[][], gs: number) {
  const segments: LaserSegment[] = [];
  const hitGems: Position[] = [];
  let pos: Position = { ...source.pos };
  let dir = source.direction;

  for (let step = 0; step < 200; step++) {
    const next = move(pos, dir);
    if (!inBounds(next, gs)) {
      segments.push({ from: pos, to: next, playerIndex: source.playerIndex });
      break;
    }
    segments.push({ from: pos, to: next, playerIndex: source.playerIndex });
    const cell = board[next.row][next.col];
    if (cell.content.type === "mirror") dir = reflect(dir, cell.content.mirrorType);
    else if (cell.content.type === "gem" && !cell.content.claimed) hitGems.push({ row: next.row, col: next.col });
    pos = next;
  }
  return { segments, hitGems };
}

function traceAllLasers(state: GameState): LaserSegment[] {
  const sources = getLaserSources(state.playerCount, state.gridSize);
  const all: LaserSegment[] = [];
  for (const src of sources) all.push(...traceLaser(src, state.board, state.gridSize).segments);
  return all;
}

function claimGems(state: GameState): GameState {
  const sources = getLaserSources(state.playerCount, state.gridSize);
  const newBoard = state.board.map((row) => row.map((cell) => ({ ...cell, content: { ...cell.content } })));
  const newPlayers = state.players.map((p) => ({ ...p }));
  let newClaimed = state.claimedGems;

  for (const source of sources) {
    for (const g of traceLaser(source, state.board, state.gridSize).hitGems) {
      const cell = newBoard[g.row][g.col];
      if (cell.content.type === "gem" && !cell.content.claimed) {
        cell.content = { type: "gem", claimed: true, claimedBy: source.playerIndex };
        newPlayers[source.playerIndex].score += 1;
        newClaimed++;
      }
    }
  }
  return { ...state, board: newBoard, players: newPlayers, claimedGems: newClaimed };
}

export function placeMirror(state: GameState, row: number, col: number): GameState | null {
  if (state.phase !== "playing") return null;
  const cell = state.board[row][col];
  if (cell.content.type !== "empty") return null;
  const player = state.players[state.currentPlayer];
  if (player.mirrorsLeft <= 0) return null;

  const newBoard = state.board.map((r) => r.map((c) => ({ ...c, content: { ...c.content } })));
  const newPlayers = state.players.map((p) => ({ ...p }));
  newBoard[row][col].content = { type: "mirror", mirrorType: state.selectedMirror, playerIndex: state.currentPlayer };
  newPlayers[state.currentPlayer].mirrorsLeft -= 1;

  let ns: GameState = { ...state, board: newBoard, players: newPlayers };
  ns.laserSegments = traceAllLasers(ns);
  ns = claimGems(ns);

  if (ns.claimedGems >= ns.totalGems || ns.players.every((p) => p.mirrorsLeft <= 0)) {
    ns.phase = "finished"; ns.winner = getWinner(ns);
  } else {
    ns.currentPlayer = (state.currentPlayer + 1) % state.playerCount;
  }
  return ns;
}

export function rotateMirror(state: GameState, row: number, col: number): GameState | null {
  if (state.phase !== "playing") return null;
  const cell = state.board[row][col];
  if (cell.content.type !== "mirror" || cell.content.playerIndex !== state.currentPlayer) return null;

  const newBoard = state.board.map((r) => r.map((c) => ({ ...c, content: { ...c.content } })));
  const cur = (cell.content as { mirrorType: MirrorType }).mirrorType;
  newBoard[row][col].content = { type: "mirror", mirrorType: cur === "/" ? "\\" : "/", playerIndex: state.currentPlayer };

  let ns: GameState = { ...state, board: newBoard };
  ns.laserSegments = traceAllLasers(ns);
  ns = claimGems(ns);

  if (ns.claimedGems >= ns.totalGems) {
    ns.phase = "finished"; ns.winner = getWinner(ns);
  } else {
    ns.currentPlayer = (state.currentPlayer + 1) % state.playerCount;
  }
  return ns;
}

function getWinner(state: GameState): number {
  let max = -1, w = 0;
  state.players.forEach((p, i) => { if (p.score > max) { max = p.score; w = i; } });
  return w;
}

export function getLaserSourcePositions(playerCount: number, gridSize: number): LaserSource[] {
  return getLaserSources(playerCount, gridSize);
}
