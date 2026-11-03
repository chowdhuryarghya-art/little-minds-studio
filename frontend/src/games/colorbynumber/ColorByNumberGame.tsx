import { useReducer, useState } from 'react'
import ColoringCanvas from '../coloring/ColoringCanvas.tsx'
import { coloringReducer, initialColoringState } from '../coloring/coloringState.ts'
import type { ColoringPage } from '../coloring/types.ts'
import { buildLabels, buildLegend } from './legend.ts'

interface Props {
  page: ColoringPage
  targets: Record<string, string>
}

export default function ColorByNumberGame({ page, targets }: Props) {
  const [state, dispatch] = useReducer(coloringReducer, initialColoringState)
  const [selected, setSelected] = useState(1)
  const [hint, setHint] = useState<string | null>(null)

  const legend = buildLegend(page, targets)
  const labels = buildLabels(page, targets, legend)
  const current = legend.find((l) => l.number === selected) ?? legend[0]
  const painted = Object.keys(state.fills).length
  const complete = painted === page.regions.length

  const onPaint = (regionId: string) => {
    if (state.fills[regionId] !== undefined) return
    const wanted = legend.find((l) => l.color === targets[regionId])
    if (wanted && wanted.color === current.color) {
      setHint(null)
      dispatch({ type: 'paint', regionId, color: current.color })
    } else if (wanted) {
      setHint(`Not quite! That part is number ${wanted.number}. Try ${wanted.name}.`)
    }
  }

  return (
    <div className="coloring-game">
      <ColoringCanvas page={page} fills={state.fills} onPaint={onPaint} labels={labels} />
      <p className="center" role="status" aria-live="polite">
        {complete ? (
          <span className="celebrate">🎉 Amazing! The picture is finished!</span>
        ) : (
          (hint ?? `Pick a number below, then tap the parts marked ${current.number}.`)
        )}
      </p>

      <div className="toolbar" role="toolbar" aria-label="Color numbers">
        <div className="legend">
          {legend.map((l) => (
            <button
              key={l.number}
              type="button"
              className={`legend-item${current.number === l.number ? ' selected' : ''}`}
              aria-pressed={current.number === l.number}
              aria-label={`Number ${l.number}, ${l.name}`}
              onClick={() => {
                setSelected(l.number)
                setHint(null)
              }}
            >
              <span className="legend-swatch" style={{ background: l.color }} />
              <span className="legend-number">{l.number}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="tool"
          disabled={painted === 0}
          onClick={() => {
            dispatch({ type: 'reset' })
            setHint(null)
          }}
        >
          Start over
        </button>
      </div>
    </div>
  )
}
