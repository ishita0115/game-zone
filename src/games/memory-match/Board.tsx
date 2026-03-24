"use client";

import { GameState, GRID_COLS } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
  onCardClick: (index: number) => void;
}

export default function Board({ state, onCardClick }: BoardProps) {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        width: GRID_COLS * 72,
      }}
    >
      {state.cards.map((card, idx) => {
        const isFlipped = card.flipped;
        const isMatched = card.matched;
        const isClickable =
          state.phase === "playing" && !isFlipped && !isMatched;

        // Find who matched this card
        let matchColor: string | undefined;
        if (isMatched) {
          // find the player who has this emoji match
          // We don't track this directly, so just show a neutral matched state
          matchColor = "#22c55e";
        }

        return (
          <button
            key={card.id}
            onClick={() => isClickable && onCardClick(idx)}
            disabled={!isClickable && !isFlipped}
            className={`relative flex h-16 w-16 items-center justify-center rounded-xl text-2xl transition-all duration-300 ${
              isMatched
                ? "scale-90 border-2 border-green-500/50 bg-green-500/10"
                : isFlipped
                ? "scale-105 border-2 border-white/30 bg-white/10 shadow-lg"
                : isClickable
                ? "cursor-pointer border-2 border-white/10 bg-white/[0.05] hover:scale-105 hover:border-white/25 hover:bg-white/10"
                : "border-2 border-white/5 bg-white/[0.02]"
            }`}
            style={
              isFlipped
                ? {
                    boxShadow: `0 0 15px ${PLAYER_COLORS[state.currentPlayer]}30`,
                    borderColor: `${PLAYER_COLORS[state.currentPlayer]}60`,
                  }
                : undefined
            }
          >
            {isFlipped || isMatched ? (
              <span className="animate-bounce-in">{card.emoji}</span>
            ) : (
              <span className="text-gray-700 text-lg">?</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
