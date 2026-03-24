"use client";

import { Difficulty, DIFFICULTIES } from "@/types/game";

interface Props {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  accentColor: string;
}

export default function DifficultySelector({ value, onChange, accentColor }: Props) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs text-gray-500">Difficulty</p>
      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
          const cfg = DIFFICULTIES[d];
          const active = value === d;
          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg border-2 py-2 text-xs font-bold transition-all ${
                active
                  ? "scale-105 text-white"
                  : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
              }`}
              style={
                active
                  ? {
                      borderColor: accentColor,
                      backgroundColor: `${accentColor}20`,
                    }
                  : undefined
              }
            >
              <span className="text-sm">{cfg.emoji}</span>
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
