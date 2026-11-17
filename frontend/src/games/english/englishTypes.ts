import type { AgeGroupId } from '../../data/ageGroups.ts'

export interface DictionaryDefinition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

export interface DictionaryMeaning {
  partOfSpeech: string
  definitions: DictionaryDefinition[]
  synonyms?: string[]
  antonyms?: string[]
}

export interface DictionaryPhonetic {
  text?: string
  audio?: string
}

export interface WordEntry {
  word: string
  phonetic?: string
  phonetics?: DictionaryPhonetic[]
  meanings: DictionaryMeaning[]
  origin?: string
  funFact?: string
  ageGroup?: AgeGroupId
  category?: string
  sourceUrls?: string[]
  license?: {
    name: string
    url: string
  }
}

export interface CuratedWord {
  word: string
  ageGroup: AgeGroupId
  category: string
  hint: string
  fallbackData?: WordEntry
}
