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
  const currentColor = state.phase === "playing" ? PLAYER_COLORS[state.currentPlayer] : "#fff";

  return (
    <div className="flex w-80 flex-col gap-4">
      {/* ===== STEP-BY-STEP ACTION GUIDE ===== */}
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

          {/* Step by step */}
          <div className="space-y-2 rounded-lg bg-white/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              What to do:
            </p>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-300">
                1
              </span>
              <p className="text-sm text-gray-300">
                Choose a mirror shape below{" "}
                <span className="text-gray-500">(/ or \)</span>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-300">
                2
              </span>
              <p className="text-sm text-gray-300">
                Click any <strong className="text-white">dark empty cell</strong> on
                the board to place it
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-gray-500">
                ?
              </span>
              <p className="text-sm text-gray-500">
                Or click <strong>your own mirror</strong> to rotate it
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Goal: Redirect your laser beam to hit 💎 gems!
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
            Captured {state.players[state.winner].score} gems
          </p>
          <button
            onClick={onRestart}
            className="mt-4 w-full rounded-xl bg-yellow-500/20 px-4 py-2 font-bold text-yellow-400 transition-all hover:bg-yellow-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Mirror Selector */}
      {state.phase === "playing" && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm font-semibold text-white">
            Step 1: Pick Mirror Shape
          </p>
          <p className="mb-3 text-xs text-gray-500">
            This decides the angle of reflection
          </p>
          <div className="flex gap-2">
            {(["/" as const, "\\" as const]).map((type) => {
              const isSelected = state.selectedMirror === type;
              return (
                <button
                  key={type}
                  onClick={() => onSelectMirror(type)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-lg border-2 py-3 transition-all ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/20 scale-105"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    className="mx-auto"
                  >
                    {type === "/" ? (
                      <line
                        x1="8"
                        y1="32"
                        x2="32"
                        y2="8"
                        stroke={isSelected ? "#a78bfa" : "white"}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    ) : (
                      <line
                        x1="8"
                        y1="8"
                        x2="32"
                        y2="32"
                        stroke={isSelected ? "#a78bfa" : "white"}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <span className="text-[10px] text-gray-400">
                    {type === "/" ? "Lean Left /" : "Lean Right \\"}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-violet-400">
                      SELECTED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-400">Scoreboard</p>
        <div className="space-y-2">
          {state.players.map((player, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                state.phase === "playing" && i === state.currentPlayer
                  ? "bg-white/10 ring-1"
                  : "bg-white/5"
              }`}
              style={
                state.phase === "playing" && i === state.currentPlayer
                  ? { boxShadow: `0 0 0 1px ${player.color}` }
                  : undefined
              }
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-sm font-medium">{player.name}</span>
                {state.phase === "playing" && i === state.currentPlayer && (
                  <span className="text-xs text-gray-500">← playing</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  🪞 {player.mirrorsLeft} left
                </span>
                <span className="text-lg font-bold">
                  💎 {player.score}
                </span>
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
        <p className="mt-2 text-xs text-gray-600">
          Game ends when all gems are collected or all mirrors are placed
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
              🔦 Each player has a <strong className="text-gray-400">laser beam</strong>{" "}
              coming from the edge (colored arrows)
            </p>
            <p>
              🪞 Place <strong className="text-gray-400">mirrors</strong> to bounce
              your laser towards 💎 gems
            </p>
            <p>
              ✅ When your laser hits a gem, you <strong className="text-gray-400">score a point</strong>!
            </p>
            <p>
              🏆 Player with the <strong className="text-gray-400">most gems</strong> wins
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
