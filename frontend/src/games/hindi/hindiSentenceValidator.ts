export interface HindiSentenceCheckItem {
  id: string
  label: string
  passed: boolean
  tip?: string
}

export interface HindiSentenceValidationResult {
  isValid: boolean
  score: number
  checks: HindiSentenceCheckItem[]
  encouragement: string
}

const COMMON_HINDI_VERB_ENDINGS = new Set([
  'है',
  'हैं',
  'था',
  'थी',
  'थे',
  'हूँ',
  'हो',
  'गया',
  'गए',
  'गई',
  'दिया',
  'दिए',
  'दी',
  'रहा',
  'रहे',
  'रही',
  'लगा',
  'लगे',
  'लगी',
  'सकता',
  'सकते',
  'सकती',
  'चाहिए',
  'करो',
  'कीजिए',
  'karta',
  'karte',
  'karti',
  'hai',
  'hain',
  'tha',
  'the',
  'thi',
  'raha',
  'rahe',
  'rahi',
  'gaya',
  'diya',
  'chaahiye',
])

function extractHindiWords(sentence: string): string[] {
  return sentence
    .replace(/[।.,!?;:"'()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

export function validateHindiSentence(
  rawSentence: string,
  targetWord: string,
  targetRomanized?: string
): HindiSentenceValidationResult {
  const trimmed = rawSentence.trim()
  const words = extractHindiWords(trimmed)
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

  // 2. Terminal punctuation (Purna Viram '।' or standard '.' or '?' or '!')
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

  // 5. SOV Verb structure (Hindi sentences usually finish with an action or verb ending like 'है', 'था', 'गया', 'लगा')
  const lastWord = lowerWords[lowerWords.length - 1] || ''
  const hasVerbEnding =
    COMMON_HINDI_VERB_ENDINGS.has(lastWord) ||
    lastWord.endsWith('ता') ||
    lastWord.endsWith('ते') ||
    lastWord.endsWith('ती') ||
    lastWord.endsWith('ना') ||
    lastWord.endsWith('या') ||
    words.length >= 4

  const checks: HindiSentenceCheckItem[] = [
    {
      id: 'target-word',
      label: `Uses the word "${targetWord}" (${targetRomanized || ''})`,
      passed: hasTargetWord,
      tip: hasTargetWord
        ? undefined
        : `Make sure your sentence includes "${targetWord}" in Devanagari or English letters.`,
    },
    {
      id: 'terminal-punctuation',
      label: 'Ends with punctuation (Purna Viram । or . ! ?)',
      passed: endsWithPunctuation,
      tip: endsWithPunctuation
        ? undefined
        : 'Finish your sentence with a Purna Viram (।) or period (.).',
    },
    {
      id: 'complete-thought',
      label: 'Complete thought & SOV sentence flow (3+ words)',
      passed: hasSufficientWords && hasVerbEnding,
      tip: hasSufficientWords
        ? !hasVerbEnding
          ? 'Hindi sentences typically end with a verb or auxiliary (like है, था, गया, लगा).'
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
    encouragement = '🌟 बहुत बढ़िया! (Wonderful!) Your Hindi sentence is formed accurately!'
  } else if (score >= 75) {
    encouragement = '👏 बहुत अच्छा प्रयास! (Great effort!) Check the tip above to complete it.'
  } else {
    encouragement = '✏️ अभ्यास जारी रखें! (Keep practicing!) Try writing a simple Hindi sentence.'
  }

  return {
    isValid,
    score,
    checks,
    encouragement,
  }
}
