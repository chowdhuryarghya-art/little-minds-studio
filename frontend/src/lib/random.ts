/** Deterministic pseudo-random numbers: the same seed always gives the same sequence. */
export type Random = () => number

/** mulberry32: small, fast, good enough for games (NOT for security). */
export function createRandom(seed: number): Random {
  let a = seed >>> 0
  const next: Random = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  // Warm up so that consecutive seeds do not start with similar values.
  next()
  next()
  next()
  return next
}

export function randInt(random: Random, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1))
}

export function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]
}

export function shuffled<T>(random: Random, items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Picture numbers are 1 to 8 digits so they are easy to read out and type. */
export const MAX_SEED = 99_999_999

export function parseSeed(value: string | null): number | null {
  return value !== null && /^\d{1,8}$/.test(value) ? Number(value) : null
}

export function randomSeed(): number {
  return Math.floor(Math.random() * (MAX_SEED + 1))
}
