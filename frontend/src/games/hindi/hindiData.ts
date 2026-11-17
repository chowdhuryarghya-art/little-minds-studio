import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { HindiWordEntry } from './hindiTypes.ts'
import { containsBlockedWord } from '../safety/wordSafety.ts'

export const HINDI_WORDS: HindiWordEntry[] = [
  // Little Explorers (Ages 2-5)
  {
    word: 'सूरज',
    romanized: 'Sooraj',
    englishMeaning: 'Sun',
    hindiDefinition: 'आकाश में चमकने वाला तारा जो हमें धूप और रोशनी देता है।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'सूर्य', romanized: 'Soorya' },
      { word: 'रवि', romanized: 'Ravi' },
      { word: 'दिनकर', romanized: 'Dinkar' },
    ],
    antonyms: [{ word: 'चाँद', romanized: 'Chaand' }],
    exampleSentence: {
      hindi: 'सुबह-सुबह सूरज पूर्व दिशा से उगता है।',
      romanized: 'Subah-subah sooraj poorva disha se ugta hai.',
      english: 'Early in the morning, the sun rises in the east.',
    },
    originOrContext: 'संस्कृत शब्द "सूर्य" से व्युत्पन्न।',
    funFact: 'सूरज की रोशनी पृथ्वी तक पहुँचने में लगभग 8 मिनट 20 सेकंड का समय लेती है!',
    ageGroup: 'explorers',
    category: 'प्रकृति और आकाश (Nature & Sky)',
  },
  {
    word: 'तितली',
    romanized: 'Titli',
    englishMeaning: 'Butterfly',
    hindiDefinition: 'रंग-बिरंगे पंखों वाला एक सुंदर और नन्हा कीट जो फूलों का रस पीता है।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'पतंग', romanized: 'Patang' },
      { word: 'शलभ', romanized: 'Shalabh' },
    ],
    exampleSentence: {
      hindi: 'सुंदर तितली बगीचे में फूलों पर नाच रही है।',
      romanized: 'Sundar titli bageeche mein phoolon par naach rahi hai.',
      english: 'The beautiful butterfly is dancing over flowers in the garden.',
    },
    funFact: 'तितलियाँ अपने पैरों से किसी भी चीज़ का स्वाद चखती हैं!',
    ageGroup: 'explorers',
    category: 'जीव-जंतु (Animals & Insects)',
  },
  {
    word: 'इंद्रधनुष',
    romanized: 'Indradhanush',
    englishMeaning: 'Rainbow',
    hindiDefinition: 'बारिश के बाद धूप खिलने पर आकाश में दिखने वाला सात रंगों का अर्धवृत्त।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'सप्तरंग', romanized: 'Saptarang' },
      { word: 'मेघधनुष', romanized: 'Meghdhanush' },
    ],
    exampleSentence: {
      hindi: 'बारिश के बाद आसमान में सात रंगों का इंद्रधनुष दिखाई दिया।',
      romanized: 'Baarish ke baad aasmaan mein saat rangon ka indradhanush dikhaai diya.',
      english: 'After the rain, a seven-colored rainbow appeared in the sky.',
    },
    originOrContext: 'देवराज "इंद्र" और "धनुष" के मेल से बना शब्द।',
    funFact: 'इंद्रधनुष में मुख्य 7 रंग होते हैं: बैंगनी, जामुनी, नीला, हरा, पीला, नारंगी और लाल (VIBGYOR)!',
    ageGroup: 'explorers',
    category: 'प्रकृति और रंग (Nature & Colors)',
  },
  {
    word: 'दोस्त',
    romanized: 'Dost',
    englishMeaning: 'Friend',
    hindiDefinition: 'वह साथी जिसके साथ हम खेलते हैं, खुशियाँ बांटते हैं और जो हमारी मदद करता है।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'मित्र', romanized: 'Mitra' },
      { word: 'सखा', romanized: 'Sakha' },
      { word: 'साथी', romanized: 'Saathi' },
    ],
    antonyms: [{ word: 'शत्रु', romanized: 'Shatru' }],
    exampleSentence: {
      hindi: 'रोहन और कबीर बहुत अच्छे दोस्त हैं और साथ मिलकर खेलते हैं।',
      romanized: 'Rohan aur Kabir bahut achhe dost hain aur saath milkar khelte hain.',
      english: 'Rohan and Kabir are very good friends and play together.',
    },
    funFact: 'दोस्ती इंसान के मन को खुश और स्वस्थ रखने में सबसे मददगार होती है!',
    ageGroup: 'explorers',
    category: 'रिश्ते और भावनाएं (Relationships)',
  },
  {
    word: 'हँसना',
    romanized: 'Hansna',
    englishMeaning: 'To Laugh / Smile',
    hindiDefinition: 'खुशी में चेहरे पर मुस्कान लाना और खिलखिलाना।',
    partOfSpeech: 'क्रिया (Verb)',
    synonyms: [
      { word: 'मुस्कुराना', romanized: 'Muskuraana' },
      { word: 'खिलखिलाना', romanized: 'Khilkhilaana' },
    ],
    antonyms: [{ word: 'रोना', romanized: 'Rona' }],
    exampleSentence: {
      hindi: 'मजेदार चुटकुला सुनकर सभी बच्चे जोर-जोर से हँसने लगे।',
      romanized: 'Maje-daar chutkula sunkar sabhi bachhe zor-zor se hansne lage.',
      english: 'Hearing the funny joke, all the children started laughing loudly.',
    },
    funFact: 'हँसने से हमारे फेफड़ों को ताज़ी हवा मिलती है और तनाव दूर होता है!',
    ageGroup: 'explorers',
    category: 'क्रियाएं और भावनाएं (Actions & Feelings)',
  },

  // Curious Minds (Ages 5-9)
  {
    word: 'साहस',
    romanized: 'Saahas',
    englishMeaning: 'Courage / Bravery',
    hindiDefinition: 'कठिन परिस्थिति या डर के समय घबराए बिना हिम्मत से काम लेना।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'हिम्मत', romanized: 'Himmat' },
      { word: 'वीरता', romanized: 'Veerta' },
      { word: 'शौर्य', romanized: 'Shaurya' },
    ],
    antonyms: [
      { word: 'डर', romanized: 'Dar' },
      { word: 'कायरता', romanized: 'Kaayarta' },
    ],
    exampleSentence: {
      hindi: 'नन्ही रीया ने साहस दिखाते हुए बिल्ली के बच्चे को बचा लिया।',
      romanized: 'Nanhi Riya ne saahas dikhaate hue billi ke bachhe ko bacha liya.',
      english: 'Little Riya showed great courage and rescued the kitten.',
    },
    originOrContext: 'संस्कृत मूल शब्द "सहस्" (बल, शक्ति)।',
    funFact: 'साहस का मतलब डर का न होना नहीं, बल्कि डर के बावजूद आगे बढ़ना है!',
    ageGroup: 'curious',
    category: 'सद्गुण और मूल्य (Values & Character)',
  },
  {
    word: 'जिज्ञासा',
    romanized: 'Jigyaasa',
    englishMeaning: 'Curiosity / Desire to learn',
    hindiDefinition: 'नई बातें जानने, सीखने और समझने की तीव्र इच्छा।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'उत्सुकता', romanized: 'Utsukta' },
      { word: 'कौतूहल', romanized: 'Kautoohal' },
    ],
    antonyms: [{ word: 'उदासीनता', romanized: 'Udaaseenta' }],
    exampleSentence: {
      hindi: 'बच्चों की जिज्ञासा उन्हें विज्ञान के नए प्रयोग करने के लिए प्रेरित करती है।',
      romanized: 'Bachhon ki jigyaasa unhein vigyaan ke naye prayog karne ke liye prerit karti hai.',
      english: 'Children\'s curiosity inspires them to conduct new science experiments.',
    },
    funFact: 'दुनिया के सबसे महान वैज्ञानिक अल्बर्ट आइंस्टीन ने कहा था: "मुझमें कोई खास प्रतिभा नहीं है, मैं केवल बेहद जिज्ञासु हूँ।"',
    ageGroup: 'curious',
    category: 'ज्ञान और विचार (Minds & Learning)',
  },
  {
    word: 'सुगंध',
    romanized: 'Sugandh',
    englishMeaning: 'Fragrance / Sweet Aroma',
    hindiDefinition: 'मन को प्रसन्न करने वाली अच्छी और भीनी-भीनी खुशबू।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'खुशबू', romanized: 'Khushboo' },
      { word: 'महक', romanized: 'Mahak' },
      { word: 'सौरभ', romanized: 'Saurabh' },
    ],
    antonyms: [{ word: 'दुर्गंध', romanized: 'Durgandh' }],
    exampleSentence: {
      hindi: 'गुलाब के खिले हुए फूलों से पूरे कमरे में मीठी सुगंध फैल गई।',
      romanized: 'Gulaab ke khile hue phoolon se poore kamre mein meethi sugandh phail gayi.',
      english: 'The blooming roses spread a sweet fragrance throughout the room.',
    },
    ageGroup: 'curious',
    category: 'अनुभूतियाँ और प्रकृति (Sensory & Nature)',
  },
  {
    word: 'चमकीला',
    romanized: 'Chamkeela',
    englishMeaning: 'Bright / Shining / Radiant',
    hindiDefinition: 'जो बहुत अधिक चमक और प्रकाश बिखेरता हो।',
    partOfSpeech: 'विशेषण (Adjective)',
    synonyms: [
      { word: 'दीप्तिमान', romanized: 'Deeptimaan' },
      { word: 'उज्ज्वल', romanized: 'Ujjwal' },
      { word: 'चमकदार', romanized: 'Chamakdaar' },
    ],
    antonyms: [{ word: 'धुंधला', romanized: 'Dhundhla' }],
    exampleSentence: {
      hindi: 'रात के अंधेरे में ध्रुव तारा सबसे चमकीला दिखाई देता है।',
      romanized: 'Raat ke andhere mein Dhruv taara sabse chamkeela dikhaai deta hai.',
      english: 'In the dark of the night, the North Star appears the brightest.',
    },
    ageGroup: 'curious',
    category: 'विशेषण और गुण (Adjectives & Qualities)',
  },
  {
    word: 'उड़ान',
    romanized: 'Udaan',
    englishMeaning: 'Flight / Flying',
    hindiDefinition: 'पंखों या विमान के सहारे हवा में तैरने या ऊपर उठने की क्रिया।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'उड्डयन', romanized: 'Uddayan' },
      { word: 'परवाज़', romanized: 'Parwaaz' },
    ],
    exampleSentence: {
      hindi: 'चील ने ऊँचे नीले आसमान में एक लंबी उड़ान भरी।',
      romanized: 'Cheel ne oonche neele aasmaan mein ek lambi udaan bhari.',
      english: 'The eagle took a high and long flight in the blue sky.',
    },
    ageGroup: 'curious',
    category: 'क्रियाएं और गति (Actions & Motion)',
  },

  // Creative Minds (Ages 10-12)
  {
    word: 'परिश्रम',
    romanized: 'Parishram',
    englishMeaning: 'Hard Work / Diligence',
    hindiDefinition: 'किसी लक्ष्य को प्राप्त करने के लिए पूरी लगन और मेहनत से किया गया प्रयास।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'मेहनत', romanized: 'Mehnat' },
      { word: 'श्रम', romanized: 'Shram' },
      { word: 'उद्यम', romanized: 'Udyam' },
    ],
    antonyms: [{ word: 'आलस्य', romanized: 'Aalasya' }],
    exampleSentence: {
      hindi: 'कड़े परिश्रम और अभ्यास से ही कोई भी विद्यार्थी परीक्षा में प्रथम स्थान पाता है।',
      romanized: 'Kade parishram aur abhyaas se hi koi bhi vidyaarthi pareeksha mein pratham sthaan paata hai.',
      english: 'Only through diligent hard work and practice does a student achieve the first rank.',
    },
    originOrContext: 'संस्कृत शब्द "परि" (चारों ओर) + "श्रम" (मेहनत)।',
    funFact: '"उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः" — अर्थात् कार्य केवल इच्छा करने से नहीं, बल्कि परिश्रम से ही सिद्ध होते हैं!',
    ageGroup: 'creative',
    category: 'सद्गुण और सफलता (Values & Growth)',
  },
  {
    word: 'अद्भुत',
    romanized: 'Adbhut',
    englishMeaning: 'Marvelous / Extraordinary / Wonderful',
    hindiDefinition: 'जो असाधारण, आश्चर्यजनक और मन को मुग्ध कर देने वाला हो।',
    partOfSpeech: 'विशेषण (Adjective)',
    synonyms: [
      { word: 'विस्मयकारी', romanized: 'Vismaykaari' },
      { word: 'अनोखा', romanized: 'Anokha' },
      { word: 'अलौकिक', romanized: 'Alaukik' },
    ],
    antonyms: [{ word: 'साधारण', romanized: 'Saadhaaran' }],
    exampleSentence: {
      hindi: 'हिमालय की बर्फीली चोटियों का दृश्य वास्तव में अत्यंत अद्भुत है।',
      romanized: 'Himaalaya ki barfeeli chotiyon ka drishya vaastav mein atyant adbhut hai.',
      english: 'The view of the snow-clad peaks of the Himalayas is truly marvelous.',
    },
    ageGroup: 'creative',
    category: 'अनोखे शब्द (Wonder & Vocabulary)',
  },
  {
    word: 'सद्भावना',
    romanized: 'Sadbhaavna',
    englishMeaning: 'Goodwill / Harmony / Benevolence',
    hindiDefinition: 'दूसरों के प्रति अच्छी भावना, प्रेम और कल्याण की पवित्र सोच।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'सहानुभूति', romanized: 'Sahaanubhooti' },
      { word: 'मैत्रीभाव', romanized: 'Maitreebhaav' },
      { word: 'भाईचारा', romanized: 'Bhaaichaara' },
    ],
    antonyms: [{ word: 'दुर्भावना', romanized: 'Durbhaavna' }],
    exampleSentence: {
      hindi: 'हमें सभी के साथ प्रेम और आपसी सद्भावना से मिलकर रहना चाहिए।',
      romanized: 'Humein sabhi ke saath prem aur aapsi sadbhaavna se milkar rehna chaahiye.',
      english: 'We should live together with love and mutual goodwill toward all.',
    },
    ageGroup: 'creative',
    category: 'सामाजिक मूल्य (Ethics & Society)',
  },
  {
    word: 'ब्रह्मांड',
    romanized: 'Brahmaand',
    englishMeaning: 'Universe / Cosmos',
    hindiDefinition: 'समस्त ग्रह, तारे, आकाशगंगाएं और अंतरिक्ष का असीम विस्तार।',
    partOfSpeech: 'संज्ञा (Noun)',
    synonyms: [
      { word: 'अंतरिक्ष', romanized: 'Antariksh' },
      { word: 'सृष्टि', romanized: 'Srishti' },
      { word: 'विश्व', romanized: 'Vishwa' },
    ],
    exampleSentence: {
      hindi: 'खगोलविद शक्तिशाली दूरबीन की मदद से अनंत ब्रह्मांड के रहस्यों की खोज करते हैं।',
      romanized: 'Khagolvid shaktishaali doorbeen ki madad se anant brahmaand ke rahasyon ki khoj karte hain.',
      english: 'Astronomers use powerful telescopes to explore the mysteries of the infinite universe.',
    },
    funFact: 'ब्रह्मांड में अरबों आकाशगंगाएँ हैं, और हमारी आकाशगंगा का नाम "मिल्की वे" (दुग्धमेखला) है!',
    ageGroup: 'creative',
    category: 'खगोल विज्ञान (Astronomy & Science)',
  },
]

export function getHindiWordsByAge(age?: AgeGroupId): HindiWordEntry[] {
  return HINDI_WORDS.filter(
    (word) => !containsBlockedWord(word.word, 'hindi') && (!age || word.ageGroup === age),
  )
}

export function findHindiWord(query: string): HindiWordEntry | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  return HINDI_WORDS.find(
    (w) =>
      w.word.toLowerCase() === q ||
      w.romanized.toLowerCase() === q ||
      w.englishMeaning.toLowerCase() === q
  )
}

export function getRandomHindiWord(age?: AgeGroupId, excludeWord?: string): HindiWordEntry {
  const pool = getHindiWordsByAge(age).filter(
    (w) => !excludeWord || w.word !== excludeWord
  )
  const list = pool.length > 0 ? pool : getHindiWordsByAge()
  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}
