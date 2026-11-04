import { useState } from 'react'
import { COSMIC_DIFFICULTIES, createCosmicPuzzle, findPossibleSectors } from './cosmicClues.ts'
import type { CosmicDifficulty, CosmicPuzzle } from './cosmicClues.ts'

export default function CosmicCluesGame() {
  const [difficulty, setDifficulty] = useState<CosmicDifficulty>('easy')
  const [puzzle, setPuzzle] = useState<CosmicPuzzle>(() => createCosmicPuzzle('easy'))
  const [revealed, setRevealed] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [investigated, setInvestigated] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [status, setStatus] = useState('Read the clue, then choose a sector to investigate.')

  const startNewPuzzle = (nextDifficulty: CosmicDifficulty = difficulty) => {
    setPuzzle(createCosmicPuzzle(nextDifficulty))
    setDifficulty(nextDifficulty)
    setRevealed(1)
    setSelected(null)
    setAttempts(0)
    setInvestigated([])
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
      setStatus(`Choose one of the ${puzzle.gridSize * puzzle.gridSize} sectors first.`)
      return
    }
    if (investigated.includes(selected)) {
      setStatus(`Sector ${selected} has already been checked. Choose another sector.`)
      return
    }
    setAttempts((current) => current + 1)
    if (selected === puzzle.targetSector) {
      setSolved(true)
      setStatus(`You found Planet X in sector ${selected}! Cosmic detective work!`)
    } else {
      setInvestigated((current) => [...current, selected])
      setStatus(`No planet in sector ${selected}. Compare the clues and try again!`)
    }
  }

  const possible = findPossibleSectors(puzzle.clues.slice(0, revealed), puzzle.gridSize)

  return (
    <div className="cosmic-game">
      <div className="chips cosmic-difficulties" role="group" aria-label="Map difficulty">
        {COSMIC_DIFFICULTIES.map(({ id, label }) => (
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
      <h2 className="center cosmic-map-title">Choose a map sector</h2>
      <div
        className="cosmic-orbit"
        role="group"
        aria-label={`${puzzle.gridSize} by ${puzzle.gridSize} map with ${puzzle.gridSize * puzzle.gridSize} sectors`}
        style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: puzzle.gridSize * puzzle.gridSize }, (_, index) => index + 1).map((sector) => {
          const hasBeenInvestigated = investigated.includes(sector)
          return (
            <button
              key={sector}
              type="button"
              className={`cosmic-sector${selected === sector ? ' selected' : ''}${hasBeenInvestigated ? ' investigated' : ''}${solved && sector === puzzle.targetSector ? ' discovered' : ''}`}
              aria-pressed={selected === sector}
              aria-label={`Sector ${sector}${hasBeenInvestigated ? ', already investigated' : ''}${solved && sector === puzzle.targetSector ? ', Planet X found' : ''}`}
              onClick={() => {
                if (!solved && !hasBeenInvestigated) {
                  setSelected(sector)
                  setStatus(`Sector ${sector} selected. Investigate when you are ready.`)
                }
              }}
              disabled={solved || hasBeenInvestigated}
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
        <button type="button" className="tool" onClick={() => startNewPuzzle()}>New mission</button>
      </div>
      {solved && <p className="celebrate center">🚀 Mission complete!</p>}
      <p className="center muted cosmic-note">A fresh space-logic puzzle is made for every mission.</p>
    </div>
  )
}
