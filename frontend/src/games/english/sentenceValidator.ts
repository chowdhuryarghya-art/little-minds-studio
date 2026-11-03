export interface SentenceCheckItem {
  id: string
  label: string
  passed: boolean
  tip?: string
}

export interface SentenceValidationResult {
  isValid: boolean
  score: number // percentage 0-100
  checks: SentenceCheckItem[]
  encouragement: string
}

// Common helper words to identify subjects and verbs deterministically
const COMMON_SUBJECT_STARTERS = new Set([
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'my',
  'your',
  'our',
  'their',
  'his',
  'her',
  'the',
  'a',
  'an',
  'this',
  'that',
  'these',
  'those',
  'there',
  'here',
  'every',
  'some',
  'all',
])

const COMMON_VERBS = new Set([
  'is',
  'are',
  'was',
  'were',
  'am',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'can',
  'could',
  'will',
  'would',
  'shall',
  'should',
  'may',
  'might',
  'must',
  'see',
  'saw',
  'seen',
  'look',
  'looked',
  'looking',
  'go',
  'goes',
  'went',
  'gone',
  'going',
  'come',
  'came',
  'run',
  'ran',
  'running',
  'jump',
  'jumped',
  'play',
  'played',
  'playing',
  'like',
  'liked',
  'likes',
  'love',
  'loved',
  'loves',
  'feel',
  'felt',
  'feels',
  'make',
  'made',
  'makes',
  'find',
  'found',
  'finds',
  'hear',
  'heard',
  'eat',
  'ate',
  'eaten',
  'shine',
  'shines',
  'shone',
  'fly',
  'flies',
  'flew',
  'walk',
  'walked',
  'walks',
  'read',
  'write',
  'wrote',
  'know',
  'knew',
  'think',
  'thought',
  'give',
  'gave',
  'want',
  'wanted',
  'wants',
  'started',
  'became',
  'seemed',
])

// Literary/metalinguistic terms that shouldn't be equated directly with concrete/activity nouns
const RHETORICAL_TERMS = new Set([
  'oxymoron',
  'paradox',
  'palindrome',
  'anagram',
  'acronym',
  'hyperbole',
  'onomatopoeia',
  'alliteration',
  'synecdoche',
])

/**
 * Normalizes and extracts words without punctuation
 */
function extractWords(sentence: string): string[] {
  return sentence
    .replace(/[^\w\s'-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Checks whether word matches target or common inflected forms
 */
function matchesTargetWord(wordInSentence: string, targetWord: string): boolean {
  const w = wordInSentence.toLowerCase()
  const t = targetWord.toLowerCase()

  if (w === t) return true

  // Standard English regular inflections
  if (w === `${t}s` || w === `${t}es` || `${w}s` === t || `${w}es` === t) return true
  if (w === `${t}d` || w === `${t}ed` || (t.endsWith('e') && w === `${t.slice(0, -1)}ed`)) return true
  if (w === `${t}ing` || (t.endsWith('e') && w === `${t.slice(0, -1)}ing`)) return true
  if (w === `${t}ly` || w === `${t}er` || w === `${t}est`) return true

  return false
}

/**
 * Validates sentence structure, grammar, agreement, and semantic plausibility (Zero AI)
 */
export function validateSentenceFormation(
  rawSentence: string,
  targetWord: string
): SentenceValidationResult {
  const trimmed = rawSentence.trim()
  const words = extractWords(trimmed)
  const lowerWords = words.map((w) => w.toLowerCase())

  // 1. Check Target Word Presence
  const hasTargetWord = words.some((w) => matchesTargetWord(w, targetWord))

  // 2. Check Capital Letter at Start
  const startsWithCapital = /^[A-Z]/.test(trimmed)

  // 3. Check Terminal Punctuation (. ! ?)
  const endsWithPunctuation = /[.!?]$/.test(trimmed)

  // 4. Check Minimum Length (At least 3 words)
  const hasSufficientWords = words.length >= 3

  // 5. Check No Duplicate Adjacent Words (e.g. "the the")
  let hasNoDuplicateWords = true
  for (let i = 0; i < words.length - 1; i++) {
    if (lowerWords[i] === lowerWords[i + 1]) {
      hasNoDuplicateWords = false
      break
    }
  }

  // 6. Check No Strange Space Before Punctuation (e.g., "happy .")
  const hasCleanSpacing = !/\s+[.,!?;:]/.test(trimmed)

  // 7. Check Article Agreement ("a" vs "an")
  let hasValidArticles = true
  let articleTip: string | undefined = undefined
  for (let i = 0; i < lowerWords.length - 1; i++) {
    const art = lowerWords[i]
    const nextWord = lowerWords[i + 1]
    const startsWithVowelSound = /^[aeiou]/i.test(nextWord)

    if (art === 'a' && startsWithVowelSound && !nextWord.startsWith('uni')) {
      hasValidArticles = false
      articleTip = `Use "an" before words starting with a vowel sound (e.g. "an ${nextWord}").`
      break
    } else if (art === 'an' && !startsWithVowelSound) {
      hasValidArticles = false
      articleTip = `Use "a" before words starting with a consonant (e.g. "a ${nextWord}").`
      break
    }
  }

  // 8. Check Subject-Verb Concord (Common elementary errors)
  let hasSubjectVerbConcord = true
  let concordTip: string | undefined = undefined
  for (let i = 0; i < lowerWords.length - 1; i++) {
    const subj = lowerWords[i]
    const nextV = lowerWords[i + 1]

    if ((subj === 'he' || subj === 'she' || subj === 'it') && (nextV === 'were' || nextV === 'are' || nextV === 'have')) {
      hasSubjectVerbConcord = false
      concordTip = `With "${subj}", use "was" or "is" or "has" (e.g. "${subj} was...").`
      break
    }
    if ((subj === 'they' || subj === 'we' || subj === 'you') && (nextV === 'was' || nextV === 'is' || nextV === 'has')) {
      hasSubjectVerbConcord = false
      concordTip = `With "${subj}", use "were" or "are" or "have" (e.g. "${subj} were...").`
      break
    }
    if (subj === 'i' && (nextV === 'are' || nextV === 'is' || nextV === 'has')) {
      hasSubjectVerbConcord = false
      concordTip = `With "I", use "am" or "was" or "have" (e.g. "I am...").`
      break
    }
  }

  // Check that the sentence has at least an action/verb or known subject structure
  const hasRecognizableVerb =
    lowerWords.some((w) => COMMON_VERBS.has(w)) ||
    lowerWords.some((w) => /ing$|ed$/.test(w) && w.length > 3)
  const hasRecognizableSubject =
    COMMON_SUBJECT_STARTERS.has(lowerWords[0]) || /^[A-Z][a-z]+/.test(words[0] || '')

  if (!hasRecognizableVerb && lowerWords.length < 5) {
    if (!concordTip) {
      concordTip = 'Make sure your sentence includes an action or linking verb (like "is", "saw", "went", "liked").'
    }
  }

  // 9. Natural Determiner Check for Singular Countable Nouns
  // e.g. "Adventure was..." or "Puppy ran..." sounds unnatural without a determiner ("The adventure...", "Our puppy...")
  let hasNaturalDeterminer = true
  let determinerTip: string | undefined = undefined
  if (
    lowerWords.length > 0 &&
    lowerWords[0] === targetWord.toLowerCase() &&
    !targetWord.endsWith('s') &&
    !['i', 'we', 'he', 'she', 'they', 'it'].includes(targetWord.toLowerCase())
  ) {
    hasNaturalDeterminer = false
    determinerTip = `Starting with "The ${targetWord}", "A ${targetWord}", or "My ${targetWord}" makes your sentence sound much more natural!`
  }

  // 10. Semantic / Rhetorical Category Compatibility Check
  // Flags nonsensical statements like "Adventure was his oxymoron" or "The puppy was an oxymoron"
  let hasSensibleMeaning = true
  let semanticTip: string | undefined = undefined
  const containsRhetoricalTerm = lowerWords.find((w) => RHETORICAL_TERMS.has(w))

  if (containsRhetoricalTerm) {
    hasSensibleMeaning = false
    semanticTip = `An "${containsRhetoricalTerm}" is a figure of speech with two opposite words together (like "deafening silence"). Try describing what happened with your ${targetWord} instead!`
  }

  // Assemble Detailed Checklist
  const checks: SentenceCheckItem[] = [
    {
      id: 'target-word',
      label: `Uses the word "${targetWord}"`,
      passed: hasTargetWord,
      tip: hasTargetWord
        ? undefined
        : `Make sure your sentence includes "${targetWord}" or a form of it (like "${targetWord}s" or "${targetWord}ed").`,
    },
    {
      id: 'capital-letter',
      label: 'Starts with a capital letter',
      passed: startsWithCapital,
      tip: startsWithCapital
        ? undefined
        : 'Every great sentence begins with an uppercase capital letter (e.g. "The...", "We...", "I...").',
    },
    {
      id: 'terminal-punctuation',
      label: 'Ends with punctuation (. ! ?)',
      passed: endsWithPunctuation,
      tip: endsWithPunctuation
        ? undefined
        : 'Finish your sentence with a period (.), exclamation point (!), or question mark (?).',
    },
    {
      id: 'grammar-agreement',
      label: 'Grammar & word agreement (articles & verbs)',
      passed: hasValidArticles && hasSubjectVerbConcord && hasNoDuplicateWords && hasCleanSpacing,
      tip: articleTip || concordTip || (!hasNoDuplicateWords ? 'Look out for duplicate words.' : undefined),
    },
    {
      id: 'natural-phrasing',
      label: 'Complete thought & natural phrasing',
      passed: hasSufficientWords && hasNaturalDeterminer && hasSensibleMeaning && hasRecognizableSubject,
      tip: determinerTip || semanticTip || (!hasSufficientWords ? 'Write at least 3 or 4 words so your sentence shares a full thought.' : undefined),
    },
  ]

  const passedCount = checks.filter((c) => c.passed).length
  const score = Math.round((passedCount / checks.length) * 100)
  const isValid = passedCount === checks.length

  let encouragement = ''
  if (isValid) {
    encouragement = '🌟 Outstanding! You formed a complete, natural, and well-punctuated sentence!'
  } else if (score >= 80) {
    encouragement = '👏 Great effort! Review the small tip above to make your sentence shine!'
  } else if (score >= 60) {
    encouragement = '👍 Good start! Follow the checklist advice to polish your sentence.'
  } else {
    encouragement = '✏️ Keep practicing! Try writing a simple story or description with your word.'
  }

  return {
    isValid,
    score,
    checks,
    encouragement,
  }
}
