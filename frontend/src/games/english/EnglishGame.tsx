import { useEffect, useRef, useState, useTransition } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { WordEntry, CuratedWord } from './englishTypes.ts'
import { getRandomCuratedWord, getCuratedWordsByAge } from './wordBank.ts'
import { fetchWordDefinition, speakWord } from './dictionaryApi.ts'
import { checkEnglishSentence, isChildSafeSentence } from './languageToolApi.ts'
import type { LanguageToolSuggestion } from './languageToolApi.ts'

interface EnglishGameProps {
  initialAge?: AgeGroupId
  initialWord?: string
}

export default function EnglishGame({ initialAge, initialWord }: EnglishGameProps) {
  const [selectedAge] = useState<AgeGroupId | 'all'>(initialAge || 'curious')
  const [currentWord, setCurrentWord] = useState<string>(initialWord || 'adventure')
  const [wordData, setWordData] = useState<WordEntry | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>('')
  const [activeTab, setActiveTab] = useState<number>(0)
  const [userSentence, setUserSentence] = useState<string>('')
  const [isSpeakingSentence, setIsSpeakingSentence] = useState<boolean>(false)
  const [sentenceSuggestions, setSentenceSuggestions] = useState<LanguageToolSuggestion[]>([])
  const [sentenceCheckError, setSentenceCheckError] = useState<string | null>(null)
  const [sentenceCheckMessage, setSentenceCheckMessage] = useState('')
  const [isCheckingSentence, setIsCheckingSentence] = useState(false)
  const sentenceCheckController = useRef<AbortController | null>(null)
  const [, startTransition] = useTransition()

  useEffect(() => () => sentenceCheckController.current?.abort(), [])

  // Load word whenever currentWord changes
  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)
    setErrorMsg(null)
    setActiveTab(0)
    setUserSentence('')
    sentenceCheckController.current?.abort()
    sentenceCheckController.current = null
    setSentenceSuggestions([])
    setSentenceCheckError(null)
    setSentenceCheckMessage('')
    setIsCheckingSentence(false)

    fetchWordDefinition(currentWord)
      .then((data) => {
        if (!isCancelled) {
          setWordData(data)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!isCancelled) {
          setErrorMsg(err.message || 'Could not fetch definition.')
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [currentWord])

  const handlePickRandomWord = () => {
    const ageFilter = selectedAge === 'all' ? undefined : selectedAge
    const randomItem: CuratedWord = getRandomCuratedWord(ageFilter, currentWord)
    startTransition(() => {
      setCurrentWord(randomItem.word)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchInput.trim().toLowerCase()
    if (!trimmed) return
    setCurrentWord(trimmed)
    setSearchInput('')
  }

  const handleSelectWord = (word: string) => {
    // Strip punctuation if any (like commas or quotes)
    const cleaned = word.replace(/[^a-zA-Z-]/g, '').toLowerCase()
    if (cleaned) {
      setCurrentWord(cleaned)
    }
  }

  const handlePlayAudio = async () => {
    if (!wordData) return
    setIsPlayingAudio(true)
    // Find audio url if available
    const audioUrl = wordData.phonetics?.find((p) => p.audio && p.audio.length > 0)?.audio
    try {
      await speakWord(wordData.word, audioUrl)
    } finally {
      setTimeout(() => setIsPlayingAudio(false), 800)
    }
  }

  const handleSpeakSentence = async () => {
    if (!userSentence.trim()) return
    setIsSpeakingSentence(true)
    try {
      await speakWord(userSentence.trim())
    } finally {
      setTimeout(() => setIsSpeakingSentence(false), 1000)
    }
  }

  const handleClearSentence = () => {
    sentenceCheckController.current?.abort()
    sentenceCheckController.current = null
    setUserSentence('')
    setSentenceSuggestions([])
    setSentenceCheckError(null)
    setSentenceCheckMessage('')
    setIsCheckingSentence(false)
  }

  const handleSentenceChange = (sentence: string) => {
    sentenceCheckController.current?.abort()
    sentenceCheckController.current = null
    setUserSentence(sentence)
    setSentenceSuggestions([])
    setSentenceCheckError(null)
    setSentenceCheckMessage('')
    setIsCheckingSentence(false)
  }

  const handleCheckSentence = async () => {
    if (!isChildSafeSentence(userSentence)) {
      setSentenceCheckError(
        'For safety, use a short sentence made only from reviewed words and simple common words.',
      )
      setSentenceSuggestions([])
      return
    }

    sentenceCheckController.current?.abort()
    const controller = new AbortController()
    sentenceCheckController.current = controller
    setIsCheckingSentence(true)
    setSentenceCheckError(null)
    setSentenceCheckMessage('')
    setSentenceSuggestions([])

    try {
      const suggestions = await checkEnglishSentence(userSentence, controller.signal)
      if (sentenceCheckController.current !== controller) return
      setSentenceSuggestions(suggestions)
      setSentenceCheckMessage(
        suggestions.length === 0
          ? 'No suggestions found. Nice work!'
          : `Found ${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'}. Choose an edit to apply it.`,
      )
    } catch (error) {
      if (controller.signal.aborted) return
      setSentenceCheckError(error instanceof Error ? error.message : 'Could not check the sentence. Please try again.')
    } finally {
      if (sentenceCheckController.current === controller) {
        sentenceCheckController.current = null
        setIsCheckingSentence(false)
      }
    }
  }

  const handleApplySuggestion = (suggestion: LanguageToolSuggestion, replacement: string) => {
    if (suggestion.offset < 0 || suggestion.length < 0 || suggestion.offset + suggestion.length > userSentence.length) {
      setSentenceCheckError('That suggestion no longer matches the sentence. Check the sentence again.')
      setSentenceSuggestions([])
      return
    }

    const updatedSentence = userSentence.slice(0, suggestion.offset)
      + replacement
      + userSentence.slice(suggestion.offset + suggestion.length)
    setUserSentence(updatedSentence)
    setSentenceSuggestions([])
    setSentenceCheckError(null)
    setSentenceCheckMessage('Suggestion applied. Check the updated sentence for more suggestions.')
  }

  const handleInsertSampleSentence = () => {
    if (!wordData) return
    const firstExample = wordData.meanings[0]?.definitions.find((d) => d.example)?.example
    if (firstExample) {
      handleSentenceChange(firstExample)
    } else {
      const sample = `The ${wordData.word} is very interesting and fun to learn about.`
      handleSentenceChange(sample)
    }
  }

  const curatedListForAge = getCuratedWordsByAge(selectedAge === 'all' ? undefined : selectedAge)

  return (
    <div className="english-fun-container">
      {/* Top Search & Surprise Bar */}
      <div className="english-search-bar-wrap">
        <form className="english-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="english-search-input"
            placeholder="Try a reviewed word (e.g. rainbow, puppy, happy)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search English Dictionary"
          />
          <button type="submit" className="btn english-search-btn">
            🔍 Search
          </button>
        </form>
        <button
          type="button"
          className="btn english-surprise-btn"
          onClick={handlePickRandomWord}
          title="Pick a random surprise word"
        >
          🎲 Surprise Word!
        </button>
      </div>
      <p className="center muted">
        Searches are sent to DictionaryAPI.dev. Dictionary results are not reviewed for age suitability.
      </p>

      {/* Suggested Quick Word Chips */}
      <div className="english-quick-words" aria-label="Curated word suggestions">
        <span className="english-quick-label">Try words:</span>
        {curatedListForAge.slice(0, 7).map((item) => (
          <button
            key={item.word}
            type="button"
            className={`english-word-chip${item.word.toLowerCase() === currentWord.toLowerCase() ? ' active' : ''}`}
            onClick={() => handleSelectWord(item.word)}
          >
            {item.word}
          </button>
        ))}
      </div>

      {/* Main Word Card Area */}
      {isLoading ? (
        <div className="english-loading-card">
          <div className="english-spinner" aria-hidden="true" />
          <p>Looking up <strong>"{currentWord}"</strong> in the dictionary...</p>
        </div>
      ) : errorMsg ? (
        <div className="english-error-card">
          <span className="english-error-icon">📖</span>
          <h3>Word Unavailable</h3>
          <p>{errorMsg}</p>
          <div className="english-error-actions">
            <button type="button" className="btn" onClick={handlePickRandomWord}>
              🎲 Try a Surprise Word
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleSelectWord('adventure')}
            >
              Explore "adventure"
            </button>
          </div>
        </div>
      ) : wordData ? (
        <article className="english-word-card">
          {/* Header with Word, Phonetic, Audio, and Category */}
          <header className="english-card-header">
            <div className="english-word-title-group">
              <h2 className="english-word-heading">{wordData.word}</h2>
              {wordData.phonetic && (
                <span className="english-phonetic">{wordData.phonetic}</span>
              )}
            </div>

            <div className="english-header-actions">
              <button
                type="button"
                className={`english-audio-btn${isPlayingAudio ? ' speaking' : ''}`}
                onClick={handlePlayAudio}
                aria-label={`Listen to pronunciation of ${wordData.word}`}
                title="Listen to pronunciation"
              >
                <span className="english-speaker-icon" aria-hidden="true">
                  {isPlayingAudio ? '🔊' : '🔈'}
                </span>
                <span>Listen</span>
              </button>
            </div>
          </header>

          {/* Category / Hint Banner if curated */}
          {wordData.category && (
            <div className="english-category-badge">
              <span>Category: <strong>{wordData.category}</strong></span>
            </div>
          )}

          {/* Multiple Meanings Tabs / Grouped Parts of Speech */}
          {wordData.meanings && wordData.meanings.length > 0 && (
            <section className="english-meanings-section">
              <div className="english-pos-tabs" role="tablist" aria-label="Parts of Speech">
                {wordData.meanings.map((meaning, index) => (
                  <button
                    key={`${meaning.partOfSpeech}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === index}
                    className={`english-pos-tab${activeTab === index ? ' active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    <span className={`pos-badge pos-${meaning.partOfSpeech.toLowerCase()}`}>
                      {meaning.partOfSpeech}
                    </span>
                    <span className="pos-def-count">
                      ({meaning.definitions.length}{' '}
                      {meaning.definitions.length === 1 ? 'meaning' : 'meanings'})
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Tab Meaning Details */}
              {wordData.meanings[activeTab] && (
                <div
                  className="english-meaning-panel"
                  role="tabpanel"
                  aria-label={`${wordData.meanings[activeTab].partOfSpeech} meanings`}
                >
                  <ol className="english-definitions-list">
                    {wordData.meanings[activeTab].definitions.map((def, dIndex) => (
                      <li key={dIndex} className="english-definition-item">
                        <p className="english-def-text">{def.definition}</p>

                        {/* Example sentence */}
                        {def.example && (
                          <blockquote className="english-example-quote">
                            <span className="quote-mark">“</span>
                            {def.example}
                            <span className="quote-mark">”</span>
                          </blockquote>
                        )}

                        {/* Definition-specific Synonyms / Antonyms */}
                        {def.synonyms && def.synonyms.length > 0 && (
                          <div className="english-rel-words">
                            <span className="rel-label">Synonyms:</span>
                            <div className="rel-chips">
                              {def.synonyms.slice(0, 5).map((syn) => (
                                <button
                                  key={syn}
                                  type="button"
                                  className="rel-chip syn-chip"
                                  onClick={() => handleSelectWord(syn)}
                                  title={`Explore synonym "${syn}"`}
                                >
                                  {syn}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {def.antonyms && def.antonyms.length > 0 && (
                          <div className="english-rel-words">
                            <span className="rel-label">Antonyms:</span>
                            <div className="rel-chips">
                              {def.antonyms.slice(0, 5).map((ant) => (
                                <button
                                  key={ant}
                                  type="button"
                                  className="rel-chip ant-chip"
                                  onClick={() => handleSelectWord(ant)}
                                  title={`Explore antonym "${ant}"`}
                                >
                                  {ant}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>

                  {/* Part-of-Speech Level Synonyms & Antonyms */}
                  {wordData.meanings[activeTab].synonyms &&
                    wordData.meanings[activeTab].synonyms!.length > 0 && (
                      <div className="english-meaning-footer-rel">
                        <strong>More Synonyms ({wordData.meanings[activeTab].partOfSpeech}):</strong>
                        <div className="rel-chips">
                          {wordData.meanings[activeTab].synonyms!.slice(0, 6).map((syn) => (
                            <button
                              key={syn}
                              type="button"
                              className="rel-chip syn-chip"
                              onClick={() => handleSelectWord(syn)}
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {wordData.meanings[activeTab].antonyms &&
                    wordData.meanings[activeTab].antonyms!.length > 0 && (
                      <div className="english-meaning-footer-rel">
                        <strong>More Antonyms ({wordData.meanings[activeTab].partOfSpeech}):</strong>
                        <div className="rel-chips">
                          {wordData.meanings[activeTab].antonyms!.slice(0, 6).map((ant) => (
                            <button
                              key={ant}
                              type="button"
                              className="rel-chip ant-chip"
                              onClick={() => handleSelectWord(ant)}
                            >
                              {ant}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </section>
          )}

          {/* Etymology / Word Origins & Fun Fact Section */}
          {(wordData.origin || wordData.funFact) && (
            <footer className="english-extra-insights">
              {wordData.origin && (
                <div className="english-origin-box">
                  <div className="extra-box-header">
                    <span className="extra-icon">📜</span>
                    <strong>Word Origin &amp; Etymology</strong>
                  </div>
                  <p>{wordData.origin}</p>
                </div>
              )}

              {wordData.funFact && (
                <div className="english-fun-fact-box">
                  <div className="extra-box-header">
                    <span className="extra-icon">💡</span>
                    <strong>Fun Kid Fact</strong>
                  </div>
                  <p>{wordData.funFact}</p>
                </div>
              )}
            </footer>
          )}

          {(wordData.sourceUrls?.length || wordData.license) && (
            <footer className="english-extra-insights">
              <p>
                Dictionary source:{' '}
                {wordData.sourceUrls?.map((sourceUrl, index) => (
                  <span key={sourceUrl}>
                    {index > 0 && ', '}
                    <a href={sourceUrl} target="_blank" rel="noreferrer">source {index + 1}</a>
                  </span>
                ))}
                {wordData.license && (
                  <>
                    {' · '}License:{' '}
                    <a href={wordData.license.url} target="_blank" rel="noreferrer">
                      {wordData.license.name}
                    </a>
                  </>
                )}
              </p>
            </footer>
          )}
        </article>
      ) : null}

      {/* Sentence Challenge Activity Card */}
      {wordData && !isLoading && !errorMsg && (
        <aside className="english-challenge-card">
          <div className="challenge-header">
            <span className="challenge-star">⭐</span>
            <h3>Word Builder Challenge</h3>
          </div>
          <p>
            Write a complete sentence using the word{' '}
            <strong className="challenge-highlight">"{wordData.word}"</strong>.
          </p>

          <div className="sentence-builder-form">
            <div className="sentence-input-wrap">
              <textarea
                className="sentence-textarea"
                rows={3}
                placeholder={`Type your sentence here with "${wordData.word}" (e.g. "We saw a brilliant rainbow after the rain.")...`}
                value={userSentence}
                maxLength={20_000}
                onChange={(e) => handleSentenceChange(e.target.value)}
                aria-label={`Write a sentence using the word ${wordData.word}`}
              />
            </div>

            <div className="sentence-builder-actions">
              <button
                type="button"
                className="btn btn-check-sentence"
                onClick={handleCheckSentence}
                disabled={!userSentence.trim() || isCheckingSentence}
              >
                {isCheckingSentence ? 'Checking…' : '✨ Get sentence suggestions'}
              </button>
              {userSentence.trim() && (
                <button
                  type="button"
                  className={`btn btn-speak-sentence${isSpeakingSentence ? ' speaking' : ''}`}
                  onClick={handleSpeakSentence}
                  title="Listen to your sentence"
                >
                  🔊 Listen to Sentence
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sample-sentence"
                onClick={handleInsertSampleSentence}
              >
                💡 Need Inspiration?
              </button>

              {userSentence.trim() && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClearSentence}
                >
                  Clear
                </button>
              )}
            </div>
            <p className="sentence-check-disclosure">
              Your sentence is sent to LanguageTool’s public checker to find writing suggestions.
            </p>
            {sentenceCheckMessage && (
              <p className="sentence-check-status" role="status" aria-live="polite">
                {sentenceCheckMessage}
              </p>
            )}
            {sentenceCheckError && (
              <p className="sentence-check-error" role="alert">
                {sentenceCheckError}
              </p>
            )}
            {sentenceSuggestions.length > 0 && (
              <section className="sentence-suggestions" aria-label="Sentence suggestions">
                <h4>Suggestions</h4>
                <ul>
                  {sentenceSuggestions.map((suggestion, index) => (
                    <li key={`${suggestion.offset}-${suggestion.ruleId}-${index}`}>
                      <p>{suggestion.shortMessage || suggestion.message}</p>
                      {suggestion.replacements.length > 0 ? (
                        <div className="sentence-suggestion-options">
                          {suggestion.replacements.slice(0, 5).map((replacement) => (
                            <button
                              key={replacement}
                              type="button"
                              className="sentence-suggestion-option"
                              onClick={() => handleApplySuggestion(suggestion, replacement)}
                            >
                              Use “{replacement}”
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="sentence-suggestion-explanation">{suggestion.message}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
