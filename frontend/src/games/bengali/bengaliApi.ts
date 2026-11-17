import type { BengaliWordEntry } from './bengaliTypes.ts'
import { findBengaliWord } from './bengaliData.ts'
import { assertWordAllowed } from '../safety/wordSafety.ts'
import { fetchWiktionaryEntry } from '../safety/wiktionaryApi.ts'

export async function fetchBengaliWord(rawWord: string): Promise<BengaliWordEntry> {
  const normalized = rawWord.trim()
  if (!normalized) {
    throw new Error('অনুগ্রহ করে একটি শব্দ লিখুন (Please enter a word to search).')
  }
  if (normalized.length > 100) throw new Error('অনুগ্রহ করে ছোট শব্দ খুঁজুন (Please search for a shorter word).')
  assertWordAllowed(normalized, 'bengali')

  const knownWord = findBengaliWord(normalized)
  if (knownWord) assertWordAllowed(knownWord.word, 'bengali')
  const entry = await fetchWiktionaryEntry(knownWord?.word ?? normalized, 'bn')
  if (knownWord) {
    return { ...knownWord, dictionaryExtract: entry.extract, sourceUrl: entry.sourceUrl }
  }

  const sampleSentence = entry.example ?? `আমি “${entry.title}” শব্দটি শিখছি।`
  return {
    word: entry.title,
    romanized: '',
    englishMeaning: '',
    bengaliDefinition: entry.definition,
    partOfSpeech: entry.partOfSpeech || 'অভিধান (Dictionary entry)',
    synonyms: [],
    exampleSentence: {
      bengali: sampleSentence,
      romanized: '',
      english: `I am learning the word "${entry.title}".`,
    },
    category: 'অভিধান (Dictionary)',
    dictionaryExtract: entry.extract,
    sourceUrl: entry.sourceUrl,
  }
}
