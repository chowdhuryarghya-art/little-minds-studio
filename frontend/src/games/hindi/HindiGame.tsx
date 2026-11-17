import { useState, useTransition } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { HindiWordEntry } from './hindiTypes.ts'
import {
  HINDI_WORDS,
  getHindiWordsByAge,
  getRandomHindiWord,
} from './hindiData.ts'
import { fetchHindiWord } from './hindiApi.ts'
import { speakHindi } from './hindiSpeech.ts'
import HindiKeyboard from './HindiKeyboard.tsx'

interface HindiGameProps {
  initialAge?: AgeGroupId
  initialWord?: string
}

export default function HindiGame({ initialAge, initialWord }: HindiGameProps) {
  const [selectedAge] = useState<AgeGroupId | 'all'>(initialAge || 'curious')
  const [currentWordEntry, setCurrentWordEntry] = useState<HindiWordEntry>(() => {
    if (initialWord) {
      const match = HINDI_WORDS.find((w) => w.word === initialWord || w.romanized.toLowerCase() === initialWord.toLowerCase())
      if (match) return match
    }
    return HINDI_WORDS[0]
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [showSearchKeyboard, setShowSearchKeyboard] = useState<boolean>(true)
  const [showSentenceKeyboard, setShowSentenceKeyboard] = useState<boolean>(false)
  const [userSentence, setUserSentence] = useState<string>('')
  const [isSpeakingSentence, setIsSpeakingSentence] = useState<boolean>(false)
  const [, startTransition] = useTransition()

  const handlePickRandomWord = () => {
    const ageFilter = selectedAge === 'all' ? undefined : selectedAge
    const randomItem = getRandomHindiWord(ageFilter, currentWordEntry.word)
    startTransition(() => {
      setCurrentWordEntry(randomItem)
      setSearchError(null)
      setUserSentence('')
    })
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchInput.trim()
    if (!trimmed) return

    setIsLoading(true)
    setSearchError(null)

    try {
      const entry = await fetchHindiWord(trimmed)
      setCurrentWordEntry(entry)
      setSearchInput('')
      setUserSentence('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `शब्द "${trimmed}" नहीं मिला।`
      setSearchError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectWord = async (word: string) => {
    setIsLoading(true)
    setSearchError(null)

    try {
      const entry = await fetchHindiWord(word)
      setCurrentWordEntry(entry)
      setUserSentence('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `शब्द "${word}" नहीं मिला।`
      setSearchError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true)
    try {
      await speakHindi(currentWordEntry.word)
    } finally {
      setTimeout(() => setIsPlayingAudio(false), 900)
    }
  }

  const handleSpeakSentence = async () => {
    if (!userSentence.trim()) return
    setIsSpeakingSentence(true)
    try {
      await speakHindi(userSentence.trim())
    } finally {
      setTimeout(() => setIsSpeakingSentence(false), 1200)
    }
  }

  const handleInsertSampleSentence = () => {
    setUserSentence(currentWordEntry.exampleSentence.hindi)
  }

  const curatedListForAge = getHindiWordsByAge(selectedAge === 'all' ? undefined : selectedAge)

  return (
    <div className="hindi-fun-container">
      {/* Top Search & Surprise Bar */}
      <div className="english-search-bar-wrap">
        <form className="english-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="english-search-input indic-font"
            placeholder="हिंदी में खोजें (उदा. सूरज, तितली, दोस्त)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search Hindi Dictionary"
          />
          <button type="submit" className="btn english-search-btn">
            🔍 खोजें (Search)
          </button>
          <button
            type="button"
            className={`btn btn-toggle-kb ${showSearchKeyboard ? 'active' : ''}`}
            onClick={() => setShowSearchKeyboard((prev) => !prev)}
            title="कीबोर्ड खोलें या बंद करें"
          >
            ⌨️ {showSearchKeyboard ? 'कीबोर्ड छिपाएं' : 'हिंदी कीबोर्ड'}
          </button>
        </form>
        <button
          type="button"
          className="btn english-surprise-btn"
          onClick={handlePickRandomWord}
          title="नया शब्द चुनें (Pick surprise word)"
        >
          🎲 नया शब्द! (Surprise Word)
        </button>
      </div>
      <p className="center muted">
        खोजे गए शब्द Wiktionary को भेजे जाते हैं। शब्दकोश की सामग्री आयु के अनुसार जाँची हुई नहीं है।
      </p>

      {/* On-Screen Search Keyboard */}
      {showSearchKeyboard && (
        <div className="search-keyboard-container">
          <HindiKeyboard
            onKeyPress={(char) => setSearchInput((prev) => prev + char)}
            onBackspace={() => setSearchInput((prev) => prev.slice(0, -1))}
            onClear={() => setSearchInput('')}
          />
        </div>
      )}

      {/* Suggested Quick Word Chips */}
      <div className="english-quick-words" aria-label="Hindi word suggestions">
        <span className="english-quick-label">सुझाव (Try words):</span>
        {curatedListForAge.map((item) => (
          <button
            key={item.word}
            type="button"
            className={`english-word-chip indic-font${
              item.word === currentWordEntry.word ? ' active' : ''
            }`}
            onClick={() => handleSelectWord(item.word)}
          >
            {item.word} <small>({item.romanized})</small>
          </button>
        ))}
      </div>

      {/* Loading Card */}
      {isLoading ? (
        <div className="english-loading-card">
          <div className="english-spinner" aria-hidden="true" />
          <p>हिंदी शब्दकोश में खोजा जा रहा है... (Searching dictionary...)</p>
        </div>
      ) : searchError ? (
        <div className="english-error-card">
          <span className="english-error-icon">📖</span>
          <h3>शब्द उपलब्ध नहीं (Word Unavailable)</h3>
          <p>{searchError}</p>
          <div className="english-error-actions">
            <button type="button" className="btn" onClick={handlePickRandomWord}>
              🎲 नया शब्द आज़माएं (Try Surprise Word)
            </button>
          </div>
        </div>
      ) : (
        <article className="english-word-card hindi-card-theme">
          <header className="english-card-header">
            <div className="english-word-title-group">
              <h2 className="english-word-heading indic-font hindi-main-word">
                {currentWordEntry.word}
              </h2>
              {currentWordEntry.romanized && (
                <span className="english-phonetic">/{currentWordEntry.romanized}/</span>
              )}
              {currentWordEntry.englishMeaning && (
                <span className="indic-english-tag">({currentWordEntry.englishMeaning})</span>
              )}
            </div>

            <div className="english-header-actions">
              <button
                type="button"
                className={`english-audio-btn${isPlayingAudio ? ' speaking' : ''}`}
                onClick={handlePlayAudio}
                aria-label={`Listen to pronunciation of ${currentWordEntry.word}`}
                title="उच्चारण सुनें (Listen)"
              >
                <span className="english-speaker-icon" aria-hidden="true">
                  {isPlayingAudio ? '🔊' : '🔈'}
                </span>
                <span>सुनें (Listen)</span>
              </button>
            </div>
          </header>

          <div className="english-category-badge">
            <span>
              श्रेणी (Category): <strong>{currentWordEntry.category}</strong>
            </span>
          </div>

          <div className="hindi-content-block">
            {/* Part of Speech & Definition */}
            <div className="indic-pos-header">
              <span className="pos-badge pos-noun">{currentWordEntry.partOfSpeech}</span>
            </div>

            <div className="indic-definition-box">
              <p className="indic-def-text indic-font">{currentWordEntry.hindiDefinition}</p>
              {currentWordEntry.englishMeaning && (
                <p className="indic-meaning-english">
                  Meaning: <strong>{currentWordEntry.englishMeaning}</strong>
                </p>
              )}
            </div>

            {/* Example Sentences */}
            {currentWordEntry.exampleSentence.hindi && (
            <div className="indic-example-section">
              <h4 className="indic-subheading">उदाहरण वाक्य (Example Sentence):</h4>
              <blockquote className="english-example-quote indic-example-box">
                <p className="indic-example-hindi indic-font">
                  “{currentWordEntry.exampleSentence.hindi}”
                </p>
                {currentWordEntry.exampleSentence.romanized && (
                  <p className="indic-example-romanized">
                    <em>/{currentWordEntry.exampleSentence.romanized}/</em>
                  </p>
                )}
                {currentWordEntry.exampleSentence.english && (
                  <p className="indic-example-trans">
                    Translation: {currentWordEntry.exampleSentence.english}
                  </p>
                )}
              </blockquote>
            </div>
            )}

            {/* Synonyms & Antonyms */}
            <div className="indic-relations-grid">
              {currentWordEntry.synonyms.length > 0 && (
                <div className="indic-rel-card">
                  <span className="rel-label">समानार्थी शब्द (Synonyms):</span>
                  <div className="rel-chips">
                    {currentWordEntry.synonyms.map((s) => (
                      <button
                        key={s.word}
                        type="button"
                        className="rel-chip syn-chip indic-font"
                        onClick={() => handleSelectWord(s.word)}
                        title={`Explore "${s.word}"`}
                      >
                        {s.word} <small>({s.romanized})</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentWordEntry.antonyms && currentWordEntry.antonyms.length > 0 && (
                <div className="indic-rel-card">
                  <span className="rel-label">विलोम शब्द (Antonyms):</span>
                  <div className="rel-chips">
                    {currentWordEntry.antonyms.map((a) => (
                      <button
                        key={a.word}
                        type="button"
                        className="rel-chip ant-chip indic-font"
                        onClick={() => handleSelectWord(a.word)}
                        title={`Explore "${a.word}"`}
                      >
                        {a.word} <small>({a.romanized})</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Origin & Fun Facts */}
            {(currentWordEntry.originOrContext || currentWordEntry.funFact) && (
              <footer className="english-extra-insights">
                {currentWordEntry.originOrContext && (
                  <div className="english-origin-box">
                    <div className="extra-box-header">
                      <span className="extra-icon">📜</span>
                      <strong>शब्द की उत्पत्ति (Origin &amp; History)</strong>
                    </div>
                    <p className="indic-font">{currentWordEntry.originOrContext}</p>
                  </div>
                )}

                {currentWordEntry.funFact && (
                  <div className="english-fun-fact-box">
                    <div className="extra-box-header">
                      <span className="extra-icon">💡</span>
                      <strong>रोचक तथ्य (Fun Kid Fact)</strong>
                    </div>
                    <p className="indic-font">{currentWordEntry.funFact}</p>
                  </div>
                )}
              </footer>
            )}
            {currentWordEntry.dictionaryExtract && currentWordEntry.sourceUrl && (
              <p className="indic-meaning-english">
                Dictionary source:{' '}
                <a href={currentWordEntry.sourceUrl} target="_blank" rel="noreferrer">Wiktionary</a>
                {' '}(
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">
                  CC BY-SA 4.0
                </a>
                )
              </p>
            )}
          </div>
        </article>
      )}

      {/* Sentence Challenge Card */}
      {!searchError && (
        <aside className="english-challenge-card hindi-challenge-theme">
          <div className="challenge-header">
            <span className="challenge-star">⭐</span>
            <h3>वाक्य बनाओ चुनौती (Sentence Builder Challenge)</h3>
          </div>
          <p>
            शब्द <strong className="challenge-highlight">"{currentWordEntry.word}"</strong>{' '}
            का प्रयोग करके एक हिंदी वाक्य लिखें (Write a sentence using this word):
          </p>

          <div className="sentence-builder-form">
            <div className="sentence-input-wrap">
              <textarea
                className="sentence-textarea indic-font"
                rows={3}
                placeholder={currentWordEntry.exampleSentence.hindi
                  ? `उदा. "${currentWordEntry.exampleSentence.hindi}" लिखें...`
                  : `“${currentWordEntry.word}” शब्द का उपयोग करके वाक्य लिखें...`}
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                aria-label={`Write a Hindi sentence using ${currentWordEntry.word}`}
              />
            </div>

            <div className="sentence-builder-actions">
              <button
                type="button"
                className={`btn btn-toggle-kb ${showSentenceKeyboard ? 'active' : ''}`}
                onClick={() => setShowSentenceKeyboard((prev) => !prev)}
              >
                ⌨️ {showSentenceKeyboard ? 'कीबोर्ड छिपाएं' : 'हिंदी कीबोर्ड'}
              </button>

              {userSentence.trim() && (
                <button
                  type="button"
                  className={`btn btn-speak-sentence${isSpeakingSentence ? ' speaking' : ''}`}
                  onClick={handleSpeakSentence}
                  title="वाक्य सुनें"
                >
                  🔊 वाक्य सुनें (Listen)
                </button>
              )}

              {currentWordEntry.exampleSentence.hindi && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sample-sentence"
                  onClick={handleInsertSampleSentence}
                >
                  💡 उदाहरण वाक्य देखें (Sample Sentence)
                </button>
              )}
            </div>

            {/* Sentence Builder Virtual Keyboard */}
            {showSentenceKeyboard && (
              <div className="sentence-keyboard-container">
                <HindiKeyboard
                  onKeyPress={(char) => setUserSentence((prev) => prev + char)}
                  onBackspace={() => setUserSentence((prev) => prev.slice(0, -1))}
                  onClear={() => setUserSentence('')}
                />
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
