"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { GameState } from "@/games/tic-tac-toe/types";
import { createInitialState, makeMove } from "@/games/tic-tac-toe/engine";
import GameSetup from "@/games/tic-tac-toe/GameSetup";
import Board from "@/games/tic-tac-toe/Board";
import GamePanel from "@/games/tic-tac-toe/GamePanel";

export default function TicTacToePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((names: string[]) => {
    setGameState(createInitialState(names));
  }, []);

  const handleCellClick = useCallback(
    (index: number) => {
      if (!gameState || gameState.phase !== "playing") return;
      const newState = makeMove(gameState, index);
      if (newState) setGameState(newState);
    },
    [gameState]
  );

  const handleRestart = useCallback(() => {
    setGameState(null);
  }, []);

  const handleNextRound = useCallback(() => {
    if (!gameState) return;
    const names = gameState.players.map((p) => p.name);
    setGameState(
      createInitialState(names, gameState.players, gameState.roundNumber + 1)
    );
  }, [gameState]);

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
        <h1 className="text-glow-cyan text-2xl font-extrabold">
          ❌⭕ Tic Tac Toe
        </h1>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onCellClick={handleCellClick} />
        <GamePanel
          state={gameState}
          onRestart={handleRestart}
          onNextRound={handleNextRound}
        />
      </div>
    </div>
  );
}
