"use client";

import Link from "next/link";
import { GameInfo } from "@/types/game";

export default function GameCard({ game }: { game: GameInfo }) {
  return (
    <Link href={game.route}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
        />
        <div className="relative z-10">
          <div className="mb-4 text-6xl">{game.emoji}</div>
          <h3 className="mb-2 text-2xl font-bold">{game.name}</h3>
          <p className="mb-4 text-sm text-gray-400">{game.description}</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              {game.minPlayers}-{game.maxPlayers} Players
            </span>
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
              Strategy
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
