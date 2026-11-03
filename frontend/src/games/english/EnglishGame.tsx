import { useEffect, useState, useTransition } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { WordEntry, CuratedWord } from './englishTypes.ts'
import { getRandomCuratedWord, getCuratedWordsByAge } from './wordBank.ts'
import { fetchWordDefinition, speakWord } from './dictionaryApi.ts'
import { validateSentenceFormation } from './sentenceValidator.ts'
import type { SentenceValidationResult } from './sentenceValidator.ts'

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
  const [sentenceResult, setSentenceResult] = useState<SentenceValidationResult | null>(null)
  const [isSpeakingSentence, setIsSpeakingSentence] = useState<boolean>(false)
  const [, startTransition] = useTransition()

  // Load word whenever currentWord changes
  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)
    setErrorMsg(null)
    setActiveTab(0)
    setUserSentence('')
    setSentenceResult(null)

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

  const handleCheckSentence = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wordData || !userSentence.trim()) return
    const result = validateSentenceFormation(userSentence, wordData.word)
    setSentenceResult(result)
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
    setUserSentence('')
    setSentenceResult(null)
  }

  const handleInsertSampleSentence = () => {
    if (!wordData) return
    const firstExample = wordData.meanings[0]?.definitions.find((d) => d.example)?.example
    if (firstExample) {
      setUserSentence(firstExample)
      setSentenceResult(validateSentenceFormation(firstExample, wordData.word))
    } else {
      const sample = `The ${wordData.word} is very interesting and fun to learn about.`
      setUserSentence(sample)
      setSentenceResult(validateSentenceFormation(sample, wordData.word))
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
            placeholder="Type any English word (e.g. galaxy, happy, brave)..."
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
          <h3>Word Not Found</h3>
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
            <strong className="challenge-highlight">"{wordData.word}"</strong>. Our smart checker will verify your punctuation, capitalization, and sentence formation!
          </p>

          <form className="sentence-builder-form" onSubmit={handleCheckSentence}>
            <div className="sentence-input-wrap">
              <textarea
                className="sentence-textarea"
                rows={3}
                placeholder={`Type your sentence here with "${wordData.word}" (e.g. "We saw a brilliant rainbow after the rain.")...`}
                value={userSentence}
                onChange={(e) => {
                  setUserSentence(e.target.value)
                  if (sentenceResult) {
                    setSentenceResult(null)
                  }
                }}
                aria-label={`Write a sentence using the word ${wordData.word}`}
              />
            </div>

            <div className="sentence-builder-actions">
              <button
                type="submit"
                className="btn btn-check-sentence"
                disabled={!userSentence.trim()}
              >
                ✨ Check Sentence
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
          </form>

          {/* Verification Results & Rule Checklist */}
          {sentenceResult && (
            <div
              className={`sentence-feedback-card ${sentenceResult.isValid ? 'feedback-success' : 'feedback-tips'}`}
            >
              <div className="feedback-banner">
                <span className="feedback-badge-icon">
                  {sentenceResult.isValid ? '🎉' : sentenceResult.score >= 80 ? '🌟' : '✏️'}
                </span>
                <div className="feedback-banner-text">
                  <h4>{sentenceResult.encouragement}</h4>
                  <span className="feedback-score">
                    Sentence Score: <strong>{sentenceResult.score}%</strong>
                  </span>
                </div>
              </div>

              <div className="sentence-checklist">
                <h5>Sentence Formation Checklist:</h5>
                <ul className="checklist-items">
                  {sentenceResult.checks.map((item) => (
                    <li
                      key={item.id}
                      className={`checklist-item ${item.passed ? 'passed' : 'needs-work'}`}
                    >
                      <span className="checklist-status-icon" aria-hidden="true">
                        {item.passed ? '✅' : '⚠️'}
                      </span>
                      <div className="checklist-text-group">
                        <span className="checklist-label">{item.label}</span>
                        {item.tip && <p className="checklist-tip">{item.tip}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="challenge-tips">
            <span>
              💡 <strong>Writing Tip:</strong> A complete sentence starts with a capital letter, contains a subject and an action, and finishes with a period, exclamation mark, or question mark!
            </span>
          </div>
        </aside>
      )}
    </div>
  )
}
