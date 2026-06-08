"use client";

import { useState } from "react";
import { GameState } from "./types";
import { getDropRow } from "./engine";

interface BoardProps {
  state: GameState;
  onColClick: (col: number) => void;
}

const CELL = 64;

export default function Board({ state, onColClick }: BoardProps) {
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const currentColor = state.players[state.currentPlayer]?.color ?? "#fff";

  return (
    <div className="select-none">
      {/* Drop-arrow row */}
      <div
        className="mb-1 grid"
        style={{ gridTemplateColumns: `repeat(${state.cols}, ${CELL}px)` }}
      >
        {Array.from({ length: state.cols }).map((_, col) => {
          const canDrop = state.phase === "playing" && getDropRow(state, col) !== -1;
          const active = hoverCol === col && canDrop;
          return (
            <button
              key={col}
              onMouseEnter={() => setHoverCol(col)}
              onMouseLeave={() => setHoverCol(null)}
              onClick={() => canDrop && onColClick(col)}
              disabled={!canDrop}
              style={{ width: CELL, height: 32 }}
              className={`flex items-center justify-center rounded-t-lg transition-colors duration-150 ${active ? "bg-white/10" : ""}`}
            >
              {active && (
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: currentColor, boxShadow: `0 0 10px ${currentColor}` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Board */}
      <div
        className="rounded-2xl p-3 shadow-2xl"
        style={{ background: "linear-gradient(135deg,#0d1b5e,#0a1240)" }}
      >
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${state.cols}, ${CELL - 10}px)` }}
        >
          {state.board.flatMap((rowArr, ri) =>
            rowArr.map((cell, ci) => {
              const isWin = state.winCells?.some(([r, c]) => r === ri && c === ci) ?? false;
              const isPreview =
                hoverCol === ci &&
                getDropRow(state, ci) === ri &&
                cell === null &&
                state.phase === "playing";
              const playerColor = cell !== null ? state.players[cell].color : undefined;

              return (
                <div
                  key={`${ri}-${ci}`}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: CELL - 10,
                    height: CELL - 10,
                    backgroundColor: playerColor
                      ? playerColor
                      : isPreview
                      ? `${currentColor}35`
                      : "rgba(4,8,30,0.85)",
                    boxShadow: isWin
                      ? `0 0 24px ${playerColor}, 0 0 48px ${playerColor}60`
                      : playerColor
                      ? `inset 0 -4px 8px rgba(0,0,0,0.35), 0 0 10px ${playerColor}50`
                      : "inset 0 -4px 8px rgba(0,0,0,0.3)",
                    transform: isWin ? "scale(1.12)" : "scale(1)",
                    border: isWin ? `2px solid ${playerColor}` : "2px solid transparent",
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
