import type { AgeGroupId } from '../../data/ageGroups.ts'
import { createRandom, pick, randInt } from '../../lib/random.ts'
import type { Random } from '../../lib/random.ts'

export type Point = [number, number]
export type ShapeFamily = 'star' | 'flower' | 'heart' | 'blob'

export interface DotPuzzle {
  family: ShapeFamily
  /** What the finished picture is, for the celebration message. */
  name: string
  /** Dots in the order they must be joined; the last one joins back to the first. */
  points: Point[]
  /** Where each dot's number goes (just outside the shape). */
  labels: Point[]
}

export const VIEW = 400
/** Dots closer than this (in a 400 wide picture) are hard to tap and read. */
export const MIN_DOT_GAP = 30
const LABEL_OFFSET = 20

const FAMILIES: Record<AgeGroupId, ShapeFamily[]> = {
  explorers: ['star', 'heart', 'flower'],
  curious: ['star', 'heart', 'flower', 'blob'],
  creative: ['star', 'heart', 'flower', 'blob'],
}

const NAMES: Record<ShapeFamily, string> = {
  star: 'a star',
  flower: 'a flower',
  heart: 'a heart',
  blob: 'a mystery shape',
}

/** Fewer dots for younger children. */
const DOTS: Record<AgeGroupId, [number, number]> = {
  explorers: [8, 12],
  curious: [12, 18],
  creative: [18, 26],
}

const dist = (a: Point, b: Point): number => Math.hypot(a[0] - b[0], a[1] - b[1])

/** Centers the shape in the picture and scales it to fill most of it. */
function fit(raw: Point[]): Point[] {
  const xs = raw.map((p) => p[0])
  const ys = raw.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const scale = 320 / Math.max(maxX - minX, maxY - minY)
  const ox = VIEW / 2 - ((minX + maxX) / 2) * scale
  const oy = VIEW / 2 - ((minY + maxY) / 2) * scale
  return raw.map(([x, y]) => [Math.round((x * scale + ox) * 10) / 10, Math.round((y * scale + oy) * 10) / 10])
}

function star(random: Random, count: number): Point[] {
  const tips = Math.floor(count / 2)
  const inner = 0.38 + random() * 0.2
  const out: Point[] = []
  for (let i = 0; i < tips * 2; i++) {
    const angle = (Math.PI * i) / tips
    const r = i % 2 === 0 ? 1 : inner
    out.push([r * Math.sin(angle), -r * Math.cos(angle)])
  }
  return out
}

function flower(random: Random, count: number): Point[] {
  const petals = pick(random, [3, 4, 5, 6, 7, 8].filter((k) => count / k >= 2 && count % k === 0))
  const depth = 0.25 + random() * 0.2
  const out: Point[] = []
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count
    const r = 1 + depth * Math.cos(petals * angle)
    out.push([r * Math.sin(angle), -r * Math.cos(angle)])
  }
  return out
}

function heart(random: Random, count: number): Point[] {
  const squash = 0.85 + random() * 0.3
  const out: Point[] = []
  for (let i = 0; i < count; i++) {
    const t = (2 * Math.PI * i) / count
    const x = 16 * Math.sin(t) ** 3
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    out.push([x * squash, -y])
  }
  return out
}

function blob(random: Random, count: number): Point[] {
  const harmonics = [2, 3, 4, 5].map((k) => ({
    k,
    amount: (random() * 0.5) / k,
    phase: random() * 2 * Math.PI,
  }))
  const out: Point[] = []
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count
    let r = 1
    for (const h of harmonics) r += h.amount * Math.cos(h.k * angle + h.phase)
    out.push([r * Math.sin(angle), -r * Math.cos(angle)])
  }
  return out
}

const BUILD: Record<ShapeFamily, (random: Random, count: number) => Point[]> = { star, flower, heart, blob }

function minGap(points: Point[]): number {
  let best = Infinity
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) best = Math.min(best, dist(points[i], points[j]))
  }
  return best
}

/** Signed area: positive when the dots run clockwise on screen. */
function signedArea(points: Point[]): number {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % points.length]
    sum += x1 * y2 - x2 * y1
  }
  return sum / 2
}

function labelsFor(points: Point[]): Point[] {
  const sign = signedArea(points) > 0 ? 1 : -1
  return points.map((p, i) => {
    const prev = points[(i + points.length - 1) % points.length]
    const next = points[(i + 1) % points.length]
    const tx = next[0] - prev[0]
    const ty = next[1] - prev[1]
    const len = Math.hypot(tx, ty) || 1
    // Clockwise on screen: the outside is to the left of the direction of travel.
    const nx = (ty / len) * sign
    const ny = (-tx / len) * sign
    return [Math.round((p[0] + nx * LABEL_OFFSET) * 10) / 10, Math.round((p[1] + ny * LABEL_OFFSET) * 10) / 10]
  })
}

/**
 * Builds a join-the-dots picture from a picture number: the same number and
 * age group always give the same dots. Shapes whose dots would be too close
 * together are re-drawn with different settings, so every picture is tappable.
 */
export function generateDots(seed: number, age: AgeGroupId): DotPuzzle {
  const random = createRandom(seed)
  const [lo, hi] = DOTS[age]

  for (let attempt = 0; attempt < 60; attempt++) {
    const family = pick(random, FAMILIES[age])
    let count = randInt(random, lo, hi)
    if (family === 'star' && count % 2 === 1) count += 1
    if (family === 'flower') {
      const options: number[] = []
      for (let c = lo; c <= hi; c++) if ([3, 4, 5, 6, 7, 8].some((k) => c % k === 0 && c / k >= 2)) options.push(c)
      count = pick(random, options)
    }
    let points = fit(BUILD[family](random, count))
    if (minGap(points) < MIN_DOT_GAP) continue

    // Start somewhere different each time, and sometimes go the other way round.
    const start = randInt(random, 0, points.length - 1)
    points = [...points.slice(start), ...points.slice(0, start)]
    if (random() < 0.5) points = [points[0], ...points.slice(1).reverse()]
    return { family, name: NAMES[family], points, labels: labelsFor(points) }
  }

  // Safe fallback that always passes the spacing rule.
  const points = fit(star(random, 10))
  return { family: 'star', name: NAMES.star, points, labels: labelsFor(points) }
}
