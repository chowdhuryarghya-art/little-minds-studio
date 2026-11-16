import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { PALETTE } from '../coloring/palette.ts'
import {
  BACKGROUND,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  applyAction,
  drawStroke,
  loadDrawing,
  redraw,
  saveDrawing,
} from './drawing.ts'
import type { DrawingAction, Point, Stroke } from './drawing.ts'
import { downloadDrawingPng } from '../exportArtwork.ts'

const SIZES = [
  { label: 'Thin', value: 4 },
  { label: 'Medium', value: 10 },
  { label: 'Thick', value: 22 },
]

const MAX_POINTS_PER_STROKE = 5000

export default function DrawingStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentRef = useRef<Stroke | null>(null)
  const [actions, setActions] = useState<DrawingAction[]>(loadDrawing)
  const [color, setColor] = useState<string>(PALETTE[0].value)
  const [erasing, setErasing] = useState(false)
  const [fillMode, setFillMode] = useState(false)
  const [size, setSize] = useState(SIZES[1].value)

  // Repaint whenever the drawing changes, and autosave locally.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true })
    if (ctx) redraw(ctx, actions)
    saveDrawing(actions)
  }, [actions])

  const toCanvasPoint = (e: PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
    const clamp = (v: number, max: number) => Math.min(max, Math.max(0, Math.round(v * 10) / 10))
    return [clamp(x, CANVAS_WIDTH), clamp(y, CANVAS_HEIGHT)]
  }

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    if (fillMode) {
      const fill: DrawingAction = { type: 'fill', color, point: toCanvasPoint(e) }
      const ctx = e.currentTarget.getContext('2d', { willReadFrequently: true })
      if (ctx) {
        const applied = applyAction(ctx, fill)
        if (applied) setActions((current) => [...current, fill])
      }
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    const stroke: Stroke = {
      type: 'stroke',
      color: erasing ? BACKGROUND : color,
      size,
      points: [toCanvasPoint(e)],
    }
    currentRef.current = stroke
    const ctx = e.currentTarget.getContext('2d', { willReadFrequently: true })
    if (ctx) drawStroke(ctx, stroke)
  }

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentRef.current
    if (!stroke || stroke.points.length >= MAX_POINTS_PER_STROKE) return
    const prev = stroke.points[stroke.points.length - 1]
    const next = toCanvasPoint(e)
    stroke.points.push(next)
    const ctx = e.currentTarget.getContext('2d', { willReadFrequently: true })
    if (ctx) drawStroke(ctx, { ...stroke, points: [prev, next] })
  }

  const onUp = () => {
    const stroke = currentRef.current
    currentRef.current = null
    if (stroke) setActions((current) => [...current, stroke])
  }

  return (
    <div className="drawing-studio">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        data-fill-mode={fillMode}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-label="Drawing area"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      {fillMode && (
        <p className="center muted" role="status">
          Tap inside a closed outline to fill that area.
        </p>
      )}

      <div className="toolbar" role="toolbar" aria-label="Drawing tools">
        <div className="palette">
          {PALETTE.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`swatch${!erasing && color === c.value ? ' selected' : ''}`}
              style={{ background: c.value }}
              aria-label={c.name}
              aria-pressed={!erasing && color === c.value}
              onClick={() => {
                setColor(c.value)
                setErasing(false)
              }}
            />
          ))}
        </div>
        <div className="tool-buttons">
          <button
            type="button"
            className="tool"
            onClick={() => {
              const canvas = canvasRef.current
              if (canvas) downloadDrawingPng(canvas, 'little-minds-drawing.png')
            }}
          >
            Download PNG
          </button>
          <button type="button" className="tool" onClick={() => window.print()}>
            Print
          </button>
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`tool${size === s.value ? ' selected' : ''}`}
              aria-pressed={size === s.value}
              onClick={() => setSize(s.value)}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            className={`tool${fillMode ? ' selected' : ''}`}
            aria-pressed={fillMode}
            onClick={() => {
              setErasing(false)
              setFillMode((current) => !current)
            }}
          >
            Fill by Color
          </button>
          <button
            type="button"
            className={`tool${erasing ? ' selected' : ''}`}
            aria-pressed={erasing}
            onClick={() => {
              setFillMode(false)
              setErasing((v) => !v)
            }}
          >
            Eraser
          </button>
          <button
            type="button"
            className="tool"
            disabled={actions.length === 0}
            onClick={() => setActions((current) => current.slice(0, -1))}
          >
            Undo
          </button>
          <button
            type="button"
            className="tool"
            disabled={actions.length === 0}
            onClick={() => setActions([])}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
