"use client";

import { useState } from "react";
import Link from "next/link";
import { PLAYER_COLORS, PLAYER_NAMES_DEFAULT } from "@/types/game";

interface Props {
  onStart: (names: string[]) => void;
}

const HOW: [string, string][] = [
  ["🔴", "Take turns dropping tokens into columns"],
  ["⬇️", "Tokens fall to the lowest empty row"],
  ["4️⃣", "Connect 4 in a row — horizontal, vertical, or diagonal!"],
  ["🚫", "Fill a column completely to block your opponent"],
];

export default function GameSetup({ onStart }: Props) {
  const [names, setNames] = useState(PLAYER_NAMES_DEFAULT.slice(0, 2));

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white">
          ← Home
        </Link>
        <h1 className="mb-1 text-center text-4xl font-extrabold text-white">🔴 Connect Four</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Drop tokens — connect 4 to win!</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <p className="mb-3 text-sm font-bold text-rose-300">How it works</p>
            <div className="space-y-2.5">
              {HOW.map(([icon, text], i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-base">{icon}</span>
                  <p className="text-xs text-gray-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-2 text-xs text-gray-500">2 Players</p>
            <div className="mb-4 space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i], boxShadow: `0 0 6px ${PLAYER_COLORS[i]}` }} />
                  <input
                    type="text"
                    value={names[i]}
                    onChange={(e) => { const c = [...names]; c[i] = e.target.value; setNames(c); }}
                    placeholder={`Player ${i + 1}`}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => onStart(names)}
              className="w-full rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 py-3 text-base font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-500/25"
            >
              Start Playing!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
