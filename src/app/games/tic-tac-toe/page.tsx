"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Difficulty } from "@/types/game";
import { GameState } from "@/games/tic-tac-toe/types";
import { createInitialState, makeMove } from "@/games/tic-tac-toe/engine";
import GameSetup from "@/games/tic-tac-toe/GameSetup";
import Board from "@/games/tic-tac-toe/Board";
import GamePanel from "@/games/tic-tac-toe/GamePanel";

export default function TicTacToePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const handleStart = useCallback((names: string[], diff: Difficulty) => {
    setDifficulty(diff);
    setGameState(createInitialState(names, undefined, 1, diff));
  }, []);

  const handleCellClick = useCallback((index: number) => {
    if (!gameState || gameState.phase !== "playing") return;
    const ns = makeMove(gameState, index);
    if (ns) setGameState(ns);
  }, [gameState]);

  const handleNextRound = useCallback(() => {
    if (!gameState) return;
    setGameState(createInitialState(gameState.players.map((p) => p.name), gameState.players, gameState.roundNumber + 1, difficulty));
  }, [gameState, difficulty]);

  if (!gameState) return <GameSetup onStart={handleStart} />;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 transition-all hover:bg-white/10 hover:text-white">← Home</Link>
        <h1 className="text-glow-cyan text-2xl font-extrabold">❌⭕ Tic Tac Toe</h1>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-500">{gameState.difficulty.toUpperCase()}</span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onCellClick={handleCellClick} />
        <GamePanel state={gameState} onRestart={() => setGameState(null)} onNextRound={handleNextRound} />
      </div>
    </div>
  );
}
