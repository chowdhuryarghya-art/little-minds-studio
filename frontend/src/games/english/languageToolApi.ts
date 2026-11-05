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
const MAX_SENTENCE_LENGTH = 20_000

export async function checkEnglishSentence(
  sentence: string,
  signal?: AbortSignal,
): Promise<LanguageToolSuggestion[]> {
  const text = sentence.trim()
  if (!text) throw new Error('Write a sentence before asking for suggestions.')
  if (text.length > MAX_SENTENCE_LENGTH) {
    throw new Error(`Please keep your sentence under ${MAX_SENTENCE_LENGTH.toLocaleString()} characters.`)
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

  return (result.matches as RawLanguageToolMatch[]).map((match) => {
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
        .filter((value): value is string => typeof value === 'string')
      : []

    return {
      message: match.message,
      shortMessage: typeof match.shortMessage === 'string' ? match.shortMessage : '',
      offset: match.offset,
      length: match.length,
      replacements,
      ruleId: typeof match.rule?.id === 'string' ? match.rule.id : '',
    }
  })
}
