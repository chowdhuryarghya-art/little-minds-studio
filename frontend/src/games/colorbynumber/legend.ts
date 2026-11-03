import { PALETTE } from '../coloring/palette.ts'
import type { ColoringPage } from '../coloring/types.ts'

export interface LegendEntry {
  number: number
  color: string
  name: string
}

/** Numbers colors 1..n in order of first appearance on the page. */
export function buildLegend(page: ColoringPage, targets: Record<string, string>): LegendEntry[] {
  const legend: LegendEntry[] = []
  for (const region of page.regions) {
    const color = targets[region.id]
    if (color === undefined || legend.some((l) => l.color === color)) continue
    const name = PALETTE.find((p) => p.value === color)?.name ?? color
    legend.push({ number: legend.length + 1, color, name })
  }
  return legend
}

/** Region id → number label to draw on it. */
export function buildLabels(
  page: ColoringPage,
  targets: Record<string, string>,
  legend: LegendEntry[],
): Record<string, string> {
  const labels: Record<string, string> = {}
  for (const region of page.regions) {
    const entry = legend.find((l) => l.color === targets[region.id])
    if (entry) labels[region.id] = String(entry.number)
  }
  return labels
}
