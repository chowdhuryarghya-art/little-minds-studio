import type { WordEntry } from './englishTypes.ts'
import { findChildSafeEnglishWord } from './wordBank.ts'

export async function fetchWordDefinition(rawWord: string): Promise<WordEntry> {
  const normalized = rawWord.trim().toLowerCase()
  if (!normalized) {
    throw new Error('Please enter a word to search.')
  }

  const curatedWord = findChildSafeEnglishWord(normalized)
  if (!curatedWord?.fallbackData) {
    throw new Error(
      'That word is not in our reviewed child-safe dictionary. Try one of the suggested words.',
    )
  }

  return curatedWord.fallbackData
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
