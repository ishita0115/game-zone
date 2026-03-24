"use client";

import Link from "next/link";
import { GameInfo } from "@/types/game";

export default function GameCard({ game }: { game: GameInfo }) {
  return (
    <Link href={game.route}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
        />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-4xl">{game.emoji}</span>
            <div>
              <h3 className="text-lg font-bold leading-tight">{game.name}</h3>
              <span className="text-[10px] text-gray-500">
                {game.minPlayers}-{game.maxPlayers} Players
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            {game.description}
          </p>
          <div className="mt-3 flex items-center justify-end">
            <span
              className={`rounded-full bg-gradient-to-r ${game.color} px-3 py-1 text-[10px] font-bold text-white opacity-0 transition-all group-hover:opacity-100`}
            >
              PLAY →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
