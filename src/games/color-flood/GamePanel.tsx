"use client";

import { GameState, FloodColor, FLOOD_COLORS } from "./types";
import { PLAYER_COLORS } from "@/types/game";
import { getAvailableColors } from "./engine";

interface GamePanelProps {
  state: GameState;
  onPickColor: (color: FloodColor) => void;
  onRestart: () => void;
}

const COLOR_NAMES: Record<string, string> = {
  "#ef4444": "Red",
  "#3b82f6": "Blue",
  "#22c55e": "Green",
  "#f59e0b": "Amber",
  "#a855f7": "Purple",
  "#ec4899": "Pink",
};

export default function GamePanel({
  state,
  onPickColor,
  onRestart,
}: GamePanelProps) {
  const available =
    state.phase === "playing" ? getAvailableColors(state) : [];
  const currentColor =
    state.phase === "playing" ? PLAYER_COLORS[state.currentPlayer] : "#fff";

  return (
    <div className="flex w-80 flex-col gap-4">
      {/* ===== TURN + ACTION GUIDE ===== */}
      {state.phase === "playing" && (
        <div
          className="rounded-xl border-2 p-5"
          style={{
            borderColor: currentColor,
            boxShadow: `0 0 20px ${currentColor}33`,
          }}
        >
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
            Your Turn
          </p>
          <p
            className="mb-3 text-2xl font-extrabold"
            style={{ color: currentColor }}
          >
            {state.players[state.currentPlayer].name}
          </p>

          <div className="rounded-lg bg-white/5 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              What to do:
            </p>
            <p className="text-sm text-gray-300">
              Pick one of the <strong className="text-white">glowing color buttons</strong>{" "}
              below. Your territory will{" "}
              <strong className="text-white">grow</strong> by absorbing nearby
              cells of that color!
            </p>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-base">👇</span>
            Choose a color below to expand your territory
          </p>
        </div>
      )}

      {/* Winner */}
      {state.phase === "finished" && state.winner !== null && (
        <div className="rounded-xl border-2 border-yellow-500 bg-yellow-500/10 p-5 text-center">
          <p className="text-4xl">🏆</p>
          <p className="mt-2 text-2xl font-extrabold text-yellow-400">
            {state.players[state.winner].name} Wins!
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Captured {state.players[state.winner].cellCount} out of{" "}
            {state.totalCells} cells
          </p>
          <button
            onClick={onRestart}
            className="mt-4 w-full rounded-xl bg-yellow-500/20 px-4 py-2 font-bold text-yellow-400 transition-all hover:bg-yellow-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {/* ===== COLOR PICKER ===== */}
      {state.phase === "playing" && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm font-semibold text-white">
            Pick a Color to Flood
          </p>
          <p className="mb-3 text-xs text-gray-500">
            Greyed-out colors are already in use by a player
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FLOOD_COLORS.map((color) => {
              const isAvailable = available.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => isAvailable && onPickColor(color)}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-2.5 transition-all ${
                    isAvailable
                      ? "border-white/30 hover:scale-110 hover:border-white/60 hover:shadow-lg"
                      : "cursor-not-allowed border-white/5 opacity-25"
                  }`}
                  style={
                    isAvailable
                      ? { boxShadow: `0 0 12px ${color}44` }
                      : undefined
                  }
                >
                  <div
                    className={`h-10 w-10 rounded-md ${
                      isAvailable ? "animate-pulse" : ""
                    }`}
                    style={{
                      backgroundColor: color,
                      boxShadow: isAvailable
                        ? `0 0 15px ${color}66`
                        : "none",
                    }}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isAvailable ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {COLOR_NAMES[color]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== SCOREBOARD ===== */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-400">
          Territory Leaderboard
        </p>
        <div className="space-y-3">
          {state.players
            .map((player, i) => ({ ...player, index: i }))
            .sort((a, b) => b.cellCount - a.cellCount)
            .map((player) => {
              const pct = Math.round(
                (player.cellCount / state.totalCells) * 100
              );
              const isCurrent =
                state.phase === "playing" &&
                player.index === state.currentPlayer;
              return (
                <div
                  key={player.index}
                  className="space-y-1"
                  style={
                    isCurrent
                      ? { boxShadow: `0 0 0 1px ${player.color}`, borderRadius: 8, padding: 6 }
                      : { padding: 6 }
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="text-sm font-medium">
                        {player.name}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-gray-500">
                          ← playing
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold">
                      {player.cellCount} cells ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: player.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Board Progress */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Board Captured</span>
          <span className="font-bold">
            {Math.round(
              (state.players.reduce((s, p) => s + p.cellCount, 0) /
                state.totalCells) *
                100
            )}
            %
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{
              width: `${
                (state.players.reduce((s, p) => s + p.cellCount, 0) /
                  state.totalCells) *
                100
              }%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Game ends when every cell on the board is captured
        </p>
      </div>

      {/* Quick Help */}
      {state.phase === "playing" && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            Quick Help
          </p>
          <div className="space-y-1.5 text-xs text-gray-500">
            <p>
              🏠 You start from a <strong className="text-gray-400">corner</strong>{" "}
              (marked with your number)
            </p>
            <p>
              🎨 Pick a color →{" "}
              <strong className="text-gray-400">your whole territory</strong>{" "}
              changes to that color
            </p>
            <p>
              🌊 Neighboring cells of the same color{" "}
              <strong className="text-gray-400">join your territory</strong>
            </p>
            <p>
              🏆 Capture the{" "}
              <strong className="text-gray-400">most cells</strong> to win!
            </p>
          </div>
        </div>
      )}

      {/* Restart */}
      {state.phase === "playing" && (
        <button
          onClick={onRestart}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 transition-all hover:bg-white/10 hover:text-white"
        >
          🔄 Start Over
        </button>
      )}
    </div>
  );
}
