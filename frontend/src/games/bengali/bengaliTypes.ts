import type { AgeGroupId } from '../../data/ageGroups.ts'

export type BengaliPartOfSpeech =
  | 'বিশেষ্য (Noun)'
  | 'ক্রিয়া (Verb)'
  | 'বিশেষণ (Adjective)'
  | 'ক্রিয়া বিশেষণ (Adverb)'
  | 'সর্বনাম (Pronoun)'

export interface BengaliWordEntry {
  word: string // Bengali script, e.g. "রংধনু"
  romanized: string // e.g. "Rongdhonu"
  englishMeaning: string // e.g. "Rainbow"
  bengaliDefinition: string // e.g. "বৃষ্টির পর আকাশে সূর্যের আলোয় ফুটে ওঠা সাতটি রঙের ধনুকাকার রেখা।"
  partOfSpeech: BengaliPartOfSpeech
  synonyms: Array<{ word: string; romanized: string }> // সমার্থক শব্দ
  antonyms?: Array<{ word: string; romanized: string }> // বিপরীতার্থক শব্দ
  exampleSentence: {
    bengali: string // e.g. "বৃষ্টি থামার পর আকাশে সুন্দর একটি রংধনু দেখা গেল।"
    romanized: string // e.g. "Brishti thamar por akashe sundor ekti rongdhonu dekha gelo."
    english: string // e.g. "After the rain stopped, a beautiful rainbow was seen in the sky."
  }
  originOrContext?: string
  funFact?: string
  ageGroup: AgeGroupId
  category: string
}
