"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Difficulty } from "@/types/game";
import { GameState, FloodColor } from "@/games/color-flood/types";
import { createInitialState, pickColor } from "@/games/color-flood/engine";
import GameSetup from "@/games/color-flood/GameSetup";
import Board from "@/games/color-flood/Board";
import GamePanel from "@/games/color-flood/GamePanel";

export default function ColorFloodPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((playerCount: number, names: string[], difficulty: Difficulty) => {
    setGameState(createInitialState(playerCount, names, difficulty));
  }, []);

  const handlePickColor = useCallback((color: FloodColor) => {
    if (!gameState || gameState.phase !== "playing") return;
    const ns = pickColor(gameState, color);
    if (ns) setGameState(ns);
  }, [gameState]);

  if (!gameState) return <GameSetup onStart={handleStart} />;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white">← Home</Link>
        <h1 className="text-glow text-2xl font-extrabold">🌊 Color Flood</h1>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-500">{gameState.difficulty.toUpperCase()}</span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} />
        <GamePanel state={gameState} onPickColor={handlePickColor} onRestart={() => setGameState(null)} />
      </div>
    </div>
  );
}
