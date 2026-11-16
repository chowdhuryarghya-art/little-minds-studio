import { CURATED_WORDS } from './wordBank.ts'

export interface LanguageToolSuggestion {
  message: string
  shortMessage: string
  offset: number
  length: number
  replacements: string[]
  ruleId: string
}

interface RawLanguageToolMatch {
  message?: unknown
  shortMessage?: unknown
  offset?: unknown
  length?: unknown
  replacements?: unknown
  rule?: {
    id?: unknown
  }
}

interface RawLanguageToolResponse {
  matches?: unknown
}

const LANGUAGE_TOOL_CHECK_URL = 'https://api.languagetool.org/v2/check'
const SAFE_COMMON_WORDS = new Set(
  `a an and are as at be big can cat come do down for fun go good happy has have he hello
  her here is it its like little look love my nice of on one our play red run see she small
  so the their them there they this to up we what when where with you your i am was were
  learn learns learned learning word words sun moon dog puppy kitten ball apple garden
  rainbow friend friends butterfly fish bird flower tree home school read write`.split(/\s+/),
)
const CHILD_SAFE_WORDS = new Set([
  ...SAFE_COMMON_WORDS,
  ...CURATED_WORDS.filter((word) => word.fallbackData).flatMap(({ word, fallbackData }) => [
    word.toLowerCase(),
    ...(fallbackData?.meanings.flatMap((meaning) =>
      meaning.definitions.flatMap(({ definition, example }) =>
        [definition, example ?? ''].flatMap((text) => text.match(/[a-z]+/gi) ?? []),
      ),
    ) ?? []),
  ]),
])

export function isChildSafeSentence(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed || trimmed.length > 500) return false
  const words = trimmed.match(/[a-z]+(?:['’-][a-z]+)*/gi)
  return Boolean(words?.length && words.every((word) => CHILD_SAFE_WORDS.has(word.toLowerCase())))
}

export async function checkEnglishSentence(
  sentence: string,
  signal?: AbortSignal,
): Promise<LanguageToolSuggestion[]> {
  const text = sentence.trim()
  if (!text) throw new Error('Write a sentence before asking for suggestions.')
  if (!isChildSafeSentence(text)) {
    throw new Error(
      'For safety, sentence suggestions are only available for short sentences using reviewed words and simple common words.',
    )
  }
  const body = new URLSearchParams({ text, language: 'en-US' })
  const response = await fetch(LANGUAGE_TOOL_CHECK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal,
  })

  if (!response.ok) {
    throw new Error(`LanguageTool could not check the sentence (HTTP ${response.status}). Please try again.`)
  }

  let result: RawLanguageToolResponse
  try {
    result = await response.json() as RawLanguageToolResponse
  } catch {
    throw new Error('LanguageTool returned an unreadable response. Please try again.')
  }
  if (!result || typeof result !== 'object' || !Array.isArray(result.matches)) {
    throw new Error('LanguageTool returned an unexpected response. Please try again.')
  }

  return (result.matches as RawLanguageToolMatch[]).flatMap((match) => {
    if (
      typeof match.message !== 'string'
      || typeof match.offset !== 'number'
      || typeof match.length !== 'number'
      || !Number.isInteger(match.offset)
      || !Number.isInteger(match.length)
      || match.offset < 0
      || match.length < 0
      || match.offset + match.length > text.length
    ) {
      throw new Error('LanguageTool returned an invalid suggestion. Please try again.')
    }

    const replacements = Array.isArray(match.replacements)
      ? match.replacements
        .map((replacement) => (
          replacement && typeof replacement === 'object' && 'value' in replacement
            ? replacement.value
            : undefined
        ))
        .filter((value): value is string => typeof value === 'string' && isChildSafeSentence(value))
      : []

    if (Array.isArray(match.replacements) && replacements.length === 0) return []

    return [{
      message: 'A writing suggestion is available.',
      shortMessage: '',
      offset: match.offset,
      length: match.length,
      replacements,
      ruleId: typeof match.rule?.id === 'string' ? match.rule.id : '',
    }]
  })
}
