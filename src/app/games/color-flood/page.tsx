"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { GameState } from "@/games/color-flood/types";
import { FloodColor } from "@/games/color-flood/types";
import { createInitialState, pickColor } from "@/games/color-flood/engine";
import GameSetup from "@/games/color-flood/GameSetup";
import Board from "@/games/color-flood/Board";
import GamePanel from "@/games/color-flood/GamePanel";

export default function ColorFloodPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback(
    (playerCount: number, names: string[]) => {
      setGameState(createInitialState(playerCount, names));
    },
    []
  );

  const handlePickColor = useCallback(
    (color: FloodColor) => {
      if (!gameState || gameState.phase !== "playing") return;
      const newState = pickColor(gameState, color);
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
    <div className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400 transition-all hover:bg-white/10 hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-glow text-3xl font-extrabold">🌊 Color Flood</h1>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-8">
        <Board state={gameState} />
        <GamePanel
          state={gameState}
          onPickColor={handlePickColor}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
