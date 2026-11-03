import type { ColoringPage, Fills } from './types.ts'

const KEY_PREFIX = 'lms.coloring.'
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

/**
 * Reads saved fills for a page. Stored data is untrusted (anyone can edit
 * localStorage), so keep only known region ids with valid hex colours.
 */
export function loadFills(page: ColoringPage): Fills {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + page.id)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    const known = new Set(page.regions.map((r) => r.id))
    const fills: Fills = {}
    for (const [id, color] of Object.entries(parsed)) {
      if (known.has(id) && typeof color === 'string' && HEX_COLOR.test(color)) fills[id] = color
    }
    return fills
  } catch {
    return {}
  }
}

export function saveFills(page: ColoringPage, fills: Fills): void {
  try {
    if (Object.keys(fills).length === 0) localStorage.removeItem(KEY_PREFIX + page.id)
    else localStorage.setItem(KEY_PREFIX + page.id, JSON.stringify(fills))
  } catch {
    // Storage unavailable or full: the game still works, just without saving.
  }
}
