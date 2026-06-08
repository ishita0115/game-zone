"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { GameState } from "@/games/connect-four/types";
import { createInitialState, dropToken } from "@/games/connect-four/engine";
import GameSetup from "@/games/connect-four/GameSetup";
import Board from "@/games/connect-four/Board";
import GamePanel from "@/games/connect-four/GamePanel";

export default function ConnectFourPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((names: string[]) => {
    setGameState(createInitialState(names));
  }, []);

  const handleColClick = useCallback((col: number) => {
    if (!gameState || gameState.phase !== "playing") return;
    const ns = dropToken(gameState, col);
    if (ns) setGameState(ns);
  }, [gameState]);

  const handleNextRound = useCallback(() => {
    if (!gameState) return;
    setGameState(createInitialState(
      gameState.players.map((p) => p.name),
      gameState.players,
      gameState.roundNumber + 1
    ));
  }, [gameState]);

  if (!gameState) return <GameSetup onStart={handleStart} />;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white">
          ← Home
        </Link>
        <h1 className="text-2xl font-extrabold text-white">🔴 Connect Four</h1>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-500">
          Round {gameState.roundNumber}
        </span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onColClick={handleColClick} />
        <GamePanel state={gameState} onRestart={() => setGameState(null)} onNextRound={handleNextRound} />
      </div>
    </div>
  );
}
