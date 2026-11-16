import type { HindiWordEntry } from './hindiTypes.ts'
import { findHindiWord } from './hindiData.ts'

export async function fetchHindiWord(rawWord: string): Promise<HindiWordEntry> {
  const normalized = rawWord.trim()
  if (!normalized) {
    throw new Error('कृपया एक शब्द लिखें (Please enter a word to search).')
  }

  const entry = findHindiWord(normalized)
  if (!entry) {
    throw new Error(
      'यह शब्द हमारी चुनी हुई बाल-सुरक्षित शब्द सूची में नहीं है। सुझाए गए शब्दों में से चुनें। (Choose a word from the child-safe suggestions.)',
    )
  }

  return entry
}
