"use client";

import { useState } from "react";
import { PLAYER_COLORS, PLAYER_NAMES_DEFAULT } from "@/types/game";

interface GameSetupProps {
  onStart: (playerCount: number, names: string[]) => void;
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState(PLAYER_NAMES_DEFAULT.slice());

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-glow mb-1 text-center text-4xl font-extrabold">
          🔲 Dots & Boxes
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Connect the Dots!
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Left: How it works */}
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <p className="mb-3 text-sm font-bold text-orange-300">
              How it works
            </p>
            <div className="space-y-2.5">
              {[
                ["🔗", "Click between two dots to draw a line"],
                ["📦", "Complete all 4 sides of a box to claim it"],
                ["🎯", "Completing a box gives you another turn!"],
                ["🏆", "Player with the most boxes wins!"],
              ].map(([icon, text], i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-base">{icon}</span>
                  <p className="text-xs text-gray-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Setup form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4">
              <p className="mb-2 text-xs text-gray-500">Players</p>
              <div className="flex gap-2">
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPlayerCount(n)}
                    className={`flex-1 rounded-lg border-2 py-2 text-sm font-bold transition-all ${
                      playerCount === n
                        ? "border-orange-500 bg-orange-500/20 text-white"
                        : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                    }`}
                  >
                    {n}P
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 space-y-2">
              {Array.from({ length: playerCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PLAYER_COLORS[i] }}
                  />
                  <input
                    type="text"
                    value={names[i]}
                    onChange={(e) => {
                      const copy = [...names];
                      copy[i] = e.target.value;
                      setNames(copy);
                    }}
                    placeholder={`Player ${i + 1}`}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                onStart(playerCount, names.slice(0, playerCount))
              }
              className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 py-3 text-base font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
            >
              Start Playing!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
