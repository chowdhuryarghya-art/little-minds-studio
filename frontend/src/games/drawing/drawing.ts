export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const BACKGROUND = '#ffffff'

export type Point = [number, number]

export interface Stroke {
  type: 'stroke'
  color: string
  size: number
  points: Point[]
}

export interface Fill {
  type: 'fill'
  color: string
  point: Point
}

export type DrawingAction = Stroke | Fill

const STORAGE_KEY = 'lms.drawing.v1'
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
const MAX_ACTIONS = 2000
const MAX_POINTS = 5000
const MIN_SIZE = 1
const MAX_SIZE = 60
const FILL_TOLERANCE = 32

function isPoint(p: unknown): p is Point {
  return (
    Array.isArray(p) &&
    p.length === 2 &&
    typeof p[0] === 'number' &&
    typeof p[1] === 'number' &&
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1]) &&
    p[0] >= 0 &&
    p[0] <= CANVAS_WIDTH &&
    p[1] >= 0 &&
    p[1] <= CANVAS_HEIGHT
  )
}

/** Stored data is untrusted: keep only well-formed drawing actions. */
export function sanitizeActions(value: unknown): DrawingAction[] {
  if (!Array.isArray(value)) return []
  const out: DrawingAction[] = []
  for (const s of value.slice(0, MAX_ACTIONS)) {
    if (typeof s !== 'object' || s === null) continue
    const action = s as Record<string, unknown>
    const { color } = action
    if (typeof color !== 'string' || !HEX_COLOR.test(color)) continue
    if (action.type === 'fill') {
      if (isPoint(action.point)) out.push({ type: 'fill', color, point: action.point })
      continue
    }
    const { size, points } = action
    if (typeof size !== 'number' || !Number.isFinite(size) || size < MIN_SIZE || size > MAX_SIZE) continue
    if (!Array.isArray(points) || points.length === 0 || points.length > MAX_POINTS) continue
    if (!points.every(isPoint)) continue
    out.push({ type: 'stroke', color, size, points })
  }
  return out
}

export function loadDrawing(): DrawingAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizeActions(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

export function saveDrawing(actions: DrawingAction[]): void {
  try {
    if (actions.length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(actions))
  } catch {
    // Storage unavailable or full: drawing still works, just without saving.
  }
}

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
  const [first, ...rest] = stroke.points
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
  ctx.lineWidth = stroke.size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (rest.length === 0) {
    ctx.beginPath()
    ctx.arc(first[0], first[1], stroke.size / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  ctx.beginPath()
  ctx.moveTo(first[0], first[1])
  for (const [x, y] of rest) ctx.lineTo(x, y)
  ctx.stroke()
}

function drawFill(ctx: CanvasRenderingContext2D, fill: Fill): boolean {
  const x = Math.round(fill.point[0])
  const y = Math.round(fill.point[1])
  if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) return false

  const image = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const { data } = image
  const start = (y * CANVAS_WIDTH + x) * 4
  const target = [data[start], data[start + 1], data[start + 2]]
  const replacement = [
    Number.parseInt(fill.color.slice(1, 3), 16),
    Number.parseInt(fill.color.slice(3, 5), 16),
    Number.parseInt(fill.color.slice(5, 7), 16),
  ]
  if (target.every((channel, i) => channel === replacement[i])) return false

  const matches = (index: number): boolean =>
    Math.abs(data[index] - target[0]) <= FILL_TOLERANCE &&
    Math.abs(data[index + 1] - target[1]) <= FILL_TOLERANCE &&
    Math.abs(data[index + 2] - target[2]) <= FILL_TOLERANCE

  const visited = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT)
  const stack = new Int32Array(CANVAS_WIDTH * CANVAS_HEIGHT)
  const region = new Int32Array(CANVAS_WIDTH * CANVAS_HEIGHT)
  let pending = 0
  let regionLength = 0
  let touchesCanvasEdge = false
  const startPixel = y * CANVAS_WIDTH + x
  stack[pending++] = startPixel
  visited[startPixel] = 1

  while (pending > 0) {
    const pixel = stack[--pending]
    const offset = pixel * 4
    if (!matches(offset)) continue
    const px = pixel % CANVAS_WIDTH
    if (
      px === 0 ||
      px === CANVAS_WIDTH - 1 ||
      pixel < CANVAS_WIDTH ||
      pixel >= CANVAS_WIDTH * (CANVAS_HEIGHT - 1)
    ) {
      touchesCanvasEdge = true
    }
    region[regionLength++] = pixel

    const top = pixel - CANVAS_WIDTH
    const bottom = pixel + CANVAS_WIDTH
    const right = pixel + 1
    const left = pixel - 1
    if (top >= 0 && !visited[top] && matches(top * 4)) {
      visited[top] = 1
      stack[pending++] = top
    }
    if (
      px < CANVAS_WIDTH - 1 &&
      !visited[right] &&
      matches(right * 4)
    ) {
      visited[right] = 1
      stack[pending++] = right
    }
    if (bottom < CANVAS_WIDTH * CANVAS_HEIGHT && !visited[bottom] && matches(bottom * 4)) {
      visited[bottom] = 1
      stack[pending++] = bottom
    }
    if (px > 0 && !visited[left] && matches(left * 4)) {
      visited[left] = 1
      stack[pending++] = left
    }
  }
  if (touchesCanvasEdge) return false
  for (let i = 0; i < regionLength; i++) {
    const offset = region[i] * 4
    data[offset] = replacement[0]
    data[offset + 1] = replacement[1]
    data[offset + 2] = replacement[2]
    data[offset + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  return true
}

export function applyAction(ctx: CanvasRenderingContext2D, action: DrawingAction): boolean {
  if (action.type === 'fill') return drawFill(ctx, action)
  else {
    drawStroke(ctx, action)
    return true
  }
}

export function redraw(ctx: CanvasRenderingContext2D, actions: DrawingAction[]): void {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  for (const action of actions) applyAction(ctx, action)
}
