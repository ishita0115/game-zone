import { Card, CARD_EMOJIS, GameState, PlayerState, TOTAL_PAIRS } from "./types";
import { PLAYER_COLORS } from "@/types/game";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createInitialState(
  playerCount: number,
  playerNames: string[]
): GameState {
  const emojis = shuffle(CARD_EMOJIS).slice(0, TOTAL_PAIRS);
  const pairs = shuffle([...emojis, ...emojis]);

  const cards: Card[] = pairs.map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));

  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      name: playerNames[i] || `Player ${i + 1}`,
      color: PLAYER_COLORS[i],
      score: 0,
    });
  }

  return {
    cards,
    players,
    currentPlayer: 0,
    playerCount,
    flippedCards: [],
    phase: "playing",
    winner: null,
    totalPairs: TOTAL_PAIRS,
    matchedPairs: 0,
  };
}

export function flipCard(state: GameState, cardIndex: number): GameState | null {
  if (state.phase !== "playing") return null;
  if (state.flippedCards.length >= 2) return null;

  const card = state.cards[cardIndex];
  if (card.flipped || card.matched) return null;

  const newCards = state.cards.map((c, i) =>
    i === cardIndex ? { ...c, flipped: true } : { ...c }
  );
  const newFlipped = [...state.flippedCards, cardIndex];

  if (newFlipped.length === 2) {
    // Two cards flipped - check for match
    return {
      ...state,
      cards: newCards,
      flippedCards: newFlipped,
      phase: "checking",
    };
  }

  return {
    ...state,
    cards: newCards,
    flippedCards: newFlipped,
  };
}

export function resolveFlip(state: GameState): GameState {
  if (state.phase !== "checking" || state.flippedCards.length !== 2) return state;

  const [i1, i2] = state.flippedCards;
  const card1 = state.cards[i1];
  const card2 = state.cards[i2];
  const isMatch = card1.emoji === card2.emoji;

  const newCards = state.cards.map((c, i) => {
    if (isMatch && (i === i1 || i === i2)) {
      return { ...c, matched: true, flipped: false };
    }
    if (!isMatch && (i === i1 || i === i2)) {
      return { ...c, flipped: false };
    }
    return { ...c };
  });

  const newPlayers = state.players.map((p, i) => {
    if (isMatch && i === state.currentPlayer) {
      return { ...p, score: p.score + 1 };
    }
    return { ...p };
  });

  const newMatchedPairs = state.matchedPairs + (isMatch ? 1 : 0);
  const finished = newMatchedPairs >= state.totalPairs;

  let winner: number | null = null;
  if (finished) {
    let maxScore = -1;
    for (let i = 0; i < newPlayers.length; i++) {
      if (newPlayers[i].score > maxScore) {
        maxScore = newPlayers[i].score;
        winner = i;
      }
    }
  }

  // If match, same player goes again
  const nextPlayer = isMatch
    ? state.currentPlayer
    : (state.currentPlayer + 1) % state.playerCount;

  return {
    ...state,
    cards: newCards,
    players: newPlayers,
    flippedCards: [],
    currentPlayer: nextPlayer,
    phase: finished ? "finished" : "playing",
    winner,
    matchedPairs: newMatchedPairs,
  };
}
