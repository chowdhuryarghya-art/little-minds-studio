/**
 * Play Hindi speech using browser Web Speech API with hi-IN locale.
 */
export async function speakHindi(text: string): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'hi-IN'
  utterance.rate = 0.85 // Calibrated for clear child listening
  utterance.pitch = 1.0

  // Look for a native Hindi voice if available
  const voices = window.speechSynthesis.getVoices()
  const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'))
  if (hindiVoice) {
    utterance.voice = hindiVoice
  }

  window.speechSynthesis.speak(utterance)
}
