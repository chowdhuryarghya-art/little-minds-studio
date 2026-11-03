import type { AgeGroupId } from '../../data/ageGroups.ts'
import { createRandom, pick, randInt, shuffled } from '../../lib/random.ts'
import { PALETTE } from '../coloring/palette.ts'
import type { GeneratedPicture, Region } from '../coloring/types.ts'

type EarStyle = 'pointy' | 'round' | 'long'
type TailStyle = 'ball' | 'fluff' | 'point'
type EyeStyle = 'round' | 'sleepy' | 'cyclops'

interface AgeSpec {
  colors: number
  legs: 2 | 4
  spots: number[]
  wings: boolean
  antenna: boolean
  eyes: EyeStyle[]
}

/** Older levels get more colors, more parts and more unusual features. */
const SPECS: Record<AgeGroupId, AgeSpec> = {
  explorers: { colors: 3, legs: 2, spots: [0], wings: false, antenna: false, eyes: ['round', 'sleepy'] },
  curious: { colors: 4, legs: 4, spots: [0, 2, 4], wings: false, antenna: false, eyes: ['round', 'sleepy'] },
  creative: { colors: 5, legs: 4, spots: [2, 4], wings: true, antenna: true, eyes: ['round', 'sleepy', 'cyclops'] },
}

const CX = 200
const BODY_Y = 255
const HEAD_Y = 130
const n1 = (n: number): number => Number(n.toFixed(1))

/**
 * Builds a creature from a picture number: the same number and age group
 * always give the same creature. Regions are listed back to front, and every
 * region has an explicit label position that sits on its visible part.
 */
export function generateCreature(seed: number, age: AgeGroupId): GeneratedPicture {
  const random = createRandom(seed)
  const spec = SPECS[age]

  const side = random() < 0.5 ? -1 : 1 // which side the tail is on
  const bw = randInt(random, 72, 95) // body half-width
  const bh = randInt(random, 62, 80) // body half-height
  const hr = randInt(random, 48, 60) // head radius
  const ears = pick(random, ['pointy', 'round', 'long'] as EarStyle[])
  const tail = pick(random, ['ball', 'fluff', 'point'] as TailStyle[])
  const eyeStyle = pick(random, spec.eyes)
  const spots = pick(random, spec.spots)
  const hasWings = spec.wings && random() < 0.5
  const hasAntenna = spec.antenna && random() < 0.5

  const palette = shuffled(random, PALETTE.map((p) => p.value)).slice(0, spec.colors)
  const n = palette.length
  const [base, accent, light] = palette
  const bodyColor = base
  const headColor = random() < 0.7 ? base : accent
  const dark = palette[3 % n]
  const extra = palette[4 % n]

  const regions: Region[] = []
  const targets: Record<string, string> = {}
  const add = (region: Region, color: string): void => {
    regions.push(region)
    targets[region.id] = color
  }

  // --- Back layer: wings, tail, legs ---------------------------------------
  if (hasWings) {
    for (const s of [-1, 1]) {
      const cx = n1(CX + s * (bw + 28))
      const cy = BODY_Y - 45
      add(
        { id: s < 0 ? 'wing-l' : 'wing-r', label: s < 0 ? 'Left wing' : 'Right wing', tag: 'ellipse', attrs: { cx, cy, rx: 38, ry: 22 }, labelAt: [cx, cy] },
        extra,
      )
    }
  }

  const tailY = BODY_Y + 35
  const edgeX = CX + side * bw
  if (tail === 'ball') {
    const cx = n1(edgeX + side * 14)
    add({ id: 'tail', label: 'Tail', tag: 'circle', attrs: { cx, cy: tailY, r: 24 }, labelAt: [cx, tailY] }, accent)
  } else if (tail === 'fluff') {
    const cx = n1(edgeX + side * 22)
    const cy = tailY - 6
    add({ id: 'tail', label: 'Tail', tag: 'ellipse', attrs: { cx, cy, rx: 30, ry: 18 }, labelAt: [cx, cy] }, accent)
  } else {
    const pts = [
      [edgeX - side * 8, tailY - 12],
      [edgeX + side * 52, tailY - 40],
      [edgeX + side * 40, tailY + 30],
    ]
    add(
      {
        id: 'tail',
        label: 'Tail',
        tag: 'polygon',
        attrs: { points: pts.map((p) => `${n1(p[0])},${n1(p[1])}`).join(' ') },
        labelAt: [n1(edgeX + side * 28), n1(tailY - 7)],
      },
      accent,
    )
  }

  const legSlots = spec.legs === 4 ? [-0.66, -0.22, 0.22, 0.66] : [-0.5, 0.5]
  const legRx = n1(bw * (spec.legs === 4 ? 0.2 : 0.24))
  const legCy = BODY_Y + bh + 6
  legSlots.forEach((slot, i) => {
    const cx = n1(CX + slot * bw)
    add(
      { id: `leg-${i + 1}`, label: `Leg ${i + 1}`, tag: 'ellipse', attrs: { cx, cy: legCy, rx: legRx, ry: 24 }, labelAt: [cx, legCy + 8] },
      accent,
    )
  })

  // --- Middle layer: body, belly, spots ------------------------------------
  const bellyTop = BODY_Y + 8 - 0.55 * bh
  const headBottom = HEAD_Y + hr
  add(
    {
      id: 'body',
      label: 'Body',
      tag: 'ellipse',
      attrs: { cx: CX, cy: BODY_Y, rx: bw, ry: bh },
      labelAt: [CX, n1((headBottom + bellyTop) / 2)],
    },
    bodyColor,
  )
  add(
    {
      id: 'belly',
      label: 'Belly',
      tag: 'ellipse',
      attrs: { cx: CX, cy: BODY_Y + 8, rx: n1(bw * 0.5), ry: n1(bh * 0.55) },
      labelAt: [CX, BODY_Y + 8],
    },
    light,
  )
  const spotSlots: Array<[number, number]> = [
    [-0.7, -0.25],
    [0.7, -0.25],
    [-0.62, 0.4],
    [0.62, 0.4],
  ]
  spotSlots.slice(0, spots).forEach(([sx, sy], i) => {
    const cx = n1(CX + sx * bw)
    const cy = n1(BODY_Y + sy * bh)
    add(
      { id: `spot-${i + 1}`, label: `Spot ${i + 1}`, tag: 'circle', attrs: { cx, cy, r: n1(bw * 0.2) }, labelAt: [cx, cy] },
      dark,
    )
  })

  // --- Front layer: ears, antenna, head, muzzle ----------------------------
  // The head is drawn over the ears, so a label must sit on the part of the
  // ear that sticks out: search for the point nearest the ear's middle where
  // a label-sized box stays inside the ear and outside the head.
  const outsideHead = (x: number, y: number): boolean => (x - CX) ** 2 + (y - HEAD_Y) ** 2 > hr * hr
  const earLabel = (
    inEar: (x: number, y: number) => boolean,
    box: [number, number, number, number],
    mid: [number, number],
  ): [number, number] => {
    let best = mid
    let bestDist = Infinity
    for (let x = box[0]; x <= box[2]; x += 2) {
      for (let y = box[1]; y <= box[3]; y += 2) {
        let ok = true
        for (let dx = -8; dx <= 8 && ok; dx += 4) {
          for (let dy = -9; dy <= 9; dy += 4.5) {
            if (!inEar(x + dx, y + dy) || !outsideHead(x + dx, y + dy)) {
              ok = false
              break
            }
          }
        }
        const d = (x - mid[0]) ** 2 + (y - mid[1]) ** 2
        if (ok && d < bestDist) {
          best = [x, y]
          bestDist = d
        }
      }
    }
    return best
  }

  for (const s of [-1, 1]) {
    const id = s < 0 ? 'ear-l' : 'ear-r'
    const label = s < 0 ? 'Left ear' : 'Right ear'
    if (ears === 'pointy') {
      const p = (fx: number, fy: number): [number, number] => [n1(CX + s * fx * hr), n1(HEAD_Y + fy * hr)]
      const a = p(1.05, -0.05)
      const b = p(0.95, -1.9)
      const c = p(-0.05, -0.85)
      const inTri = (x: number, y: number): boolean => {
        const d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        const u = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / d
        const v = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / d
        return u >= 0 && v >= 0 && u + v <= 1
      }
      const mid: [number, number] = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3]
      add(
        {
          id,
          label,
          tag: 'polygon',
          attrs: { points: [a, b, c].map((q) => `${q[0]},${q[1]}`).join(' ') },
          labelAt: earLabel(inTri, [CX - 2 * hr, HEAD_Y - 2 * hr, CX + 2 * hr, HEAD_Y], mid),
        },
        accent,
      )
    } else if (ears === 'round') {
      const cx = n1(CX + s * 0.85 * hr)
      const cy = n1(HEAD_Y - 0.8 * hr)
      const r = n1(0.55 * hr)
      add(
        {
          id,
          label,
          tag: 'circle',
          attrs: { cx, cy, r },
          labelAt: earLabel((x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r, [cx - r, cy - r, cx + r, cy + r], [cx, cy]),
        },
        accent,
      )
    } else {
      const cx = n1(CX + s * 0.6 * hr)
      const cy = n1(HEAD_Y - 1.3 * hr)
      const rx = n1(0.3 * hr)
      const ry = n1(0.85 * hr)
      add(
        {
          id,
          label,
          tag: 'ellipse',
          attrs: { cx, cy, rx, ry },
          labelAt: earLabel(
            (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1,
            [cx - rx, cy - ry, cx + rx, cy + ry],
            [cx, cy - 0.15 * hr],
          ),
        },
        accent,
      )
    }
  }

  const details: Region[] = []
  if (hasAntenna) {
    const cy = n1(HEAD_Y - hr - 30)
    add({ id: 'antenna', label: 'Antenna ball', tag: 'circle', attrs: { cx: CX, cy, r: 12 }, labelAt: [CX, cy] }, extra)
    details.push({
      id: 'antenna-stalk',
      label: 'Antenna',
      tag: 'path',
      attrs: { d: `M ${CX} ${n1(HEAD_Y - hr)} L ${CX} ${n1(HEAD_Y - hr - 18)}`, class: 'detail-line' },
    })
  }

  add(
    {
      id: 'head',
      label: 'Head',
      tag: 'circle',
      attrs: { cx: CX, cy: HEAD_Y, r: hr },
      labelAt: [CX, n1(HEAD_Y - 0.6 * hr)],
    },
    headColor,
  )
  add(
    {
      id: 'muzzle',
      label: 'Muzzle',
      tag: 'ellipse',
      attrs: { cx: CX, cy: n1(HEAD_Y + 0.38 * hr), rx: n1(0.5 * hr), ry: n1(0.34 * hr) },
      labelAt: [CX, n1(HEAD_Y + 0.46 * hr)],
    },
    light,
  )

  // --- Details (never colorable) -------------------------------------------
  const eyeY = n1(HEAD_Y - 0.2 * hr)
  if (eyeStyle === 'round') {
    for (const s of [-1, 1]) {
      details.push({
        id: s < 0 ? 'eye-l' : 'eye-r',
        label: 'Eye',
        tag: 'circle',
        attrs: { cx: n1(CX + s * 0.35 * hr), cy: eyeY, r: n1(0.1 * hr), class: 'detail-dark' },
      })
    }
  } else if (eyeStyle === 'sleepy') {
    for (const s of [-1, 1]) {
      const x = n1(CX + s * 0.35 * hr)
      details.push({
        id: s < 0 ? 'eye-l' : 'eye-r',
        label: 'Eye',
        tag: 'path',
        attrs: { d: `M ${n1(x - 8)} ${eyeY} Q ${x} ${n1(eyeY + 9)} ${n1(x + 8)} ${eyeY}`, class: 'detail-line' },
      })
    }
  } else {
    details.push({
      id: 'eye',
      label: 'Eye',
      tag: 'circle',
      attrs: { cx: CX, cy: eyeY, r: n1(0.2 * hr), class: 'detail-dark' },
    })
  }
  details.push({
    id: 'nose',
    label: 'Nose',
    tag: 'circle',
    attrs: { cx: CX, cy: n1(HEAD_Y + 0.14 * hr), r: n1(0.07 * hr), class: 'detail-dark' },
  })

  return {
    page: {
      id: `creature-${age}-${seed}`,
      title: `Creature #${seed}`,
      kind: 'creature',
      ages: [age],
      viewBox: '0 0 400 400',
      regions,
      details,
    },
    targets,
  }
}
