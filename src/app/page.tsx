"use client";

import GameCard from "@/components/GameCard";
import { GAMES } from "@/types/game";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-16">
      <h1 className="text-glow mb-2 text-center text-6xl font-extrabold tracking-tight">
        Game Zone
      </h1>
      <p className="mb-4 text-lg text-purple-300">🎮 Multiplayer Fun!</p>
      <p className="mb-12 text-center text-gray-400">
        Choose a game and challenge your friends. 2-3 players, one screen!
      </p>

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-gray-600">
        More games coming soon...
      </div>
    </main>
  );
}
