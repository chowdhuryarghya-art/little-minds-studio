import type { BengaliWordEntry, BengaliPartOfSpeech } from './bengaliTypes.ts'
import { findBengaliWord } from './bengaliData.ts'

const BN_TRANSLIT_MAP: Record<string, string> = {
  'অ': 'o',
  'আ': 'a',
  'ই': 'i',
  'ঈ': 'ee',
  'উ': 'u',
  'ঊ': 'oo',
  'ঋ': 'ri',
  'এ': 'e',
  'ঐ': 'oi',
  'ও': 'o',
  'ঔ': 'ou',
  'া': 'a',
  'ি': 'i',
  'ী': 'ee',
  'ু': 'u',
  'ূ': 'oo',
  'ৃ': 'ri',
  'ে': 'e',
  'ৈ': 'oi',
  'ো': 'o',
  'ৌ': 'ou',
  'ক': 'k',
  'খ': 'kh',
  'গ': 'g',
  'ঘ': 'gh',
  'ঙ': 'ng',
  'চ': 'ch',
  'ছ': 'chh',
  'জ': 'j',
  'ঝ': 'jh',
  'ঞ': 'n',
  'ট': 't',
  'ঠ': 'th',
  'ড': 'd',
  'ঢ': 'dh',
  'ণ': 'n',
  'ত': 't',
  'থ': 'th',
  'দ': 'd',
  'ধ': 'dh',
  'ন': 'n',
  'প': 'p',
  'ফ': 'ph',
  'ব': 'b',
  'ভ': 'bh',
  'ম': 'm',
  'য': 'j',
  'র': 'r',
  'ল': 'l',
  'শ': 'sh',
  'ষ': 'sh',
  'স': 's',
  'হ': 'h',
  'ড়': 'r',
  'ঢ়': 'rh',
  'য়': 'y',
  'ৎ': 't',
  'ং': 'ng',
  'ঃ': 'h',
  'ঁ': 'n',
  '্': '',
}

export function transliterateBengali(text: string): string {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    out += BN_TRANSLIT_MAP[ch] !== undefined ? BN_TRANSLIT_MAP[ch] : ch
  }
  return out ? out.charAt(0).toUpperCase() + out.slice(1) : text
}

function cleanHtmlText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const POS_MAP_BN: Record<string, BengaliPartOfSpeech> = {
  noun: 'বিশেষ্য (Noun)',
  propernoun: 'বিশেষ্য (Noun)',
  verb: 'ক্রিয়া (Verb)',
  adjective: 'বিশেষণ (Adjective)',
  adverb: 'ক্রিয়া বিশেষণ (Adverb)',
  pronoun: 'সর্বনাম (Pronoun)',
}

const memoryCacheBn = new Map<string, BengaliWordEntry>()

/**
 * Fetch Bengali word definition from curated data or live open Wiktionary / translation APIs.
 */
export async function fetchBengaliWord(rawWord: string): Promise<BengaliWordEntry> {
  const normalized = rawWord.trim()
  if (!normalized) {
    throw new Error('অনুগ্রহ করে একটি শব্দ লিখুন (Please enter a word to search).')
  }

  // 1. Check in-memory cache
  if (memoryCacheBn.has(normalized)) {
    return memoryCacheBn.get(normalized)!
  }

  // 2. Check static curated list first
  const curated = findBengaliWord(normalized)
  if (curated) {
    memoryCacheBn.set(normalized, curated)
    return curated
  }

  // 3. Query Wiktionary open REST API + MyMemory translation
  try {
    const wiktionaryUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(normalized)}`
    const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(normalized)}&langpair=bn|en`

    const [wiktRes, transRes] = await Promise.allSettled([
      fetch(wiktionaryUrl, { headers: { 'User-Agent': 'LittleMindsStudio/1.0' } }),
      fetch(translateUrl),
    ])

    let englishMeaning = ''
    let bengaliDefinition = ''
    let partOfSpeech: BengaliPartOfSpeech = 'বিশেষ্য (Noun)'
    let sampleSentenceBengali = `আমি ${normalized} সম্পর্কে জেনেছি।`
    let sampleSentenceEnglish = `I learned about ${normalized}.`

    // Extract translation
    if (transRes.status === 'fulfilled' && transRes.value.ok) {
      const transData = await transRes.value.json()
      if (transData?.responseData?.translatedText) {
        englishMeaning = transData.responseData.translatedText.trim()
      }
    }

    // Extract Wiktionary definition & Part of Speech
    if (wiktRes.status === 'fulfilled' && wiktRes.value.ok) {
      const wiktData = await wiktRes.value.json()
      const bnSections = wiktData.bn || wiktData[Object.keys(wiktData)[0]] || []

      if (Array.isArray(bnSections) && bnSections.length > 0) {
        const primarySection = bnSections[0]
        const posRaw = (primarySection.partOfSpeech || 'noun').toLowerCase()
        partOfSpeech = POS_MAP_BN[posRaw] || 'বিশেষ্য (Noun)'

        if (Array.isArray(primarySection.definitions) && primarySection.definitions.length > 0) {
          const firstDef = primarySection.definitions[0]
          const cleanedDef = cleanHtmlText(firstDef.definition || '')
          if (cleanedDef) {
            bengaliDefinition = `বাংলা অর্থ / অর্থাত্: ${cleanedDef}`
            if (!englishMeaning) {
              englishMeaning = cleanedDef
            }
          }

          if (Array.isArray(firstDef.parsedExamples) && firstDef.parsedExamples.length > 0) {
            const ex = firstDef.parsedExamples[0]
            if (ex.example) sampleSentenceBengali = cleanHtmlText(ex.example)
            if (ex.translation) sampleSentenceEnglish = cleanHtmlText(ex.translation)
          }
        }
      }
    }

    if (!englishMeaning && !bengaliDefinition) {
      throw new Error(`শব্দ "${rawWord}" পাওয়া যায়নি (Word not found in dictionary).`)
    }

    if (!englishMeaning) {
      englishMeaning = normalized
    }

    if (!bengaliDefinition) {
      bengaliDefinition = `বাংলা ভাষায় "${normalized}" শব্দের অর্থ: ${englishMeaning}।`
    }

    const romanized = transliterateBengali(normalized)

    const entry: BengaliWordEntry = {
      word: normalized,
      romanized,
      englishMeaning,
      bengaliDefinition,
      partOfSpeech,
      synonyms: [],
      exampleSentence: {
        bengali: sampleSentenceBengali,
        romanized: transliterateBengali(sampleSentenceBengali),
        english: sampleSentenceEnglish,
      },
      ageGroup: 'curious',
      category: 'সাধারণ শব্দকোষ (General Vocabulary)',
    }

    memoryCacheBn.set(normalized, entry)
    return entry
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error(`শব্দ "${rawWord}" পাওয়া যায়নি (Word not found).`)
  }
}
