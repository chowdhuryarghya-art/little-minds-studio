import { useState } from 'react'
import { checkArithmeticCage, createArithmeticPuzzle } from './arithmeticGrid.ts'
import type { ArithmeticPuzzle } from './arithmeticGrid.ts'

export default function ArithmeticGridGame() {
  const [puzzle, setPuzzle] = useState<ArithmeticPuzzle>(() => createArithmeticPuzzle())
  const [values, setValues] = useState<number[]>(() => Array(16).fill(0))
  const [selected, setSelected] = useState<number | null>(null)
  const [status, setStatus] = useState('Fill each row and column with 1–4. Solve the clues in each outlined cage.')

  const enter = (value: number) => {
    if (selected === null) {
      setStatus('Choose a square first.')
      return
    }
    setValues((current) => current.map((item, index) => index === selected ? value : item))
    setStatus('Number placed. Keep solving!')
  }

  const erase = () => {
    if (selected === null) return
    setValues((current) => current.map((item, index) => index === selected ? 0 : item))
    setStatus('Square cleared.')
  }

  const check = () => {
    if (values.some((value) => value === 0)) {
      setStatus('A few squares are empty. Fill the grid before checking.')
      return
    }
    const rowsValid = Array.from({ length: 4 }, (_, row) =>
      new Set(values.slice(row * 4, row * 4 + 4)).size === 4,
    ).every(Boolean)
    const columnsValid = Array.from({ length: 4 }, (_, column) =>
      new Set(Array.from({ length: 4 }, (_, row) => values[row * 4 + column])).size === 4,
    ).every(Boolean)
    const cagesValid = puzzle.cages.every((cage) => checkArithmeticCage(cage, values))

    if (rowsValid && columnsValid && cagesValid) {
      setStatus('🎉 Brilliant arithmetic! You solved the whole grid!')
    } else {
      setStatus('Not quite yet. Check the row, column, and arithmetic cage clues.')
    }
  }

  const newPuzzle = () => {
    setPuzzle(createArithmeticPuzzle())
    setValues(Array(16).fill(0))
    setSelected(null)
    setStatus('New puzzle! Fill each row and column with 1–4.')
  }

  const cageLabels = new Map<number, string>()
  const cageForCell = new Map<number, number>()
  puzzle.cages.forEach((cage) => {
    const firstCell = Math.min(...cage.cells)
    cageLabels.set(firstCell, `${cage.target}${cage.operation === '=' ? '' : cage.operation}`)
    cage.cells.forEach((cell) => cageForCell.set(cell, firstCell))
  })

  return (
    <div className="arithmetic-grid-game">
      <p className="center muted">A kid-friendly KenKen-style challenge: use 1–4 once in each row and column, and solve every arithmetic cage.</p>
      <div className="arithmetic-grid" role="group" aria-label="Arithmetic crossword grid">
        {values.map((value, index) => {
          const row = Math.floor(index / 4)
          const column = index % 4
          const cage = cageForCell.get(index)
          const boundaries = [
            row === 0 || cageForCell.get(index - 4) !== cage ? 'cage-edge-top' : '',
            row === 3 || cageForCell.get(index + 4) !== cage ? 'cage-edge-bottom' : '',
            column === 0 || cageForCell.get(index - 1) !== cage ? 'cage-edge-left' : '',
            column === 3 || cageForCell.get(index + 1) !== cage ? 'cage-edge-right' : '',
          ].filter(Boolean).join(' ')
          return (
            <button
              key={index}
              type="button"
              className={`arithmetic-cell ${boundaries}${selected === index ? ' selected' : ''}`}
              aria-label={`Row ${row + 1}, column ${column + 1}${value ? `, ${value}` : ', empty'}${cageLabels.has(cage ?? -1) ? `, cage ${cageLabels.get(cage ?? -1)}` : ''}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {cageLabels.has(cage ?? -1) && <small className="cage-label">{cageLabels.get(cage ?? -1)}</small>}
              <span>{value || ''}</span>
            </button>
          )
        })}
      </div>
      <div className="arithmetic-number-pad" role="group" aria-label="Choose a number">
        {[1, 2, 3, 4].map((number) => (
          <button key={number} type="button" className="tool" onClick={() => enter(number)}>{number}</button>
        ))}
        <button type="button" className="tool" onClick={erase}>Erase</button>
      </div>
      <p className="center arithmetic-status" role="status" aria-live="polite">{status}</p>
      <div className="brain-game-actions">
        <button type="button" className="tool" onClick={check}>Check grid</button>
        <button type="button" className="tool" onClick={newPuzzle}>New puzzle</button>
      </div>
    </div>
  )
}
