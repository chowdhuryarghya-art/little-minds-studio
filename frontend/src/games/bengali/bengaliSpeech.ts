/**
 * Play Bengali speech using High-Quality native audio stream with Web Speech API and phonetics fallback.
 */
export async function speakBengali(text: string, romanizedFallback?: string): Promise<void> {
  const clean = text.trim()
  if (!clean) return

  // Layer 1: High-Quality Bengali Native TTS Audio Stream
  try {
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=bn&client=tw-ob`
    const audio = new Audio(audioUrl)
    audio.playbackRate = 0.92

    // Wrap playback in promise with timeout so it falls back immediately if audio fails to load
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Audio timeout')), 3500)
      audio.onended = () => {
        clearTimeout(timer)
        resolve()
      }
      audio.onerror = () => {
        clearTimeout(timer)
        reject(new Error('Audio load error'))
      }
      audio.play().then(() => {
        // Audio started playing successfully
      }).catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
    })
    return
  } catch {
    // If online audio element playback is blocked/fails, fall back to browser Web Speech API
  }

  // Layer 2: Web Speech API (if browser / OS has Bengali voice installed)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()

    const voices = window.speechSynthesis.getVoices()
    const bengaliVoice = voices.find(
      (v) =>
        v.lang.startsWith('bn') ||
        v.name.toLowerCase().includes('bengali') ||
        v.name.toLowerCase().includes('bangla')
    )

    if (bengaliVoice) {
      const utterance = new SpeechSynthesisUtterance(clean)
      utterance.voice = bengaliVoice
      utterance.lang = bengaliVoice.lang || 'bn-IN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
      return
    }

    // Layer 3: If no Bengali voice is installed in the OS, pronounce using Romanized transliteration on Indian English / Hindi voice
    const fallbackText = romanizedFallback || clean
    const utterance = new SpeechSynthesisUtterance(fallbackText)
    const indianVoice = voices.find(
      (v) =>
        v.lang.startsWith('hi') ||
        v.lang.includes('IN') ||
        v.name.toLowerCase().includes('india')
    )
    if (indianVoice) {
      utterance.voice = indianVoice
    }
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }
}
