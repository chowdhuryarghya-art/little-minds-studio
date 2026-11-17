export type WiktionaryLanguage = 'hi' | 'bn'

export interface WiktionaryEntry {
  title: string
  extract: string
  definition: string
  partOfSpeech: string
  example?: string
  sourceUrl: string
}

interface RawWiktionaryPage {
  title?: unknown
  extract?: unknown
  pageid?: unknown
  missing?: unknown
}

const LANGUAGE_HEADINGS: Record<WiktionaryLanguage, string[]> = {
  hi: ['हिंदी', 'हिन्दी'],
  bn: ['বাংলা'],
}

const PART_OF_SPEECH_HEADINGS: Record<WiktionaryLanguage, string[]> = {
  hi: ['संज्ञा', 'विशेषण', 'क्रिया', 'सर्वनाम', 'क्रिया विशेषण', 'अव्यय'],
  bn: ['বিশেষ্য', 'বিশেষণ', 'ক্রিয়া', 'সর্বনাম', 'ক্রিয়া বিশেষণ', 'অব্যয়'],
}

const SENSE_MARKERS: Record<WiktionaryLanguage, [string, string]> = {
  hi: ['१', '२'],
  bn: ['১', '২'],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function findHeadingSections(extract: string): Array<{ level: number; title: string; start: number; end: number }> {
  const headings = [...extract.matchAll(/^(={1,6})\s*([^=]+?)\s*\1\s*$/gmu)]
  return headings.flatMap((heading, index) => {
    const level = heading[1]?.length ?? 0
    const title = heading[2]?.trim()
    if (!title) return []
    const nextSection = headings.slice(index + 1).find((candidate) =>
      (candidate[1]?.length ?? 0) <= level
    )
    return [{
      level,
      title,
      start: (heading.index ?? 0) + heading[0].length,
      end: nextSection?.index ?? extract.length,
    }]
  })
}

function getLanguageSection(extract: string, language: WiktionaryLanguage): string {
  const sections = findHeadingSections(extract)
  const languageSection = sections.find((section) => LANGUAGE_HEADINGS[language].includes(section.title))
  if (!languageSection) return ''

  const nextLanguage = sections.find((section) =>
    section.start > languageSection.start
    && LANGUAGE_HEADINGS[language].includes(section.title)
    && section.level <= languageSection.level
  )
  return extract.slice(languageSection.start, nextLanguage?.start ?? languageSection.end).trim()
}

function getDefinitionText(
  extract: string,
  language: WiktionaryLanguage,
): { extract: string; partOfSpeech: string } {
  const sections = findHeadingSections(extract)
  const partOfSpeech = sections.find((section) =>
    PART_OF_SPEECH_HEADINGS[language].includes(section.title)
  )
  if (partOfSpeech) {
    return {
      extract: extract.slice(partOfSpeech.start, partOfSpeech.end).trim(),
      partOfSpeech: partOfSpeech.title,
    }
  }

  const [firstMarker, nextMarker] = SENSE_MARKERS[language]
  const firstSense = new RegExp(`(?:^|\\s)${firstMarker}[.)।]?\\s*`, 'u').exec(extract)
  if (firstSense?.index !== undefined) {
    const start = firstSense.index + firstSense[0].length
    const remaining = extract.slice(start)
    const nextSense = new RegExp(`(?:^|\\s)${nextMarker}[.)।]\\s*`, 'u').exec(remaining)
    return {
      extract: remaining.slice(0, nextSense?.index ?? remaining.length).trim(),
      partOfSpeech: '',
    }
  }

  return { extract, partOfSpeech: '' }
}

export async function fetchWiktionaryEntry(
  query: string,
  language: WiktionaryLanguage,
): Promise<WiktionaryEntry> {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) throw new Error('Please enter a word to search.')

  const url = new URL(`https://${language}.wiktionary.org/w/api.php`)
  url.search = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    explaintext: '1',
    format: 'json',
    origin: '*',
    titles: normalizedQuery,
  }).toString()

  const response = await fetch(url)
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
  if (!isRecord(result) || !isRecord(result.query) || !isRecord(result.query.pages)) {
    throw new Error('The open dictionary returned an unexpected response.')
  }

  const pages = Object.values(result.query.pages as Record<string, RawWiktionaryPage>)
  const page = pages.find((candidate) =>
    typeof candidate.title === 'string'
    && typeof candidate.extract === 'string'
    && candidate.pageid !== undefined
    && candidate.missing === undefined
  )
  if (!page || typeof page.title !== 'string' || typeof page.extract !== 'string') {
    throw new Error('Word not found in the open dictionary.')
  }

  const languageSection = getLanguageSection(page.extract, language)
  if (!languageSection) throw new Error('No entry was found for this language.')
  const selected = getDefinitionText(languageSection, language)
  const formattedExtract = selected.extract
    .replace(/^={1,6}\s*[^=]+?\s*={1,6}\s*$/gmu, '')
    .replace(/\n{3,}/gu, '\n\n')
    .replace(/\s+([।,;:])/gu, '$1')
    .trim()
  if (!formattedExtract) throw new Error('No definition was found for this word.')
  const label = language === 'hi'
    ? /^(?:परिभाषा|अर्थ)\s*[:：]\s*/u
    : /^(?:সংজ্ঞা|অর্থ)\s*[:：]\s*/u
  const exampleLabel = language === 'hi'
    ? /^(?:उदाहरण|उदाहरण वाक्य)\s*[:：]\s*/u
    : /^(?:উদাহরণ|উদাহরণ বাক্য)\s*[:：]\s*/u
  const lines = formattedExtract.split(/\n+/u).map((line) => line.trim()).filter(Boolean)
  const definitionLines = lines.filter((line) => !exampleLabel.test(line))
  const exampleLine = lines.find((line) => exampleLabel.test(line))
  const definition = definitionLines
    .map((line) => line.replace(label, ''))
    .join('\n')
    .trim()
  const example = exampleLine?.replace(exampleLabel, '').trim()
  if (!definition) throw new Error('No definition was found for this word.')

  const pagePath = encodeURIComponent(page.title.replace(/ /gu, '_'))
  return {
    title: page.title,
    extract: definition,
    definition,
    partOfSpeech: selected.partOfSpeech,
    ...(example ? { example } : {}),
    sourceUrl: `https://${language}.wiktionary.org/wiki/${pagePath}`,
  }
}
