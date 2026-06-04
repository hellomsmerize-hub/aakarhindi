import type { ExamPaper } from '@/lib/types'

export const examPapers: ExamPaper[] = [
  // ─── PSLE Paper ──────────────────────────────────────────────────────────
  {
    id: 'psle-2024-p2',
    title: '2024 PSLE Hindi B — Paper 2',
    title_hindi: '२०२४ पी.एस.एल.ई. हिंदी — पत्रिका २',
    track: 'psle',
    level: 'foundational',
    year: 2024,
    time_minutes: 100,
    total_marks: 80,
    pass_mark: 40,
    sections: [
      {
        id: 'psle-2024-s1',
        name: 'Booklet A — Section 1: Grammar',
        name_hindi: 'खंड अ — व्याकरण',
        instructions: 'Choose the correct answer (A, B, C or D) for each question.',
        marks: 10,
        questions: [
          {
            id: 'psle-2024-g1', type: 'mcq', module: 'grammar', topic: 'nouns', track: 'psle', level: 'foundational', difficulty: 'easy',
            question: 'निम्नलिखित में से कौन-सा शब्द स्त्रीलिंग है?',
            options: ['लड़का', 'घोड़ा', 'पुस्तक', 'बादल'],
            correct: 2,
            explanation: '"पुस्तक" स्त्रीलिंग है। लड़का, घोड़ा, बादल — ये पुल्लिंग हैं।',
            explanation_en: '"पुस्तक" (book) is feminine. The others — लड़का (boy), घोड़ा (horse), बादल (cloud) — are masculine.',
          },
          {
            id: 'psle-2024-g2', type: 'mcq', module: 'grammar', topic: 'verbs', track: 'psle', level: 'foundational', difficulty: 'easy',
            question: 'रिक्त स्थान भरिए: "सीता हर रोज़ स्कूल ___।"',
            options: ['जाती है', 'जाता है', 'जाते हैं', 'जाई'],
            correct: 0,
            explanation: 'सीता (स्त्रीलिंग, एकवचन) के लिए "जाती है" सही है।',
            explanation_en: 'Sita is feminine singular, so the verb must be "जाती है" (feminine singular present).',
          },
          {
            id: 'psle-2024-g3', type: 'mcq', module: 'grammar', topic: 'pronouns', track: 'psle', level: 'foundational', difficulty: 'easy',
            question: 'अध्यापक से बात करते समय कौन-सा सर्वनाम प्रयोग करना चाहिए?',
            options: ['तू', 'तुम', 'आप', 'वह'],
            correct: 2,
            explanation: 'अध्यापक बड़े और सम्मानीय हैं — इसलिए "आप" का प्रयोग उचित है।',
            explanation_en: '"आप" is the respectful form of "you" — always used with teachers, elders, and strangers.',
          },
          {
            id: 'psle-2024-g4', type: 'mcq', module: 'grammar', topic: 'adjectives', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: 'सही विशेषण चुनिए: "वह ___ लड़की है।"',
            options: ['अच्छा', 'अच्छी', 'अच्छे', 'अच्छों'],
            correct: 1,
            explanation: 'लड़की स्त्रीलिंग है — इसलिए स्त्रीलिंग विशेषण "अच्छी" प्रयोग होगा।',
            explanation_en: 'लड़की is feminine, so the adjective must take feminine form: अच्छी (not अच्छा which is masculine).',
          },
          {
            id: 'psle-2024-g5', type: 'mcq', module: 'grammar', topic: 'postpositions', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: 'सही परसर्ग चुनिए: "किताब मेज़ ___ रखी है।"',
            options: ['में', 'पर', 'को', 'से'],
            correct: 1,
            explanation: '"पर" का अर्थ है "on" — मेज़ की सतह पर। "में" = inside।',
            explanation_en: '"पर" means "on (a surface)". The book is ON the table, not inside it. "में" would mean inside.',
          },
          {
            id: 'psle-2024-g6', type: 'mcq', module: 'grammar', topic: 'nouns', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: '"राजा" का स्त्रीलिंग क्या है?',
            options: ['राजी', 'राजिनी', 'रानी', 'राजकुमारी'],
            correct: 2,
            explanation: '"राजा" का स्त्रीलिंग "रानी" है। यह एक अनियमित रूप है।',
            explanation_en: '"रानी" (queen) is the feminine counterpart of "राजा" (king). This is an irregular feminine form — must be memorised.',
          },
          {
            id: 'psle-2024-g7', type: 'mcq', module: 'grammar', topic: 'verbs', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: 'भूतकाल में बदलिए: "वह खेलता है।"',
            options: ['वह खेलता था', 'वह खेला था', 'वह खेलेगा', 'वह खेलता'],
            correct: 0,
            explanation: '"खेलता है" (present) → "खेलता था" (imperfect past — used to play).',
            explanation_en: '"खेलता है" (plays) → "खेलता था" (used to play). This is imperfect past (अपूर्ण भूतकाल).',
          },
          {
            id: 'psle-2024-g8', type: 'mcq', module: 'grammar', topic: 'synonyms', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: '"पानी" का पर्यायवाची शब्द कौन-सा है?',
            options: ['अग्नि', 'नभ', 'जल', 'पवन'],
            correct: 2,
            explanation: '"जल" "पानी" का पर्यायवाची है। अग्नि = fire, नभ = sky, पवन = wind.',
            explanation_en: '"जल" is a synonym for "पानी" (water). The others mean fire, sky, and wind respectively.',
          },
          {
            id: 'psle-2024-g9', type: 'mcq', module: 'grammar', topic: 'antonyms', track: 'psle', level: 'foundational', difficulty: 'easy',
            question: '"दिन" का विलोम शब्द क्या है?',
            options: ['शाम', 'सुबह', 'रात', 'दोपहर'],
            correct: 2,
            explanation: '"दिन" (day) का विलोम "रात" (night) है।',
            explanation_en: 'Antonym of "दिन" (day) is "रात" (night).',
          },
          {
            id: 'psle-2024-g10', type: 'mcq', module: 'grammar', topic: 'postpositions', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: 'सही वाक्य चुनिए:',
            options: [
              'राम ने स्कूल गया।',
              'राम स्कूल गया।',
              'राम को स्कूल गया।',
              'राम में स्कूल गया।',
            ],
            correct: 1,
            explanation: '"जाना" अकर्मक क्रिया है — इसलिए "ने" का प्रयोग नहीं होता। "राम स्कूल गया" सही है।',
            explanation_en: '"जाना" (to go) is an intransitive verb, so "ने" is NEVER used with it. "राम स्कूल गया" is correct.',
          },
        ],
      },
      {
        id: 'psle-2024-s2',
        name: 'Booklet A — Section 2: Cloze Passage',
        name_hindi: 'खंड अ — रिक्त स्थान',
        instructions: 'Read the passage and choose the best word (A, B, C or D) to fill each blank.',
        marks: 20,
        questions: [
          {
            id: 'psle-2024-cloze-1', type: 'mcq', module: 'comprehension', topic: 'cloze', track: 'psle', level: 'foundational', difficulty: 'easy',
            question: 'हमारा देश बहुत ___ है। (Passage blank 1)',
            options: ['बुरा', 'सुंदर', 'छोटा', 'बड़ा'],
            correct: 1,
            explanation: 'संदर्भ में "सुंदर" सबसे उचित शब्द है — देश की सुंदरता का वर्णन किया जा रहा है।',
            explanation_en: 'In context, "सुंदर" (beautiful) fits best — the passage is describing the country positively.',
          },
          {
            id: 'psle-2024-cloze-2', type: 'mcq', module: 'comprehension', topic: 'cloze', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: 'यहाँ के लोग बहुत ___ हैं। (Passage blank 2)',
            options: ['क्रोधी', 'मेहनती', 'आलसी', 'कमज़ोर'],
            correct: 1,
            explanation: '"मेहनती" (hardworking) सबसे उचित शब्द है — सकारात्मक विवरण के संदर्भ में।',
            explanation_en: '"मेहनती" (hardworking) fits — the passage describes people positively, so a positive adjective is needed.',
          },
        ],
      },
      {
        id: 'psle-2024-s3',
        name: 'Booklet B — Section 1: Idioms',
        name_hindi: 'खंड ब — मुहावरे',
        instructions: 'Fill in the blank with the correct meaning of the underlined idiom.',
        marks: 10,
        questions: [
          {
            id: 'psle-2024-idiom-1', type: 'fib', module: 'vocabulary', topic: 'idioms', track: 'psle', level: 'foundational', difficulty: 'medium',
            question: '"परीक्षा में नकल करते पकड़े जाने पर रोहन के <u>नाक में दम</u> हो गया।"\n\nइस वाक्य में "नाक में दम होना" मुहावरे का अर्थ है: बहुत ___।',
            correct: 'परेशान होना',
            explanation: '"नाक में दम होना" का अर्थ है — <b>बहुत परेशान होना / तंग होना</b>। रोहन नकल पकड़े जाने से बहुत परेशान हो गया।',
            explanation_en: '"नाक में दम होना" means to be in great trouble/distress. Rohit was caught cheating and was in deep trouble.',
          },
        ],
      },
    ],
  },

  // ─── O-Level Paper ────────────────────────────────────────────────────────
  {
    id: 'olevel-2024-p2',
    title: '2024 O-Level Hindi — Paper 2',
    title_hindi: '२०२४ ओ-लेवल हिंदी — पत्रिका २',
    track: 'olevel',
    level: 'foundational',
    year: 2024,
    time_minutes: 120,
    total_marks: 75,
    pass_mark: 38,
    sections: [
      {
        id: 'ol-2024-s1',
        name: 'Section A: Sandhi',
        name_hindi: 'खंड अ: संधि',
        instructions: 'Do the sandhi (join words) OR sandhi-vichchhed (split the word) as instructed.',
        marks: 10,
        questions: [
          {
            id: 'ol-2024-sandhi-1', type: 'obj', module: 'grammar', topic: 'sandhi', track: 'olevel', level: 'foundational', difficulty: 'easy',
            question: 'संधि करिए: <b>देव + इंद्र</b> = ?',
            correct: 'देवेंद्र',
            explanation: 'देव + इंद्र = <b>देवेंद्र</b> — "अ + इ = ए" (गुण संधि)।',
            explanation_en: 'देव + इंद्र = देवेंद्र — गुण संधि: अ + इ = ए.',
          },
          {
            id: 'ol-2024-sandhi-2', type: 'obj', module: 'grammar', topic: 'sandhi', track: 'olevel', level: 'foundational', difficulty: 'medium',
            question: 'संधि-विच्छेद करिए: <b>हिमाचल</b>',
            correct: 'हिम + अचल',
            explanation: 'हिमाचल = <b>हिम + अचल</b> — "अ + अ = आ" (दीर्घ संधि का विच्छेद)।',
            explanation_en: 'हिमाचल = हिम + अचल — दीर्घ संधि reversal: आ splits into अ + अ.',
          },
        ],
      },
      {
        id: 'ol-2024-s2',
        name: 'Section B: Idioms & Proverbs',
        name_hindi: 'खंड ब: मुहावरे और लोकोक्तियाँ',
        instructions: 'Choose the correct meaning for each idiom or proverb.',
        marks: 10,
        questions: [
          {
            id: 'ol-2024-idiom-1', type: 'mcq', module: 'vocabulary', topic: 'idioms', track: 'olevel', level: 'foundational', difficulty: 'medium',
            question: '"अंगूठा दिखाना" मुहावरे का क्या अर्थ है?',
            options: ['मदद करना', 'मना कर देना', 'इशारा करना', 'स्वागत करना'],
            correct: 1,
            explanation: '"अंगूठा दिखाना" = साफ़ मना कर देना (to refuse flatly)।',
            explanation_en: '"अंगूठा दिखाना" means to flatly refuse/deny.',
          },
          {
            id: 'ol-2024-proverb-1', type: 'mcq', module: 'vocabulary', topic: 'proverbs', track: 'olevel', level: 'foundational', difficulty: 'medium',
            question: '"जो गरजते हैं वो बरसते नहीं" — इस लोकोक्ति का अर्थ है:',
            options: [
              'बादल गरजते हैं',
              'जो अधिक बोलते हैं वे काम कम करते हैं',
              'वर्षा होगी',
              'शोर करने वाले खतरनाक हैं',
            ],
            correct: 1,
            explanation: '"जो गरजते हैं वो बरसते नहीं" = अधिक बोलने वाले कम काम करते हैं (Barking dogs seldom bite)।',
            explanation_en: '"Those who thunder don\'t rain" = Those who make noise/threats seldom act. Like "Barking dogs seldom bite."',
          },
        ],
      },
      {
        id: 'ol-2024-s3',
        name: 'Section C: Sentence Transformation',
        name_hindi: 'खंड स: वाक्य परिवर्तन',
        instructions: 'Transform each sentence as directed.',
        marks: 15,
        questions: [
          {
            id: 'ol-2024-transform-1', type: 'mcq', module: 'grammar', topic: 'sentence-transformation', track: 'olevel', level: 'foundational', difficulty: 'medium',
            question: 'कर्मवाच्य में बदलिए: "राम ने किताब पढ़ी।"',
            options: [
              'राम से किताब पढ़ी गई।',
              'राम द्वारा किताब पढ़ी गई।',
              'किताब राम को पढ़ी गई।',
              'राम ने किताब पढ़वाई।',
            ],
            correct: 1,
            explanation: 'कर्तृवाच्य → कर्मवाच्य: <b>राम द्वारा किताब पढ़ी गई।</b>\nराम ने → राम द्वारा; पढ़ी → पढ़ी गई।',
            explanation_en: 'Active → Passive: "Ram read the book" → "The book was read by Ram." राम ने → राम द्वारा; पढ़ी → पढ़ी गई.',
          },
        ],
      },
      {
        id: 'ol-2024-s4',
        name: 'Section D: Comprehension',
        name_hindi: 'खंड द: गद्यांश बोध',
        instructions: 'Read the passage and answer all questions.',
        marks: 25,
        questions: [
          {
            id: 'ol-2024-comp-1', type: 'mcq', module: 'comprehension', topic: 'factual', track: 'olevel', level: 'foundational', difficulty: 'medium',
            question: 'गद्यांश के अनुसार, पर्यावरण प्रदूषण का मुख्य कारण क्या है?',
            options: ['प्राकृतिक आपदाएँ', 'मानवीय गतिविधियाँ', 'जलवायु परिवर्तन', 'भूकंप'],
            correct: 1,
            explanation: 'गद्यांश में बताया गया है कि पर्यावरण प्रदूषण का मुख्य कारण <b>मानवीय गतिविधियाँ</b> हैं — कारखाने, वाहन, वनों की कटाई।',
            explanation_en: 'The passage states that human activities (factories, vehicles, deforestation) are the main cause of environmental pollution.',
          },
          {
            id: 'ol-2024-comp-oe', type: 'oe', module: 'comprehension', topic: 'factual', track: 'olevel', level: 'foundational', difficulty: 'hard',
            question: 'गद्यांश के आधार पर पर्यावरण बचाने के तीन उपाय अपने शब्दों में लिखिए।',
            model_answer: 'पर्यावरण बचाने के उपाय:\n(१) पेड़-पौधे लगाने चाहिए और वनों की कटाई रोकनी चाहिए।\n(२) वाहनों का उपयोग कम करके सार्वजनिक परिवहन का प्रयोग करना चाहिए।\n(३) कारखानों में प्रदूषण नियंत्रण के उपाय अपनाने चाहिए।',
            explanation: 'उत्तर में तीन अलग उपाय, पूर्ण वाक्यों में और गद्यांश के आधार पर होने चाहिए।',
            explanation_en: 'Three separate solutions from the passage, written in complete Hindi sentences in your own words.',
          },
        ],
      },
    ],
  },
]

// Helper: get paper by ID
export function getExamPaper(id: string): ExamPaper | undefined {
  return examPapers.find((p) => p.id === id)
}

// Helper: get papers by track
export function getExamPapersByTrack(track: 'psle' | 'olevel'): ExamPaper[] {
  return examPapers.filter((p) => p.track === track)
}
