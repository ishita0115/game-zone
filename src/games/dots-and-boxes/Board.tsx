"use client";

import { GameState, GRID_COLS, GRID_ROWS, LineDirection } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
  onLineClick: (row: number, col: number, dir: LineDirection) => void;
}

const DOT_SIZE = 12;
const LINE_LENGTH = 60;
const LINE_THICKNESS = 6;
const GAP = LINE_LENGTH + DOT_SIZE;

export default function Board({ state, onLineClick }: BoardProps) {
  const boardW = (GRID_COLS - 1) * GAP + DOT_SIZE;
  const boardH = (GRID_ROWS - 1) * GAP + DOT_SIZE;
  const currentColor = PLAYER_COLORS[state.currentPlayer];

  return (
    <div>
      <div
        className="relative"
        style={{ width: boardW, height: boardH, margin: "20px" }}
      >
        {/* ===== BOXES (filled when claimed) ===== */}
        {state.boxes.map((row, r) =>
          row.map((owner, c) => (
            <div
              key={`box-${r}-${c}`}
              className="absolute rounded-sm transition-all duration-300"
              style={{
                left: c * GAP + DOT_SIZE,
                top: r * GAP + DOT_SIZE,
                width: LINE_LENGTH,
                height: LINE_LENGTH,
                backgroundColor:
                  owner !== null
                    ? `${PLAYER_COLORS[owner]}40`
                    : "transparent",
                border:
                  owner !== null
                    ? `1px solid ${PLAYER_COLORS[owner]}60`
                    : "none",
              }}
            >
              {owner !== null && (
                <div className="flex h-full items-center justify-center text-xs font-bold"
                  style={{ color: PLAYER_COLORS[owner] }}
                >
                  {state.players[owner].name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))
        )}

        {/* ===== HORIZONTAL LINES ===== */}
        {state.hLines.map((row, r) =>
          row.map((drawn, c) => {
            const isDrawn = drawn !== null;
            const isClickable = !isDrawn && state.phase === "playing";
            const isLast =
              state.lastMove?.dir === "h" &&
              state.lastMove.row === r &&
              state.lastMove.col === c;

            return (
              <div
                key={`h-${r}-${c}`}
                onClick={() => isClickable && onLineClick(r, c, "h")}
                className={`absolute rounded-full transition-all ${
                  isClickable
                    ? "cursor-pointer hover:opacity-100"
                    : "cursor-default"
                }`}
                style={{
                  left: c * GAP + DOT_SIZE,
                  top: r * GAP + (DOT_SIZE - LINE_THICKNESS) / 2,
                  width: LINE_LENGTH,
                  height: LINE_THICKNESS,
                  backgroundColor: isDrawn
                    ? PLAYER_COLORS[drawn]
                    : isClickable
                    ? `${currentColor}25`
                    : "rgba(255,255,255,0.05)",
                  boxShadow: isLast
                    ? `0 0 12px ${PLAYER_COLORS[drawn!]}`
                    : isDrawn
                    ? `0 0 4px ${PLAYER_COLORS[drawn]}88`
                    : "none",
                  opacity: isClickable ? 0.5 : 1,
                }}
                title={isClickable ? "Click to draw a line here" : undefined}
              />
            );
          })
        )}

        {/* ===== VERTICAL LINES ===== */}
        {state.vLines.map((row, r) =>
          row.map((drawn, c) => {
            const isDrawn = drawn !== null;
            const isClickable = !isDrawn && state.phase === "playing";
            const isLast =
              state.lastMove?.dir === "v" &&
              state.lastMove.row === r &&
              state.lastMove.col === c;

            return (
              <div
                key={`v-${r}-${c}`}
                onClick={() => isClickable && onLineClick(r, c, "v")}
                className={`absolute rounded-full transition-all ${
                  isClickable
                    ? "cursor-pointer hover:opacity-100"
                    : "cursor-default"
                }`}
                style={{
                  left: c * GAP + (DOT_SIZE - LINE_THICKNESS) / 2,
                  top: r * GAP + DOT_SIZE,
                  width: LINE_THICKNESS,
                  height: LINE_LENGTH,
                  backgroundColor: isDrawn
                    ? PLAYER_COLORS[drawn]
                    : isClickable
                    ? `${currentColor}25`
                    : "rgba(255,255,255,0.05)",
                  boxShadow: isLast
                    ? `0 0 12px ${PLAYER_COLORS[drawn!]}`
                    : isDrawn
                    ? `0 0 4px ${PLAYER_COLORS[drawn]}88`
                    : "none",
                  opacity: isClickable ? 0.5 : 1,
                }}
                title={isClickable ? "Click to draw a line here" : undefined}
              />
            );
          })
        )}

        {/* ===== DOTS ===== */}
        {Array.from({ length: GRID_ROWS }).map((_, r) =>
          Array.from({ length: GRID_COLS }).map((_, c) => (
            <div
              key={`dot-${r}-${c}`}
              className="absolute rounded-full bg-white"
              style={{
                left: c * GAP,
                top: r * GAP,
                width: DOT_SIZE,
                height: DOT_SIZE,
                boxShadow: "0 0 6px rgba(255,255,255,0.5)",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
