"use client";

import { GameState } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
  onCellClick: (index: number) => void;
}

export default function Board({ state, onCellClick }: BoardProps) {
  const currentColor = PLAYER_COLORS[state.currentPlayer];

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "repeat(3, 1fr)", width: 300 }}
    >
      {state.board.map((cell, idx) => {
        const isEmpty = cell === null;
        const isClickable = state.phase === "playing" && isEmpty;
        const isWinCell = state.winLine?.includes(idx);
        const playerColor = cell !== null ? PLAYER_COLORS[cell] : undefined;

        return (
          <button
            key={idx}
            onClick={() => isClickable && onCellClick(idx)}
            className={`flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-black transition-all duration-200 ${
              isWinCell
                ? "scale-105 border-2"
                : isClickable
                ? "cursor-pointer border-2 border-white/10 bg-white/[0.04] hover:scale-105 hover:border-white/25 hover:bg-white/10"
                : "border-2 border-white/[0.06] bg-white/[0.02]"
            }`}
            style={
              isWinCell
                ? {
                    borderColor: playerColor,
                    backgroundColor: `${playerColor}20`,
                    boxShadow: `0 0 20px ${playerColor}40`,
                  }
                : isEmpty && isClickable
                ? { borderColor: `${currentColor}20` }
                : undefined
            }
          >
            {cell !== null && (
              <span
                className="animate-bounce-in"
                style={{
                  color: playerColor,
                  textShadow: `0 0 15px ${playerColor}60`,
                }}
              >
                {state.players[cell].symbol}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
