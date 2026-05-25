# Content Guide — Adding Questions & Lessons

All content for Aakar Hindi lives in TypeScript files inside the `data/` directory. TypeScript is used instead of JSON so that the compiler catches typos and structural mistakes before the site is deployed.

Changes to content files require a redeploy, which happens automatically when you push to GitHub (takes ~2 minutes on Vercel).

---

## Directory Structure

```
data/
├── psle/
│   ├── grammar.ts          # Grammar questions (P3–P6)
│   ├── vocabulary.ts       # Vocabulary questions  ← TEACHER_REVIEW
│   ├── comprehension.ts    # Comprehension passages ← TEACHER_REVIEW
│   ├── writing.ts          # Writing prompts
│   ├── lessons.ts          # Lesson content for all modules
│   └── papers.ts           # Full exam papers
└── olevel/
    ├── grammar.ts
    ├── vocabulary.ts        ← TEACHER_REVIEW
    ├── comprehension.ts     ← TEACHER_REVIEW
    ├── writing.ts
    ├── lessons.ts
    └── papers.ts
```

Files marked `← TEACHER_REVIEW` contain AI-generated placeholder content that needs verification before being used in class. See the [What needs teacher review](#what-needs-teacher-review) section below.

---

## Adding a Quiz Question

Open the relevant file (e.g. `data/psle/grammar.ts`) and add a new object to the exported array.

### MCQ (Multiple Choice Question)

```typescript
{
  id: "grammar-tense-011",           // must be unique across the entire array
  type: "mcq",
  question: "निम्नलिखित में से कौन-सा वाक्य भूतकाल में है?",
  options: [
    "वह जाता है।",
    "वह गया।",
    "वह जाएगा।",
    "वह जा रहा है।",
  ],
  correct: 1,                        // 0-indexed: option[1] = "वह गया।"
  explanation: "<b>गया</b> भूतकाल की क्रिया है।",
  explanation_en: '"Gaya" is the past tense form of "to go".',
  module: "grammar",
  topic: "tenses",
  track: "psle",
  level: "foundational",             // "foundational" | "advanced" | "expert"
  difficulty: "easy",               // "easy" | "medium" | "hard"
}
```

### Fill-in-the-Blank (FIB)

```typescript
{
  id: "grammar-gender-fib-005",
  type: "fib",
  question: "राजा का स्त्रीलिंग ________ है।",
  correct: "रानी",                   // exact string match (case-insensitive)
  explanation: "<b>राजा</b> का स्त्रीलिंग <b>रानी</b> है।",
  explanation_en: 'The feminine form of "raja" (king) is "rani" (queen).',
  module: "grammar",
  topic: "gender",
  track: "psle",
  level: "foundational",
  difficulty: "easy",
}
```

### Open-Ended (OE) — teacher-marked

```typescript
{
  id: "writing-letter-oe-003",
  type: "oe",
  question: "अपने मित्र को एक पत्र लिखिए जिसमें आप उसे अपनी छुट्टियों के बारे में बताएँ। (50–80 शब्द)",
  explanation: "पत्र में तिथि, संबोधन, मुख्य भाग और अभिवादन होना चाहिए।",
  explanation_en: "The letter should include date, salutation, body (holiday description), and closing.",
  module: "writing",
  topic: "letter-writing",
  track: "psle",
  level: "foundational",
  difficulty: "medium",
  // Note: no 'correct' field — teacher marks these manually
}
```

---

## Adding a Lesson

Open `data/psle/lessons.ts` (or the olevel equivalent) and add a new object to the exported array.

```typescript
{
  id: "psle-grammar-tenses",         // must be unique
  title: "Tenses in Hindi",
  title_hindi: "हिंदी में काल",
  module: "grammar",
  topic: "tenses",
  track: "psle",
  level: "foundational",
  content: [
    {
      type: "text",
      content: "Hindi has three main tenses: present (वर्तमान काल), past (भूतकाल), and future (भविष्य काल). Identifying the tense depends on the verb ending.",
    },
    {
      type: "rule",
      content: "Present tense verbs end in -ता (masculine singular), -ती (feminine singular), or -ते (masculine plural).",
    },
    {
      type: "hindi",
      content: "वह जाता है।",
      translation: "He goes. (Present tense)",
    },
    {
      type: "hindi",
      content: "वह गई।",
      translation: "She went. (Past tense)",
    },
    {
      type: "hindi",
      content: "वह जाएगा।",
      translation: "He will go. (Future tense)",
    },
    {
      type: "tip",
      content: "In PSLE, look at the last word of the sentence — it is almost always the verb and will tell you the tense.",
    },
    {
      type: "example",
      content: "Q: Which sentence is in past tense? (A) वह खाता है। (B) वह खाया। (C) वह खाएगा। → Answer: (B)",
    },
  ],
}
```

### Lesson block types

| `type` | Purpose | Required fields |
|--------|---------|----------------|
| `text` | Plain explanatory text (English) | `content` |
| `hindi` | A Hindi sentence with its translation | `content`, `translation` |
| `example` | A worked example or sample question | `content` |
| `table` | Tabular data (rendered as HTML table) | `content` (HTML string) |
| `rule` | A grammatical rule, displayed highlighted | `content` |
| `tip` | An exam tip, displayed in a callout box | `content` |

---

## Adding an Exam Paper

Open `data/psle/papers.ts` and add a new `ExamPaper` object to the exported array.

```typescript
{
  id: "psle-2024-mock-paper1",
  title: "PSLE Hindi Mock Paper 1 (2024)",
  title_hindi: "पीएसएलई हिंदी नमूना प्रश्नपत्र 1 (2024)",
  track: "psle",
  level: "foundational",
  year: 2024,
  time_minutes: 50,
  total_marks: 50,
  pass_mark: 25,
  sections: [
    {
      id: "section-a",
      name: "Section A — Grammar",
      name_hindi: "खंड अ — व्याकरण",
      instructions: "Choose the correct answer.",
      marks: 20,
      questions: [
        // Reference existing question IDs or inline them here
        { id: "grammar-tense-001", /* ... */ },
      ],
    },
    {
      id: "section-b",
      name: "Section B — Comprehension",
      name_hindi: "खंड ब — गद्यांश",
      marks: 20,
      questions: [ /* ... */ ],
    },
    {
      id: "section-c",
      name: "Section C — Writing",
      name_hindi: "खंड स — लेखन",
      marks: 10,
      questions: [
        { id: "writing-letter-oe-001", type: "oe", /* ... */ }
      ],
    },
  ],
}
```

> **Important:** Any paper that includes a section with `type: "oe"` questions will be automatically flagged for teacher marking when a student submits it. The student's MCQ and FIB scores are auto-calculated immediately; the OE score is added by the teacher later.

---

## What Needs Teacher Review

The following files contain AI-generated content that should be verified before being used with students. They are marked with `// TEACHER_REVIEW` comments at the top of each file.

### `data/olevel/vocabulary.ts`
- Idiom and proverb lists are AI-generated. Please verify:
  - That each idiom/proverb is authentic and commonly used in Standard Hindi.
  - That the English explanations are accurate.
  - That difficulty ratings match O-Level expectations.

### `data/psle/comprehension.ts`
- Comprehension passages were generated from topic summaries. Please verify:
  - That Hindi prose is grammatically correct and age-appropriate for P3–P6.
  - That comprehension questions match the passage content exactly.
  - That answer keys are correct.

### `data/olevel/comprehension.ts`
- Same concerns as above, at Secondary 1–4 level.
- Vocabulary in passages should align with MOE O-Level Hindi syllabus.

**How to flag a question for removal:**
Add `disabled: true` to the question object. The quiz engine skips disabled questions automatically:

```typescript
{
  id: "vocabulary-idioms-007",
  disabled: true,   // will not appear in quizzes
  // ... rest of question
}
```

---

## ID Naming Convention

Use lowercase with hyphens. Format: `{module}-{topic}-{type}-{number}`

Examples:
- `grammar-tense-mcq-011`
- `vocabulary-synonyms-mcq-022`
- `comprehension-passage-fib-003`
- `writing-letter-oe-001`

IDs must be unique within each track (`psle` / `olevel`). A good practice is to grep for the ID before adding it:

```bash
grep -r "grammar-tense-mcq-011" data/
```

If no output, the ID is free to use.
