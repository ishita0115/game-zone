"use client";

import { GameState, LaserSegment, MirrorType, Position } from "./types";
import { PLAYER_COLORS } from "@/types/game";
import { getLaserSourcePositions } from "./engine";

interface BoardProps {
  state: GameState;
  onCellClick: (row: number, col: number) => void;
}

const CELL_SIZE = 52;

function laserEndpoint(pos: Position, gs: number) {
  return {
    x: (Math.max(-0.5, Math.min(gs - 0.5, pos.col)) + 0.5) * CELL_SIZE,
    y: (Math.max(-0.5, Math.min(gs - 0.5, pos.row)) + 0.5) * CELL_SIZE,
  };
}

function MirrorIcon({ mirrorType, color }: { mirrorType: MirrorType; color: string }) {
  const pad = 10;
  const s = CELL_SIZE;
  const coords = mirrorType === "/" ? { x1: pad, y1: s - pad, x2: s - pad, y2: pad } : { x1: pad, y1: pad, x2: s - pad, y2: s - pad };
  return (
    <svg width={s - 8} height={s - 8} viewBox={`0 0 ${s} ${s}`} className="pointer-events-none">
      <line {...coords} stroke={color} strokeWidth={4} strokeLinecap="round" filter={`drop-shadow(0 0 4px ${color})`} />
    </svg>
  );
}

export default function Board({ state, onCellClick }: BoardProps) {
  const gs = state.gridSize;
  const boardPx = CELL_SIZE * gs;
  const currentColor = PLAYER_COLORS[state.currentPlayer];
  const sources = getLaserSourcePositions(state.playerCount, gs);

  return (
    <div className="relative" style={{ width: boardPx, height: boardPx, margin: 20 }}>
      {/* Laser source arrows */}
      {sources.map((src, i) => {
        const color = PLAYER_COLORS[src.playerIndex];
        const sz = 18;
        let style: React.CSSProperties = { position: "absolute", zIndex: 20 };
        if (src.direction === "right") style = { ...style, left: -sz - 4, top: (src.pos.row + 0.5) * CELL_SIZE - sz / 2 };
        else if (src.direction === "left") style = { ...style, right: -sz - 4, top: (src.pos.row + 0.5) * CELL_SIZE - sz / 2 };
        else if (src.direction === "down") style = { ...style, left: (src.pos.col + 0.5) * CELL_SIZE - sz / 2, top: -sz - 4 };
        const rot = src.direction === "right" ? 0 : src.direction === "down" ? 90 : src.direction === "left" ? 180 : 270;
        return <div key={i} style={style}><svg width={sz} height={sz} viewBox="0 0 20 20" style={{ filter: `drop-shadow(0 0 6px ${color})`, transform: `rotate(${rot}deg)` }}><polygon points="2,4 18,10 2,16" fill={color} /></svg></div>;
      })}

      {/* Laser lines */}
      <svg width={boardPx} height={boardPx} className="pointer-events-none absolute left-0 top-0" style={{ zIndex: 10 }}>
        {state.laserSegments.map((seg, i) => {
          const from = laserEndpoint(seg.from, gs);
          const to = laserEndpoint(seg.to, gs);
          const c = PLAYER_COLORS[seg.playerIndex];
          return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={c} strokeWidth={3} strokeLinecap="round" opacity={0.8} filter={`drop-shadow(0 0 6px ${c})`} />;
        })}
      </svg>

      {/* Grid */}
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${gs}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${gs}, ${CELL_SIZE}px)` }}>
        {state.board.flat().map((cell) => {
          const isEmpty = cell.content.type === "empty";
          const isOwn = cell.content.type === "mirror" && cell.content.playerIndex === state.currentPlayer;
          const click = state.phase === "playing" && (isEmpty || isOwn);
          return (
            <div key={`${cell.row}-${cell.col}`} onClick={() => click && onCellClick(cell.row, cell.col)}
              className={`relative flex items-center justify-center border transition-all ${click ? "cursor-pointer border-white/20 hover:border-white/50" : "cursor-default border-white/5"}`}
              style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor: click ? "rgba(30,41,59,0.95)" : "rgba(15,23,42,0.8)", boxShadow: click ? `inset 0 0 12px ${currentColor}20` : "none" }}
              title={isEmpty ? "Place mirror" : isOwn ? "Rotate mirror" : undefined}>
              {isEmpty && state.phase === "playing" && <div className="absolute h-2 w-2 rounded-full opacity-40" style={{ backgroundColor: currentColor }} />}
              {isOwn && <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold" style={{ backgroundColor: currentColor, color: "white" }}>↻</div>}
              {cell.content.type === "gem" && <span className="animate-pulse-glow text-xl" style={{ filter: cell.content.claimed ? `drop-shadow(0 0 8px ${PLAYER_COLORS[cell.content.claimedBy!]})` : "drop-shadow(0 0 8px #a78bfa)" }}>{cell.content.claimed ? "✅" : "💎"}</span>}
              {cell.content.type === "mirror" && <MirrorIcon mirrorType={cell.content.mirrorType} color={PLAYER_COLORS[cell.content.playerIndex]} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
