"use client";

import { useState } from "react";
import { PLAYER_COLORS, PLAYER_NAMES_DEFAULT } from "@/types/game";

interface GameSetupProps {
  onStart: (names: string[]) => void;
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [names, setNames] = useState(PLAYER_NAMES_DEFAULT.slice(0, 2));

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-glow-cyan mb-1 text-center text-4xl font-extrabold">
          ❌⭕ Tic Tac Toe
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Get Three in a Row!
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
            <p className="mb-3 text-sm font-bold text-sky-300">How it works</p>
            <div className="space-y-2.5">
              {[
                ["✕", "Player 1 is ✕, Player 2 is ◯"],
                ["👆", "Tap an empty cell to place your mark"],
                ["🎯", "Get 3 in a row (horizontal, vertical, or diagonal)"],
                ["🏆", "First to three in a row wins the round!"],
              ].map(([icon, text], i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-base">{icon}</span>
                  <p className="text-xs text-gray-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-xs text-gray-500">2 Players Only</p>

            <div className="mb-4 space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PLAYER_COLORS[i] }}
                  />
                  <span className="shrink-0 text-sm font-bold text-gray-400">
                    {i === 0 ? "✕" : "◯"}
                  </span>
                  <input
                    type="text"
                    value={names[i]}
                    onChange={(e) => {
                      const copy = [...names];
                      copy[i] = e.target.value;
                      setNames(copy);
                    }}
                    placeholder={`Player ${i + 1}`}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-sky-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => onStart(names)}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-base font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25"
            >
              Start Playing!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
