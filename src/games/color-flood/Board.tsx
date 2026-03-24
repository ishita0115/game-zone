"use client";

import { GameState, GRID_SIZE } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
}

const CELL_SIZE = 48;
const BOARD_PX = CELL_SIZE * GRID_SIZE;

export default function Board({ state }: BoardProps) {
  return (
    <div>
      <div
        className="relative overflow-hidden rounded-xl border-2 border-white/10"
        style={{ width: BOARD_PX, height: BOARD_PX }}
      >
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {state.board.flat().map((color, idx) => {
            const row = Math.floor(idx / GRID_SIZE);
            const col = idx % GRID_SIZE;
            const owner = state.ownership[row][col];
            const isStartCell = state.players.some(
              (p, i) => p.startRow === row && p.startCol === col && owner === i
            );

            return (
              <div
                key={`${row}-${col}`}
                className="relative transition-all duration-300"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: color,
                  opacity: owner !== null ? 1 : 0.5,
                  borderWidth: owner !== null ? 2 : 1,
                  borderColor:
                    owner !== null
                      ? `${PLAYER_COLORS[owner]}88`
                      : "rgba(255,255,255,0.05)",
                }}
              >
                {/* Player home base icon */}
                {isStartCell && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold"
                      style={{
                        backgroundColor: PLAYER_COLORS[owner!],
                        boxShadow: `0 0 10px ${PLAYER_COLORS[owner!]}`,
                      }}
                    >
                      {state.players.findIndex(
                        (p) => p.startRow === row && p.startCol === col
                      ) + 1}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
