"use client";

import GameCard from "@/components/GameCard";
import { GAMES } from "@/types/game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-glow mb-1 text-5xl font-extrabold tracking-tight sm:text-6xl">
          Game Zone
        </h1>
        <p className="text-sm text-purple-300/80">
          🎮 2-3 players, one screen — pick a game!
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}
