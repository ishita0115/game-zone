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
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
      <h1 className="text-glow mb-2 text-5xl font-extrabold">🌊 Color Flood</h1>
      <p className="mb-8 text-gray-400">Capture the Board!</p>

      {/* Visual How-to-Play */}
      <div className="mb-8 w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h3 className="mb-4 text-center text-lg font-bold text-emerald-300">
          How Does This Game Work?
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-lg bg-white/5 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-sm font-bold text-emerald-300">
              1
            </span>
            <div>
              <p className="font-medium text-white">You start from a corner 🏠</p>
              <p className="text-sm text-gray-400">
                Each player owns one corner cell of the colorful board
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg bg-white/5 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-sm font-bold text-emerald-300">
              2
            </span>
            <div>
              <p className="font-medium text-white">Pick a color 🎨</p>
              <p className="text-sm text-gray-400">
                Your territory changes to that color. Any neighboring cells that
                match it get absorbed into your territory!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg bg-white/5 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-sm font-bold text-emerald-300">
              3
            </span>
            <div>
              <p className="font-medium text-white">Capture the most cells! 🏆</p>
              <p className="text-sm text-gray-400">
                Keep flooding to grow your territory. Player with the most cells
                when the board is full wins!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-center text-xl font-semibold">Game Setup</h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-gray-400">
            How many players?
          </label>
          <div className="flex gap-3">
            {[2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                className={`flex-1 rounded-xl border-2 px-6 py-3 text-lg font-bold transition-all ${
                  playerCount === n
                    ? "border-emerald-500 bg-emerald-500/20 text-white"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}
              >
                {n} Players
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <label className="block text-sm text-gray-400">
            Enter your names:
          </label>
          {Array.from({ length: playerCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
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
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition-colors focus:border-emerald-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => onStart(playerCount, names.slice(0, playerCount))}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 text-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          Start Playing!
        </button>
      </div>
    </div>
  );
}
