import { Card, CARD_EMOJIS, DIFFICULTY_CONFIG, GameState, PlayerState } from "./types";
import { Difficulty, PLAYER_COLORS } from "@/types/game";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function createInitialState(playerCount: number, playerNames: string[], difficulty: Difficulty = "medium"): GameState {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const emojis = shuffle(CARD_EMOJIS).slice(0, cfg.pairs);
  const pairs = shuffle([...emojis, ...emojis]);
  const cards: Card[] = pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({ name: playerNames[i] || `Player ${i + 1}`, color: PLAYER_COLORS[i], score: 0 });
  }
  return { cards, players, currentPlayer: 0, playerCount, flippedCards: [], phase: "playing", winner: null, totalPairs: cfg.pairs, matchedPairs: 0, gridCols: cfg.cols, difficulty };
}

export function flipCard(state: GameState, cardIndex: number): GameState | null {
  if (state.phase !== "playing" || state.flippedCards.length >= 2) return null;
  const card = state.cards[cardIndex];
  if (card.flipped || card.matched) return null;

  const newCards = state.cards.map((c, i) => i === cardIndex ? { ...c, flipped: true } : { ...c });
  const newFlipped = [...state.flippedCards, cardIndex];

  if (newFlipped.length === 2) return { ...state, cards: newCards, flippedCards: newFlipped, phase: "checking" };
  return { ...state, cards: newCards, flippedCards: newFlipped };
}

export function resolveFlip(state: GameState): GameState {
  if (state.phase !== "checking" || state.flippedCards.length !== 2) return state;
  const [i1, i2] = state.flippedCards;
  const isMatch = state.cards[i1].emoji === state.cards[i2].emoji;

  const newCards = state.cards.map((c, i) => {
    if (isMatch && (i === i1 || i === i2)) return { ...c, matched: true, flipped: false };
    if (!isMatch && (i === i1 || i === i2)) return { ...c, flipped: false };
    return { ...c };
  });

  const newPlayers = state.players.map((p, i) => isMatch && i === state.currentPlayer ? { ...p, score: p.score + 1 } : { ...p });
  const newMatched = state.matchedPairs + (isMatch ? 1 : 0);
  const finished = newMatched >= state.totalPairs;
  let winner: number | null = null;
  if (finished) { let max = -1; newPlayers.forEach((p, i) => { if (p.score > max) { max = p.score; winner = i; } }); }

  return { ...state, cards: newCards, players: newPlayers, flippedCards: [], currentPlayer: isMatch ? state.currentPlayer : (state.currentPlayer + 1) % state.playerCount, phase: finished ? "finished" : "playing", winner, matchedPairs: newMatched };
}
