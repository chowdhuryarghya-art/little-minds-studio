import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../data/ageGroups.ts'
import type { AgeGroupId } from '../data/ageGroups.ts'
import SeedPicker from './SeedPicker.tsx'
import ColoringGame from '../games/coloring/ColoringGame.tsx'
import ColorByNumberGame from '../games/colorbynumber/ColorByNumberGame.tsx'
import type { GeneratedPicture } from '../games/coloring/types.ts'
import { parseSeed, randomSeed } from '../lib/random.ts'

type Mode = 'free' | 'number'

interface Props {
  title: string
  /** Noun used on the buttons, e.g. "Picture" or "Creature". */
  noun: string
  generate: (seed: number, age: AgeGroupId) => GeneratedPicture
  defaultAge?: AgeGroupId
}

/**
 * A page that plays a procedurally generated coloring picture, either as free
 * coloring or color by number. Age, mode and picture number live in the URL so
 * a link reproduces the exact picture.
 */
export default function GeneratedColoringPage({ title, noun, generate, defaultAge = 'curious' }: Props) {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const age: AgeGroupId = isAgeGroupId(ageParam) ? ageParam : defaultAge
  const mode: Mode = params.get('mode') === 'number' ? 'number' : 'free'
  // A fresh random picture when the link has no (valid) picture number.
  const [fallbackSeed] = useState(randomSeed)
  const seed = parseSeed(params.get('seed')) ?? fallbackSeed

  const update = (next: { age?: AgeGroupId; mode?: Mode; seed?: number }) =>
    setParams({
      age: next.age ?? age,
      mode: next.mode ?? mode,
      seed: String(next.seed ?? seed),
    })

  const { page, targets } = generate(seed, age)

  return (
    <section className="page narrow">
      <p>
        <Link to="/coloring">← Coloring Games</Link>
      </p>
      <h1>{title}</h1>

      <div className="chips" role="group" aria-label="Choose difficulty">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`chip${age === g.id ? ' selected' : ''}`}
            onClick={() => update({ age: g.id })}
          >
            {g.name} ({g.ages})
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label="Choose how to color">
        <button
          type="button"
          className={`chip${mode === 'free' ? ' selected' : ''}`}
          onClick={() => update({ mode: 'free' })}
        >
          Free coloring
        </button>
        <button
          type="button"
          className={`chip${mode === 'number' ? ' selected' : ''}`}
          onClick={() => update({ mode: 'number' })}
        >
          Color by number
        </button>
      </div>

      <SeedPicker label={noun} seed={seed} onSelect={(s) => update({ seed: s })} />

      {/* key remounts the game (and clears the colors) when the picture changes */}
      {mode === 'free' ? (
        <ColoringGame key={page.id} page={page} persist={false} />
      ) : (
        <ColorByNumberGame key={page.id} page={page} targets={targets} />
      )}
    </section>
  )
}
