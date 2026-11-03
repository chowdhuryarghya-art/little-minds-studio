import { useState } from 'react'
import type { FormEvent } from 'react'
import { parseSeed, randomSeed } from '../lib/random.ts'

interface Props {
  /** What the number is called, e.g. "Picture" or "Maze". */
  label: string
  seed: number
  onSelect: (seed: number) => void
}

/** Shows the current number, a "New" button, and a box to type a number you were given. */
export default function SeedPicker({ label, seed, onSelect }: Props) {
  const [typed, setTyped] = useState('')
  const [error, setError] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = parseSeed(typed.trim())
    if (value === null) {
      setError(true)
      return
    }
    setError(false)
    setTyped('')
    onSelect(value)
  }

  return (
    <>
      <p className="center">
        <strong>
          {label} #{seed}
        </strong>{' '}
        <button type="button" className="tool" onClick={() => onSelect(randomSeed())}>
          New {label.toLowerCase()}
        </button>
      </p>
      <form className="seed-form center" onSubmit={onSubmit}>
        <label>
          Have a {label.toLowerCase()} number?{' '}
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={typed}
            aria-invalid={error}
            onChange={(e) => setTyped(e.target.value)}
          />
        </label>{' '}
        <button type="submit" className="tool">
          Go
        </button>
        {error && <span role="alert"> Please type a number with up to 8 digits.</span>}
      </form>
    </>
  )
}
