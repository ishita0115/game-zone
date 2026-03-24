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

function cellCenter(row: number, col: number): { x: number; y: number } {
  return {
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2,
  };
}

function laserEndpoint(
  pos: Position
): { x: number; y: number } {
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
          style = {
            ...style,
            left: -arrowSize - 4,
            top: cy - arrowSize / 2,
          };
        } else if (src.direction === "left") {
          const cy = (src.pos.row + 0.5) * CELL_SIZE;
          style = {
            ...style,
            right: -arrowSize - 4,
            top: cy - arrowSize / 2,
          };
        } else if (src.direction === "down") {
          const cx = (src.pos.col + 0.5) * CELL_SIZE;
          style = {
            ...style,
            left: cx - arrowSize / 2,
            top: -arrowSize - 4,
          };
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
              <polygon
                points="2,4 18,10 2,16"
                fill={color}
              />
            </svg>
          </div>
        );
      })}
    </>
  );
}

export default function Board({ state, onCellClick }: BoardProps) {
  return (
    <div
      className="relative"
      style={{
        width: BOARD_PX,
        height: BOARD_PX,
        margin: "30px",
      }}
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
          const isClickable =
            state.phase === "playing" &&
            (cell.content.type === "empty" ||
              (cell.content.type === "mirror" &&
                cell.content.playerIndex === state.currentPlayer));

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              onClick={() => isClickable && onCellClick(cell.row, cell.col)}
              className={`flex items-center justify-center border border-white/5 transition-all ${
                isClickable
                  ? "cursor-pointer hover:bg-white/10"
                  : "cursor-default"
              }`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: "rgba(15, 23, 42, 0.8)",
              }}
            >
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
  );
}
