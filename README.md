# Aakar Hindi — Learning Platform

> **Master Hindi. Excel in Exams.**  
> A full-stack web platform for PSLE and O-Level Hindi tuition — built for Singapore students and teachers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aakar-hindi)

---

## What this is

A private tuition platform with:
- **Dual tracks**: PSLE Hindi (P3–P6) and O-Level Hindi (Sec 1–4)
- **Password-protected login** — teacher assigns username + password to each student
- **4 modules per track**: Grammar, Vocabulary, Comprehension, Writing
- **Interactive quizzes** with instant answer explanations (Hindi + English)
- **Timed exam papers** with auto-marking for MCQ/FIB and teacher marking for OE
- **Teacher dashboard** — view all students' progress, add/remove students
- **Persistent progress** — streak, avg score, papers done — stored in Supabase

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API routes (serverless) |
| Database | Supabase (PostgreSQL) |
| Auth | bcryptjs + JWT (httpOnly cookie) |
| Deployment | Vercel (free tier) |
| Tests | Vitest + Testing Library |

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/aakar-hindi
cd aakar-hindi
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste `supabase/migrations/001_schema.sql` → **Run**
3. Generate a password hash for the teacher account:
   ```bash
   node -e "const b=require('bcryptjs'); b.hash('aakar2026',10).then(console.log)"
   ```
4. Open `supabase/seed.sql`, replace `REPLACE_WITH_BCRYPT_HASH` with the output → Run seed.sql in SQL Editor
5. Go to **Settings → API** → copy Project URL + anon key + service role key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

Login with `teacher` / `aakar2026` after seeding.

### 5. Run tests

```bash
npm test
```

---

## Deployment to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create aakar-hindi --private && git push -u origin main

# 2. Deploy
npx vercel --prod
```

Add all 4 environment variables in **Vercel → Settings → Environment Variables**.

Your site is live at `https://aakar-hindi.vercel.app` (or custom domain).

---

## Project structure

```
aakar-hindi/
├── app/
│   ├── (auth)/login/         Login page
│   ├── (app)/
│   │   ├── dashboard/        Student dashboard
│   │   ├── track/[trackId]/  Level overview per track
│   │   ├── module/[moduleId]/Topic list per module
│   │   ├── lesson/[topicId]/ Lesson viewer
│   │   ├── quiz/[moduleId]/  Interactive quiz
│   │   ├── exam/[paperId]/   Timed exam paper
│   │   ├── progress/         Analytics & history
│   │   └── teacher/          Teacher-only pages
│   └── api/                  API routes
├── components/               Shared UI components
├── data/
│   ├── psle/                 PSLE content (questions, lessons)
│   └── olevel/               O-Level content
├── lib/                      Auth, Supabase client, types, utils
├── supabase/                 Schema migrations + seed
├── __tests__/                Vitest test suites
└── docs/                     Setup, deployment, content guides
```

---

## Adding students (teacher workflow)

1. Log in as teacher at your URL
2. **Teacher Dashboard → Add Student**
3. Enter: name, username, password, grade (auto-detects PSLE/O-Level)
4. Share the username + password with the student
5. Student logs in and sees their own dashboard

## Adding content

All questions and lessons live in `data/`. Edit the TypeScript files, commit, push — Vercel auto-deploys in ~2 minutes.

See [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) for the full content authoring guide.

---

## What is NOT built (intentional scope)

- ❌ Oral/listening (requires audio — teacher handles in class)
- ❌ Auto-marking of essays (teacher marks OE via dashboard)
- ❌ Payment/subscriptions
- ❌ Mobile app
- ❌ AI features

---

## Docs

- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Content Guide](docs/CONTENT_GUIDE.md)
- [Teacher Guide](docs/TEACHER_GUIDE.md)

---

*Built for Aakar Hindi Tuition Centre, Singapore.*
