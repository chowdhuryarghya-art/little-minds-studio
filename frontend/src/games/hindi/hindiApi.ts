import type { HindiWordEntry } from './hindiTypes.ts'
import { findHindiWord } from './hindiData.ts'
import { assertWordAllowed } from '../safety/wordSafety.ts'
import { fetchWiktionaryEntry } from '../safety/wiktionaryApi.ts'

export async function fetchHindiWord(rawWord: string): Promise<HindiWordEntry> {
  const normalized = rawWord.trim()
  if (!normalized) {
    throw new Error('कृपया एक शब्द लिखें (Please enter a word to search).')
  }
  if (normalized.length > 100) throw new Error('कृपया छोटा शब्द खोजें (Please search for a shorter word).')
  assertWordAllowed(normalized, 'hindi')

  const knownWord = findHindiWord(normalized)
  if (knownWord) assertWordAllowed(knownWord.word, 'hindi')
  const entry = await fetchWiktionaryEntry(knownWord?.word ?? normalized, 'hi')
  if (knownWord) {
    return { ...knownWord, dictionaryExtract: entry.extract, sourceUrl: entry.sourceUrl }
  }

  return {
    word: entry.title,
    romanized: '',
    englishMeaning: '',
    hindiDefinition: entry.definition,
    partOfSpeech: entry.partOfSpeech || 'शब्दकोश (Dictionary entry)',
    synonyms: [],
    exampleSentence: { hindi: entry.example ?? '', romanized: '', english: '' },
    category: 'शब्दकोश (Dictionary)',
    dictionaryExtract: entry.extract,
    sourceUrl: entry.sourceUrl,
  }
}
