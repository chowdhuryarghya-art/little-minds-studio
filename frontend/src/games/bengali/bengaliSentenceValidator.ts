export interface BengaliSentenceCheckItem {
  id: string
  label: string
  passed: boolean
  tip?: string
}

export interface BengaliSentenceValidationResult {
  isValid: boolean
  score: number
  checks: BengaliSentenceCheckItem[]
  encouragement: string
}

const COMMON_BENGALI_VERB_ENDINGS = new Set([
  'হয়',
  'হলো',
  'ছিল',
  'আছে',
  'যায়',
  'গেল',
  'করে',
  'করল',
  'করছে',
  'দেয়',
  'দিল',
  'পায়',
  'পেল',
  'উঠে',
  'উঠল',
  'লাগে',
  'লাগছে',
  'থাকে',
  'পারে',
  'হবে',
  'কোরো',
  'hoy',
  'holo',
  'chhilo',
  'ache',
  'jaay',
  'gelo',
  'kore',
  'korlo',
  'korchhe',
  'dey',
  'dilo',
  'paay',
  'pelo',
  'othe',
  'othlo',
  'hobe',
])

function extractBengaliWords(sentence: string): string[] {
  return sentence
    .replace(/[।.,!?;:"'()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

export function validateBengaliSentence(
  rawSentence: string,
  targetWord: string,
  targetRomanized?: string
): BengaliSentenceValidationResult {
  const trimmed = rawSentence.trim()
  const words = extractBengaliWords(trimmed)
  const lowerWords = words.map((w) => w.toLowerCase())

  const targetLower = targetWord.toLowerCase()
  const romanizedLower = (targetRomanized || '').toLowerCase()

  // 1. Target word presence
  const hasTargetWord = words.some((w) => {
    const wl = w.toLowerCase()
    return (
      wl === targetLower ||
      (romanizedLower && (wl === romanizedLower || wl.includes(romanizedLower))) ||
      w.includes(targetWord)
    )
  })

  // 2. Terminal punctuation (Dari '।' or standard '.' or '?' or '!')
  const endsWithPunctuation = /[।!?.]$/.test(trimmed)

  // 3. Word count (at least 3 words)
  const hasSufficientWords = words.length >= 3

  // 4. Duplicate words check
  let hasNoDuplicateWords = true
  for (let i = 0; i < words.length - 1; i++) {
    if (lowerWords[i] === lowerWords[i + 1]) {
      hasNoDuplicateWords = false
      break
    }
  }

  // 5. SOV Verb structure (Bengali sentences usually finish with a verb ending like 'হয়', 'হলো', 'ছিল', 'গেল', 'করল', 'দেখা গেল')
  const lastWord = lowerWords[lowerWords.length - 1] || ''
  const hasVerbEnding =
    COMMON_BENGALI_VERB_ENDINGS.has(lastWord) ||
    lastWord.endsWith('ল') ||
    lastWord.endsWith('ছে') ||
    lastWord.endsWith('বে') ||
    lastWord.endsWith('ত') ||
    words.length >= 4

  const checks: BengaliSentenceCheckItem[] = [
    {
      id: 'target-word',
      label: `Uses the word "${targetWord}" (${targetRomanized || ''})`,
      passed: hasTargetWord,
      tip: hasTargetWord
        ? undefined
        : `Make sure your sentence includes "${targetWord}" in Bengali script or English letters.`,
    },
    {
      id: 'terminal-punctuation',
      label: 'Ends with punctuation (Dari । or . ! ?)',
      passed: endsWithPunctuation,
      tip: endsWithPunctuation
        ? undefined
        : 'Finish your sentence with a Dari (।) or period (.).',
    },
    {
      id: 'complete-thought',
      label: 'Complete thought & SOV sentence flow (3+ words)',
      passed: hasSufficientWords && hasVerbEnding,
      tip: hasSufficientWords
        ? !hasVerbEnding
          ? 'Bengali sentences typically end with a verb (like হয়, ছিল, গেল, করল, হলো).'
          : undefined
        : 'Write at least 3 words to express a full thought.',
    },
    {
      id: 'clean-grammar',
      label: 'Clean formatting without duplicate words',
      passed: hasNoDuplicateWords,
      tip: !hasNoDuplicateWords ? 'Avoid repeating words right next to each other.' : undefined,
    },
  ]

  const passedCount = checks.filter((c) => c.passed).length
  const score = Math.round((passedCount / checks.length) * 100)
  const isValid = passedCount === checks.length

  let encouragement = ''
  if (isValid) {
    encouragement = '🌟 দারুণ হয়েছে! (Wonderful!) Your Bengali sentence is formed accurately!'
  } else if (score >= 75) {
    encouragement = '👏 খুব সুন্দর প্রচেষ্টা! (Great effort!) Check the tip above to finish it.'
  } else {
    encouragement = '✏️ চর্চা চালিয়ে যাও! (Keep practicing!) Try writing a simple Bengali sentence.'
  }

  return {
    isValid,
    score,
    checks,
    encouragement,
  }
}
