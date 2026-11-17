import { useState, useTransition } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { BengaliWordEntry } from './bengaliTypes.ts'
import {
  BENGALI_WORDS,
  getBengaliWordsByAge,
  getRandomBengaliWord,
} from './bengaliData.ts'
import { fetchBengaliWord } from './bengaliApi.ts'
import { speakBengali } from './bengaliSpeech.ts'
import BengaliKeyboard from './BengaliKeyboard.tsx'

interface BengaliGameProps {
  initialAge?: AgeGroupId
  initialWord?: string
}

export default function BengaliGame({ initialAge, initialWord }: BengaliGameProps) {
  const [selectedAge] = useState<AgeGroupId | 'all'>(initialAge || 'curious')
  const [currentWordEntry, setCurrentWordEntry] = useState<BengaliWordEntry>(() => {
    if (initialWord) {
      const match = BENGALI_WORDS.find((w) => w.word === initialWord || w.romanized.toLowerCase() === initialWord.toLowerCase())
      if (match) return match
    }
    return BENGALI_WORDS[0]
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [showSearchKeyboard, setShowSearchKeyboard] = useState<boolean>(true)
  const [showSentenceKeyboard, setShowSentenceKeyboard] = useState<boolean>(false)
  const [userSentence, setUserSentence] = useState<string>('')
  const [isSpeakingSentence, setIsSpeakingSentence] = useState<boolean>(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handlePickRandomWord = () => {
    const ageFilter = selectedAge === 'all' ? undefined : selectedAge
    const randomItem = getRandomBengaliWord(ageFilter, currentWordEntry.word)
    startTransition(() => {
      setCurrentWordEntry(randomItem)
      setSearchError(null)
      setUserSentence('')
      setSpeechError(null)
    })
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchInput.trim()
    if (!trimmed) return

    setIsLoading(true)
    setSearchError(null)

    try {
      const entry = await fetchBengaliWord(trimmed)
      setCurrentWordEntry(entry)
      setSearchInput('')
      setUserSentence('')
      setSpeechError(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `শব্দ "${trimmed}" পাওয়া যায়নি।`
      setSearchError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectWord = async (word: string) => {
    setIsLoading(true)
    setSearchError(null)

    try {
      const entry = await fetchBengaliWord(word)
      setCurrentWordEntry(entry)
      setUserSentence('')
      setSpeechError(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `শব্দ "${word}" পাওয়া যায়নি।`
      setSearchError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true)
    setSpeechError(null)
    try {
      const usedApproximatePronunciation = await speakBengali(
        currentWordEntry.word,
        currentWordEntry.romanized,
      )
      if (usedApproximatePronunciation) {
        setSpeechError('Using an approximate pronunciation because Bengali audio is unavailable.')
      }
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : 'Bengali audio could not be played.')
    } finally {
      setIsPlayingAudio(false)
    }
  }

  const handleSpeakSentence = async () => {
    if (!userSentence.trim()) return
    setIsSpeakingSentence(true)
    setSpeechError(null)
    try {
      const isSampleSentence = userSentence.trim() === currentWordEntry.exampleSentence.bengali
      const usedApproximatePronunciation = await speakBengali(
        userSentence.trim(),
        isSampleSentence ? currentWordEntry.exampleSentence.romanized : undefined,
      )
      if (usedApproximatePronunciation) {
        setSpeechError('Using an approximate pronunciation because Bengali audio is unavailable.')
      }
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : 'Bengali audio could not be played.')
    } finally {
      setIsSpeakingSentence(false)
    }
  }

  const handleInsertSampleSentence = () => {
    setUserSentence(currentWordEntry.exampleSentence.bengali)
    setSpeechError(null)
  }

  const curatedListForAge = getBengaliWordsByAge(selectedAge === 'all' ? undefined : selectedAge)

  return (
    <div className="bengali-fun-container">
      {/* Top Search & Surprise Bar */}
      <div className="english-search-bar-wrap">
        <form className="english-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="english-search-input indic-font"
            placeholder="বাংলায় খুঁজুন (যেমন: সূর্য, প্রজাপতি, বন্ধু)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search Bengali Dictionary"
          />
          <button type="submit" className="btn english-search-btn">
            🔍 খুঁজুন (Search)
          </button>
          <button
            type="button"
            className={`btn btn-toggle-kb ${showSearchKeyboard ? 'active' : ''}`}
            onClick={() => setShowSearchKeyboard((prev) => !prev)}
            title="কীবোর্ড খুলুন বা বন্ধ করুন"
          >
            ⌨️ {showSearchKeyboard ? 'কীবোর্ড লুকান' : 'বাংলা কীবোর্ড'}
          </button>
        </form>
        <button
          type="button"
          className="btn english-surprise-btn"
          onClick={handlePickRandomWord}
          title="নতুন শব্দ নির্বাচন করুন (Pick surprise word)"
        >
          🎲 নতুন শব্দ! (Surprise Word)
        </button>
      </div>
      <p className="center muted">
        অনুসন্ধানের শব্দ Wiktionary-তে পাঠানো হয়। অভিধানের বিষয়বস্তু বয়স-উপযোগী হিসেবে পর্যালোচিত নয়।
      </p>

      {/* On-Screen Search Keyboard */}
      {showSearchKeyboard && (
        <div className="search-keyboard-container">
          <BengaliKeyboard
            onKeyPress={(char) => setSearchInput((prev) => prev + char)}
            onBackspace={() => setSearchInput((prev) => prev.slice(0, -1))}
            onClear={() => setSearchInput('')}
          />
        </div>
      )}

      {/* Suggested Quick Word Chips */}
      <div className="english-quick-words" aria-label="Bengali word suggestions">
        <span className="english-quick-label">শব্দ পরামর্শ (Try words):</span>
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
          <p>বাংলা শব্দকোষে খোঁজা হচ্ছে... (Searching dictionary...)</p>
        </div>
      ) : searchError ? (
        <div className="english-error-card">
          <span className="english-error-icon">📖</span>
          <h3>শব্দটি উপলব্ধ নয় (Word Unavailable)</h3>
          <p>{searchError}</p>
          <div className="english-error-actions">
            <button type="button" className="btn" onClick={handlePickRandomWord}>
              🎲 নতুন শব্দ চেষ্টা করুন (Try Surprise Word)
            </button>
          </div>
        </div>
      ) : (
        <article className="english-word-card bengali-card-theme">
          <header className="english-card-header">
            <div className="english-word-title-group">
              <h2 className="english-word-heading indic-font bengali-main-word">
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
                title="উচ্চারণ শুনুন (Listen)"
              >
                <span className="english-speaker-icon" aria-hidden="true">
                  {isPlayingAudio ? '🔊' : '🔈'}
                </span>
                <span>শুনুন (Listen)</span>
              </button>
            </div>
          </header>
          {speechError && <p className="center" role="status">{speechError}</p>}

          <div className="english-category-badge">
            <span>
              বিভাগ (Category): <strong>{currentWordEntry.category}</strong>
            </span>
          </div>

          <div className="bengali-content-block">
            {/* Part of Speech & Definition */}
            <div className="indic-pos-header">
              <span className="pos-badge pos-noun">{currentWordEntry.partOfSpeech}</span>
            </div>

            <div className="indic-definition-box">
              <p className="indic-def-text indic-font">{currentWordEntry.bengaliDefinition}</p>
              {currentWordEntry.englishMeaning && (
                <p className="indic-meaning-english">
                  Meaning: <strong>{currentWordEntry.englishMeaning}</strong>
                </p>
              )}
            </div>

            {/* Example Sentences */}
            {currentWordEntry.exampleSentence.bengali && (
            <div className="indic-example-section">
              <h4 className="indic-subheading">উদাহরণ বাক্য (Example Sentence):</h4>
              <blockquote className="english-example-quote indic-example-box">
                <p className="indic-example-hindi indic-font">
                  “{currentWordEntry.exampleSentence.bengali}”
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
                  <span className="rel-label">সমার্থক শব্দ (Synonyms):</span>
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
                  <span className="rel-label">বিপরীতার্থক শব্দ (Antonyms):</span>
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
                      <strong>শব্দের উৎস (Origin &amp; History)</strong>
                    </div>
                    <p className="indic-font">{currentWordEntry.originOrContext}</p>
                  </div>
                )}

                {currentWordEntry.funFact && (
                  <div className="english-fun-fact-box">
                    <div className="extra-box-header">
                      <span className="extra-icon">💡</span>
                      <strong>মজার তথ্য (Fun Kid Fact)</strong>
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
        <aside className="english-challenge-card bengali-challenge-theme">
          <div className="challenge-header">
            <span className="challenge-star">⭐</span>
            <h3>বাক্য গঠন চ্যালেঞ্জ (Sentence Builder Challenge)</h3>
          </div>
          <p>
            শব্দ <strong className="challenge-highlight">"{currentWordEntry.word}"</strong>{' '}
            ব্যবহার করে একটি বাংলা বাক্য তৈরি করুন (Write a sentence using this word):
          </p>

          <div className="sentence-builder-form">
            <div className="sentence-input-wrap">
              <textarea
                className="sentence-textarea indic-font"
                rows={3}
                placeholder={currentWordEntry.exampleSentence.bengali
                  ? `যেমন: "${currentWordEntry.exampleSentence.bengali}" লিখুন...`
                  : `"${currentWordEntry.word}" শব্দটি ব্যবহার করে বাক্য লিখুন...`}
                value={userSentence}
                onChange={(e) => {
                  setUserSentence(e.target.value)
                  setSpeechError(null)
                }}
                aria-label={`Write a Bengali sentence using ${currentWordEntry.word}`}
              />
            </div>

            <div className="sentence-builder-actions">
              <button
                type="button"
                className={`btn btn-toggle-kb ${showSentenceKeyboard ? 'active' : ''}`}
                onClick={() => setShowSentenceKeyboard((prev) => !prev)}
              >
                ⌨️ {showSentenceKeyboard ? 'কীবোর্ড লুকান' : 'বাংলা কীবোর্ড'}
              </button>

              {userSentence.trim() && (
                <button
                  type="button"
                  className={`btn btn-speak-sentence${isSpeakingSentence ? ' speaking' : ''}`}
                  onClick={handleSpeakSentence}
                  title="বাক্য শুনুন"
                >
                  🔊 বাক্য শুনুন (Listen)
                </button>
              )}

              {currentWordEntry.exampleSentence.bengali && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sample-sentence"
                  onClick={handleInsertSampleSentence}
                >
                  💡 উদাহরণ বাক্য দেখুন (Sample Sentence)
                </button>
              )}
            </div>
            {/* Sentence Builder Virtual Keyboard */}
            {showSentenceKeyboard && (
              <div className="sentence-keyboard-container">
                <BengaliKeyboard
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
