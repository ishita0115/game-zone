"use client";

import Link from "next/link";
import { GameInfo } from "@/types/game";

export default function GameCard({ game }: { game: GameInfo }) {
  return (
    <Link href={game.route} className="block">
      <div className="card-shine group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.04] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10">
        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${game.color} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08]`}
        />

        {/* Top glow line */}
        <div
          className={`absolute left-4 right-4 top-0 h-[2px] bg-gradient-to-r ${game.color} opacity-0 transition-opacity duration-500 group-hover:opacity-60`}
        />

        <div className="relative z-10">
          {/* Emoji + Info */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.05] text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {game.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold leading-tight text-white group-hover:text-white">
                {game.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                  {game.minPlayers}-{game.maxPlayers}P
                </span>
                <span
                  className={`rounded-full bg-gradient-to-r ${game.color} bg-clip-text text-[10px] font-bold text-transparent`}
                >
                  {game.tag}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 text-[11px] leading-relaxed text-gray-500 group-hover:text-gray-400">
            {game.description}
          </p>

          {/* Play button */}
          <div
            className={`flex items-center justify-center rounded-xl bg-gradient-to-r ${game.color} py-2.5 text-xs font-bold text-white opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-lg`}
          >
            PLAY NOW
          </div>
        </div>
      </div>
    </Link>
  );
}
