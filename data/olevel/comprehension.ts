import type { Question } from '@/lib/types'

export const olevel_comprehension: Question[] = [
  // ─── Passage 1: पर्यावरण प्रदूषण (Environmental Pollution) ─────────────
  {
    id: 'ol-comp-env-mcq-001',
    type: 'mcq',
    module: 'comprehension',
    topic: 'factual',
    track: 'olevel',
    level: 'foundational',
    difficulty: 'easy',
    passage_id: 'ol-comp-environment',
    question: 'गद्यांश के अनुसार, आज के समय में सबसे बड़ी समस्या क्या है?',
    options: ['बेरोज़गारी', 'पर्यावरण प्रदूषण', 'महँगाई', 'शिक्षा की कमी'],
    correct: 1,
    explanation: 'गद्यांश में स्पष्ट रूप से कहा गया है कि <b>पर्यावरण प्रदूषण</b> आज के समय की सबसे गंभीर समस्या है। यह विश्वभर में मानव जीवन को खतरे में डाल रहा है।',
    explanation_en: 'The passage clearly identifies environmental pollution as the most serious problem of today, threatening human life worldwide.',
  },
  {
    id: 'ol-comp-env-mcq-002',
    type: 'mcq',
    module: 'comprehension',
    topic: 'factual',
    track: 'olevel',
    level: 'foundational',
    difficulty: 'medium',
    passage_id: 'ol-comp-environment',
    question: 'वायु प्रदूषण के प्रमुख कारण क्या हैं? गद्यांश के आधार पर बताइए:',
    options: [
      'केवल कारखाने',
      'वाहनों का धुआँ, कारखानों से निकलने वाले रसायन और पेड़ों की कटाई',
      'केवल पेड़ों की कटाई',
      'केवल बढ़ती जनसंख्या',
    ],
    correct: 1,
    explanation: 'गद्यांश में वायु प्रदूषण के तीन मुख्य कारण बताए गए हैं:\n(1) वाहनों का धुआँ\n(2) कारखानों से निकलने वाले रसायन\n(3) पेड़ों की अंधाधुंध कटाई',
    explanation_en: 'The passage mentions three main causes of air pollution: vehicle smoke, industrial chemicals, and indiscriminate deforestation.',
  },
  {
    id: 'ol-comp-env-mcq-003',
    type: 'mcq',
    module: 'comprehension',
    topic: 'inference',
    track: 'olevel',
    level: 'foundational',
    difficulty: 'medium',
    passage_id: 'ol-comp-environment',
    question: 'लेखक का मुख्य उद्देश्य क्या है?',
    options: [
      'प्रदूषण की तस्वीर दिखाना',
      'लोगों को पर्यावरण संरक्षण के लिए प्रेरित करना',
      'सरकार की आलोचना करना',
      'प्रदूषण के इतिहास का वर्णन करना',
    ],
    correct: 1,
    explanation: 'गद्यांश में लेखक समस्या बताकर उसके समाधान भी सुझाता है। इससे स्पष्ट होता है कि उसका उद्देश्य <b>पाठकों को पर्यावरण बचाने के लिए प्रेरित करना</b> है।',
    explanation_en: 'The author describes the problem and then suggests solutions, indicating the main purpose is to motivate readers to protect the environment.',
  },
  {
    id: 'ol-comp-env-mcq-004',
    type: 'mcq',
    module: 'comprehension',
    topic: 'inference',
    track: 'olevel',
    level: 'foundational',
    difficulty: 'hard',
    passage_id: 'ol-comp-environment',
    question: '"यदि हमने समय रहते नहीं सोचा तो आने वाली पीढ़ियाँ हमें माफ़ नहीं करेंगी" — इस वाक्य का क्या निहितार्थ है?',
    options: [
      'भावी पीढ़ी हमसे ज़्यादा होशियार होगी',
      'पर्यावरण की समस्या अभी भी सुधारी जा सकती है, पर देर नहीं करनी चाहिए',
      'हमें पर्यावरण की चिंता नहीं करनी चाहिए',
      'भावी पीढ़ी स्वयं समस्या हल कर लेगी',
    ],
    correct: 1,
    explanation: 'यह वाक्य एक चेतावनी है — <b>अभी कार्रवाई करना ज़रूरी है वरना भविष्य में सुधार असंभव हो जाएगा</b>। "समय रहते" = before it is too late। यह urgency का भाव है।',
    explanation_en: 'This sentence is a warning that action must be taken NOW — if we delay, future generations will suffer and blame us. It conveys urgency: act before it\'s too late.',
  },
  {
    id: 'ol-comp-env-mcq-005',
    type: 'mcq',
    module: 'comprehension',
    topic: 'vocabulary',
    track: 'olevel',
    level: 'foundational',
    difficulty: 'medium',
    passage_id: 'ol-comp-environment',
    question: 'गद्यांश में "अंधाधुंध" शब्द का प्रयोग किस संदर्भ में हुआ है और इसका क्या अर्थ है?',
    options: [
      'अंधकार में; meaning: in darkness',
      'पेड़ों की कटाई के संदर्भ में; meaning: indiscriminate/without thought',
      'प्रदूषण फैलाने में; meaning: rapidly',
      'कारखानों के लिए; meaning: large-scale',
    ],
    correct: 1,
    explanation: '"अंधाधुंध कटाई" = <b>बिना सोचे-समझे, बेलगाम कटाई</b> (indiscriminate cutting)। "अंधाधुंध" का अर्थ है — बिना विचार किए, हर तरफ से। यह पेड़ों की बेरहम कटाई के संदर्भ में प्रयुक्त है।',
    explanation_en: '"अंधाधुंध कटाई" = indiscriminate/reckless cutting (of trees). अंधाधुंध means without thought or restraint — used to describe the excessive and thoughtless deforestation.',
  },

  // ─── OE Questions ─────────────────────────────────────────────────────────
  {
    id: 'ol-comp-env-oe-001',
    type: 'oe',
    module: 'comprehension',
    topic: 'factual',
    track: 'olevel',
    level: 'foundational',
    difficulty: 'medium',
    passage_id: 'ol-comp-environment',
    question: 'गद्यांश में पर्यावरण प्रदूषण के क्या-क्या परिणाम बताए गए हैं? किन्हीं तीन परिणामों का उल्लेख करिए।',
    model_answer: 'गद्यांश में पर्यावरण प्रदूषण के निम्नलिखित परिणाम बताए गए हैं:\n(१) वायु प्रदूषण से साँस की बीमारियाँ बढ़ रही हैं।\n(२) जल प्रदूषण से पीने के पानी की कमी हो रही है।\n(३) जलवायु परिवर्तन से प्राकृतिक आपदाएँ बढ़ रही हैं।',
    explanation: 'उत्तर में तीन अलग-अलग परिणाम होने चाहिए। प्रत्येक परिणाम एक वाक्य में और गद्यांश के शब्दों का उपयोग करते हुए लिखें।',
    explanation_en: 'Answer should include THREE consequences from the passage. Write in complete Hindi sentences using vocabulary from the passage.',
  },
  {
    id: 'ol-comp-env-oe-002',
    type: 'oe',
    module: 'comprehension',
    topic: 'inference',
    track: 'olevel',
    level: 'advanced',
    difficulty: 'hard',
    passage_id: 'ol-comp-environment',
    question: 'गद्यांश के आधार पर बताइए — पर्यावरण बचाने की ज़िम्मेदारी किसकी है और क्यों?',
    model_answer: 'पर्यावरण बचाने की ज़िम्मेदारी सबकी है — सरकार की, उद्योगों की और प्रत्येक नागरिक की। गद्यांश के अनुसार प्रदूषण हर कोई फैलाता है इसलिए हर किसी को इसे रोकने में भाग लेना होगा। व्यक्तिगत स्तर पर भी छोटे-छोटे कदम उठाने से बड़ा फ़र्क पड़ता है।',
    explanation: 'इस प्रश्न में "निष्कर्ष/निहितार्थ" पूछा है — गद्यांश में स्पष्ट न कहा हो तो भी संदेश से समझकर उत्तर दें।',
    explanation_en: 'This is an inference question. The answer should draw a logical conclusion from the passage — that environmental responsibility belongs to everyone, not just the government.',
  },

  // ─── Passage 2: ─────────────────────────────────────────────────────────
  {
    id: 'ol-comp-tech-mcq-001',
    type: 'mcq',
    module: 'comprehension',
    topic: 'factual',
    track: 'olevel',
    level: 'advanced',
    difficulty: 'medium',
    passage_id: 'ol-comp-technology',
    question: 'गद्यांश के अनुसार, इंटरनेट ने शिक्षा को किस प्रकार प्रभावित किया है?',
    options: [
      'इंटरनेट ने शिक्षा को नुकसान पहुँचाया है',
      'इंटरनेट ने शिक्षा को अधिक सुलभ और विस्तृत बनाया है',
      'इंटरनेट का शिक्षा पर कोई प्रभाव नहीं है',
      'इंटरनेट केवल मनोरंजन के लिए है',
    ],
    correct: 1,
    explanation: 'गद्यांश में बताया गया है कि इंटरनेट ने ऑनलाइन शिक्षा को संभव बनाया है, जिससे दुनिया के किसी भी कोने में बैठकर पढ़ाई हो सकती है। शिक्षा अब अधिक <b>सुलभ और व्यापक</b> हो गई है।',
    explanation_en: 'The passage states that the internet has made education more accessible and widespread through online learning, allowing study from anywhere in the world.',
  },
]

// Passages for O-Level comprehension
export const olevel_passages: Record<string, { title: string; title_hi: string; text: string }> = {
  'ol-comp-environment': {
    title: 'Environmental Pollution — A Global Crisis',
    title_hi: 'पर्यावरण प्रदूषण — एक वैश्विक संकट',
    text: `आज विश्व के सामने अनेक समस्याएँ हैं, परंतु पर्यावरण प्रदूषण सबसे गंभीर समस्याओं में से एक है। यह समस्या केवल किसी एक देश की नहीं, बल्कि पूरे विश्व की है।

वायु प्रदूषण के मुख्य कारण हैं — वाहनों का धुआँ, कारखानों से निकलने वाले विषैले रसायन और पेड़ों की अंधाधुंध कटाई। इस प्रदूषण के कारण साँस की बीमारियाँ, फेफड़ों के रोग और अनेक गंभीर बीमारियाँ बढ़ रही हैं। जल प्रदूषण के कारण पीने का स्वच्छ पानी मिलना मुश्किल होता जा रहा है।

जलवायु परिवर्तन पर्यावरण प्रदूषण का ही परिणाम है। ग्लेशियर पिघल रहे हैं, समुद्र का जलस्तर बढ़ रहा है और प्राकृतिक आपदाएँ तेज़ होती जा रही हैं।

हम सबकी यह ज़िम्मेदारी है कि हम पर्यावरण को बचाएँ। पेड़ लगाएँ, वाहनों का उपयोग कम करें, बिजली और पानी बचाएँ। यदि हमने समय रहते नहीं सोचा तो आने वाली पीढ़ियाँ हमें माफ़ नहीं करेंगी। "पृथ्वी बचाओ" केवल एक नारा नहीं, यह एक संकल्प होना चाहिए।`,
  },
  'ol-comp-technology': {
    title: 'Technology — A Double-Edged Sword',
    title_hi: 'प्रौद्योगिकी — दोधारी तलवार',
    text: `विज्ञान और प्रौद्योगिकी ने मानव जीवन को बदल कर रख दिया है। इंटरनेट के आगमन से सूचना और शिक्षा का क्षेत्र पूरी तरह बदल गया है। अब दुनिया के किसी भी कोने में बैठकर शिक्षा प्राप्त की जा सकती है। ऑनलाइन पाठ्यक्रम, ई-पुस्तकें और वीडियो व्याख्यान शिक्षा को सुलभ और सस्ती बना रहे हैं।

चिकित्सा के क्षेत्र में भी तकनीक ने चमत्कार किए हैं। रोबोटिक सर्जरी, टेलीमेडिसिन और कृत्रिम बुद्धिमत्ता से रोगों का निदान आसान हो गया है।

परंतु तकनीक के नकारात्मक पहलू भी हैं। सोशल मीडिया पर समय बर्बाद करना, साइबर अपराध और गोपनीयता का खतरा — ये सब चिंताजनक हैं। विशेषकर युवा पीढ़ी मोबाइल की लत का शिकार हो रही है।

इसलिए आवश्यक है कि हम तकनीक का संतुलित और विवेकपूर्ण उपयोग करें। तकनीक हमारी दासी होनी चाहिए, स्वामी नहीं।`,
  },
}
