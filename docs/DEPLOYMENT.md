# Aakar Hindi — Deployment to Vercel

## Overview

Aakar Hindi is a Next.js 14 application. Deployment is fully automated via Vercel's GitHub integration — push to `main` and the site updates in about 2 minutes.

---

## One-time Setup

### 1. Push to GitHub

```bash
# From the project root
git init
git add .
git commit -m "Initial commit: Aakar Hindi platform"

# Create a private GitHub repo (requires GitHub CLI)
gh repo create aakar-hindi --private --source=. --remote=origin --push
```

Or create the repo manually at [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/aakar-hindi.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Option A — Vercel CLI:**

```bash
npm install -g vercel
vercel
# Follow the prompts:
#   Set up and deploy? Yes
#   Which scope? (your account)
#   Link to existing project? No
#   Project name: aakar-hindi
#   In which directory? ./
#   Framework preset: Next.js (auto-detected)
```

**Option B — Vercel dashboard:**

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Select your GitHub repository `aakar-hindi`.
4. Vercel will auto-detect Next.js. Leave build settings as defaults.
5. **Do not click Deploy yet** — add environment variables first (step 3).

### 3. Add Environment Variables in Vercel Dashboard

Go to your project in the Vercel dashboard → **Settings → Environment Variables**.

Add each of the following for **Production**, **Preview**, and **Development** environments:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yourproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service role key |
| `JWT_SECRET` | your 64-character hex secret |

> Generate `JWT_SECRET` if you haven't already:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Deploy

After adding env variables, click **Deploy** (or push a commit — Vercel will auto-deploy).

Your site will be live at:
```
https://aakar-hindi.vercel.app
```
(or a custom domain you configure in Settings → Domains)

---

## Ongoing Workflow

### Updating content (questions, lessons, exam papers)

Content lives in `data/` TypeScript files. To update it:

```bash
# Edit a file, e.g. data/psle/grammar.ts
# Then:
git add data/psle/grammar.ts
git commit -m "Add 5 new tenses questions for P5"
git push
```

Vercel detects the push and deploys automatically. The new content is live in ~2 minutes.

### Adding students (at runtime, no redeploy needed)

1. Log in as teacher at your Vercel URL.
2. Go to **Students → Add Student**.
3. Enter the student's name, username, password, and grade.
4. The student can log in immediately.

### Resetting a student password (at runtime)

1. Log in as teacher.
2. Go to **Students → click the student's name → Reset Password**.
3. Enter and confirm the new password.
4. Give the new password to the student.

---

## Marking Open-Ended Answers

When a student submits an exam paper that contains open-ended (written) questions, the paper is flagged for teacher review.

1. Log in as teacher.
2. Go to **Students → click student name → Exams tab**.
3. Papers awaiting marking show a "Pending OE" badge.
4. Click the paper → scroll to the open-ended section → enter the score.
5. Click **Save mark**. The student's dashboard updates immediately.

---

## Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains → **Add domain**.
2. Enter your domain (e.g. `hindi.yourschool.edu.sg`).
3. Follow the DNS instructions Vercel provides (add a CNAME or A record).
4. Vercel provisions an SSL certificate automatically within a few minutes.

---

## Monitoring & Logs

- **Function logs:** Vercel dashboard → your project → **Functions** tab → click any route.
- **Build logs:** Vercel dashboard → **Deployments** → click the latest deployment.
- **Errors:** Vercel sends email alerts on failed deployments by default.

---

## Rolling Back a Deployment

If a deployment causes issues:

1. Vercel dashboard → **Deployments**.
2. Find the last working deployment.
3. Click the three-dot menu → **Promote to Production**.

The previous version is live instantly without a new build.
