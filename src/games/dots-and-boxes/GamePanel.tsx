"use client";

import { GameState } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface GamePanelProps {
  state: GameState;
  onRestart: () => void;
}

export default function GamePanel({ state, onRestart }: GamePanelProps) {
  const currentColor =
    state.phase === "playing" ? PLAYER_COLORS[state.currentPlayer] : "#fff";
  const totalScored = state.players.reduce((s, p) => s + p.score, 0);

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
            👇 Click the{" "}
            <strong className="text-gray-300">
              faded space between two dots
            </strong>{" "}
            to draw a line. Complete a box = bonus turn!
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
            {state.players[state.winner].score}/{state.totalBoxes} boxes
          </p>
          <button
            onClick={onRestart}
            className="mt-3 w-full rounded-lg bg-yellow-500/20 py-1.5 text-sm font-bold text-yellow-400 hover:bg-yellow-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Scoreboard */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400">Score</span>
          <span className="text-xs text-gray-600">
            📦 {totalScored}/{state.totalBoxes}
          </span>
        </div>
        <div className="space-y-1.5">
          {state.players.map((player, i) => (
            <div
              key={i}
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
              <span className="text-base font-bold">{player.score}</span>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{
              width: `${(totalScored / state.totalBoxes) * 100}%`,
            }}
          />
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
