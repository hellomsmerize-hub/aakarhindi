export interface WritingTopic {
  id: string
  type: 'narrative' | 'descriptive' | 'picture'
  title: string
  title_hindi: string
  hints: string[]
  time_minutes: number
  word_count: string
  track: 'psle' | 'olevel'
}

export interface WritingLesson {
  id: string
  title: string
  title_hindi: string
  track: 'psle' | 'olevel'
  content: {
    type: 'text' | 'example' | 'list' | 'tip' | 'rule'
    heading?: string
    content: string
    note?: string
  }[]
}

export const psleWritingTopics: WritingTopic[] = [
  // ─── NARRATIVE ESSAYS (कथात्मक निबंध) ──────────────────────────────────

  {
    id: 'psle-writing-narrative-001',
    type: 'narrative',
    title: 'The Day I Got Lost',
    title_hindi: 'वह दिन जब मैं खो गया/गई',
    hints: [
      'कब और कहाँ गए थे — परिचय दें',
      'भीड़ में कैसे खो गए — घटना बताएँ',
      'खोने पर कैसा लगा — भावनाएँ व्यक्त करें',
      'किसने मदद की — पात्र का परिचय दें',
      'क्या सीखा — अंत में संदेश दें',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-narrative-002',
    type: 'narrative',
    title: 'A Visit to a Fair',
    title_hindi: 'मेले की सैर',
    hints: [
      'कौन सा मेला था और कब गए — प्रस्तावना',
      'मेले में क्या-क्या देखा — विवरण दें',
      'सबसे अच्छी बात क्या लगी — अपनी राय बताएँ',
      'परिवार के साथ क्या किया — परिवार का उल्लेख',
      'मेले से क्या यादें लेकर आए — समापन',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-narrative-003',
    type: 'narrative',
    title: 'A Rainy Day',
    title_hindi: 'एक वर्षा का दिन',
    hints: [
      'अचानक बारिश कब और कहाँ शुरू हुई',
      'आसपास के माहौल का वर्णन करें',
      'बारिश में क्या किया — घर के अंदर या बाहर',
      'कैसा महसूस हुआ — भावनाएँ लिखें',
      'बारिश के बाद का दृश्य कैसा था',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-narrative-004',
    type: 'narrative',
    title: 'My Best Birthday Memory',
    title_hindi: 'मेरी सबसे यादगार जन्मदिन की पार्टी',
    hints: [
      'किस जन्मदिन की बात है — परिचय',
      'तैयारियाँ कैसे की गईं',
      'कौन-कौन आए और क्या हुआ',
      'सबसे खास पल कौन सा था',
      'इस जन्मदिन को क्यों याद रखेंगे',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-narrative-005',
    type: 'narrative',
    title: 'An Act of Kindness I Witnessed',
    title_hindi: 'एक दयालुता का कार्य जो मैंने देखा',
    hints: [
      'कहाँ और कब देखा — परिस्थिति बताएँ',
      'किसने किस पर दयालुता दिखाई',
      'उस समय आपकी क्या प्रतिक्रिया थी',
      'उस कार्य का क्या प्रभाव हुआ',
      'आपने इससे क्या सीखा',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },

  // ─── DESCRIPTIVE ESSAYS (वर्णनात्मक निबंध) ──────────────────────────────

  {
    id: 'psle-writing-descriptive-001',
    type: 'descriptive',
    title: 'My School',
    title_hindi: 'मेरा विद्यालय',
    hints: [
      'विद्यालय का नाम और स्थान — परिचय',
      'भवन का वर्णन — कक्षाएँ, खेल का मैदान, पुस्तकालय',
      'शिक्षक और सहपाठियों का वर्णन',
      'विद्यालय की विशेष गतिविधियाँ',
      'विद्यालय आपको क्यों प्रिय है',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-descriptive-002',
    type: 'descriptive',
    title: 'My Favourite Festival',
    title_hindi: 'मेरा प्रिय त्योहार',
    hints: [
      'कौन सा त्योहार है और क्यों प्रिय है',
      'त्योहार कैसे और कब मनाया जाता है',
      'घर में त्योहार की तैयारियाँ',
      'त्योहार के दिन क्या-क्या होता है',
      'त्योहार का क्या महत्त्व है',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-descriptive-003',
    type: 'descriptive',
    title: 'My Favourite Animal',
    title_hindi: 'मेरा प्रिय पशु',
    hints: [
      'कौन सा पशु है और उसे क्यों पसंद करते हैं',
      'उस पशु का बाहरी वर्णन — रंग, आकार',
      'उसकी विशेषताएँ और आदतें',
      'वह पशु कहाँ रहता है',
      'मनुष्यों के लिए उसकी उपयोगिता',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-descriptive-004',
    type: 'descriptive',
    title: 'The Market Near My House',
    title_hindi: 'मेरे घर के पास का बाज़ार',
    hints: [
      'बाज़ार का परिचय — कहाँ, कितना बड़ा',
      'बाज़ार में क्या-क्या मिलता है',
      'दुकानदारों और ग्राहकों का वर्णन',
      'बाज़ार में क्या-क्या देखा/सुना',
      'बाज़ार की कोई खास बात',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-descriptive-005',
    type: 'descriptive',
    title: 'A Beautiful Garden',
    title_hindi: 'एक सुंदर बाग़',
    hints: [
      'बाग़ का परिचय — कहाँ है, कैसा दिखता है',
      'बाग़ में कौन-कौन से फूल और पेड़ हैं',
      'बाग़ में कौन-कौन से पक्षी आते हैं',
      'बाग़ में जाने पर कैसा लगता है',
      'बाग़ का मनुष्यों के लिए क्या महत्त्व है',
    ],
    time_minutes: 30,
    word_count: '150–200 शब्द',
    track: 'psle',
  },

  // ─── PICTURE-BASED ESSAYS (चित्र-आधारित निबंध) ──────────────────────────

  {
    id: 'psle-writing-picture-001',
    type: 'picture',
    title: 'Children Playing in a Park',
    title_hindi: 'पार्क में खेलते बच्चे',
    hints: [
      'चित्र में कितने बच्चे हैं और वे क्या कर रहे हैं',
      'पार्क का वातावरण कैसा है',
      'बच्चों के चेहरे पर कैसे भाव हैं',
      'आस-पास क्या-क्या दिख रहा है',
      'इस चित्र से आपको क्या संदेश मिलता है',
    ],
    time_minutes: 30,
    word_count: '100–150 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-picture-002',
    type: 'picture',
    title: 'A Busy Street Scene',
    title_hindi: 'एक व्यस्त सड़क का दृश्य',
    hints: [
      'सड़क पर कौन-कौन से वाहन हैं',
      'सड़क किनारे क्या-क्या दिख रहा है',
      'लोग क्या-क्या कर रहे हैं',
      'यातायात की क्या स्थिति है',
      'इस दृश्य की कोई खास बात',
    ],
    time_minutes: 30,
    word_count: '100–150 शब्द',
    track: 'psle',
  },
  {
    id: 'psle-writing-picture-003',
    type: 'picture',
    title: 'A Family Celebration',
    title_hindi: 'परिवार का उत्सव',
    hints: [
      'चित्र में कौन-कौन से लोग हैं',
      'कौन सा अवसर मनाया जा रहा है',
      'कमरे या स्थान की सजावट कैसी है',
      'सभी लोग क्या कर रहे हैं',
      'इस उत्सव का क्या महत्त्व है',
    ],
    time_minutes: 30,
    word_count: '100–150 शब्द',
    track: 'psle',
  },
]

export const psleWritingLessons: WritingLesson[] = [
  {
    id: 'psle-writing-lesson-structure',
    title: 'Essay Structure in Hindi',
    title_hindi: 'हिंदी निबंध की संरचना',
    track: 'psle',
    content: [
      {
        type: 'text',
        heading: 'निबंध के तीन भाग',
        content: 'हर हिंदी निबंध के तीन मुख्य भाग होते हैं: (१) प्रस्तावना (Introduction), (२) मुख्य भाग (Body), (३) उपसंहार (Conclusion)। इन तीनों को स्पष्ट रूप से लिखना चाहिए।',
      },
      {
        type: 'rule',
        heading: 'प्रस्तावना (Introduction)',
        content: 'प्रस्तावना में विषय का परिचय दें। पाठक का ध्यान खींचने वाला पहला वाक्य लिखें। विषय से संबंधित एक-दो वाक्य लिखें।',
        note: 'प्रस्तावना बहुत लंबी न हो — 2–3 वाक्य काफी हैं।',
      },
      {
        type: 'example',
        heading: 'प्रस्तावना का उदाहरण',
        content: 'विषय: "मेरा विद्यालय" → "शिक्षा जीवन की नींव है और विद्यालय उस नींव को मज़बूत बनाता है। मेरा विद्यालय मेरे लिए एक दूसरे घर जैसा है।"',
      },
      {
        type: 'rule',
        heading: 'मुख्य भाग (Body)',
        content: 'मुख्य भाग में विषय के बारे में विस्तार से लिखें। 3–4 पैराग्राफ लिखें। प्रत्येक पैराग्राफ एक नए विचार पर हो। उदाहरण, विवरण और भावनाएँ शामिल करें।',
        note: 'हर पैराग्राफ एक नई पंक्ति से शुरू करें।',
      },
      {
        type: 'rule',
        heading: 'उपसंहार (Conclusion)',
        content: 'उपसंहार में निबंध का सार लिखें। अपनी राय या संदेश दें। एक यादगार वाक्य से समाप्त करें।',
      },
      {
        type: 'example',
        heading: 'उपसंहार का उदाहरण',
        content: '"मेरा विद्यालय" → "मेरा विद्यालय मुझे न केवल ज्ञान देता है, बल्कि एक अच्छा इंसान बनने की राह भी दिखाता है। मैं अपने विद्यालय से सदा प्रेम करता/करती रहूँगा/रहूँगी।"',
      },
    ],
  },
  {
    id: 'psle-writing-lesson-connectors',
    title: 'Useful Hindi Connectors',
    title_hindi: 'उपयोगी हिंदी संयोजक शब्द',
    track: 'psle',
    content: [
      {
        type: 'text',
        heading: 'संयोजक शब्द क्यों ज़रूरी हैं?',
        content: 'संयोजक शब्द (Connectors) निबंध को पठनीय और प्रवाहमान बनाते हैं। ये वाक्यों और विचारों को जोड़ते हैं। इनके बिना निबंध टुकड़ों जैसा लगता है।',
      },
      {
        type: 'list',
        heading: 'कारण बताने के लिए (Reason)',
        content: 'इसलिए (therefore) | क्योंकि (because) | अतः (thus) | इस कारण (for this reason) | इसी वजह से (for this very reason)',
      },
      {
        type: 'list',
        heading: 'विरोध दर्शाने के लिए (Contrast)',
        content: 'परन्तु (but) | लेकिन (however) | फिर भी (even then) | तथापि (nevertheless) | इसके विपरीत (on the other hand)',
      },
      {
        type: 'list',
        heading: 'अतिरिक्त जानकारी के लिए (Addition)',
        content: 'इसके अलावा (besides this) | साथ ही (along with) | और भी (moreover) | न केवल... बल्कि (not only... but also)',
      },
      {
        type: 'list',
        heading: 'समय दर्शाने के लिए (Time)',
        content: 'पहले (first) | फिर (then) | अंत में (finally) | उसके बाद (after that) | जब (when) | तब (then)',
      },
      {
        type: 'tip',
        heading: 'सलाह',
        content: 'हर वाक्य को एक ही शब्द "और" से न जोड़ें। अलग-अलग संयोजक शब्दों का प्रयोग करने से निबंध में विविधता आती है और वह अधिक प्रभावशाली बनता है।',
      },
    ],
  },
  {
    id: 'psle-writing-lesson-openings',
    title: 'Sample Opening Lines',
    title_hindi: 'निबंध की शुरुआत के लिए उपयोगी वाक्य',
    track: 'psle',
    content: [
      {
        type: 'text',
        content: 'निबंध की शुरुआत अच्छी होनी चाहिए ताकि पाठक आगे पढ़ने के लिए प्रेरित हो। नीचे विभिन्न प्रकार के निबंधों के लिए आरंभिक वाक्य दिए गए हैं:',
      },
      {
        type: 'example',
        heading: 'कथात्मक निबंध के लिए',
        content: 'यह घटना उस दिन की है जब... | मुझे आज भी याद है वह दिन जब... | यह एक ऐसी घटना है जिसे मैं कभी नहीं भूल सकता/सकती...',
      },
      {
        type: 'example',
        heading: 'वर्णनात्मक निबंध के लिए',
        content: 'मेरा [विषय] बहुत [विशेषण] है... | [विषय] का वर्णन करना मुझे बहुत अच्छा लगता है... | जब भी मैं [विषय] के बारे में सोचता/सोचती हूँ...',
      },
      {
        type: 'example',
        heading: 'चित्र-आधारित निबंध के लिए',
        content: 'इस चित्र में हम देख सकते हैं कि... | चित्र में [विषय] का सुंदर दृश्य दिखाई दे रहा है... | चित्र को देखकर मन में [भावना] का भाव उठता है...',
      },
      {
        type: 'tip',
        content: 'कभी भी "मैं आपको [विषय] के बारे में बताऊँगा" जैसी शुरुआत न करें। यह बहुत साधारण है। ऊपर दिए गए उदाहरणों जैसी रचनात्मक शुरुआत करें।',
      },
    ],
  },
]
