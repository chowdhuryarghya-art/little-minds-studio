import { useEffect, useReducer, useState } from 'react'
import { createMemoryState, isComplete, memoryReducer } from './memoryState.ts'

const MISMATCH_DELAY_MS = 900

function Board({ pairs }: { pairs: number }) {
  const [state, dispatch] = useReducer(memoryReducer, pairs, (p) => createMemoryState(p))

  useEffect(() => {
    if (state.selected.length < 2) return
    const timer = setTimeout(() => dispatch({ type: 'resolve' }), MISMATCH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [state.selected])

  const columns = state.cards.length <= 6 ? 3 : 4

  return (
    <>
      <p className="center muted">Moves: {state.moves}</p>
      <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {state.cards.map((card, index) => {
          const faceUp = card.flipped || card.matched
          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card${faceUp ? ' up' : ''}${card.matched ? ' matched' : ''}`}
              aria-label={faceUp ? card.label : 'Hidden card'}
              aria-pressed={faceUp}
              onClick={() => dispatch({ type: 'flip', index })}
            >
              {faceUp ? card.symbol : '?'}
            </button>
          )
        })}
      </div>
      {isComplete(state) && (
        <p className="celebrate" role="status">
          🎉 You found every pair in {state.moves} moves!
        </p>
      )}
    </>
  )
}

export default function MemoryGame({ pairs }: { pairs: number }) {
  const [round, setRound] = useState(0)
  return (
    <div className="memory-game">
      {/* key remounts Board, dealing a fresh shuffled deck */}
      <Board key={round} pairs={pairs} />
      <p className="center">
        <button type="button" className="tool" onClick={() => setRound((r) => r + 1)}>
          New game
        </button>
      </p>
    </div>
  )
}
