"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Difficulty } from "@/types/game";
import { GameState } from "@/games/memory-match/types";
import { createInitialState, flipCard, resolveFlip } from "@/games/memory-match/engine";
import GameSetup from "@/games/memory-match/GameSetup";
import Board from "@/games/memory-match/Board";
import GamePanel from "@/games/memory-match/GamePanel";

export default function MemoryMatchPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((playerCount: number, names: string[], difficulty: Difficulty) => {
    setGameState(createInitialState(playerCount, names, difficulty));
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (!gameState || gameState.phase !== "playing") return;
    const ns = flipCard(gameState, index);
    if (ns) setGameState(ns);
  }, [gameState]);

  useEffect(() => {
    if (gameState?.phase === "checking") {
      const timer = setTimeout(() => setGameState((prev) => (prev ? resolveFlip(prev) : null)), 800);
      return () => clearTimeout(timer);
    }
  }, [gameState?.phase]);

  if (!gameState) return <GameSetup onStart={handleStart} />;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white">← Home</Link>
        <h1 className="text-glow text-2xl font-extrabold">🃏 Memory Match</h1>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-500">{gameState.difficulty.toUpperCase()}</span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onCardClick={handleCardClick} />
        <GamePanel state={gameState} onRestart={() => setGameState(null)} />
      </div>
    </div>
  );
}
