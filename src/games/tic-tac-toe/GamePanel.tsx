"use client";

import { GameState } from "./types";
import { PLAYER_COLORS } from "@/types/game";

interface GamePanelProps {
  state: GameState;
  onRestart: () => void;
  onNextRound: () => void;
}

export default function GamePanel({
  state,
  onRestart,
  onNextRound,
}: GamePanelProps) {
  const currentColor =
    state.phase === "playing" ? PLAYER_COLORS[state.currentPlayer] : "#fff";

  return (
    <div className="flex w-72 flex-col gap-3">
      {/* Turn */}
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
          <div className="flex items-center gap-2">
            <span
              className="text-3xl font-black"
              style={{ color: currentColor }}
            >
              {state.players[state.currentPlayer].symbol}
            </span>
            <p
              className="text-lg font-extrabold"
              style={{ color: currentColor }}
            >
              {state.players[state.currentPlayer].name}
            </p>
          </div>
          <div className="mt-2 rounded-md bg-white/5 px-2.5 py-2 text-xs text-gray-400">
            👆 Tap an empty cell to place your{" "}
            <strong className="text-gray-300">
              {state.players[state.currentPlayer].symbol}
            </strong>
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
            Round {state.roundNumber}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onNextRound}
              className="flex-1 rounded-lg bg-yellow-500/20 py-1.5 text-sm font-bold text-yellow-400 hover:bg-yellow-500/30"
            >
              Next Round
            </button>
            <button
              onClick={onRestart}
              className="flex-1 rounded-lg bg-white/5 py-1.5 text-sm font-bold text-gray-400 hover:bg-white/10"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Draw */}
      {state.phase === "draw" && (
        <div className="rounded-xl border-2 border-gray-500 bg-gray-500/10 p-4 text-center">
          <p className="text-3xl">🤝</p>
          <p className="mt-1 text-xl font-extrabold text-gray-300">
            It&apos;s a Draw!
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onNextRound}
              className="flex-1 rounded-lg bg-white/10 py-1.5 text-sm font-bold text-gray-300 hover:bg-white/15"
            >
              Next Round
            </button>
            <button
              onClick={onRestart}
              className="flex-1 rounded-lg bg-white/5 py-1.5 text-sm font-bold text-gray-400 hover:bg-white/10"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Score */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400">
            Score (Best of ∞)
          </span>
          <span className="text-xs text-gray-600">
            Round {state.roundNumber}
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
                <span
                  className="text-sm font-bold"
                  style={{ color: player.color }}
                >
                  {player.symbol}
                </span>
                <span className="text-xs font-medium">{player.name}</span>
              </div>
              <span className="text-base font-bold">{player.wins}</span>
            </div>
          ))}
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
