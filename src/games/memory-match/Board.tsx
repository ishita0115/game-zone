"use client";

import { GameState } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface BoardProps {
  state: GameState;
  onCardClick: (index: number) => void;
}

export default function Board({ state, onCardClick }: BoardProps) {
  const cols = state.gridCols;
  const cardSize = cols <= 4 ? 72 : cols <= 6 ? 64 : 56;

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: cols * (cardSize + 8) }}>
      {state.cards.map((card, idx) => {
        const isFlipped = card.flipped;
        const isMatched = card.matched;
        const clickable = state.phase === "playing" && !isFlipped && !isMatched;

        return (
          <button key={card.id} onClick={() => clickable && onCardClick(idx)} disabled={!clickable && !isFlipped}
            className={`flex items-center justify-center rounded-xl text-2xl transition-all duration-300 ${
              isMatched ? "scale-90 border-2 border-green-500/50 bg-green-500/10"
              : isFlipped ? "scale-105 border-2 border-white/30 bg-white/10 shadow-lg"
              : clickable ? "cursor-pointer border-2 border-white/10 bg-white/[0.05] hover:scale-105 hover:border-white/25 hover:bg-white/10"
              : "border-2 border-white/5 bg-white/[0.02]"
            }`}
            style={{ width: cardSize, height: cardSize,
              ...(isFlipped ? { boxShadow: `0 0 15px ${PLAYER_COLORS[state.currentPlayer]}30`, borderColor: `${PLAYER_COLORS[state.currentPlayer]}60` } : {}) }}>
            {isFlipped || isMatched ? <span className="animate-bounce-in">{card.emoji}</span> : <span className="text-lg text-gray-700">?</span>}
          </button>
        );
      })}
    </div>
  );
}
