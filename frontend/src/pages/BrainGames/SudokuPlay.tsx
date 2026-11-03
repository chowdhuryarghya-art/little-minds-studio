import { Link } from 'react-router-dom'
import SudokuGame from '../../games/sudoku/SudokuGame.tsx'

export default function SudokuPlay() {
  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/brain-games">
          ← Brain Games
        </Link>
      </p>
      <h1 className="center">Sudoku</h1>
      <p className="center muted">Fill every row, column, and 3 × 3 box with numbers 1 to 9.</p>
      <SudokuGame />
    </section>
  )
}
