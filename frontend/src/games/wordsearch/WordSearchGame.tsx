import { useState } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import { findWord, generateWordSearch, lineBetween } from './wordsearch.ts'
import type { ThemeId } from './words.ts'

const FOUND_COLORS = ['#ffd60a', '#4cc9f0', '#f15bb5', '#52b788', '#f77f00', '#b388eb', '#e63946', '#9aa0a6']

/** Tap the first letter of a word, then its last letter. Same seed, age group and theme = same puzzle. */
export default function WordSearchGame({ age, seed, theme }: { age: AgeGroupId; seed: number; theme?: ThemeId }) {
  const [puzzle] = useState(() => generateWordSearch(seed, age, theme))
  const [found, setFound] = useState<number[]>([]) // indexes into puzzle.words, in the order found
  const [first, setFirst] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  const total = puzzle.words.length
  const done = found.length === total

  // cell number -> color of the word found there
  const cellColor = new Map<number, string>()
  found.forEach((wordIndex, n) => {
    const w = puzzle.words[wordIndex]
    for (const cell of lineBetween(puzzle.size, w.start, w.end) ?? []) cellColor.set(cell, FOUND_COLORS[n % FOUND_COLORS.length])
  })

  const tap = (cell: number) => {
    if (done) return
    if (first === null) {
      setFirst(cell)
      setMessage('Now tap the last letter of the word.')
      return
    }
    if (first === cell) {
      setFirst(null)
      setMessage('')
      return
    }
    const index = findWord(puzzle, first, cell)
    if (index >= 0 && !found.includes(index)) {
      setFound([...found, index])
      setMessage(`You found ${puzzle.words[index].word}!`)
    } else {
      setMessage('Not a word from the list. Try again!')
    }
    setFirst(null)
  }

  return (
    <div className="ws-game">
      <ul className="ws-words" aria-label="Words to find">
        {puzzle.words.map((w, i) => (
          <li key={w.word} className={found.includes(i) ? 'ws-found' : ''}>
            {w.emoji && <span aria-hidden="true">{w.emoji} </span>}
            {w.word}
            {found.includes(i) && <span className="sr-only"> (found)</span>}
          </li>
        ))}
      </ul>

      <p className="center muted" role="status">
        {done ? '' : message || 'Tap the first letter of a word, then its last letter.'}
      </p>

      <div
        className="ws-grid"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}
        role="group"
        aria-label={`Word search, ${puzzle.size} by ${puzzle.size} letters. ${found.length} of ${total} words found.`}
      >
        {puzzle.letters.map((letter, cell) => (
          <button
            key={cell}
            type="button"
            className={`ws-cell${first === cell ? ' ws-first' : ''}`}
            style={cellColor.has(cell) ? { background: cellColor.get(cell) } : undefined}
            aria-label={`${letter}, row ${Math.floor(cell / puzzle.size) + 1}, column ${(cell % puzzle.size) + 1}`}
            onClick={() => tap(cell)}
          >
            {letter}
          </button>
        ))}
      </div>

      {done && (
        <p className="celebrate" role="status">
          🎉 You found all {total} words!
        </p>
      )}
    </div>
  )
}
