import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import { generateDots, VIEW } from './connectdots.ts'

/** Tap the dots in number order; the same seed and age group always give the same dots. */
export default function ConnectDotsGame({ age, seed }: { age: AgeGroupId; seed: number }) {
  const [puzzle] = useState(() => generateDots(seed, age))
  const [reached, setReached] = useState(1) // how many dots are joined so far
  const [wrong, setWrong] = useState(false)

  const total = puzzle.points.length
  const done = reached === total
  const joined = puzzle.points.slice(0, reached)

  const tap = (index: number) => {
    if (done) return
    if (index === reached) {
      setWrong(false)
      setReached(reached + 1)
    } else if (index > reached) {
      setWrong(true)
    }
  }

  const onKey = (index: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      tap(index)
    }
  }

  const path = joined.map((p) => p.join(',')).join(' ')

  return (
    <div className="dots-game">
      <p className="center muted" role="status">
        {done ? '' : wrong ? `Not yet! Find dot ${reached + 1}.` : `Tap dot ${reached + 1}`}
      </p>
      <svg
        className="dots-svg"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="group"
        aria-label={`Join the dots. ${total} dots. ${reached} joined.`}
      >
        {done && <polygon className="dots-fill" points={puzzle.points.map((p) => p.join(',')).join(' ')} />}
        <polyline className="dots-line" points={path} />
        {done && (
          <line
            className="dots-line"
            x1={puzzle.points[total - 1][0]}
            y1={puzzle.points[total - 1][1]}
            x2={puzzle.points[0][0]}
            y2={puzzle.points[0][1]}
          />
        )}
        {puzzle.points.map(([x, y], i) => {
          const isNext = i === reached
          const isDone = i < reached
          const [lx, ly] = puzzle.labels[i]
          return (
            <g
              key={i}
              className={`dot${isDone ? ' dot-done' : ''}${isNext ? ' dot-next' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Dot ${i + 1}`}
              onClick={() => tap(i)}
              onKeyDown={onKey(i)}
            >
              <circle className="dot-hit" cx={x} cy={y} r={16} />
              <circle className="dot-mark" cx={x} cy={y} r={7} />
              <text className="dot-number" x={lx} y={ly}>
                {i + 1}
              </text>
            </g>
          )
        })}
      </svg>
      {done && (
        <p className="celebrate" role="status">
          🎉 It's {puzzle.name}!
        </p>
      )}
    </div>
  )
}
