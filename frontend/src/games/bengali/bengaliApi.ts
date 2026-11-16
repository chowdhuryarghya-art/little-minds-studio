import type { BengaliWordEntry } from './bengaliTypes.ts'
import { findBengaliWord } from './bengaliData.ts'

export async function fetchBengaliWord(rawWord: string): Promise<BengaliWordEntry> {
  const normalized = rawWord.trim()
  if (!normalized) {
    throw new Error('অনুগ্রহ করে একটি শব্দ লিখুন (Please enter a word to search).')
  }

  const entry = findBengaliWord(normalized)
  if (!entry) {
    throw new Error(
      'এই শব্দটি আমাদের নির্বাচিত শিশু-উপযোগী তালিকায় নেই। প্রস্তাবিত শব্দগুলির মধ্যে একটি বেছে নিন। (Choose a word from the child-safe suggestions.)',
    )
  }

  return entry
}
