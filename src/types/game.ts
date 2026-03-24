export interface GameInfo {
  id: string;
  name: string;
  description: string;
  emoji: string;
  minPlayers: number;
  maxPlayers: number;
  route: string;
  color: string;
}

export const GAMES: GameInfo[] = [
  {
    id: "mirror-maze",
    name: "Mirror Maze",
    description:
      "Place mirrors to reflect your laser beam and hit gems before your opponents! A unique strategy game of light and angles.",
    emoji: "🪞",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/mirror-maze",
    color: "from-violet-600 to-cyan-500",
  },
  {
    id: "color-flood",
    name: "Color Flood",
    description:
      "Pick colors to flood your territory and capture the board! A colorful strategy game of expansion and control.",
    emoji: "🌊",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/color-flood",
    color: "from-emerald-600 to-teal-500",
  },
  {
    id: "dots-and-boxes",
    name: "Dots & Boxes",
    description:
      "Draw lines between dots to complete boxes and claim them! A classic pen-and-paper game of strategy.",
    emoji: "🔲",
    minPlayers: 2,
    maxPlayers: 3,
    route: "/games/dots-and-boxes",
    color: "from-orange-600 to-amber-500",
  },
];

export const PLAYER_COLORS = ["#06b6d4", "#f43f5e", "#f59e0b"] as const;
export const PLAYER_NAMES_DEFAULT = ["Player 1", "Player 2", "Player 3"];
