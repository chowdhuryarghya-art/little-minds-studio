import { Link } from 'react-router-dom'
import { useState } from 'react'
import ChessGame from '../../games/chess/ChessGame.tsx'

export default function ChessPractice() {
  const [started, setStarted] = useState(false)

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/brain-games">
          ← Brain Games
        </Link>
      </p>
      <h1 className="center">Chess Practice</h1>
      <aside className="chess-disclaimer" aria-label="Chess practice notice">
        <strong>Learning and practice only</strong>
        <p>
          This game is for learning chess basics and practicing. It does not replace proper
          training. For structured chess lessons, learn with a chess coach, teacher, or chess club.
        </p>
      </aside>
      {started ? (
        <ChessGame />
      ) : (
        <div className="center chess-start">
          <p>Play as White against the computer. Choose a move and see what happens next!</p>
          <button type="button" className="btn big" onClick={() => setStarted(true)}>
            Start chess practice
          </button>
        </div>
      )}
    </section>
  )
}
