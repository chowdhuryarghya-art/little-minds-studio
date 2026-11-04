function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) return Promise.resolve(voices)

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      resolve(window.speechSynthesis.getVoices())
    }, 1500)
    const onVoicesChanged = () => {
      window.clearTimeout(timer)
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged, { once: true })
  })
}

function speakWithBengaliVoice(text: string, voice: SpeechSynthesisVoice): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.lang = voice.lang
    utterance.rate = 0.82
    utterance.onend = () => resolve()
    utterance.onerror = (event) => reject(new Error(`Bengali speech failed: ${event.error}`))
    window.speechSynthesis.speak(utterance)
  })
}

async function speakWithOnlineAudio(text: string): Promise<void> {
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=bn&client=tw-ob`
  const audio = new Audio(audioUrl)
  audio.playbackRate = 0.92

  try {
    await new Promise<void>((resolve, reject) => {
      const loadTimer = window.setTimeout(() => finish(new Error('Bengali audio timed out')), 10000)
      let settled = false

      const finish = (error?: Error) => {
        if (settled) return
        settled = true
        window.clearTimeout(loadTimer)
        audio.onplaying = null
        audio.onended = null
        audio.onerror = null
        if (error) reject(error)
        else resolve()
      }

      audio.onplaying = () => window.clearTimeout(loadTimer)
      audio.onended = () => finish()
      audio.onerror = () => finish(new Error('Bengali audio could not be played'))
      audio.play().catch((error: unknown) => {
        finish(error instanceof Error ? error : new Error('Bengali audio could not be played'))
      })
    })
  } catch (error) {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    throw error
  }
}

export async function speakBengali(text: string, romanizedFallback?: string): Promise<boolean> {
  const clean = text.trim()
  if (!clean) return false

  try {
    await speakWithOnlineAudio(clean)
    return false
  } catch {
    // Use a system Bengali voice if online audio is unavailable.
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    throw new Error('Bengali audio is unavailable in this browser.')
  }

  window.speechSynthesis.cancel()
  const voices = await loadVoices()
  const bengaliVoice = voices.find((voice) => voice.lang.toLowerCase() === 'bn-bd')
    ?? voices.find((voice) => voice.lang.toLowerCase() === 'bn-in')
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('bn'))
  if (bengaliVoice) {
    await speakWithBengaliVoice(clean, bengaliVoice)
    return false
  }

  if (!romanizedFallback?.trim()) {
    throw new Error('Could not play Bengali audio. Please try again or use a browser with a Bengali voice installed.')
  }

  const utterance = new SpeechSynthesisUtterance(romanizedFallback)
  utterance.lang = 'hi-IN'
  utterance.rate = 0.78
  const fallbackVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('hi-in'))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('hi'))
  if (fallbackVoice) utterance.voice = fallbackVoice

  await new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve()
    utterance.onerror = (event) => reject(new Error(`Pronunciation fallback failed: ${event.error}`))
    window.speechSynthesis.speak(utterance)
  })
  return true
}
