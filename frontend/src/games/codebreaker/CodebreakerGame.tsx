import { useState } from 'react'

const COLORS = [
  { id: 'red', label: 'Red', emoji: '🔴' },
  { id: 'blue', label: 'Blue', emoji: '🔵' },
  { id: 'green', label: 'Green', emoji: '🟢' },
  { id: 'yellow', label: 'Yellow', emoji: '🟡' },
  { id: 'purple', label: 'Purple', emoji: '🟣' },
  { id: 'orange', label: 'Orange', emoji: '🟠' },
]

type Difficulty = 'easy' | 'medium' | 'hard'

const LEVELS: { id: Difficulty; label: string; codeLength: number; colorCount: number }[] = [
  { id: 'easy', label: 'Easy', codeLength: 3, colorCount: 4 },
  { id: 'medium', label: 'Medium', codeLength: 4, colorCount: 5 },
  { id: 'hard', label: 'Hard', codeLength: 5, colorCount: 6 },
]

type Guess = {
  colors: string[]
  exact: number
  misplaced: number
}

function createSecret(colorCount: number, codeLength: number): string[] {
  const colors = COLORS.slice(0, colorCount).map(({ id }) => id)
  for (let index = colors.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[colors[index], colors[swap]] = [colors[swap], colors[index]]
  }
  return colors.slice(0, codeLength)
}

export default function CodebreakerGame() {
  const [level, setLevel] = useState(LEVELS[0])
  const [secret, setSecret] = useState(() => createSecret(LEVELS[0].colorCount, LEVELS[0].codeLength))
  const [guess, setGuess] = useState<string[]>([])
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [solved, setSolved] = useState(false)
  const [status, setStatus] = useState('Choose colors to crack the hidden code.')

  const startNewGame = (nextLevel = level) => {
    setLevel(nextLevel)
    setSecret(createSecret(nextLevel.colorCount, nextLevel.codeLength))
    setGuess([])
    setGuesses([])
    setSolved(false)
    setStatus('Choose colors to crack the hidden code.')
  }

  const chooseColor = (colorId: string) => {
    if (solved || guess.length >= level.codeLength) return
    if (guess.includes(colorId)) {
      setStatus('Use each color only once in a code guess.')
      return
    }
    setGuess((current) => [...current, colorId])
    setStatus('')
  }

  const submitGuess = () => {
    if (guess.length !== level.codeLength) {
      setStatus(`Choose ${level.codeLength} different colors first.`)
      return
    }

    const exact = guess.filter((color, index) => color === secret[index]).length
    const shared = guess.filter((color) => secret.includes(color)).length
    const nextGuesses = [...guesses, { colors: guess, exact, misplaced: shared - exact }]
    setGuesses(nextGuesses)
    setGuess([])

    if (exact === level.codeLength) {
      setSolved(true)
      setStatus('Brilliant codebreaking! You cracked the secret!')
    } else if (nextGuesses.length >= 8) {
      setSolved(true)
      setStatus(`Mission over! The secret code was ${secret.map((id) => COLORS.find((color) => color.id === id)?.emoji).join(' ')}.`)
    } else {
      setStatus(`${exact} in the right place · ${shared - exact} right color, different place.`)
    }
  }

  const removeGuessColor = (index: number) => {
    if (solved) return
    setGuess((current) => current.filter((_, colorIndex) => colorIndex !== index))
    setStatus('Color removed. Choose a replacement.')
  }

  return (
    <div className="codebreaker-game">
      <div className="chips" role="group" aria-label="Codebreaker difficulty">
        {LEVELS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`chip${level.id === option.id ? ' selected' : ''}`}
            aria-pressed={level.id === option.id}
            onClick={() => startNewGame(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="center muted">Crack a {level.codeLength}-color code in 8 guesses. Colors do not repeat.</p>
      <p className="center muted">Guesses: {guesses.length} / 8</p>
      <div className="codebreaker-history" aria-label="Previous guesses">
        {guesses.map((item, index) => (
          <div className="codebreaker-row" key={index}>
            <span className="codebreaker-colors">
              {item.colors.map((id) => (
                <span key={id} aria-label={COLORS.find((color) => color.id === id)?.label}>
                  {COLORS.find((color) => color.id === id)?.emoji}
                </span>
              ))}
            </span>
            <span className="codebreaker-feedback">{item.exact} right place · {item.misplaced} wrong place</span>
          </div>
        ))}
      </div>
      {!solved && (
        <>
          <h2 className="center codebreaker-heading">Your guess</h2>
          <div className="codebreaker-slots" aria-label="Current code guess">
            {Array.from({ length: level.codeLength }, (_, index) => {
              const id = guess[index]
              const color = COLORS.find((item) => item.id === id)
              return (
                <button
                  key={index}
                  type="button"
                  className="codebreaker-slot"
                  aria-label={color ? `Remove ${color.label} from slot ${index + 1}` : `Empty slot ${index + 1}`}
                  onClick={() => removeGuessColor(index)}
                >
                  {color?.emoji ?? '＋'}
                </button>
              )
            })}
          </div>
          <div className="codebreaker-palette" role="group" aria-label="Choose a color">
            {COLORS.slice(0, level.colorCount).map((color) => (
              <button
                key={color.id}
                type="button"
                className="codebreaker-color"
                onClick={() => chooseColor(color.id)}
                disabled={guess.includes(color.id) || guess.length >= level.codeLength}
                aria-label={color.label}
              >
                {color.emoji} {color.label}
              </button>
            ))}
          </div>
          <p className="center">
            <button type="button" className="tool" onClick={submitGuess}>Check code</button>
          </p>
        </>
      )}
      <p className="center cosmic-status" role="status" aria-live="polite">
        {status || `${guess.length} of ${level.codeLength} colors selected`}
      </p>
      {solved && (
        <p className="center">
          <button type="button" className="tool" onClick={() => startNewGame()}>New code</button>
        </p>
      )}
    </div>
  )
}
