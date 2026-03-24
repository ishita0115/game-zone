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
      <h1 className="text-glow mb-2 text-5xl font-extrabold">🪞 Mirror Maze</h1>
      <p className="mb-8 text-gray-400">Laser Battle</p>

      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-center text-xl font-semibold">Game Setup</h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-gray-400">
            Number of Players
          </label>
          <div className="flex gap-3">
            {[2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                className={`flex-1 rounded-xl border-2 px-6 py-3 text-lg font-bold transition-all ${
                  playerCount === n
                    ? "border-violet-500 bg-violet-500/20 text-white"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}
              >
                {n} Players
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-3">
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
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition-colors focus:border-violet-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => onStart(playerCount, names.slice(0, playerCount))}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-lg font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
        >
          Start Game
        </button>
      </div>

      <div className="mt-8 max-w-md rounded-xl border border-white/5 bg-white/5 p-6 text-sm text-gray-400">
        <h3 className="mb-2 font-semibold text-white">How to Play</h3>
        <ul className="list-inside list-disc space-y-1">
          <li>Each player has a laser beam from one edge of the board</li>
          <li>Place mirrors (/ or \) to redirect your laser toward gems 💎</li>
          <li>Click your own mirror to rotate it</li>
          <li>Gems hit by your laser = your points!</li>
          <li>Player with most gems wins!</li>
        </ul>
      </div>
    </div>
  );
}
