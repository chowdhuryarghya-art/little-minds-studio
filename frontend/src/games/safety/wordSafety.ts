import bengaliDictionary from './profanity/bengali.json'
import englishDictionary from './profanity/english.json'
import hindiDictionary from './profanity/hindi.json'

export type WordLanguage = 'english' | 'hindi' | 'bengali'

const dictionaries = {
  english: englishDictionary,
  hindi: hindiDictionary,
  bengali: bengaliDictionary,
}

function compileDictionary(language: WordLanguage): RegExp[] {
  return Object.values(dictionaries[language].categories)
    .flat()
    .map((entry) => {
      const normalizedEntry = normalize(entry)
      const pattern = normalizedEntry
        .split('*')
        .map(escapeRegExp)
        .join('[\\p{L}\\p{M}]*')
      return new RegExp(
        `(^|[^\\p{L}\\p{M}\\p{N}])${pattern}(?=$|[^\\p{L}\\p{M}\\p{N}])`,
        'u',
      )
    })
}

const blockedPatterns: Record<WordLanguage, RegExp[]> = {
  english: compileDictionary('english'),
  hindi: compileDictionary('hindi'),
  bengali: compileDictionary('bengali'),
}

const blockedMessages: Record<WordLanguage, string> = {
  english: "This word isn't available for learning. Try a different word.",
  hindi: 'यह शब्द सीखने के लिए उपलब्ध नहीं है। कोई दूसरा शब्द खोजें।',
  bengali: 'এই শব্দটি শেখার জন্য উপলব্ধ নয়। অন্য একটি শব্দ খুঁজুন।',
}

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

export function containsBlockedWord(input: string, language: WordLanguage): boolean {
  const normalizedInput = normalize(input)
  if (!normalizedInput) return false

  if (blockedPatterns[language].some((pattern) => pattern.test(normalizedInput))) return true
  return language !== 'english'
    && /\p{Script=Latin}/u.test(normalizedInput)
    && blockedPatterns.english.some((pattern) => pattern.test(normalizedInput))
}

export function assertWordAllowed(input: string, language: WordLanguage): void {
  if (containsBlockedWord(input, language)) {
    throw new Error(blockedMessages[language])
  }
}
