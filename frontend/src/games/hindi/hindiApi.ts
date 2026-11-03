import type { HindiWordEntry, HindiPartOfSpeech } from './hindiTypes.ts'
import { findHindiWord } from './hindiData.ts'

const HI_TRANSLIT_MAP: Record<string, string> = {
  'अ': 'a',
  'आ': 'aa',
  'इ': 'i',
  'ई': 'ee',
  'उ': 'u',
  'ऊ': 'oo',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
  'ऋ': 'ri',
  'अं': 'an',
  'अः': 'ah',
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ee',
  'ु': 'u',
  'ू': 'oo',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'ृ': 'ri',
  'ं': 'n',
  'ँ': 'n',
  'ः': 'h',
  '्': '',
  'क': 'k',
  'ख': 'kh',
  'ग': 'g',
  'घ': 'gh',
  'ङ': 'ng',
  'च': 'ch',
  'छ': 'chh',
  'ज': 'j',
  'झ': 'jh',
  'ञ': 'n',
  'ट': 't',
  'ठ': 'th',
  'ड': 'd',
  'ढ': 'dh',
  'ण': 'n',
  'त': 't',
  'थ': 'th',
  'द': 'd',
  'ध': 'dh',
  'न': 'n',
  'प': 'p',
  'फ': 'ph',
  'ब': 'b',
  'भ': 'bh',
  'म': 'm',
  'य': 'y',
  'र': 'r',
  'ल': 'l',
  'व': 'v',
  'श': 'sh',
  'ष': 'sh',
  'स': 's',
  'ह': 'h',
  'क्ष': 'ksha',
  'त्र': 'tra',
  'ज्ञ': 'gya',
  'श्र': 'shra',
  'ड़': 'r',
  'ढ़': 'rh',
}

export function transliterateHindi(text: string): string {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    out += HI_TRANSLIT_MAP[ch] !== undefined ? HI_TRANSLIT_MAP[ch] : ch
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

const POS_MAP_HI: Record<string, HindiPartOfSpeech> = {
  noun: 'संज्ञा (Noun)',
  propernoun: 'संज्ञा (Noun)',
  verb: 'क्रिया (Verb)',
  adjective: 'विशेषण (Adjective)',
  adverb: 'क्रिया विशेषण (Adverb)',
  pronoun: 'सर्वनाम (Pronoun)',
}

const memoryCacheHi = new Map<string, HindiWordEntry>()

/**
 * Fetch Hindi word definition from curated data or live open Wiktionary / translation APIs.
 */
export async function fetchHindiWord(rawWord: string): Promise<HindiWordEntry> {
  const normalized = rawWord.trim()
  if (!normalized) {
    throw new Error('कृपया एक शब्द लिखें (Please enter a word to search).')
  }

  // 1. Check in-memory cache
  if (memoryCacheHi.has(normalized)) {
    return memoryCacheHi.get(normalized)!
  }

  // 2. Check static curated list first
  const curated = findHindiWord(normalized)
  if (curated) {
    memoryCacheHi.set(normalized, curated)
    return curated
  }

  // 3. Query Wiktionary open REST API + MyMemory translation
  try {
    const wiktionaryUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(normalized)}`
    const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(normalized)}&langpair=hi|en`

    const [wiktRes, transRes] = await Promise.allSettled([
      fetch(wiktionaryUrl, { headers: { 'User-Agent': 'LittleMindsStudio/1.0' } }),
      fetch(translateUrl),
    ])

    let englishMeaning = ''
    let hindiDefinition = ''
    let partOfSpeech: HindiPartOfSpeech = 'संज्ञा (Noun)'
    let sampleSentenceHindi = `मैंने ${normalized} के बारे में सीखा।`
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
      const hiSections = wiktData.hi || wiktData[Object.keys(wiktData)[0]] || []

      if (Array.isArray(hiSections) && hiSections.length > 0) {
        const primarySection = hiSections[0]
        const posRaw = (primarySection.partOfSpeech || 'noun').toLowerCase()
        partOfSpeech = POS_MAP_HI[posRaw] || 'संज्ञा (Noun)'

        if (Array.isArray(primarySection.definitions) && primarySection.definitions.length > 0) {
          const firstDef = primarySection.definitions[0]
          const cleanedDef = cleanHtmlText(firstDef.definition || '')
          if (cleanedDef) {
            hindiDefinition = `हिंदी अर्थ / तात्पर्य: ${cleanedDef}`
            if (!englishMeaning) {
              englishMeaning = cleanedDef
            }
          }

          if (Array.isArray(firstDef.parsedExamples) && firstDef.parsedExamples.length > 0) {
            const ex = firstDef.parsedExamples[0]
            if (ex.example) sampleSentenceHindi = cleanHtmlText(ex.example)
            if (ex.translation) sampleSentenceEnglish = cleanHtmlText(ex.translation)
          }
        }
      }
    }

    if (!englishMeaning && !hindiDefinition) {
      throw new Error(`शब्द "${rawWord}" नहीं मिला (Word not found in dictionary).`)
    }

    if (!englishMeaning) {
      englishMeaning = normalized
    }

    if (!hindiDefinition) {
      hindiDefinition = `हिंदी में "${normalized}" शब्द का अर्थ: ${englishMeaning}।`
    }

    const romanized = transliterateHindi(normalized)

    const entry: HindiWordEntry = {
      word: normalized,
      romanized,
      englishMeaning,
      hindiDefinition,
      partOfSpeech,
      synonyms: [],
      exampleSentence: {
        hindi: sampleSentenceHindi,
        romanized: transliterateHindi(sampleSentenceHindi),
        english: sampleSentenceEnglish,
      },
      ageGroup: 'curious',
      category: 'सामान्य शब्दकोश (General Vocabulary)',
    }

    memoryCacheHi.set(normalized, entry)
    return entry
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error(`शब्द "${rawWord}" नहीं मिला (Word not found).`)
  }
}
