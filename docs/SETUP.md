# Aakar Hindi — Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier is sufficient)
- Vercel account (free tier is sufficient)

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd aakar-hindi
npm install
```

---

## 2. Supabase Setup

### 2a. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose a name (e.g. `aakar-hindi`), set a strong database password, and select the closest region.
4. Wait ~2 minutes for the project to provision.

### 2b. Run the schema migration

1. In your Supabase project, click **SQL Editor** in the left sidebar.
2. Click **+ New query**.
3. Open `supabase/migrations/001_schema.sql` from this repo.
4. Paste the entire contents into the SQL editor.
5. Click **Run** (or press Ctrl+Enter).
6. You should see "Success. No rows returned."

### 2c. Generate password hashes and run seed data

The seed file requires bcrypt hashes for the initial accounts. Generate them first:

```bash
# Run this from the project root (bcryptjs is already installed)
node -e "
const b = require('bcryptjs');
Promise.all([
  b.hash('aakar2026', 10),
  b.hash('student123', 10)
]).then(([teacherHash, studentHash]) => {
  console.log('Teacher hash (aakar2026):');
  console.log(teacherHash);
  console.log('Student hash (student123):');
  console.log(studentHash);
});
"
```

1. Open `supabase/seed.sql`.
2. Replace every occurrence of `$2b$10$REPLACE_WITH_HASH_OF_aakar2026_RUN_NODE_COMMAND_ABOVE` with the teacher hash.
3. Replace every occurrence of `$2b$10$REPLACE_WITH_HASH_OF_student123_RUN_NODE_COMMAND_ABOVE` with the student hash.
4. In Supabase SQL Editor, create another new query.
5. Paste the updated `seed.sql` contents and click **Run**.

### 2d. Get your API keys

1. In Supabase, go to **Settings → API**.
2. Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon / public** key
   - **service_role** key (click to reveal — keep this secret)

---

## 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_here
```

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **Security note:** Never commit `.env.local` to version control. The `.gitignore` already excludes it.

---

## 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Default accounts after seeding:**

| Role    | Username   | Password   |
|---------|------------|------------|
| Teacher | `teacher`  | `aakar2026` |
| Student | `priya_p5` | `student123` |
| Student | `arjun_p6` | `student123` |
| Student | `meera_s3` | `student123` |

---

## 5. Run Tests

```bash
npm test
```

To run in watch mode (re-runs on file changes):

```bash
npm run test:watch
```

---

## 6. Project Structure

```
aakar-hindi/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── auth/         # login, logout, me
│   │   ├── progress/     # quiz, exam
│   │   └── students/     # teacher CRUD for students
│   └── (pages)/          # UI pages
├── components/           # Reusable React components
├── data/                 # Content: questions, lessons, exam papers
│   ├── psle/
│   └── olevel/
├── lib/                  # Shared utilities: auth, supabase client, types
├── supabase/
│   ├── migrations/       # SQL schema
│   └── seed.sql          # Initial data
├── __tests__/            # Vitest test suites
└── docs/                 # This documentation
```

---

## 7. Troubleshooting

**"Invalid username or password" on login**
- Make sure you ran `seed.sql` after replacing the placeholder hashes.
- Double-check you generated the hash for the correct password string.

**Supabase connection errors**
- Confirm `NEXT_PUBLIC_SUPABASE_URL` and keys are correct in `.env.local`.
- Ensure you are using the `service_role` key for `SUPABASE_SERVICE_ROLE_KEY`, not the anon key.

**JWT errors**
- Make sure `JWT_SECRET` is set and is the same value across restarts.
- Clearing browser cookies and logging in again resolves stale token issues.

**Tests failing with module not found**
- Run `npm install` to ensure all dependencies are installed.
- Confirm `vitest.config.ts` has the `@` alias pointing to the project root.
