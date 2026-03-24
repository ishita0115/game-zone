"use client";

import GameCard from "@/components/GameCard";
import { GAMES } from "@/types/game";

export default function Home() {
  const adultGames = GAMES.filter((g) => g.category === "adult");
  const kidsGames = GAMES.filter((g) => g.category === "kids");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      {/* ===== HERO ===== */}
      <div className="mb-14 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          2-3 Players &bull; One Screen &bull; Offline Fun
        </div>
        <h1 className="text-glow mb-3 text-5xl font-black tracking-tight sm:text-7xl">
          Game Zone
        </h1>
        <p className="text-base text-gray-500">
          Pick a game and challenge your friends right here!
        </p>
      </div>

      {/* ===== ADULT / STRATEGY GAMES ===== */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-sm">
            🧠
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Strategy Games</h2>
            <p className="text-[11px] text-gray-600">
              Brain-bending multiplayer challenges
            </p>
          </div>
          <div className="ml-auto rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-0.5 text-[10px] font-semibold text-violet-400">
            {adultGames.length} GAMES
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adultGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="section-line mb-12" />

      {/* ===== KIDS GAMES ===== */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-sm">
            🎈
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Kids Games</h2>
            <p className="text-[11px] text-gray-600">
              Simple & fun for younger players
            </p>
          </div>
          <div className="ml-auto rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-0.5 text-[10px] font-semibold text-pink-400">
            {kidsGames.length} GAMES
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kidsGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="pb-6 text-center text-[11px] text-gray-700">
        Made with ❤️ for fun &bull; Game Zone
      </footer>
    </main>
  );
}
