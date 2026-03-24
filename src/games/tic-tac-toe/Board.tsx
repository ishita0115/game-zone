"use client";

import { GameState } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
  onCellClick: (index: number) => void;
}

export default function Board({ state, onCellClick }: BoardProps) {
  const size = state.boardSize;
  const cellPx = size <= 3 ? 96 : size <= 4 ? 76 : 64;
  const currentColor = PLAYER_COLORS[state.currentPlayer];

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: size * (cellPx + 8) }}>
      {state.board.map((cell, idx) => {
        const isEmpty = cell === null;
        const clickable = state.phase === "playing" && isEmpty;
        const isWin = state.winLine?.includes(idx);
        const pColor = cell !== null ? PLAYER_COLORS[cell] : undefined;

        return (
          <button key={idx} onClick={() => clickable && onCellClick(idx)}
            className={`flex items-center justify-center rounded-2xl font-black transition-all duration-200 ${
              isWin ? "scale-105 border-2"
              : clickable ? "cursor-pointer border-2 border-white/10 bg-white/[0.04] hover:scale-105 hover:border-white/25 hover:bg-white/10"
              : "border-2 border-white/[0.06] bg-white/[0.02]"
            }`}
            style={{ width: cellPx, height: cellPx, fontSize: cellPx * 0.4,
              ...(isWin ? { borderColor: pColor, backgroundColor: `${pColor}20`, boxShadow: `0 0 20px ${pColor}40` } : {}),
              ...(isEmpty && clickable ? { borderColor: `${currentColor}20` } : {}) }}>
            {cell !== null && <span className="animate-bounce-in" style={{ color: pColor, textShadow: `0 0 15px ${pColor}60` }}>{state.players[cell].symbol}</span>}
          </button>
        );
      })}
    </div>
  );
}
