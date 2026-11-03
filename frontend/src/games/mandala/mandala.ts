import type { AgeGroupId } from '../../data/ageGroups.ts'
import { createRandom, pick, randInt, shuffled } from '../../lib/random.ts'
import { PALETTE } from '../coloring/palette.ts'
import type { ColoringPage, Region } from '../coloring/types.ts'

type Style = 'wedge' | 'petal' | 'dot'

interface AgeSpec {
  sectors: number[]
  rings: [number, number]
  colors: number
}

/** Harder levels: more sectors, more rings, more colors. */
const SPECS: Record<AgeGroupId, AgeSpec> = {
  explorers: { sectors: [3, 4, 5], rings: [1, 2], colors: 3 },
  curious: { sectors: [5, 6, 7, 8], rings: [2, 3], colors: 4 },
  creative: { sectors: [6, 8, 9, 10], rings: [3, 4], colors: 5 },
}

const STYLES: Style[] = ['wedge', 'petal', 'dot']
const CENTER = 200
const OUTER_RADIUS = 185
const GAP = 0 // rings share one outline instead of drawing a thick double line

export interface Mandala {
  page: ColoringPage
  /** Region id → target color, for color by number. */
  targets: Record<string, string>
}

type Pt = [number, number]

const polar = (r: number, angle: number): Pt => [
  CENTER + r * Math.cos(angle),
  CENTER + r * Math.sin(angle),
]
const fmt = (p: Pt): string => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

function wedgePath(rIn: number, rOut: number, a0: number, a1: number): string {
  return (
    `M ${fmt(polar(rOut, a0))} A ${rOut.toFixed(1)} ${rOut.toFixed(1)} 0 0 1 ${fmt(polar(rOut, a1))} ` +
    `L ${fmt(polar(rIn, a1))} A ${rIn.toFixed(1)} ${rIn.toFixed(1)} 0 0 0 ${fmt(polar(rIn, a0))} Z`
  )
}

function petalPath(rIn: number, rOut: number, angle: number, spread: number): string {
  const rMid = (rIn + rOut) / 2
  return (
    `M ${fmt(polar(rIn, angle))} Q ${fmt(polar(rMid, angle - spread))} ${fmt(polar(rOut, angle))} ` +
    `Q ${fmt(polar(rMid, angle + spread))} ${fmt(polar(rIn, angle))} Z`
  )
}

/**
 * Builds a mandala coloring page from a picture number. The same number and
 * age group always give the same picture. No AI: it is plain geometry plus
 * seeded random choices (sector count, ring count, ring styles, ring
 * rotation, petal width, colors).
 */
export function generateMandala(seed: number, age: AgeGroupId): Mandala {
  const random = createRandom(seed)
  const spec = SPECS[age]
  const n = pick(random, spec.sectors)
  const ringCount = randInt(random, spec.rings[0], spec.rings[1])
  const step = (Math.PI * 2) / n

  const centerRadius = 20 + 3.5 * n
  const firstInner = centerRadius + GAP
  const band = (OUTER_RADIUS - firstInner - GAP * (ringCount - 1)) / ringCount

  const palette = shuffled(
    random,
    PALETTE.map((p) => p.value),
  ).slice(0, spec.colors)

  const regions: Region[] = [
    {
      id: 'center',
      label: 'Center',
      tag: 'circle',
      attrs: { cx: CENTER, cy: CENTER, r: Number(centerRadius.toFixed(1)) },
    },
  ]
  const targets: Record<string, string> = { center: palette[0] }

  for (let ring = 0; ring < ringCount; ring++) {
    const rIn = firstInner + ring * (band + GAP)
    const rOut = rIn + band
    const rMid = (rIn + rOut) / 2
    const style = pick(random, STYLES)
    const offset = random() < 0.5 ? 0 : 0.5 // rotate ring by half a sector
    const spread = (Math.PI / n) * (0.9 + random() * 0.5) // petal width
    const scheme = pick(random, ['solid', 'alternate', 'cycle'] as const)
    const solid = pick(random, palette)
    const [alt1, alt2] = shuffled(random, palette)

    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (i + offset) * step
      const id = `r${ring + 1}-${i + 1}`
      const label = `Ring ${ring + 1}, piece ${i + 1}`
      const [lx, ly] = polar(rMid, angle)
      const labelAt: Pt = [Number(lx.toFixed(1)), Number(ly.toFixed(1))]

      if (style === 'wedge') {
        regions.push({
          id,
          label,
          tag: 'path',
          attrs: { d: wedgePath(rIn, rOut, angle - step / 2, angle + step / 2) },
          labelAt,
        })
      } else if (style === 'petal') {
        regions.push({
          id,
          label,
          tag: 'path',
          attrs: { d: petalPath(rIn, rOut, angle, spread) },
          labelAt,
        })
      } else {
        const radius = Math.min(band / 2, 0.85 * rMid * Math.sin(step / 2)) * (0.85 + random() * 0.15)
        regions.push({
          id,
          label,
          tag: 'circle',
          attrs: { cx: labelAt[0], cy: labelAt[1], r: Number(radius.toFixed(1)) },
        })
      }

      targets[id] =
        scheme === 'solid' ? solid : scheme === 'alternate' ? (i % 2 === 0 ? alt1 : alt2) : palette[(i + ring) % palette.length]
    }
  }

  return {
    page: {
      id: `mandala-${age}-${seed}`,
      title: `Mandala #${seed}`,
      kind: 'mandala',
      ages: [age],
      viewBox: '0 0 400 400',
      regions,
    },
    targets,
  }
}
