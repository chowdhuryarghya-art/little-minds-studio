export interface MemoryCard {
  id: number
  symbol: string
  label: string
  flipped: boolean
  matched: boolean
}

export interface MemoryState {
  cards: MemoryCard[]
  /** Indices of face-up cards that are not yet matched (max 2). */
  selected: number[]
  moves: number
}

export type MemoryAction =
  | { type: 'flip'; index: number }
  | { type: 'resolve' }

export interface CardFace {
  symbol: string
  label: string
}

export const SYMBOLS: CardFace[] = [
  { symbol: '🐶', label: 'Dog' },
  { symbol: '🐱', label: 'Cat' },
  { symbol: '🐘', label: 'Elephant' },
  { symbol: '🦁', label: 'Lion' },
  { symbol: '🐸', label: 'Frog' },
  { symbol: '🐢', label: 'Turtle' },
  { symbol: '🦋', label: 'Butterfly' },
  { symbol: '🐟', label: 'Fish' },
]

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function createMemoryState(pairs: number, random: () => number = Math.random): MemoryState {
  const chosen = shuffle(SYMBOLS, random).slice(0, Math.min(pairs, SYMBOLS.length))
  const deck = shuffle([...chosen, ...chosen], random)
  return {
    cards: deck.map((s, id) => ({ id, ...s, flipped: false, matched: false })),
    selected: [],
    moves: 0,
  }
}

export function isComplete(state: MemoryState): boolean {
  return state.cards.length > 0 && state.cards.every((c) => c.matched)
}

export function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
  switch (action.type) {
    case 'flip': {
      const card = state.cards[action.index]
      if (!card || card.flipped || card.matched || state.selected.length >= 2) return state

      const selected = [...state.selected, action.index]
      let cards = state.cards.map((c, i) => (i === action.index ? { ...c, flipped: true } : c))
      if (selected.length < 2) return { ...state, cards, selected }

      const [a, b] = selected
      if (cards[a].symbol === cards[b].symbol) {
        cards = cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
        return { cards, selected: [], moves: state.moves + 1 }
      }
      return { cards, selected, moves: state.moves + 1 }
    }
    case 'resolve': {
      if (state.selected.length < 2) return state
      return {
        ...state,
        cards: state.cards.map((c, i) => (state.selected.includes(i) ? { ...c, flipped: false } : c)),
        selected: [],
      }
    }
  }
}
