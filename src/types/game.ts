export type GameCategory = "adult" | "kids";

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
  // ===== ADULT / STRATEGY GAMES =====
  {
    id: "mirror-maze",
    name: "Mirror Maze",
    description:
      "Place mirrors to reflect laser beams and hit gems! A brain-bending strategy game of light and angles.",
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
    description:
      "Pick colors to flood and expand your territory! A colorful battle of area control.",
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
    description:
      "Draw lines between dots to complete boxes and claim them! A classic game of clever moves.",
    emoji: "🔲",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/dots-and-boxes",
    color: "from-orange-500 via-amber-500 to-yellow-500",
    category: "adult",
    tag: "Classic",
  },
  // ===== KIDS GAMES =====
  {
    id: "memory-match",
    name: "Memory Match",
    description:
      "Flip cards and find matching pairs! Test your memory in this fun and colorful card game.",
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
    description:
      "The classic X and O game! Get three in a row to win. Simple, fast, and super fun!",
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
