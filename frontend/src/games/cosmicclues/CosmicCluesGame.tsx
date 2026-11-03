import { useState } from 'react'
import { createCosmicPuzzle, findPossibleSectors } from './cosmicClues.ts'
import type { CosmicPuzzle } from './cosmicClues.ts'

export default function CosmicCluesGame() {
  const [puzzle, setPuzzle] = useState<CosmicPuzzle>(() => createCosmicPuzzle())
  const [revealed, setRevealed] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [solved, setSolved] = useState(false)
  const [status, setStatus] = useState('Read the clue, then choose a sector to investigate.')

  const startNewPuzzle = () => {
    setPuzzle(createCosmicPuzzle())
    setRevealed(1)
    setSelected(null)
    setAttempts(0)
    setSolved(false)
    setStatus('Read the clue, then choose a sector to investigate.')
  }

  const revealClue = () => {
    if (revealed >= puzzle.clues.length) return
    setRevealed((current) => current + 1)
    setStatus(`Clue ${revealed + 1} revealed. Put the clues together!`)
  }

  const investigate = () => {
    if (solved) return
    if (selected === null) {
      setStatus('Choose one of the eight sectors first.')
      return
    }
    setAttempts((current) => current + 1)
    if (selected === puzzle.targetSector) {
      setSolved(true)
      setStatus(`You found Planet X in sector ${selected}! Cosmic detective work!`)
    } else {
      setStatus(`No planet in sector ${selected}. Compare the clues and try again!`)
    }
  }

  const possible = findPossibleSectors(puzzle.clues.slice(0, revealed))

  return (
    <div className="cosmic-game">
      <div className="cosmic-scoreboard">
        <span><strong>Clues</strong> {revealed} / {puzzle.clues.length}</span>
        <span><strong>Investigations</strong> {attempts}</span>
      </div>
      <section className="cosmic-clue-card" aria-labelledby="cosmic-clues-title">
        <h2 id="cosmic-clues-title">Mission clues</h2>
        <ol>
          {puzzle.clues.slice(0, revealed).map((clue, index) => (
            <li key={index}>{clue.text}</li>
          ))}
        </ol>
        {revealed < puzzle.clues.length ? (
          <button type="button" className="tool" onClick={revealClue}>Reveal clue {revealed + 1}</button>
        ) : (
          <p className="cosmic-deduction" role="status">
            {possible.length === 1 ? 'The clues point to one sector. Can you spot it?' : 'Use all the clues to narrow it down.'}
          </p>
        )}
      </section>
      <h2 className="center cosmic-map-title">Choose an orbit sector</h2>
      <div className="cosmic-orbit" role="group" aria-label="Eight orbit sectors">
        {Array.from({ length: 8 }, (_, index) => index + 1).map((sector) => {
          return (
            <button
              key={sector}
              type="button"
              className={`cosmic-sector${selected === sector ? ' selected' : ''}${solved && sector === puzzle.targetSector ? ' discovered' : ''}`}
              aria-pressed={selected === sector}
              aria-label={`Sector ${sector}${solved && sector === puzzle.targetSector ? ', Planet X found' : ''}`}
              onClick={() => {
                if (!solved) {
                  setSelected(sector)
                  setStatus(`Sector ${sector} selected. Investigate when you are ready.`)
                }
              }}
              disabled={solved}
            >
              <span className="cosmic-sector-number">{sector}</span>
              <span aria-hidden="true">{solved && sector === puzzle.targetSector ? '🪐' : '✦'}</span>
            </button>
          )
        })}
      </div>
      <p className="center cosmic-status" role="status" aria-live="polite">{status}</p>
      <div className="cosmic-actions">
        <button type="button" className="tool" onClick={investigate} disabled={solved}>Investigate sector</button>
        <button type="button" className="tool" onClick={startNewPuzzle}>New mission</button>
      </div>
      {solved && <p className="celebrate center">🚀 Mission complete!</p>}
      <p className="center muted cosmic-note">A fresh space-logic puzzle is made for every mission.</p>
    </div>
  )
}
