"use client";

import { GameState, GRID_SIZE, LaserSegment, MirrorType, Position } from "./types";
import { PLAYER_COLORS } from "@/types/game";
import { getLaserSourcePositions } from "./engine";

interface BoardProps {
  state: GameState;
  onCellClick: (row: number, col: number) => void;
}

const CELL_SIZE = 60;
const BOARD_PX = CELL_SIZE * GRID_SIZE;

function laserEndpoint(pos: Position): { x: number; y: number } {
  const clamped = {
    row: Math.max(-0.5, Math.min(GRID_SIZE - 0.5, pos.row)),
    col: Math.max(-0.5, Math.min(GRID_SIZE - 0.5, pos.col)),
  };
  return {
    x: (clamped.col + 0.5) * CELL_SIZE,
    y: (clamped.row + 0.5) * CELL_SIZE,
  };
}

function MirrorIcon({
  mirrorType,
  color,
}: {
  mirrorType: MirrorType;
  color: string;
}) {
  const pad = 10;
  if (mirrorType === "/") {
    return (
      <svg
        width={CELL_SIZE - 8}
        height={CELL_SIZE - 8}
        viewBox={`0 0 ${CELL_SIZE} ${CELL_SIZE}`}
        className="pointer-events-none"
      >
        <line
          x1={pad}
          y1={CELL_SIZE - pad}
          x2={CELL_SIZE - pad}
          y2={pad}
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          filter={`drop-shadow(0 0 4px ${color})`}
        />
      </svg>
    );
  }
  return (
    <svg
      width={CELL_SIZE - 8}
      height={CELL_SIZE - 8}
      viewBox={`0 0 ${CELL_SIZE} ${CELL_SIZE}`}
      className="pointer-events-none"
    >
      <line
        x1={pad}
        y1={pad}
        x2={CELL_SIZE - pad}
        y2={CELL_SIZE - pad}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        filter={`drop-shadow(0 0 4px ${color})`}
      />
    </svg>
  );
}

function LaserSVG({ segments }: { segments: LaserSegment[] }) {
  return (
    <svg
      width={BOARD_PX}
      height={BOARD_PX}
      className="pointer-events-none absolute left-0 top-0"
      style={{ zIndex: 10 }}
    >
      {segments.map((seg, i) => {
        const from = laserEndpoint(seg.from);
        const to = laserEndpoint(seg.to);
        const color = PLAYER_COLORS[seg.playerIndex];
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.8}
            filter={`drop-shadow(0 0 6px ${color})`}
          />
        );
      })}
    </svg>
  );
}

function LaserSourceIndicators({ playerCount }: { playerCount: number }) {
  const sources = getLaserSourcePositions(playerCount);

  return (
    <>
      {sources.map((src, i) => {
        const color = PLAYER_COLORS[src.playerIndex];
        let style: React.CSSProperties = { position: "absolute", zIndex: 20 };
        const arrowSize = 20;

        if (src.direction === "right") {
          const cy = (src.pos.row + 0.5) * CELL_SIZE;
          style = { ...style, left: -arrowSize - 4, top: cy - arrowSize / 2 };
        } else if (src.direction === "left") {
          const cy = (src.pos.row + 0.5) * CELL_SIZE;
          style = { ...style, right: -arrowSize - 4, top: cy - arrowSize / 2 };
        } else if (src.direction === "down") {
          const cx = (src.pos.col + 0.5) * CELL_SIZE;
          style = { ...style, left: cx - arrowSize / 2, top: -arrowSize - 4 };
        }

        const rotation =
          src.direction === "right"
            ? 0
            : src.direction === "down"
            ? 90
            : src.direction === "left"
            ? 180
            : 270;

        return (
          <div key={i} style={style}>
            <svg
              width={arrowSize}
              height={arrowSize}
              viewBox="0 0 20 20"
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <polygon points="2,4 18,10 2,16" fill={color} />
            </svg>
          </div>
        );
      })}
    </>
  );
}

export default function Board({ state, onCellClick }: BoardProps) {
  const currentColor = PLAYER_COLORS[state.currentPlayer];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Board instruction banner */}
      {state.phase === "playing" && (
        <div
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium animate-pulse"
          style={{
            borderColor: currentColor,
            backgroundColor: `${currentColor}15`,
            color: currentColor,
          }}
        >
          <span className="text-lg">👇</span>
          Click any dark cell on the board to place your mirror
        </div>
      )}

      <div
        className="relative"
        style={{ width: BOARD_PX, height: BOARD_PX, margin: "30px" }}
      >
        <LaserSourceIndicators playerCount={state.playerCount} />
        <LaserSVG segments={state.laserSegments} />

        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {state.board.flat().map((cell) => {
            const isEmpty = cell.content.type === "empty";
            const isOwnMirror =
              cell.content.type === "mirror" &&
              cell.content.playerIndex === state.currentPlayer;
            const isClickable =
              state.phase === "playing" && (isEmpty || isOwnMirror);

            return (
              <div
                key={`${cell.row}-${cell.col}`}
                onClick={() => isClickable && onCellClick(cell.row, cell.col)}
                className={`relative flex items-center justify-center border transition-all ${
                  isClickable
                    ? "cursor-pointer border-white/20 hover:border-white/50"
                    : "cursor-default border-white/5"
                }`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: isClickable
                    ? "rgba(30, 41, 59, 0.95)"
                    : "rgba(15, 23, 42, 0.8)",
                  boxShadow: isClickable
                    ? `inset 0 0 12px ${currentColor}20`
                    : "none",
                }}
                title={
                  isEmpty
                    ? "Click to place mirror here"
                    : isOwnMirror
                    ? "Click to rotate your mirror"
                    : undefined
                }
              >
                {/* Clickable indicator dot for empty cells */}
                {isEmpty && state.phase === "playing" && (
                  <div
                    className="absolute h-2 w-2 rounded-full opacity-40"
                    style={{ backgroundColor: currentColor }}
                  />
                )}

                {/* Rotate hint for own mirrors */}
                {isOwnMirror && (
                  <div
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
                    style={{
                      backgroundColor: currentColor,
                      color: "white",
                    }}
                  >
                    ↻
                  </div>
                )}

                {cell.content.type === "gem" && (
                  <span
                    className="animate-pulse-glow text-2xl"
                    style={{
                      filter: cell.content.claimed
                        ? `drop-shadow(0 0 8px ${
                            PLAYER_COLORS[cell.content.claimedBy!]
                          })`
                        : "drop-shadow(0 0 8px #a78bfa)",
                    }}
                  >
                    {cell.content.claimed ? "✅" : "💎"}
                  </span>
                )}
                {cell.content.type === "mirror" && (
                  <MirrorIcon
                    mirrorType={cell.content.mirrorType}
                    color={PLAYER_COLORS[cell.content.playerIndex]}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
