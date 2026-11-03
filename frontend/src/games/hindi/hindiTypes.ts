import type { AgeGroupId } from '../../data/ageGroups.ts'

export type HindiPartOfSpeech =
  | 'संज्ञा (Noun)'
  | 'क्रिया (Verb)'
  | 'विशेषण (Adjective)'
  | 'क्रिया विशेषण (Adverb)'
  | 'सर्वनाम (Pronoun)'

export interface HindiWordEntry {
  word: string // Devanagari script, e.g. "इंद्रधनुष"
  romanized: string // e.g. "Indradhanush"
  englishMeaning: string // e.g. "Rainbow"
  hindiDefinition: string // e.g. "बारिश के बाद आकाश में दिखाई देने वाला सात रंगों का धनुष"
  partOfSpeech: HindiPartOfSpeech
  synonyms: Array<{ word: string; romanized: string }> // समानार्थी
  antonyms?: Array<{ word: string; romanized: string }> // विलोम
  exampleSentence: {
    hindi: string // e.g. "बारिश के बाद आसमान में सुंदर इंद्रधनुष दिखाई दिया।"
    romanized: string // e.g. "Baarish ke baad aasmaan mein sundar indradhanush dikhaai diya."
    english: string // e.g. "After the rain, a beautiful rainbow appeared in the sky."
  }
  originOrContext?: string
  funFact?: string
  ageGroup: AgeGroupId
  category: string
}
