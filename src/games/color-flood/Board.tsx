"use client";

import { GameState } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
}

export default function Board({ state }: BoardProps) {
  const gs = state.gridSize;
  const cellSize = gs <= 10 ? 48 : 36;
  const boardPx = cellSize * gs;

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-white/10" style={{ width: boardPx, height: boardPx }}>
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${gs}, ${cellSize}px)`, gridTemplateRows: `repeat(${gs}, ${cellSize}px)` }}>
        {state.board.flat().map((color, idx) => {
          const row = Math.floor(idx / gs);
          const col = idx % gs;
          const owner = state.ownership[row][col];
          const isStart = state.players.some((p, i) => p.startRow === row && p.startCol === col && owner === i);

          return (
            <div key={`${row}-${col}`} className="relative transition-all duration-300"
              style={{ width: cellSize, height: cellSize, backgroundColor: color, opacity: owner !== null ? 1 : 0.5,
                borderWidth: owner !== null ? 2 : 1, borderColor: owner !== null ? `${PLAYER_COLORS[owner]}88` : "rgba(255,255,255,0.05)" }}>
              {isStart && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold"
                    style={{ backgroundColor: PLAYER_COLORS[owner!], boxShadow: `0 0 10px ${PLAYER_COLORS[owner!]}` }}>
                    {state.players.findIndex((p) => p.startRow === row && p.startCol === col) + 1}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
