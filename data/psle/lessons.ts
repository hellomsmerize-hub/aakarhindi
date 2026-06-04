import type { Lesson } from '@/lib/types'

export const psleLessons: Lesson[] = [
  // ─── LESSON 1: TENSES ─────────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-tenses',
    title: 'Tenses in Hindi (काल)',
    title_hindi: 'हिंदी में काल',
    module: 'grammar',
    topic: 'tenses',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'Hindi has three main tenses (काल): Present (वर्तमान काल), Past (भूत काल), and Future (भविष्य काल). Every sentence contains a verb that tells us WHEN the action happens. Identifying the verb ending is the key to finding the tense.',
      },
      {
        type: 'rule',
        content: 'वर्तमान काल (Present Tense) — verb ends in: ता है / ती है / ते हैं (Habitual), रहा है / रही है / रहे हैं (Continuous)',
        note: 'Use present tense for actions happening now or regularly.',
      },
      {
        type: 'hindi',
        content: 'राम प्रतिदिन विद्यालय जाता है।',
        translation: 'Ram goes to school every day. (Habitual Present — ता है)',
      },
      {
        type: 'hindi',
        content: 'सीता अभी खाना खा रही है।',
        translation: 'Sita is eating food right now. (Continuous Present — रही है)',
      },
      {
        type: 'rule',
        content: 'भूत काल (Past Tense) — verb ends in: था / थी / थे (Imperfect), या / यी / ये (Perfective). Transitive verbs in perfect past take ने with subject.',
        note: 'The word "ने" after the subject is a strong signal of past tense with transitive verbs.',
      },
      {
        type: 'hindi',
        content: 'राम खाना खाता था।',
        translation: 'Ram used to eat food. (Imperfect Past — था)',
      },
      {
        type: 'hindi',
        content: 'राम ने खाना खाया।',
        translation: 'Ram ate food. (Perfect Past — ने + या)',
      },
      {
        type: 'rule',
        content: 'भविष्य काल (Future Tense) — verb ends in: गा (masculine singular) / गी (feminine singular) / गे (masculine plural)',
        note: 'The suffix गा/गी/गे always signals future tense.',
      },
      {
        type: 'hindi',
        content: 'राम कल विद्यालय जाएगा।',
        translation: 'Ram will go to school tomorrow. (Future — गा)',
      },
      {
        type: 'hindi',
        content: 'सीता कल गाना गाएगी।',
        translation: 'Sita will sing tomorrow. (Future — गी)',
      },
      {
        type: 'tip',
        content: 'Quick trick: Look at the LAST word of the verb phrase. ता/ती/ते + है/हैं = Present. था/थी/थे OR या/यी/ये = Past. गा/गी/गे = Future.',
      },
    ],
  },

  // ─── LESSON 2: POSTPOSITIONS ──────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-karak',
    title: 'Postpositions / Case Markers (कारक)',
    title_hindi: 'कारक — विभक्ति चिह्न',
    module: 'grammar',
    topic: 'postpositions',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'In Hindi, postpositions (कारक चिह्न) come AFTER nouns or pronouns to show their relationship to the verb. There are 8 cases (कारक) in Hindi grammar.',
      },
      {
        type: 'table',
        content: 'कारक | चिह्न | अर्थ\nकर्ता | ने | doer (past transitive)\nकर्म | को | to/for (object)\nकरण | से | with/by (instrument)\nसंप्रदान | के लिए | for (recipient)\nअपादान | से | from (separation)\nसंबंध | का/की/के | of / possessive\nअधिकरण | में / पर | in / on (location)\nसंबोधन | हे / अरे | O! (vocative)',
      },
      {
        type: 'rule',
        content: '"ने" का प्रयोग: Only use ने with the subject when (1) the verb is transitive AND (2) the tense is past. "राम ने आम खाया" ✓ BUT "राम ने सोया" ✗ (सोना is intransitive)',
        note: 'Common mistake: Using ने with intransitive verbs like जाना, सोना, रोना, हँसना.',
      },
      {
        type: 'hindi',
        content: 'मैंने किताब पढ़ी।',
        translation: 'I read the book. (ने with transitive verb पढ़ना, past tense) ✓',
      },
      {
        type: 'hindi',
        content: 'मैं विद्यालय से आया।',
        translation: 'I came from school. (से = Apadan Karak — source/separation)',
      },
      {
        type: 'hindi',
        content: 'किताब मेज़ पर रखी है।',
        translation: 'The book is placed on the table. (पर = on a surface)',
      },
      {
        type: 'tip',
        content: 'में vs पर: में = inside something (बक्से में = inside the box). पर = on the surface (मेज़ पर = on the table). Think: में goes IN, पर goes ON TOP.',
      },
    ],
  },

  // ─── LESSON 3: SYNONYMS ───────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-synonyms',
    title: 'Synonyms (पर्यायवाची शब्द)',
    title_hindi: 'पर्यायवाची शब्द',
    module: 'grammar',
    topic: 'synonyms',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'Synonyms (पर्यायवाची शब्द) are words with the same or very similar meanings. In Hindi, knowing synonyms helps avoid repetition and makes writing richer.',
      },
      {
        type: 'table',
        content: 'शब्द | पर्यायवाची शब्द\nपानी | जल, नीर, वारि, तोय\nआँख | नेत्र, नयन, लोचन, दृग\nसूरज | सूर्य, रवि, दिनकर, भास्कर\nआकाश | गगन, नभ, व्योम, अंबर\nघर | गृह, आवास, निवास, मकान\nरात | रात्रि, निशा, रजनी, यामिनी\nआग | अग्नि, पावक, अनल, ज्वाला\nसुंदर | मनोहर, खूबसूरत, रमणीय',
      },
      {
        type: 'rule',
        content: 'पर्यायवाची ≠ बिल्कुल एक जैसे: Synonyms are similar but not always fully interchangeable. "जल" is more formal/literary than "पानी".',
        note: 'In PSLE, choose the CLOSEST synonym — not an antonym!',
      },
      {
        type: 'tip',
        content: 'Memory trick: Learn synonyms in theme groups. Water words: जल, नीर, वारि. Sky words: गगन, नभ, व्योम. Eye words: नेत्र, नयन, लोचन. Groups are easier to remember!',
      },
    ],
  },

  // ─── LESSON 4: ANTONYMS ───────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-antonyms',
    title: 'Antonyms (विलोम शब्द)',
    title_hindi: 'विलोम शब्द',
    module: 'grammar',
    topic: 'antonyms',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'Antonyms (विलोम शब्द) are words with opposite meanings. In Hindi, many antonyms are formed by adding a prefix like "अ-", "वि-", "अन-", "नि-" etc.',
      },
      {
        type: 'table',
        content: 'शब्द | विलोम | शब्द | विलोम\nदिन | रात | सुबह | शाम\nगरम | ठंडा | खुश | दुखी\nबड़ा | छोटा | अच्छा | बुरा\nसफल | असफल | आना | जाना\nप्रेम | घृणा | जीत | हार\nसत्य | असत्य | ऊपर | नीचे\nगरीब | अमीर | नया | पुराना',
      },
      {
        type: 'rule',
        content: 'Prefix antonyms: "अ-" reverses meaning: सत्य→असत्य, सफल→असफल, संभव→असंभव. "वि-" prefix: जय→पराजय. Some antonyms must be memorised as pairs with no pattern.',
        note: 'Not all words take prefixes — memorise irregular antonym pairs.',
      },
      {
        type: 'tip',
        content: 'Don\'t confuse पर्यायवाची (synonym = same meaning) and विलोम (antonym = opposite meaning). Read the question word very carefully every time!',
      },
    ],
  },

  // ─── LESSON 5: GENDER ─────────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-gender',
    title: 'Gender in Hindi (लिंग)',
    title_hindi: 'हिंदी में लिंग',
    module: 'grammar',
    topic: 'gender',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'Hindi has two genders: Masculine (पुल्लिंग) and Feminine (स्त्रीलिंग). Every noun in Hindi has a gender. Gender affects verb forms, adjective endings and pronoun choices.',
      },
      {
        type: 'rule',
        content: 'Feminine formation patterns: (1) -आ → -ई: लड़का→लड़की, बेटा→बेटी. (2) Add -नी: शेर→शेरनी, मोर→मोरनी, हाथी→हथिनी. (3) Irregular pairs: राजा→रानी, भाई→बहन, पिता→माता.',
        note: 'Irregular pairs MUST be memorised — no rule applies to them.',
      },
      {
        type: 'table',
        content: 'पुल्लिंग | स्त्रीलिंग | पुल्लिंग | स्त्रीलिंग\nराजा | रानी | लड़का | लड़की\nभाई | बहन | बेटा | बेटी\nपिता | माता | शेर | शेरनी\nमोर | मोरनी | हाथी | हथिनी\nनेता | नेत्री | अभिनेता | अभिनेत्री',
      },
      {
        type: 'rule',
        content: 'Always-feminine nouns: नदी (river), भाषा (language), किताब (book). Always-masculine: पेड़ (tree), पहाड़ (mountain), घर (house).',
        note: 'Rivers in Hindi are always feminine — remember गंगा नदी बहती है (flows = feminine verb).',
      },
      {
        type: 'tip',
        content: 'Gender test: Replace the noun in a past-tense sentence. If "वह गया" (he went) sounds right, it\'s masculine. If "वह गई" (she went) sounds right, it\'s feminine. Verb agreement reveals gender!',
      },
    ],
  },

  // ─── LESSON 6: ADJECTIVES ─────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-adjectives',
    title: 'Adjectives (विशेषण)',
    title_hindi: 'विशेषण',
    module: 'grammar',
    topic: 'adjectives',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'An adjective (विशेषण) describes or qualifies a noun or pronoun — telling us about quality, quantity, or number. In Hindi, adjectives generally come BEFORE the noun they describe.',
      },
      {
        type: 'rule',
        content: 'Three main types: (1) गुणवाचक विशेषण — quality: सुंदर, ईमानदार, लाल, बड़ा. (2) संख्यावाचक विशेषण — number: पाँच, दस, कुछ, दोनों. (3) परिमाणवाचक विशेषण — quantity: थोड़ा, बहुत, सारा.',
      },
      {
        type: 'hindi',
        content: 'लाल गुलाब बहुत सुंदर है।',
        translation: 'The red rose is very beautiful. (लाल = गुणवाचक विशेषण — colour)',
      },
      {
        type: 'hindi',
        content: 'मेज़ पर पाँच किताबें हैं।',
        translation: 'There are five books on the table. (पाँच = संख्यावाचक विशेषण)',
      },
      {
        type: 'rule',
        content: 'Agreement: Adjectives ending in -आ change to match gender/number: अच्छा लड़का → अच्छी लड़की → अच्छे लड़के. Adjectives NOT ending in -आ do NOT change: सुंदर लड़का / सुंदर लड़की.',
      },
      {
        type: 'tip',
        content: 'To find the adjective: ask "WHAT KIND of [noun]?" The word that answers is the adjective. "लाल गुलाब" → What kind of rose? लाल (red). That is the adjective.',
      },
    ],
  },

  // ─── LESSON 7: NOUNS ──────────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-nouns',
    title: 'Nouns and Plurals (संज्ञा और वचन)',
    title_hindi: 'संज्ञा और वचन',
    module: 'grammar',
    topic: 'nouns',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'A noun (संज्ञा) is the name of a person, place, thing or idea. Hindi has four types of nouns, and you must know how to form plurals (बहुवचन) from singular (एकवचन) nouns.',
      },
      {
        type: 'rule',
        content: 'Four types: (1) व्यक्तिवाचक (Proper) — राम, गंगा, दिल्ली. (2) जातिवाचक (Common) — लड़का, नदी, पेड़. (3) भाववाचक (Abstract) — प्रेम, ईमानदारी, सुंदरता. (4) द्रव्यवाचक (Material) — पानी, दूध, सोना.',
      },
      {
        type: 'table',
        content: 'Rule | एकवचन | बहुवचन\nMasc. -आ → -ए | लड़का | लड़के\nFem. -ई → -इयाँ | लड़की | लड़कियाँ\nFem. consonant → -एँ | किताब | किताबें\nFem. -आ → -एँ | माता | माताएँ\nNo change (masc.) | पानी | पानी',
      },
      {
        type: 'hindi',
        content: 'कमरा → कमरे | नदी → नदियाँ | बात → बातें | माता → माताएँ',
        translation: 'room→rooms | river→rivers | matter→matters | mother→mothers',
      },
      {
        type: 'tip',
        content: 'Material nouns (द्रव्यवाचक) like पानी, दूध, चीनी, सोना do NOT have plurals — they are always singular. Abstract nouns like प्रेम, ज्ञान are also usually singular.',
      },
    ],
  },

  // ─── LESSON 8: HOMONYMS ───────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-homonyms',
    title: 'Homonyms (समरूपी शब्द)',
    title_hindi: 'समरूपी शब्द',
    module: 'grammar',
    topic: 'homonyms',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'Homonyms (समरूपी शब्द) are words that sound similar but have different meanings. In PSLE, you identify the correct word based on context. Always read the whole sentence!',
      },
      {
        type: 'table',
        content: 'शब्द 1 | अर्थ | शब्द 2 | अर्थ\nकान | ear | काम | work\nमन | mind | मान | honour\nकल | yesterday/tomorrow | काल | time/death\nहार | necklace/defeat | हल | solution/plough\nपल | moment | पाल | sail/nurture\nसुन | listen (verb) | सून | desolate',
      },
      {
        type: 'hindi',
        content: 'कान से सुनो। (Listen with ears.) | काम करो। (Do work.)',
        translation: 'कान = ear | काम = work — similar sound, completely different meaning',
      },
      {
        type: 'hindi',
        content: 'उसने हार पहनी। / टीम की हार हुई।',
        translation: 'She wore a necklace (हार = garland). / The team was defeated (हार = defeat). — same word, different meanings by context.',
      },
      {
        type: 'rule',
        content: 'Solving homonym questions: (1) Read the complete sentence. (2) Identify what is described. (3) Choose the word that makes logical sense in context. Never guess without reading!',
      },
      {
        type: 'tip',
        content: 'Some words have multiple meanings from the same spelling (polysemous) — like हार meaning both defeat and necklace. Context is ALWAYS the key to the correct meaning.',
      },
    ],
  },

  // ─── LESSON 9: NUMBERS ────────────────────────────────────────────────────
  {
    id: 'psle-grammar-lesson-numbers',
    title: 'Singular & Plural (एकवचन और बहुवचन)',
    title_hindi: 'एकवचन और बहुवचन',
    module: 'grammar',
    topic: 'numbers',
    track: 'psle',
    level: 'foundational',
    content: [
      {
        type: 'text',
        content: 'वचन (number) tells us if a noun refers to one thing (एकवचन / singular) or more than one (बहुवचन / plural). Correct plurals are essential because verbs must agree with the subject in number.',
      },
      {
        type: 'rule',
        content: 'Five main plural rules:\n(1) Masc. -आ → -ए: लड़का→लड़के, कमरा→कमरे\n(2) Fem. -ई → -इयाँ: लड़की→लड़कियाँ, नदी→नदियाँ\n(3) Fem. consonant + -एँ: किताब→किताबें, बात→बातें\n(4) Fem. -आ + -एँ: माता→माताएँ, आशा→आशाएँ\n(5) Some words unchanged: पानी→पानी, आदमी→आदमी',
      },
      {
        type: 'table',
        content: 'एकवचन | बहुवचन | एकवचन | बहुवचन\nलड़का | लड़के | लड़की | लड़कियाँ\nकमरा | कमरे | किताब | किताबें\nमाता | माताएँ | रोटी | रोटियाँ\nआदमी | आदमी | गाय | गायें',
      },
      {
        type: 'rule',
        content: 'Oblique Plural (with postpositions): -एँ → -ओं when followed by में, को, से, के, ने. Example: किताबें → किताबों में (in the books). लड़कियाँ → लड़कियों को (to the girls).',
        note: 'Direct plural: किताबें. Oblique plural: किताबों (always used before postpositions).',
      },
      {
        type: 'tip',
        content: 'Verb agreement test: "लड़का जाता है" (singular) vs "लड़के जाते हैं" (plural). If you use the wrong plural form, the verb will also be wrong. Get the noun right first!',
      },
    ],
  },
]
