import type { WordEntry } from './englishTypes.ts'
import { assertWordAllowed } from '../safety/wordSafety.ts'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function mapDictionaryEntry(value: unknown, searchWord: string): WordEntry {
  if (!isRecord(value) || typeof value.word !== 'string' || !Array.isArray(value.meanings)) {
    throw new Error('The open dictionary returned an unexpected response.')
  }

  const meanings = value.meanings.flatMap((rawMeaning) => {
    if (!isRecord(rawMeaning) || typeof rawMeaning.partOfSpeech !== 'string' || !Array.isArray(rawMeaning.definitions)) {
      return []
    }

    const definitions = rawMeaning.definitions.flatMap((rawDefinition) => {
      if (!isRecord(rawDefinition) || typeof rawDefinition.definition !== 'string') return []
      return [{
        definition: rawDefinition.definition,
        ...(typeof rawDefinition.example === 'string' ? { example: rawDefinition.example } : {}),
        synonyms: stringArray(rawDefinition.synonyms),
        antonyms: stringArray(rawDefinition.antonyms),
      }]
    })
    if (definitions.length === 0) return []

    return [{
      partOfSpeech: rawMeaning.partOfSpeech,
      definitions,
      synonyms: stringArray(rawMeaning.synonyms),
      antonyms: stringArray(rawMeaning.antonyms),
    }]
  })

  if (meanings.length === 0) throw new Error('No definition was found for this word.')

  const phonetics = Array.isArray(value.phonetics)
    ? value.phonetics.flatMap((rawPhonetic) => {
      if (!isRecord(rawPhonetic)) return []
      const text = typeof rawPhonetic.text === 'string' ? rawPhonetic.text : undefined
      const audio = typeof rawPhonetic.audio === 'string' ? rawPhonetic.audio : undefined
      return text || audio ? [{ ...(text ? { text } : {}), ...(audio ? { audio } : {}) }] : []
    })
    : []
  const license = isRecord(value.license)
    && typeof value.license.name === 'string'
    && typeof value.license.url === 'string'
    ? { name: value.license.name, url: value.license.url }
    : undefined

  return {
    word: value.word || searchWord,
    ...(typeof value.phonetic === 'string' ? { phonetic: value.phonetic } : {}),
    phonetics,
    meanings,
    ...(typeof value.origin === 'string' ? { origin: value.origin } : {}),
    sourceUrls: stringArray(value.sourceUrls),
    ...(license ? { license } : {}),
  }
}

export async function fetchWordDefinition(rawWord: string): Promise<WordEntry> {
  const normalized = rawWord.trim().toLowerCase()
  if (!normalized) {
    throw new Error('Please enter a word to search.')
  }
  if (normalized.length > 100) throw new Error('Please search for a shorter word.')
  assertWordAllowed(normalized, 'english')

  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`,
  )
  if (response.status === 404) throw new Error('Word not found in the open dictionary.')
  if (!response.ok) {
    throw new Error(`The open dictionary could not be reached (HTTP ${response.status}).`)
  }

  let result: unknown
  try {
    result = await response.json()
  } catch {
    throw new Error('The open dictionary returned an unreadable response.')
  }
  if (!Array.isArray(result)) throw new Error('The open dictionary returned an unexpected response.')
  const entry = result.map((item) => mapDictionaryEntry(item, normalized)).find(Boolean)
  if (!entry) throw new Error('No definition was found for this word.')
  return entry
}

export async function speakWord(word: string, audioUrl?: string): Promise<void> {
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl)
      await audio.play()
      return
    } catch {
      // Fall back to the browser voice if audio playback fails.
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1.05
    window.speechSynthesis.speak(utterance)
  }
}
