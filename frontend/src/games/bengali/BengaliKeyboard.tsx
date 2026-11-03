import { useState } from 'react'

interface BengaliKeyboardProps {
  onKeyPress: (char: string) => void
  onBackspace: () => void
  onClear: () => void
}

const SWAR_AND_KAR = [
  // Independent Vowels
  { char: 'অ', label: 'অ' },
  { char: 'আ', label: 'আ' },
  { char: 'ই', label: 'ই' },
  { char: 'ঈ', label: 'ঈ' },
  { char: 'উ', label: 'উ' },
  { char: 'ঊ', label: 'ঊ' },
  { char: 'ঋ', label: 'ঋ' },
  { char: 'এ', label: 'এ' },
  { char: 'ঐ', label: 'ঐ' },
  { char: 'ও', label: 'ও' },
  { char: 'ঔ', label: 'ঔ' },
  // Kar Signs
  { char: 'া', label: 'া (আ-কার)' },
  { char: 'ি', label: 'ি (ই-কার)' },
  { char: 'ী', label: 'ী (ঈ-কার)' },
  { char: 'ু', label: 'ু (উ-কার)' },
  { char: 'ূ', label: 'ূ (ঊ-কার)' },
  { char: 'ৃ', label: 'ৃ (ঋ-কার)' },
  { char: 'ে', label: 'ে (এ-কার)' },
  { char: 'ৈ', label: 'ৈ (ঐ-কার)' },
  { char: 'ো', label: 'ো (ও-কার)' },
  { char: 'ৌ', label: 'ৌ (ঔ-কার)' },
  { char: 'ং', label: 'ং (অনুস্বার)' },
  { char: 'ঃ', label: 'ঃ (বিসর্গ)' },
  { char: 'ঁ', label: 'ঁ (চন্দ্রবিন্দু)' },
  { char: '্', label: '্ (হসন্ত)' },
]

const BYANJON = [
  // Ka Borgo
  { char: 'ক', label: 'ক' },
  { char: 'খ', label: 'খ' },
  { char: 'গ', label: 'গ' },
  { char: 'ঘ', label: 'ঘ' },
  { char: 'ঙ', label: 'ঙ' },
  // Cha Borgo
  { char: 'চ', label: 'চ' },
  { char: 'ছ', label: 'ছ' },
  { char: 'জ', label: 'জ' },
  { char: 'ঝ', label: 'ঝ' },
  { char: 'ঞ', label: 'ঞ' },
  // Ta Borgo
  { char: 'ট', label: 'ট' },
  { char: 'ঠ', label: 'ঠ' },
  { char: 'ড', label: 'ড' },
  { char: 'ঢ', label: 'ঢ' },
  { char: 'ণ', label: 'ণ' },
  // Ta (Dental) Borgo
  { char: 'ত', label: 'ত' },
  { char: 'থ', label: 'থ' },
  { char: 'দ', label: 'দ' },
  { char: 'ধ', label: 'ধ' },
  { char: 'ন', label: 'ন' },
  // Pa Borgo
  { char: 'প', label: 'প' },
  { char: 'ফ', label: 'ফ' },
  { char: 'ব', label: 'ব' },
  { char: 'ভ', label: 'ভ' },
  { char: 'ম', label: 'ম' },
  // Antastha & Ushma
  { char: 'য', label: 'য' },
  { char: 'র', label: 'র' },
  { char: 'ল', label: 'ল' },
  { char: 'শ', label: 'শ' },
  { char: 'ষ', label: 'ষ' },
  { char: 'স', label: 'স' },
  { char: 'হ', label: 'হ' },
  // Special / Extra
  { char: 'ড়', label: 'ড়' },
  { char: 'ঢ়', label: 'ঢ়' },
  { char: 'য়', label: 'য়' },
  { char: 'ৎ', label: 'ৎ' },
  { char: 'ক্ষ', label: 'ক্ষ' },
  { char: 'জ্ঞ', label: 'জ্ঞ' },
]

export default function BengaliKeyboard({
  onKeyPress,
  onBackspace,
  onClear,
}: BengaliKeyboardProps) {
  const [activeTab, setActiveTab] = useState<'byanjon' | 'swar'>('byanjon')

  return (
    <div className="indic-keyboard-wrapper bengali-keyboard" aria-label="Bengali on-screen keyboard">
      <div className="indic-keyboard-header">
        <div className="indic-kb-tabs">
          <button
            type="button"
            className={`indic-kb-tab ${activeTab === 'byanjon' ? 'active' : ''}`}
            onClick={() => setActiveTab('byanjon')}
          >
            ব্যঞ্জনবর্ণ (Consonants)
          </button>
          <button
            type="button"
            className={`indic-kb-tab ${activeTab === 'swar' ? 'active' : ''}`}
            onClick={() => setActiveTab('swar')}
          >
            স্বরবর্ণ ও কারচিহ্ন (Vowels &amp; Kar)
          </button>
        </div>
        <span className="indic-kb-hint">অক্ষরে চাপ দিয়ে লিখুন (Tap letters to type)</span>
      </div>

      <div className="indic-kb-keys-grid">
        {(activeTab === 'byanjon' ? BYANJON : SWAR_AND_KAR).map((item) => (
          <button
            key={item.char}
            type="button"
            className="indic-kb-key indic-font"
            onClick={() => onKeyPress(item.char)}
            title={item.label}
          >
            {item.char}
          </button>
        ))}
      </div>

      {/* Action Keys */}
      <div className="indic-kb-actions">
        <button
          type="button"
          className="indic-kb-action-key space-key indic-font"
          onClick={() => onKeyPress(' ')}
        >
          ␣ স্পেস (Space)
        </button>
        <button
          type="button"
          className="indic-kb-action-key purna-viram-key indic-font"
          onClick={() => onKeyPress('।')}
          title="দাঁড়ি (Dari)"
        >
          । (দাঁড়ি)
        </button>
        <button
          type="button"
          className="indic-kb-action-key backspace-key"
          onClick={onBackspace}
          title="মুছুন (Backspace)"
        >
          ⌫ মুছুন (Backspace)
        </button>
        <button
          type="button"
          className="indic-kb-action-key clear-key"
          onClick={onClear}
          title="সাফ করুন (Clear all)"
        >
          🗑️ সাফ করুন (Clear)
        </button>
      </div>
    </div>
  )
}
