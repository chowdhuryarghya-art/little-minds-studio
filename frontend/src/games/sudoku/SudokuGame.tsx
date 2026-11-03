import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { generateSudoku } from './sudoku.ts'
import type { SudokuDifficulty, SudokuPuzzle } from './sudoku.ts'

const DIFFICULTIES: { id: SudokuDifficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('easy')
  const [puzzle, setPuzzle] = useState<SudokuPuzzle>(() => generateSudoku('easy'))
  const [entries, setEntries] = useState(() => [...puzzle.puzzle])
  const [selected, setSelected] = useState<number | null>(null)
  const [status, setStatus] = useState('Choose a square, then tap a number.')

  const startNewPuzzle = (nextDifficulty: SudokuDifficulty = difficulty) => {
    const next = generateSudoku(nextDifficulty)
    setDifficulty(nextDifficulty)
    setPuzzle(next)
    setEntries([...next.puzzle])
    setSelected(null)
    setStatus('Choose a square, then tap a number.')
  }

  const enterDigit = (digit: number) => {
    if (selected === null || puzzle.puzzle[selected] !== 0) return
    setEntries((current) => current.map((value, index) => (index === selected ? digit : value)))
    setStatus('Number added. Keep going!')
  }

  const clearSelected = () => {
    if (selected === null || puzzle.puzzle[selected] !== 0) return
    setEntries((current) => current.map((value, index) => (index === selected ? 0 : value)))
    setStatus('Square cleared.')
  }

  const checkPuzzle = () => {
    const empty = entries.filter((value) => value === 0).length
    if (empty > 0) {
      setStatus(`There ${empty === 1 ? 'is' : 'are'} ${empty} empty ${empty === 1 ? 'square' : 'squares'} left.`)
      return
    }
    const correct = entries.every((value, index) => value === puzzle.solution[index])
    setStatus(correct ? '🎉 Brilliant! You solved the Sudoku!' : 'Some numbers need another look. You can do it!')
  }

  const onBoardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (selected === null) return
    const delta: Record<string, number> = {
      ArrowUp: -9,
      ArrowDown: 9,
      ArrowLeft: -1,
      ArrowRight: 1,
    }
    if (event.key in delta) {
      event.preventDefault()
      setSelected((current) =>
        current === null ? null : Math.max(0, Math.min(80, current + delta[event.key])),
      )
      return
    }
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault()
      enterDigit(Number(event.key))
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      clearSelected()
    }
  }

  return (
    <div className="sudoku-game">
      <div className="chips sudoku-difficulties" role="group" aria-label="Sudoku difficulty">
        {DIFFICULTIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`chip${difficulty === id ? ' selected' : ''}`}
            aria-pressed={difficulty === id}
            onClick={() => startNewPuzzle(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="sudoku-board" role="group" aria-label="Sudoku puzzle" onKeyDown={onBoardKeyDown}>
        {entries.map((value, index) => {
          const row = Math.floor(index / 9)
          const column = index % 9
          const isGiven = puzzle.puzzle[index] !== 0
          const isSelected = selected === index
          const sameDigit = selected !== null && value !== 0 && value === entries[selected]
          const wrong = !isGiven && value !== 0 && value !== puzzle.solution[index]
          return (
            <button
              key={index}
              type="button"
              className={[
                'sudoku-cell',
                column % 3 === 2 && column !== 8 ? 'box-right' : '',
                row % 3 === 2 && row !== 8 ? 'box-bottom' : '',
                isGiven ? 'given' : 'entry',
                isSelected ? 'selected' : '',
                sameDigit ? 'same-digit' : '',
                wrong ? 'wrong' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={`Row ${row + 1}, column ${column + 1}${value ? `, ${isGiven ? 'given ' : ''}${value}` : ', empty'}${wrong ? ', check this number' : ''}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(index)}
            >
              {value || ''}
            </button>
          )
        })}
      </div>
      <div className="sudoku-number-pad" role="group" aria-label="Choose a number">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((digit) => (
          <button key={digit} type="button" className="tool" onClick={() => enterDigit(digit)}>
            {digit}
          </button>
        ))}
        <button type="button" className="tool" onClick={clearSelected}>
          Erase
        </button>
      </div>
      <p className="center sudoku-status" role="status" aria-live="polite">
        {status}
      </p>
      <div className="sudoku-actions">
        <button type="button" className="tool" onClick={checkPuzzle}>
          Check puzzle
        </button>
        <button type="button" className="tool" onClick={() => startNewPuzzle()}>
          New puzzle
        </button>
      </div>
    </div>
  )
}
