import { useState } from 'react'

interface HindiKeyboardProps {
  onKeyPress: (char: string) => void
  onBackspace: () => void
  onClear: () => void
}

const SWAR_AND_MATRAS = [
  // Independent Vowels
  { char: 'अ', label: 'अ' },
  { char: 'आ', label: 'आ' },
  { char: 'इ', label: 'इ' },
  { char: 'ई', label: 'ई' },
  { char: 'उ', label: 'उ' },
  { char: 'ऊ', label: 'ऊ' },
  { char: 'ए', label: 'ए' },
  { char: 'ऐ', label: 'ऐ' },
  { char: 'ओ', label: 'ओ' },
  { char: 'औ', label: 'औ' },
  { char: 'ऋ', label: 'ऋ' },
  { char: 'अं', label: 'अं' },
  { char: 'अः', label: 'अः' },
  // Matras
  { char: 'ा', label: 'ा (आ)' },
  { char: 'ि', label: 'ि (इ)' },
  { char: 'ी', label: 'ी (ई)' },
  { char: 'ु', label: 'ु (उ)' },
  { char: 'ू', label: 'ू (ऊ)' },
  { char: 'े', label: 'े (ए)' },
  { char: 'ै', label: 'ै (ऐ)' },
  { char: 'ो', label: 'ो (ओ)' },
  { char: 'ौ', label: 'ौ (औ)' },
  { char: 'ृ', label: 'ृ (ऋ)' },
  { char: 'ं', label: 'ं (अनुस्वार)' },
  { char: 'ँ', label: 'ँ (चन्द्रबिन्दु)' },
  { char: 'ः', label: 'ः (विसर्ग)' },
  { char: '्', label: '् (हलंत)' },
]

const VYANJAN = [
  // Ka Varg
  { char: 'क', label: 'क' },
  { char: 'ख', label: 'ख' },
  { char: 'ग', label: 'ग' },
  { char: 'घ', label: 'घ' },
  { char: 'ङ', label: 'ङ' },
  // Cha Varg
  { char: 'च', label: 'च' },
  { char: 'छ', label: 'छ' },
  { char: 'ज', label: 'ज' },
  { char: 'झ', label: 'झ' },
  { char: 'ञ', label: 'ञ' },
  // Ta Varg
  { char: 'ट', label: 'ट' },
  { char: 'ठ', label: 'ठ' },
  { char: 'ड', label: 'ड' },
  { char: 'ढ', label: 'ढ' },
  { char: 'ण', label: 'ण' },
  // Ta (Dental) Varg
  { char: 'त', label: 'त' },
  { char: 'थ', label: 'थ' },
  { char: 'द', label: 'द' },
  { char: 'ध', label: 'ध' },
  { char: 'न', label: 'न' },
  // Pa Varg
  { char: 'प', label: 'प' },
  { char: 'फ', label: 'फ' },
  { char: 'ब', label: 'ब' },
  { char: 'भ', label: 'भ' },
  { char: 'म', label: 'म' },
  // Ya to Ha
  { char: 'य', label: 'य' },
  { char: 'र', label: 'र' },
  { char: 'ल', label: 'ल' },
  { char: 'व', label: 'व' },
  { char: 'श', label: 'श' },
  { char: 'ष', label: 'ष' },
  { char: 'स', label: 'स' },
  { char: 'ह', label: 'ह' },
  // Joint / Nuqta
  { char: 'क्ष', label: 'क्ष' },
  { char: 'त्र', label: 'त्र' },
  { char: 'ज्ञ', label: 'ज्ञ' },
  { char: 'श्र', label: 'श्र' },
  { char: 'ड़', label: 'ड़' },
  { char: 'ढ़', label: 'ढ़' },
]

export default function HindiKeyboard({
  onKeyPress,
  onBackspace,
  onClear,
}: HindiKeyboardProps) {
  const [activeTab, setActiveTab] = useState<'vyanjan' | 'swar'>('vyanjan')

  return (
    <div className="indic-keyboard-wrapper hindi-keyboard" aria-label="Hindi on-screen keyboard">
      <div className="indic-keyboard-header">
        <div className="indic-kb-tabs">
          <button
            type="button"
            className={`indic-kb-tab ${activeTab === 'vyanjan' ? 'active' : ''}`}
            onClick={() => setActiveTab('vyanjan')}
          >
            व्यंजन (Consonants)
          </button>
          <button
            type="button"
            className={`indic-kb-tab ${activeTab === 'swar' ? 'active' : ''}`}
            onClick={() => setActiveTab('swar')}
          >
            स्वर व मात्राएँ (Vowels &amp; Matras)
          </button>
        </div>
        <span className="indic-kb-hint">अक्षरों पर टैप करके लिखें (Tap letters to type)</span>
      </div>

      <div className="indic-kb-keys-grid">
        {(activeTab === 'vyanjan' ? VYANJAN : SWAR_AND_MATRAS).map((item) => (
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
          ␣ स्पेस (Space)
        </button>
        <button
          type="button"
          className="indic-kb-action-key purna-viram-key indic-font"
          onClick={() => onKeyPress('।')}
          title="पूर्ण विराम (Purna Viram)"
        >
          । (पूर्ण विराम)
        </button>
        <button
          type="button"
          className="indic-kb-action-key backspace-key"
          onClick={onBackspace}
          title="मिटाएं (Backspace)"
        >
          ⌫ मिटाएं (Backspace)
        </button>
        <button
          type="button"
          className="indic-kb-action-key clear-key"
          onClick={onClear}
          title="साफ़ करें (Clear all)"
        >
          🗑️ साफ़ करें (Clear)
        </button>
      </div>
    </div>
  )
}
