"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { GameState, MirrorType } from "@/games/mirror-maze/types";
import { createInitialState, placeMirror, rotateMirror } from "@/games/mirror-maze/engine";
import GameSetup from "@/games/mirror-maze/GameSetup";
import Board from "@/games/mirror-maze/Board";
import GamePanel from "@/games/mirror-maze/GamePanel";

export default function MirrorMazePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback(
    (playerCount: number, names: string[]) => {
      setGameState(createInitialState(playerCount, names));
    },
    []
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameState || gameState.phase !== "playing") return;

      const cell = gameState.board[row][col];

      if (
        cell.content.type === "mirror" &&
        cell.content.playerIndex === gameState.currentPlayer
      ) {
        const newState = rotateMirror(gameState, row, col);
        if (newState) setGameState(newState);
      } else if (cell.content.type === "empty") {
        const newState = placeMirror(gameState, row, col);
        if (newState) setGameState(newState);
      }
    },
    [gameState]
  );

  const handleSelectMirror = useCallback(
    (type: MirrorType) => {
      if (!gameState) return;
      setGameState({ ...gameState, selectedMirror: type });
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
        <h1 className="text-glow text-2xl font-extrabold">🪞 Mirror Maze</h1>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        <Board state={gameState} onCellClick={handleCellClick} />
        <GamePanel
          state={gameState}
          onSelectMirror={handleSelectMirror}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
