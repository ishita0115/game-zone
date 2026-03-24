"use client";

import { GameState, MirrorType } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface GamePanelProps {
  state: GameState;
  onSelectMirror: (type: MirrorType) => void;
  onRestart: () => void;
}

export default function GamePanel({
  state,
  onSelectMirror,
  onRestart,
}: GamePanelProps) {
  return (
    <div className="flex w-72 flex-col gap-4">
      {/* Current Turn */}
      {state.phase === "playing" && (
        <div
          className="rounded-xl border-2 p-4 text-center"
          style={{
            borderColor: PLAYER_COLORS[state.currentPlayer],
            boxShadow: `0 0 20px ${PLAYER_COLORS[state.currentPlayer]}33`,
          }}
        >
          <p className="text-sm text-gray-400">Current Turn</p>
          <p className="text-xl font-bold">
            {state.players[state.currentPlayer].name}
          </p>
        </div>
      )}

      {/* Winner */}
      {state.phase === "finished" && state.winner !== null && (
        <div className="rounded-xl border-2 border-yellow-500 bg-yellow-500/10 p-4 text-center">
          <p className="text-3xl">🏆</p>
          <p className="text-xl font-bold text-yellow-400">
            {state.players[state.winner].name} Wins!
          </p>
          <p className="text-sm text-gray-400">
            Score: {state.players[state.winner].score}
          </p>
        </div>
      )}

      {/* Mirror Selector */}
      {state.phase === "playing" && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-sm text-gray-400">Place Mirror Type</p>
          <div className="flex gap-2">
            {(["/" as const, "\\" as const]).map((type) => (
              <button
                key={type}
                onClick={() => onSelectMirror(type)}
                className={`flex-1 rounded-lg border-2 py-3 text-2xl font-bold transition-all ${
                  state.selectedMirror === type
                    ? "border-violet-500 bg-violet-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto">
                  {type === "/" ? (
                    <line
                      x1="8"
                      y1="32"
                      x2="32"
                      y2="8"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ) : (
                    <line
                      x1="8"
                      y1="8"
                      x2="32"
                      y2="32"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Click empty cell to place, click your mirror to rotate
          </p>
        </div>
      )}

      {/* Scoreboard */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-400">Scoreboard</p>
        <div className="space-y-2">
          {state.players.map((player, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-sm font-medium">{player.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  🪞 {player.mirrorsLeft}
                </span>
                <span className="text-lg font-bold">{player.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gems Progress */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Gems Collected</span>
          <span className="font-bold">
            {state.claimedGems}/{state.totalGems}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
            style={{
              width: `${(state.claimedGems / state.totalGems) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 transition-all hover:bg-white/10 hover:text-white"
      >
        🔄 New Game
      </button>
    </div>
  );
}
