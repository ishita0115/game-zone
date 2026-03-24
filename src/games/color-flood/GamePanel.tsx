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
  const totalOwned = state.players.reduce((s, p) => s + p.cellCount, 0);
  const pctDone = Math.round((totalOwned / state.totalCells) * 100);

  return (
    <div className="flex w-72 flex-col gap-3">
      {/* Turn + What to do */}
      {state.phase === "playing" && (
        <div
          className="rounded-xl border-2 p-4"
          style={{
            borderColor: currentColor,
            boxShadow: `0 0 15px ${currentColor}25`,
          }}
        >
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Your Turn
          </p>
          <p
            className="mb-2 text-lg font-extrabold"
            style={{ color: currentColor }}
          >
            {state.players[state.currentPlayer].name}
          </p>
          <div className="rounded-md bg-white/5 px-2.5 py-2 text-xs text-gray-400">
            👇 Pick a <strong className="text-gray-300">color below</strong> to
            flood your territory and absorb nearby cells
          </div>
        </div>
      )}

      {/* Winner */}
      {state.phase === "finished" && state.winner !== null && (
        <div className="rounded-xl border-2 border-yellow-500 bg-yellow-500/10 p-4 text-center">
          <p className="text-3xl">🏆</p>
          <p className="mt-1 text-xl font-extrabold text-yellow-400">
            {state.players[state.winner].name} Wins!
          </p>
          <p className="text-xs text-gray-400">
            {state.players[state.winner].cellCount}/{state.totalCells} cells
          </p>
          <button
            onClick={onRestart}
            className="mt-3 w-full rounded-lg bg-yellow-500/20 py-1.5 text-sm font-bold text-yellow-400 hover:bg-yellow-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Color Picker */}
      {state.phase === "playing" && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="mb-2 text-xs font-semibold text-gray-400">
            Pick a Color
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {FLOOD_COLORS.map((color) => {
              const isAvailable = available.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => isAvailable && onPickColor(color)}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center gap-0.5 rounded-md border-2 p-1.5 transition-all ${
                    isAvailable
                      ? "border-white/20 hover:scale-110 hover:border-white/50"
                      : "cursor-not-allowed border-white/5 opacity-25"
                  }`}
                  title={isAvailable ? `Pick ${COLOR_NAMES[color]}` : "In use"}
                >
                  <div
                    className="h-7 w-7 rounded"
                    style={{
                      backgroundColor: color,
                      boxShadow: isAvailable ? `0 0 8px ${color}55` : "none",
                    }}
                  />
                  <span className="text-[8px] text-gray-600">
                    {COLOR_NAMES[color]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400">Territory</span>
          <span className="text-xs text-gray-600">{pctDone}% captured</span>
        </div>
        <div className="space-y-1.5">
          {state.players.map((player, i) => {
            const pct = Math.round(
              (player.cellCount / state.totalCells) * 100
            );
            return (
              <div key={i}>
                <div
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${
                    state.phase === "playing" && i === state.currentPlayer
                      ? "bg-white/10"
                      : "bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="text-xs font-medium">{player.name}</span>
                  </div>
                  <span className="text-xs font-bold">
                    {player.cellCount} ({pct}%)
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: player.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart */}
      {state.phase === "playing" && (
        <button
          onClick={onRestart}
          className="rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs text-gray-500 hover:bg-white/10 hover:text-white"
        >
          🔄 Start Over
        </button>
      )}
    </div>
  );
}
