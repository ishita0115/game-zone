"use client";

import { GameState, LineDirection } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
  onLineClick: (row: number, col: number, dir: LineDirection) => void;
}

const DOT_SIZE = 12;
const LINE_LENGTH = 52;
const LINE_THICKNESS = 6;
const GAP = LINE_LENGTH + DOT_SIZE;

export default function Board({ state, onLineClick }: BoardProps) {
  const { gridRows, gridCols } = state;
  const boardW = (gridCols - 1) * GAP + DOT_SIZE;
  const boardH = (gridRows - 1) * GAP + DOT_SIZE;
  const currentColor = PLAYER_COLORS[state.currentPlayer];

  return (
    <div className="relative" style={{ width: boardW, height: boardH, margin: 20 }}>
      {/* Boxes */}
      {state.boxes.map((row, r) =>
        row.map((owner, c) => (
          <div key={`box-${r}-${c}`} className="absolute rounded-sm transition-all duration-300"
            style={{ left: c * GAP + DOT_SIZE, top: r * GAP + DOT_SIZE, width: LINE_LENGTH, height: LINE_LENGTH, backgroundColor: owner !== null ? `${PLAYER_COLORS[owner]}40` : "transparent", border: owner !== null ? `1px solid ${PLAYER_COLORS[owner]}60` : "none" }}>
            {owner !== null && <div className="flex h-full items-center justify-center text-xs font-bold" style={{ color: PLAYER_COLORS[owner] }}>{state.players[owner].name.charAt(0).toUpperCase()}</div>}
          </div>
        ))
      )}

      {/* Horizontal lines */}
      {state.hLines.map((row, r) =>
        row.map((drawn, c) => {
          const isDrawn = drawn !== null;
          const clickable = !isDrawn && state.phase === "playing";
          const isLast = state.lastMove?.dir === "h" && state.lastMove.row === r && state.lastMove.col === c;
          return (
            <div key={`h-${r}-${c}`} onClick={() => clickable && onLineClick(r, c, "h")}
              className={`absolute rounded-full transition-all ${clickable ? "cursor-pointer hover:opacity-100" : "cursor-default"}`}
              style={{ left: c * GAP + DOT_SIZE, top: r * GAP + (DOT_SIZE - LINE_THICKNESS) / 2, width: LINE_LENGTH, height: LINE_THICKNESS,
                backgroundColor: isDrawn ? PLAYER_COLORS[drawn] : clickable ? `${currentColor}25` : "rgba(255,255,255,0.05)",
                boxShadow: isLast ? `0 0 12px ${PLAYER_COLORS[drawn!]}` : isDrawn ? `0 0 4px ${PLAYER_COLORS[drawn]}88` : "none",
                opacity: clickable ? 0.5 : 1 }}
              title={clickable ? "Draw a line here" : undefined} />
          );
        })
      )}

      {/* Vertical lines */}
      {state.vLines.map((row, r) =>
        row.map((drawn, c) => {
          const isDrawn = drawn !== null;
          const clickable = !isDrawn && state.phase === "playing";
          const isLast = state.lastMove?.dir === "v" && state.lastMove.row === r && state.lastMove.col === c;
          return (
            <div key={`v-${r}-${c}`} onClick={() => clickable && onLineClick(r, c, "v")}
              className={`absolute rounded-full transition-all ${clickable ? "cursor-pointer hover:opacity-100" : "cursor-default"}`}
              style={{ left: c * GAP + (DOT_SIZE - LINE_THICKNESS) / 2, top: r * GAP + DOT_SIZE, width: LINE_THICKNESS, height: LINE_LENGTH,
                backgroundColor: isDrawn ? PLAYER_COLORS[drawn] : clickable ? `${currentColor}25` : "rgba(255,255,255,0.05)",
                boxShadow: isLast ? `0 0 12px ${PLAYER_COLORS[drawn!]}` : isDrawn ? `0 0 4px ${PLAYER_COLORS[drawn]}88` : "none",
                opacity: clickable ? 0.5 : 1 }}
              title={clickable ? "Draw a line here" : undefined} />
          );
        })
      )}

      {/* Dots */}
      {Array.from({ length: gridRows }).map((_, r) =>
        Array.from({ length: gridCols }).map((_, c) => (
          <div key={`dot-${r}-${c}`} className="absolute rounded-full bg-white"
            style={{ left: c * GAP, top: r * GAP, width: DOT_SIZE, height: DOT_SIZE, boxShadow: "0 0 6px rgba(255,255,255,0.5)" }} />
        ))
      )}
    </div>
  );
}
