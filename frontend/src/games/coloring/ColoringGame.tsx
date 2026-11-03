import { useEffect, useReducer, useState } from 'react'
import ColoringCanvas from './ColoringCanvas.tsx'
import { PALETTE } from './palette.ts'
import { coloringReducer, ERASER } from './coloringState.ts'
import { loadFills, saveFills } from './storage.ts'
import type { ColoringPage } from './types.ts'

interface Props {
  page: ColoringPage
  /** Autosave to this device. Off for generated pages (there are millions of them). */
  persist?: boolean
}

export default function ColoringGame({ page, persist = true }: Props) {
  const [state, dispatch] = useReducer(coloringReducer, page, (p) => ({
    fills: persist ? loadFills(p) : {},
    history: [],
  }))
  const [color, setColor] = useState<string>(PALETTE[0].value)

  // Autosave on this device only.
  useEffect(() => {
    if (persist) saveFills(page, state.fills)
  }, [page, persist, state.fills])

  const paintedCount = Object.keys(state.fills).length
  const complete = paintedCount === page.regions.length

  return (
    <div className="coloring-game">
      <div className="canvas-wrap">
        <ColoringCanvas
          page={page}
          fills={state.fills}
          onPaint={(regionId) => dispatch({ type: 'paint', regionId, color })}
        />
        {complete && (
          <p className="celebrate" role="status">
            🎉 Wonderful! You colored everything!
          </p>
        )}
      </div>

      <div className="toolbar" role="toolbar" aria-label="Coloring tools">
        <div className="palette">
          {PALETTE.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`swatch${color === c.value ? ' selected' : ''}`}
              style={{ background: c.value }}
              aria-label={c.name}
              aria-pressed={color === c.value}
              onClick={() => setColor(c.value)}
            />
          ))}
        </div>
        <div className="tool-buttons">
          <button
            type="button"
            className={`tool${color === ERASER ? ' selected' : ''}`}
            aria-pressed={color === ERASER}
            onClick={() => setColor(ERASER)}
          >
            Eraser
          </button>
          <button
            type="button"
            className="tool"
            disabled={state.history.length === 0}
            onClick={() => dispatch({ type: 'undo' })}
          >
            Undo
          </button>
          <button
            type="button"
            className="tool"
            disabled={paintedCount === 0}
            onClick={() => dispatch({ type: 'reset' })}
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  )
}
