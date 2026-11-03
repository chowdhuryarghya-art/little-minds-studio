import type {
  WordEntry,
  DictionaryMeaning,
  DictionaryDefinition,
  DictionaryPhonetic,
} from './englishTypes.ts'
import { CURATED_WORDS } from './wordBank.ts'

interface RawDictionaryResponse {
  word: string
  phonetic?: string
  phonetics?: Array<{
    text?: string
    audio?: string
    sourceUrl?: string
  }>
  origin?: string
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
      synonyms?: string[]
      antonyms?: string[]
    }>
    synonyms?: string[]
    antonyms?: string[]
  }>
}

interface DatamuseWordItem {
  word: string
  score?: number
  numSyllables?: number
  tags?: string[]
  defs?: string[]
}

interface DatamuseRelItem {
  word: string
  score?: number
}

const PRIMARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'
const DATAMUSE_API_BASE = 'https://api.datamuse.com/words'

// In-memory cache for fetched words during session
const memoryCache = new Map<string, WordEntry>()

const POS_MAP: Record<string, string> = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  pron: 'pronoun',
  prep: 'preposition',
  conj: 'conjunction',
  interj: 'interjection',
}

/**
 * Fallback fetcher using Datamuse API (fast, open, high-availability).
 */
async function fetchDatamuseDefinition(normalized: string): Promise<WordEntry> {
  const [mainRes, synRes, antRes] = await Promise.allSettled([
    fetch(`${DATAMUSE_API_BASE}?sp=${encodeURIComponent(normalized)}&md=dpfs&max=1`),
    fetch(`${DATAMUSE_API_BASE}?rel_syn=${encodeURIComponent(normalized)}&max=8`),
    fetch(`${DATAMUSE_API_BASE}?rel_ant=${encodeURIComponent(normalized)}&max=8`),
  ])

  let mainItems: DatamuseWordItem[] = []
  if (mainRes.status === 'fulfilled' && mainRes.value.ok) {
    mainItems = await mainRes.value.json()
  }

  if (!Array.isArray(mainItems) || mainItems.length === 0) {
    throw new Error(`Word "${normalized}" was not found in the dictionary. Try another word!`)
  }

  const raw = mainItems[0]
  if (raw.word.toLowerCase() !== normalized && !raw.defs?.length) {
    throw new Error(`Word "${normalized}" was not found in the dictionary. Try another word!`)
  }

  let synonyms: string[] = []
  if (synRes.status === 'fulfilled' && synRes.value.ok) {
    const synData: DatamuseRelItem[] = await synRes.value.json()
    if (Array.isArray(synData)) {
      synonyms = synData.map((x) => x.word).filter(Boolean)
    }
  }

  let antonyms: string[] = []
  if (antRes.status === 'fulfilled' && antRes.value.ok) {
    const antData: DatamuseRelItem[] = await antRes.value.json()
    if (Array.isArray(antData)) {
      antonyms = antData.map((x) => x.word).filter(Boolean)
    }
  }

  // Group definitions by part of speech
  const meaningsMap = new Map<string, DictionaryDefinition[]>()

  if (Array.isArray(raw.defs) && raw.defs.length > 0) {
    for (const defStr of raw.defs) {
      const tabIdx = defStr.indexOf('\t')
      let posCode = 'n'
      let cleanDef = defStr

      if (tabIdx !== -1) {
        posCode = defStr.slice(0, tabIdx).trim().toLowerCase()
        cleanDef = defStr.slice(tabIdx + 1).trim()
      }

      const partOfSpeech = POS_MAP[posCode] || posCode || 'general'
      if (!meaningsMap.has(partOfSpeech)) {
        meaningsMap.set(partOfSpeech, [])
      }

      meaningsMap.get(partOfSpeech)!.push({
        definition: cleanDef,
        example: `I learned how to use "${normalized}" in my daily reading.`,
      })
    }
  } else {
    // If no definitions array, provide a clear descriptive entry
    meaningsMap.set('noun', [
      {
        definition: `The English word "${normalized}".`,
        example: `Look up "${normalized}" to learn its meaning and synonyms.`,
      },
    ])
  }

  const meanings: DictionaryMeaning[] = Array.from(meaningsMap.entries()).map(
    ([partOfSpeech, definitions]) => ({
      partOfSpeech,
      definitions,
      synonyms: synonyms.slice(0, 6),
      antonyms: antonyms.slice(0, 6),
    })
  )

  return {
    word: raw.word || normalized,
    phonetic: raw.numSyllables ? `[${raw.numSyllables} syllable${raw.numSyllables > 1 ? 's' : ''}]` : '',
    phonetics: [],
    meanings,
    origin: `From the English lexicon.`,
  }
}

/**
 * Primary dictionary fetcher with dual-engine fallback and session caching.
 */
export async function fetchWordDefinition(
  rawWord: string,
  timeoutMs = 8000
): Promise<WordEntry> {
  const normalized = rawWord.trim().toLowerCase()
  if (!normalized) {
    throw new Error('Please enter a word to search.')
  }

  // Check in-memory cache first
  if (memoryCache.has(normalized)) {
    return memoryCache.get(normalized)!
  }

  // Check if we have curated fallback data for immediate match
  const curatedMatch = CURATED_WORDS.find((w) => w.word.toLowerCase() === normalized)
  if (curatedMatch?.fallbackData) {
    memoryCache.set(normalized, curatedMatch.fallbackData)
    return curatedMatch.fallbackData
  }

  // Attempt 1: Free Dictionary API
  let primarySuccess = false
  let primaryError: Error | null = null

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
    }, timeoutMs)

    let response: Response
    try {
      response = await fetch(`${PRIMARY_API_BASE}/${encodeURIComponent(normalized)}`, {
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }

    if (response.ok) {
      const data: RawDictionaryResponse[] = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        const raw = data[0]

        // Extract cleanest phonetic text & audio
        let bestPhoneticText = raw.phonetic || ''
        const phonetics: DictionaryPhonetic[] = []

        if (Array.isArray(raw.phonetics)) {
          for (const p of raw.phonetics) {
            if (p.text && !bestPhoneticText) {
              bestPhoneticText = p.text
            }
            if (p.audio && p.audio.trim().length > 0) {
              let audioUrl = p.audio.trim()
              if (audioUrl.startsWith('//')) {
                audioUrl = `https:${audioUrl}`
              }
              phonetics.push({
                text: p.text || bestPhoneticText,
                audio: audioUrl,
              })
            }
          }
        }

        // Extract meanings
        const meanings: DictionaryMeaning[] = (raw.meanings || []).map((m) => {
          const defs: DictionaryDefinition[] = (m.definitions || []).map((d) => ({
            definition: d.definition,
            example: d.example,
            synonyms: Array.isArray(d.synonyms) ? d.synonyms.filter(Boolean) : [],
            antonyms: Array.isArray(d.antonyms) ? d.antonyms.filter(Boolean) : [],
          }))

          return {
            partOfSpeech: m.partOfSpeech || 'unknown',
            definitions: defs,
            synonyms: Array.isArray(m.synonyms) ? m.synonyms.filter(Boolean) : [],
            antonyms: Array.isArray(m.antonyms) ? m.antonyms.filter(Boolean) : [],
          }
        })

        const entry: WordEntry = {
          word: raw.word || normalized,
          phonetic: bestPhoneticText,
          phonetics,
          meanings,
          origin: raw.origin,
          ageGroup: curatedMatch?.ageGroup,
          category: curatedMatch?.category,
        }

        memoryCache.set(normalized, entry)
        primarySuccess = true
        return entry
      }
    }
  } catch (err) {
    primaryError = err instanceof Error ? err : new Error(String(err))
  }

  // Attempt 2: Fallback to Datamuse API if primary fails, times out, or returns 404
  if (!primarySuccess) {
    try {
      const datamuseEntry = await fetchDatamuseDefinition(normalized)
      memoryCache.set(normalized, datamuseEntry)
      return datamuseEntry
    } catch {
      // If both APIs fail, throw a friendly user message
      if (primaryError?.name === 'AbortError') {
        throw new Error(`The request took too long. Please check your internet connection and try again.`)
      }
      throw new Error(`Word "${rawWord}" was not found in the dictionary. Try another word!`)
    }
  }

  throw new Error(`No definition found for "${rawWord}".`)
}

/**
 * Play audio pronunciation using the API audio URL, or fallback to browser Web Speech API.
 */
export async function speakWord(word: string, audioUrl?: string): Promise<void> {
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl)
      await audio.play()
      return
    } catch {
      // Audio playback failed (e.g., codec or CORS issue), proceed to speech synthesis fallback
    }
  }

  // Web Speech API fallback
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel() // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.85 // Slightly slower for clear kid comprehension
    utterance.pitch = 1.05
    window.speechSynthesis.speak(utterance)
  }
}
