import type { AgeGroupId } from '../../data/ageGroups.ts'

export type RegionTag = 'path' | 'circle' | 'ellipse' | 'rect' | 'polygon'

/** One colourable area of an illustration. */
export interface Region {
  id: string
  label: string
  tag: RegionTag
  attrs: Record<string, string | number>
  /** Where to draw this region's number in color-by-number (default: its center). */
  labelAt?: [number, number]
}

export type ColoringKind = 'animal' | 'shape' | 'nature' | 'festival' | 'mandala' | 'creature'

export interface ColoringPage {
  id: string
  title: string
  kind: ColoringKind
  ages: AgeGroupId[]
  viewBox: string
  regions: Region[]
  /** Non-colourable decoration (eyes, whiskers…) drawn on top of the regions. */
  details?: Region[]
}

/** Map of region id → fill colour. Missing = unpainted (white). */
export type Fills = Record<string, string>

/** A picture made by a generator from a Picture number, plus target colors for color by number. */
export interface GeneratedPicture {
  page: ColoringPage
  /** Region id to target color. */
  targets: Record<string, string>
}
