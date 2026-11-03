import { useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Color, PieceSymbol, Square } from 'chess.js'

const PIECE_GLYPHS: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
}

const PIECE_NAMES: Record<PieceSymbol, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
}

function evaluateForBlack(chess: Chess): number {
  if (chess.isCheckmate()) return chess.turn() === 'w' ? 1000 : -1000
  if (chess.isDraw()) return 0

  let score = 0
  for (const row of chess.board()) {
    for (const piece of row) {
      if (piece) score += (piece.color === 'b' ? 1 : -1) * PIECE_VALUES[piece.type]
    }
  }
  return score
}

function chooseComputerMove(fen: string): { from: Square; to: Square; promotion?: string } | null {
  const chess = new Chess(fen)
  const candidates: { from: Square; to: Square; promotion?: string; score: number }[] = []

  for (const move of chess.moves({ verbose: true })) {
    chess.move({ from: move.from, to: move.to, promotion: 'q' })
    let score = evaluateForBlack(chess)
    if (!chess.isGameOver()) {
      score = Infinity
      for (const reply of chess.moves({ verbose: true })) {
        chess.move({ from: reply.from, to: reply.to, promotion: 'q' })
        score = Math.min(score, evaluateForBlack(chess))
        chess.undo()
      }
    }
    chess.undo()
    candidates.push({
      from: move.from,
      to: move.to,
      ...(move.promotion ? { promotion: 'q' } : {}),
      score,
    })
  }

  if (candidates.length === 0) return null
  const best = Math.max(...candidates.map((candidate) => candidate.score))
  const friendlyMoves = candidates.filter((candidate) => candidate.score >= best - 1.5)
  const { from, to, promotion } = friendlyMoves[Math.floor(Math.random() * friendlyMoves.length)]
  return { from, to, ...(promotion ? { promotion } : {}) }
}

function getStatus(chess: Chess, thinking: boolean): string {
  if (thinking) return 'Computer is thinking…'
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? 'Checkmate! The computer wins this round.' : 'Checkmate! You win!'
  }
  if (chess.isStalemate()) return 'Stalemate! The game is a draw.'
  if (chess.isDraw()) return 'It’s a draw! Nice game.'
  if (chess.isCheck()) return chess.turn() === 'w' ? 'Your king is in check!' : 'Computer is in check!'
  return chess.turn() === 'w' ? 'Your turn — you are White.' : 'Computer is thinking…'
}

export default function ChessGame() {
  const [chess, setChess] = useState(() => new Chess())
  const [selected, setSelected] = useState<Square | null>(null)
  const [thinking, setThinking] = useState(false)
  const timer = useRef<number | null>(null)
  const legalMoves = selected
    ? chess.moves({ square: selected, verbose: true }).map((move) => move.to)
    : []
  const lastMove = chess.history({ verbose: true }).at(-1)
  const gameOver = chess.isGameOver()

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const restart = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setThinking(false)
    setSelected(null)
    setChess(new Chess())
  }

  const onSquareClick = (square: Square) => {
    if (thinking || gameOver || chess.turn() !== 'w') return

    if (selected && legalMoves.includes(square)) {
      chess.move({ from: selected, to: square, promotion: 'q' })
      setSelected(null)
      setChess(new Chess(chess.fen()))
      if (!chess.isGameOver()) {
        setThinking(true)
        const fen = chess.fen()
        timer.current = window.setTimeout(() => {
          const current = new Chess(fen)
          const reply = chooseComputerMove(fen)
          if (reply) current.move(reply)
          setChess(current)
          setThinking(false)
          timer.current = null
        }, 350)
      }
      return
    }

    const piece = chess.get(square)
    if (piece?.color === 'w') {
      setSelected(square)
    } else {
      setSelected(null)
    }
  }

  return (
    <div className="chess-game">
      <div className="chess-board" role="group" aria-label="Chess board">
        {chess.board().flatMap((row, rowIndex) =>
          row.map((piece, columnIndex) => {
            const square = `${'abcdefgh'[columnIndex]}${8 - rowIndex}` as Square
            const isLight = (rowIndex + columnIndex) % 2 === 0
            const isSelected = selected === square
            const isLegalTarget = legalMoves.includes(square)
            const isLastMove = lastMove?.from === square || lastMove?.to === square
            const squareClasses = [
              'chess-square',
              isLight ? 'light' : 'dark',
              isSelected ? 'selected' : '',
              isLegalTarget ? 'legal-target' : '',
              isLegalTarget && piece ? 'capture-target' : '',
              isLastMove ? 'last-move' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={square}
                type="button"
                className={squareClasses}
                aria-label={`${square}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${PIECE_NAMES[piece.type]}` : ' empty'}`}
                aria-pressed={isSelected}
                onClick={() => onSquareClick(square)}
              >
                {piece && (
                  <span className={`chess-piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`}>
                    {PIECE_GLYPHS[piece.color][piece.type]}
                  </span>
                )}
                {isLegalTarget && !piece && <span className="chess-move-dot" />}
              </button>
            )
          }),
        )}
      </div>
      <p className="center chess-status" role="status" aria-live="polite">
        {getStatus(chess, thinking)}
      </p>
      <p className="center muted">You play White. Tap one of your pieces, then tap a highlighted square.</p>
      <div className="center">
        <button type="button" className="tool" onClick={restart}>
          New game
        </button>
      </div>
    </div>
  )
}
