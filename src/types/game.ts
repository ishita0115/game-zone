export type GameCategory = "adult" | "kids";
export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  label: string;
  emoji: string;
  color: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: "Easy", emoji: "🟢", color: "#22c55e" },
  medium: { label: "Medium", emoji: "🟡", color: "#f59e0b" },
  hard: { label: "Hard", emoji: "🔴", color: "#ef4444" },
};

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  emoji: string;
  minPlayers: number;
  maxPlayers: number;
  route: string;
  color: string;
  category: GameCategory;
  tag: string;
}

export const GAMES: GameInfo[] = [
  {
    id: "mirror-maze",
    name: "Mirror Maze",
    description: "Place mirrors to reflect laser beams and hit gems!",
    emoji: "🪞",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/mirror-maze",
    color: "from-violet-600 via-purple-600 to-cyan-500",
    category: "adult",
    tag: "Strategy",
  },
  {
    id: "color-flood",
    name: "Color Flood",
    description: "Pick colors to flood and expand your territory!",
    emoji: "🌊",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/color-flood",
    color: "from-emerald-500 via-green-500 to-teal-500",
    category: "adult",
    tag: "Strategy",
  },
  {
    id: "dots-and-boxes",
    name: "Dots & Boxes",
    description: "Draw lines between dots to complete boxes!",
    emoji: "🔲",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/dots-and-boxes",
    color: "from-orange-500 via-amber-500 to-yellow-500",
    category: "adult",
    tag: "Classic",
  },
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Flip cards and find matching emoji pairs!",
    emoji: "🃏",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/memory-match",
    color: "from-pink-500 via-rose-500 to-red-500",
    category: "kids",
    tag: "Memory",
  },
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Classic X and O — get three in a row to win!",
    emoji: "❌⭕",
    minPlayers: 2,
    maxPlayers: 2,
    route: "/games/tic-tac-toe",
    color: "from-sky-500 via-blue-500 to-indigo-500",
    category: "kids",
    tag: "Classic",
  },
];

export const PLAYER_COLORS = ["#06b6d4", "#f43f5e", "#f59e0b"] as const;
export const PLAYER_NAMES_DEFAULT = ["Player 1", "Player 2", "Player 3"];
