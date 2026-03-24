import {
  Cell,
  CellContent,
  Direction,
  GameState,
  GEM_COUNT,
  GRID_SIZE,
  LaserSegment,
  LaserSource,
  MIRRORS_PER_PLAYER,
  MirrorType,
  PlayerState,
  Position,
} from "./types";
import { PLAYER_COLORS } from "@/types/game";

function getLaserSources(playerCount: number): LaserSource[] {
  const sources: LaserSource[] = [
    { pos: { row: 3, col: -1 }, direction: "right", playerIndex: 0 },
    { pos: { row: 4, col: GRID_SIZE }, direction: "left", playerIndex: 1 },
  ];
  if (playerCount >= 3) {
    sources.push({
      pos: { row: -1, col: 4 },
      direction: "down",
      playerIndex: 2,
    });
  }
  return sources;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function placeGems(board: Cell[][], count: number): void {
  const rand = seededRandom(Date.now());
  const available: Position[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c].content.type === "empty") {
        available.push({ row: r, col: c });
      }
    }
  }

  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  const gemPositions = available.slice(0, count);
  for (const pos of gemPositions) {
    board[pos.row][pos.col].content = {
      type: "gem",
      claimed: false,
      claimedBy: null,
    };
  }
}

export function createInitialState(
  playerCount: number,
  playerNames: string[]
): GameState {
  const board: Cell[][] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push({ row: r, col: c, content: { type: "empty" } });
    }
    board.push(row);
  }

  placeGems(board, GEM_COUNT);

  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      name: playerNames[i] || `Player ${i + 1}`,
      score: 0,
      mirrorsLeft: MIRRORS_PER_PLAYER,
      color: PLAYER_COLORS[i],
    });
  }

  const state: GameState = {
    board,
    players,
    currentPlayer: 0,
    playerCount,
    gridSize: GRID_SIZE,
    laserSegments: [],
    selectedMirror: "/",
    phase: "playing",
    winner: null,
    totalGems: GEM_COUNT,
    claimedGems: 0,
  };

  state.laserSegments = traceAllLasers(state);
  return state;
}

function move(pos: Position, dir: Direction): Position {
  switch (dir) {
    case "up":
      return { row: pos.row - 1, col: pos.col };
    case "down":
      return { row: pos.row + 1, col: pos.col };
    case "left":
      return { row: pos.row, col: pos.col - 1 };
    case "right":
      return { row: pos.row, col: pos.col + 1 };
  }
}

function reflect(dir: Direction, mirror: MirrorType): Direction {
  if (mirror === "/") {
    switch (dir) {
      case "right":
        return "up";
      case "left":
        return "down";
      case "up":
        return "right";
      case "down":
        return "left";
    }
  } else {
    switch (dir) {
      case "right":
        return "down";
      case "left":
        return "up";
      case "up":
        return "left";
      case "down":
        return "right";
    }
  }
}

function inBounds(pos: Position): boolean {
  return pos.row >= 0 && pos.row < GRID_SIZE && pos.col >= 0 && pos.col < GRID_SIZE;
}

function traceLaser(
  source: LaserSource,
  board: Cell[][]
): { segments: LaserSegment[]; hitGems: Position[] } {
  const segments: LaserSegment[] = [];
  const hitGems: Position[] = [];
  let pos: Position = { ...source.pos };
  let dir = source.direction;
  const maxSteps = 100;

  for (let step = 0; step < maxSteps; step++) {
    const next = move(pos, dir);

    if (!inBounds(next)) {
      if (inBounds(pos)) {
        segments.push({ from: pos, to: next, playerIndex: source.playerIndex });
      } else {
        segments.push({ from: pos, to: next, playerIndex: source.playerIndex });
      }
      break;
    }

    segments.push({ from: pos, to: next, playerIndex: source.playerIndex });

    const cell = board[next.row][next.col];

    if (cell.content.type === "mirror") {
      dir = reflect(dir, cell.content.mirrorType);
    } else if (
      cell.content.type === "gem" &&
      !cell.content.claimed
    ) {
      hitGems.push({ row: next.row, col: next.col });
    }

    pos = next;
  }

  return { segments, hitGems };
}

function traceAllLasers(state: GameState): LaserSegment[] {
  const sources = getLaserSources(state.playerCount);
  const allSegments: LaserSegment[] = [];

  for (const source of sources) {
    const { segments } = traceLaser(source, state.board);
    allSegments.push(...segments);
  }

  return allSegments;
}

function claimGems(state: GameState): GameState {
  const sources = getLaserSources(state.playerCount);
  const newBoard = state.board.map((row) =>
    row.map((cell) => ({ ...cell, content: { ...cell.content } }))
  );
  const newPlayers = state.players.map((p) => ({ ...p }));
  let newClaimed = state.claimedGems;

  for (const source of sources) {
    const { hitGems } = traceLaser(source, state.board);
    for (const gemPos of hitGems) {
      const cell = newBoard[gemPos.row][gemPos.col];
      if (cell.content.type === "gem" && !cell.content.claimed) {
        cell.content = {
          type: "gem",
          claimed: true,
          claimedBy: source.playerIndex,
        };
        newPlayers[source.playerIndex].score += 1;
        newClaimed++;
      }
    }
  }

  return { ...state, board: newBoard, players: newPlayers, claimedGems: newClaimed };
}

export function placeMirror(
  state: GameState,
  row: number,
  col: number
): GameState | null {
  if (state.phase !== "playing") return null;

  const cell = state.board[row][col];
  if (cell.content.type !== "empty") return null;

  const player = state.players[state.currentPlayer];
  if (player.mirrorsLeft <= 0) return null;

  const newBoard = state.board.map((r) =>
    r.map((c) => ({ ...c, content: { ...c.content } }))
  );
  const newPlayers = state.players.map((p) => ({ ...p }));

  newBoard[row][col].content = {
    type: "mirror",
    mirrorType: state.selectedMirror,
    playerIndex: state.currentPlayer,
  };
  newPlayers[state.currentPlayer].mirrorsLeft -= 1;

  let newState: GameState = {
    ...state,
    board: newBoard,
    players: newPlayers,
  };

  newState.laserSegments = traceAllLasers(newState);
  newState = claimGems(newState);

  if (newState.claimedGems >= newState.totalGems || allMirrorsUsed(newState)) {
    newState.phase = "finished";
    newState.winner = getWinner(newState);
  } else {
    newState.currentPlayer =
      (state.currentPlayer + 1) % state.playerCount;
  }

  return newState;
}

export function rotateMirror(
  state: GameState,
  row: number,
  col: number
): GameState | null {
  if (state.phase !== "playing") return null;

  const cell = state.board[row][col];
  if (
    cell.content.type !== "mirror" ||
    cell.content.playerIndex !== state.currentPlayer
  ) {
    return null;
  }

  const newBoard = state.board.map((r) =>
    r.map((c) => ({ ...c, content: { ...c.content } }))
  );

  const currentMirror = (cell.content as { mirrorType: MirrorType }).mirrorType;
  newBoard[row][col].content = {
    type: "mirror",
    mirrorType: currentMirror === "/" ? "\\" : "/",
    playerIndex: state.currentPlayer,
  };

  let newState: GameState = { ...state, board: newBoard };
  newState.laserSegments = traceAllLasers(newState);
  newState = claimGems(newState);

  if (newState.claimedGems >= newState.totalGems) {
    newState.phase = "finished";
    newState.winner = getWinner(newState);
  } else {
    newState.currentPlayer =
      (state.currentPlayer + 1) % state.playerCount;
  }

  return newState;
}

function allMirrorsUsed(state: GameState): boolean {
  return state.players.every((p) => p.mirrorsLeft <= 0);
}

function getWinner(state: GameState): number {
  let maxScore = -1;
  let winner = 0;
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].score > maxScore) {
      maxScore = state.players[i].score;
      winner = i;
    }
  }
  return winner;
}

export function getLaserSourcePositions(playerCount: number): LaserSource[] {
  return getLaserSources(playerCount);
}
