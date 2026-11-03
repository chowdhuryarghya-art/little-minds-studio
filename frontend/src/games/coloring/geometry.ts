import type { Region } from './types.ts'

/** Where to draw a region's number label. Coloring regions never use `path`. */
export function labelPosition(region: Region): [number, number] {
  if (region.labelAt) return region.labelAt
  const a = region.attrs
  switch (region.tag) {
    case 'circle':
    case 'ellipse':
      return [Number(a.cx), Number(a.cy)]
    case 'rect':
      return [Number(a.x) + Number(a.width) / 2, Number(a.y) + Number(a.height) / 2]
    case 'polygon': {
      const pts = String(a.points)
        .trim()
        .split(/\s+/)
        .map((p) => p.split(',').map(Number))
      const n = pts.length
      return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n]
    }
    case 'path':
      return [200, 200]
  }
}
