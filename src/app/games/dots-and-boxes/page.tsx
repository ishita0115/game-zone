"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Difficulty } from "@/types/game";
import { GameState, LineDirection } from "@/games/dots-and-boxes/types";
import { createInitialState, drawLine } from "@/games/dots-and-boxes/engine";
import GameSetup from "@/games/dots-and-boxes/GameSetup";
import Board from "@/games/dots-and-boxes/Board";
import GamePanel from "@/games/dots-and-boxes/GamePanel";

export default function DotsAndBoxesPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((playerCount: number, names: string[], difficulty: Difficulty) => {
    setGameState(createInitialState(playerCount, names, difficulty));
  }, []);

  const handleLineClick = useCallback((row: number, col: number, dir: LineDirection) => {
    if (!gameState || gameState.phase !== "playing") return;
    const ns = drawLine(gameState, row, col, dir);
    if (ns) setGameState(ns);
  }, [gameState]);

  if (!gameState) return <GameSetup onStart={handleStart} />;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white">← Home</Link>
        <h1 className="text-glow-orange text-2xl font-extrabold">🔲 Dots & Boxes</h1>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-500">{gameState.difficulty.toUpperCase()}</span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onLineClick={handleLineClick} />
        <GamePanel state={gameState} onRestart={() => setGameState(null)} />
      </div>
    </div>
  );
}
