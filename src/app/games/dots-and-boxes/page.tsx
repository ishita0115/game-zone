"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { GameState, LineDirection } from "@/games/dots-and-boxes/types";
import { createInitialState, drawLine } from "@/games/dots-and-boxes/engine";
import GameSetup from "@/games/dots-and-boxes/GameSetup";
import Board from "@/games/dots-and-boxes/Board";
import GamePanel from "@/games/dots-and-boxes/GamePanel";

export default function DotsAndBoxesPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback(
    (playerCount: number, names: string[]) => {
      setGameState(createInitialState(playerCount, names));
    },
    []
  );

  const handleLineClick = useCallback(
    (row: number, col: number, dir: LineDirection) => {
      if (!gameState || gameState.phase !== "playing") return;
      const newState = drawLine(gameState, row, col, dir);
      if (newState) setGameState(newState);
    },
    [gameState]
  );

  const handleRestart = useCallback(() => {
    setGameState(null);
  }, []);

  if (!gameState) {
    return <GameSetup onStart={handleStart} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white"
        >
          ← Home
        </Link>
        <h1 className="text-glow text-2xl font-extrabold">🔲 Dots & Boxes</h1>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onLineClick={handleLineClick} />
        <GamePanel state={gameState} onRestart={handleRestart} />
      </div>
    </div>
  );
}
