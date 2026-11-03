import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { BengaliWordEntry } from './bengaliTypes.ts'

export const BENGALI_WORDS: BengaliWordEntry[] = [
  // Little Explorers (Ages 2-5)
  {
    word: 'সূর্য',
    romanized: 'Shurjo',
    englishMeaning: 'Sun',
    bengaliDefinition: 'দিনের বেলায় আকাশে আলো ও উত্তাপ প্রদানকারী উজ্জ্বল নক্ষত্র।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'রবি', romanized: 'Robi' },
      { word: 'ভানু', romanized: 'Bhanu' },
      { word: 'দিবাকর', romanized: 'Dibakor' },
    ],
    antonyms: [{ word: 'চাঁদ', romanized: 'Chaand' }],
    exampleSentence: {
      bengali: 'সকালবেলা পূর্ব আকাশে লাল সূর্য ওঠে।',
      romanized: 'Sokalbela purbo akashe lal shurjo othe.',
      english: 'In the morning, the red sun rises in the eastern sky.',
    },
    originOrContext: 'সংস্কৃত "সূর্য" শব্দ থেকে উদ্ভূত।',
    funFact: 'সূর্য পৃথিবী থেকে প্রায় ১৫ কোটি কিলোমিটার দূরে অবস্থিত!',
    ageGroup: 'explorers',
    category: 'প্রকৃতি ও আকাশ (Nature & Sky)',
  },
  {
    word: 'প্রজাপতি',
    romanized: 'Projapoti',
    englishMeaning: 'Butterfly',
    bengaliDefinition: 'রঙিন ও চিত্রবিচিত্র ডানাবিশিষ্ট সুন্দর একটি নধর পতঙ্গ।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'রঙিন পতঙ্গ', romanized: 'Rongin potongo' },
    ],
    exampleSentence: {
      bengali: 'বাগানের ফুলে ফুলে সুন্দর প্রজাপতি উড়ে বেড়াচ্ছে।',
      romanized: 'Baganer phule phule sundor projapoti ure berachhe.',
      english: 'The beautiful butterfly is fluttering among the garden flowers.',
    },
    funFact: 'প্রজাপতিরা তাদের পায়ের পাতা দিয়ে যেকোনো কিছুর স্বাদ গ্রহণ করে!',
    ageGroup: 'explorers',
    category: 'পশুপাখি ও কীটপতঙ্গ (Insects & Animals)',
  },
  {
    word: 'রংধনু',
    romanized: 'Rongdhonu',
    englishMeaning: 'Rainbow',
    bengaliDefinition: 'বৃষ্টির পর আকাশে সূর্যের আলো প্রতিফলিত হয়ে গঠিত সাত রঙের ধনুকাকার বর্ণচ্ছত্র।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'রামধনু', romanized: 'Ramdhonu' },
      { word: 'মেঘধনু', romanized: 'Meghdhonu' },
    ],
    exampleSentence: {
      bengali: 'বৃষ্টি থামার পর আকাশে সাতরঙা চমৎকার একটি রংধনু দেখা গেল।',
      romanized: 'Brishti thamar por akashe satronga chomokkar ekti rongdhonu dekha gelo.',
      english: 'After the rain stopped, a wonderful seven-colored rainbow appeared in the sky.',
    },
    funFact: 'রংধনুর সাতটি রং হলো: বেগুনি, নীল, আকাশি, সবুজ, হলুদ, কমলা ও লাল (বেনীআসহকলা)!',
    ageGroup: 'explorers',
    category: 'প্রকৃতি ও রং (Nature & Colors)',
  },
  {
    word: 'বন্ধু',
    romanized: 'Bondhu',
    englishMeaning: 'Friend',
    bengaliDefinition: 'যে সহচর আমাদের ভালোবাসে, একসাথে খেলে এবং বিপদে পাশে দাঁড়ায়।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'মিত্র', romanized: 'Mitro' },
      { word: 'সখা', romanized: 'Sokha' },
      { word: 'সাথী', romanized: 'Sathi' },
    ],
    antonyms: [{ word: 'শত্রু', romanized: 'Shotru' }],
    exampleSentence: {
      bengali: 'অপু আর দুর্গা প্রতিদিন বিকেলে একসাথে মাঠে বন্ধুদের সাথে খেলা করে।',
      romanized: 'Apu aar Durga protidin bikele ekshathe mathe bondhuder sathe khela kore.',
      english: 'Apu and Durga play together in the field with friends every afternoon.',
    },
    ageGroup: 'explorers',
    category: 'সম্পর্ক ও অনুভূতি (Relationships)',
  },
  {
    word: 'হাসি',
    romanized: 'Hashi',
    englishMeaning: 'Smile / Laughter',
    bengaliDefinition: 'আনন্দ বা খুশির প্রকাশ হিসেবে মুখে ফুটে ওঠা মিষ্টি অভিব্যক্তি।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'আনন্দ', romanized: 'Anondo' },
      { word: 'মুচকি হাসি', romanized: 'Muchki hashi' },
    ],
    antonyms: [{ word: 'কান্না', romanized: 'Kanna' }],
    exampleSentence: {
      bengali: 'ছোট্ট শিশুর মিষ্টি হাসি সবার মন ভালো করে দেয়।',
      romanized: 'Chhotto shishur mishti hashi sobar mon bhalo kore dey.',
      english: 'The sweet smile of the little baby brightens everyone\'s mood.',
    },
    ageGroup: 'explorers',
    category: 'অনুভূতি ও প্রকাশ (Feelings)',
  },

  // Curious Minds (Ages 5-9)
  {
    word: 'সাহস',
    romanized: 'Sahosh',
    englishMeaning: 'Courage / Bravery',
    bengaliDefinition: 'ভয় বা বিপদের মুখে পিছপা না হয়ে দৃঢ়চিত্তে এগিয়ে যাওয়ার মানসিক শক্তি।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'বীরত্ব', romanized: 'Birotto' },
      { word: 'নির্ভীকতা', romanized: 'Nirbheekota' },
      { word: 'হিম্মত', romanized: 'Himmot' },
    ],
    antonyms: [
      { word: 'ভয়', romanized: 'Bhoy' },
      { word: 'কাপুরুষতা', romanized: 'Kapurushota' },
    ],
    exampleSentence: {
      bengali: 'নিলয় অনেক সাহস দেখিয়ে নদীর ঢেউ থেকে বলটি উদ্ধার করল।',
      romanized: 'Niloy onek sahosh dekhiye nodir dheu theke bolti uddhar korlo.',
      english: 'Niloy showed great courage and retrieved the ball from the river waves.',
    },
    originOrContext: 'সংস্কৃত মূল শব্দ "সাহস"।',
    funFact: 'সাহস মানে ভয়ের অনুপস্থিতি নয়, বরং ভয়কে জয় করে এগিয়ে চলা!',
    ageGroup: 'curious',
    category: 'গুণাবলি ও চরিত্র (Values & Character)',
  },
  {
    word: 'কৌতূহল',
    romanized: 'Koutuhol',
    englishMeaning: 'Curiosity / Inquisitiveness',
    bengaliDefinition: 'নতুন কিছু জানা বা শেখার তীব্র ইচ্ছা ও আগ্রহ।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'আগ্রহ', romanized: 'Agroho' },
      { word: 'জানার ইচ্ছা', romanized: 'Janar ichha' },
    ],
    antonyms: [{ word: 'উদাসীনতা', romanized: 'Udasheenota' }],
    exampleSentence: {
      bengali: 'মহাকাশ ও তারা সম্পর্কে জানার জন্য শিশুদের মধ্যে প্রবল কৌতূহল দেখা যায়।',
      romanized: 'Mohakash o tara shomporke janar jonno shishuder moddhe probol koutuhol dekha jaay.',
      english: 'Children show immense curiosity to learn about space and stars.',
    },
    ageGroup: 'curious',
    category: 'মন ও জিজ্ঞাসা (Mind & Learning)',
  },
  {
    word: 'সুগন্ধ',
    romanized: 'Shugondho',
    englishMeaning: 'Sweet Fragrance / Aroma',
    bengaliDefinition: 'মন মাতানো সুন্দর ও মিষ্টি ঘ্রাণ।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'সৌরভ', romanized: 'Shourobh' },
      { word: 'খুশবু', romanized: 'Khushbu' },
      { word: 'মহক', romanized: 'Mohok' },
    ],
    antonyms: [{ word: 'দুর্গন্ধ', romanized: 'Durgondho' }],
    exampleSentence: {
      bengali: 'সন্ধ্যাবেলায় সাদা বেলি ফুলের সুগন্ধে পুরো বাগানটি ভরে উঠেছে।',
      romanized: 'Shondhyabelay shada beli phuler shugondhe puro baganti bhore uthechhe.',
      english: 'In the evening, the sweet fragrance of white jasmine filled the entire garden.',
    },
    ageGroup: 'curious',
    category: 'প্রকৃতি ও অনুভূতি (Nature & Sensory)',
  },
  {
    word: 'উজ্জ্বল',
    romanized: 'Ujjwal',
    englishMeaning: 'Bright / Luminous / Radiant',
    bengaliDefinition: 'যা অত্যন্ত আলো ছড়ায় বা দীপ্তিময়।',
    partOfSpeech: 'বিশেষণ (Adjective)',
    synonyms: [
      { word: 'দীপ্তিময়', romanized: 'Deeptimoy' },
      { word: 'চকচকে', romanized: 'Chokchoke' },
      { word: 'আলোকিত', romanized: 'Alokito' },
    ],
    antonyms: [{ word: 'অন্ধকার', romanized: 'Ondhokar' }],
    exampleSentence: {
      bengali: 'পূর্ণিমার রাতে চাঁদের উজ্জ্বল আলো চারপাশকে আলোকিত করে তোলে।',
      romanized: 'Purnimar raate chaander ujjwal alo charpashke alokito kore tole.',
      english: 'On a full moon night, the bright moonlight illuminates the surroundings.',
    },
    ageGroup: 'curious',
    category: 'বিশেষণ ও সৌন্দর্য (Adjectives & Qualities)',
  },

  // Creative Minds (Ages 10-12)
  {
    word: 'পরিশ্রম',
    romanized: 'Porishrom',
    englishMeaning: 'Hard Work / Diligence',
    bengaliDefinition: 'কোনো লক্ষ্য অর্জনের জন্য একনিষ্ঠভাবে কায়িক বা মানসিক শ্রম দেওয়া।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'মেহনত', romanized: 'Mehnot' },
      { word: 'উদ্যোগ', romanized: 'Uddyog' },
      { word: 'সাধনা', romanized: 'Sadhona' },
    ],
    antonyms: [{ word: 'অলসতা', romanized: 'Oloshota' }],
    exampleSentence: {
      bengali: 'কঠোর পরিশ্রম ও নিষ্ঠার বলেই বিজ্ঞানী জগদীশচন্দ্র বসু বিজ্ঞানের জগতে অমর হয়ে আছেন।',
      romanized: 'Kothor porishrom o nishthar bolei bigyani Jagadish Chandra Bose bigyaner jogote omor hoye achhen.',
      english: 'Through hard work and dedication, scientist Jagadish Chandra Bose remains immortal in science.',
    },
    funFact: '"পরিশ্রম সাফল্যের চাবিকাঠি" — নিয়মিত চর্চা মানুষকে দক্ষ ও সফল করে তোলে!',
    ageGroup: 'creative',
    category: 'সফলতা ও নীতিবোধ (Values & Growth)',
  },
  {
    word: 'মহাবিশ্ব',
    romanized: 'Moha-bishwo',
    englishMeaning: 'Universe / Cosmos',
    bengaliDefinition: 'অগণিত গ্যালাক্সি, নক্ষত্র, গ্রহ এবং অনন্ত মহাশূন্যের সমন্বিত রূপ।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'ব্রহ্মাণ্ড', romanized: 'Brohmando' },
      { word: 'বিশ্বজগৎ', romanized: 'Bishwojogot' },
    ],
    exampleSentence: {
      bengali: 'জ্যোতির্বিজ্ঞানীরা মহাশূন্যের দূরবীক্ষণ যন্ত্র দিয়ে অসীম মহাবিশ্বের অজানা রহস্য অনুসন্ধান করেন।',
      romanized: 'Jyotirbigyanira mohashunyer doorbeekkhon jontro diye oshim moha-bishwer ojana rohoshyo onushondhan koren.',
      english: 'Astronomers use space telescopes to explore the unknown mysteries of the vast universe.',
    },
    funFact: 'মহাবিশ্বের কোটি কোটি তারামণ্ডলের মধ্যে আমাদের সৌরজগত একটি ছোট্ট অংশ!',
    ageGroup: 'creative',
    category: 'মহাকাশ ও বিজ্ঞান (Astronomy & Science)',
  },
  {
    word: 'ঐক্য',
    romanized: 'Oikyo',
    englishMeaning: 'Unity / Harmony',
    bengaliDefinition: 'একত্রিত হওয়ার ভাব বা পরস্পর সম্প্রীতি বজায় রেখে একসাথে থাকা।',
    partOfSpeech: 'বিশেষ্য (Noun)',
    synonyms: [
      { word: 'একতা', romanized: 'Ekota' },
      { word: 'মিলন', romanized: 'Milon' },
      { word: 'সম্প্রীতি', romanized: 'Shompreeti' },
    ],
    antonyms: [{ word: 'অনৈক্য', romanized: 'Onoikyo' }],
    exampleSentence: {
      bengali: 'দলের সবার মধ্যে ঐক্য থাকলে যেকোনো কঠিন খেলায় জয়লাভ করা সম্ভব।',
      romanized: 'Doler sobar moddhe oikyo thakle jekono kothin khelay joylabh kora shombhob.',
      english: 'When there is unity among team members, victory is possible in any difficult game.',
    },
    funFact: '"দশে মিলি করি কাজ, হারি জিতি নাহি লাজ" — এই প্রবাদটি একতার শক্তিকে নির্দেশ করে!',
    ageGroup: 'creative',
    category: 'নীতি ও প্রজ্ঞা (Wisdom & Ethics)',
  },
]

export function getBengaliWordsByAge(age?: AgeGroupId): BengaliWordEntry[] {
  if (!age) return BENGALI_WORDS
  return BENGALI_WORDS.filter((w) => w.ageGroup === age)
}

export function findBengaliWord(query: string): BengaliWordEntry | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  return BENGALI_WORDS.find(
    (w) =>
      w.word.toLowerCase() === q ||
      w.romanized.toLowerCase() === q ||
      w.englishMeaning.toLowerCase() === q
  )
}

export function getRandomBengaliWord(age?: AgeGroupId, excludeWord?: string): BengaliWordEntry {
  const pool = getBengaliWordsByAge(age).filter((w) => !excludeWord || w.word !== excludeWord)
  const list = pool.length > 0 ? pool : BENGALI_WORDS
  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}
