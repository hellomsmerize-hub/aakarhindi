# Aakar Hindi Deployment Checklist

Complete this checklist to deploy Aakar Hindi to Vercel with real Supabase credentials.

---

## ✅ Phase 1: GitHub Setup (5 min)

### Create GitHub Repository
- [ ] Go to [github.com/new](https://github.com/new)
- [ ] Name: `aakar-hindi`
- [ ] Privacy: **Private** (only your team can see it)
- [ ] Leave other options blank
- [ ] Click **Create repository**

### Push code to GitHub
```bash
cd /Users/mac/aakar-hindi
git remote add origin https://github.com/YOUR_USERNAME/aakar-hindi.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## ✅ Phase 2: Supabase Setup (10 min)

### Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com) → **New Project**
- [ ] Organization: (create one if needed)
- [ ] Database name: `aakar_hindi`
- [ ] Region: Singapore (or closest to you)
- [ ] Password: Strong, unique (save this!)
- [ ] Click **Create new project** (wait 2-3 min for startup)

### Get Credentials
Once project is ready:
- [ ] In Supabase dashboard, go to **Settings → API**
- [ ] Copy:
  - `Project URL` → save as `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` → save as `SUPABASE_SERVICE_ROLE_KEY`

### Run migrations
- [ ] In Supabase dashboard → **SQL Editor**
- [ ] Click **New Query**
- [ ] Copy-paste contents of `/supabase/migrations/001_schema.sql` from this repo
- [ ] Click **Run**
- [ ] Verify: **Table Editor** should now show `users`, `progress`, `quiz_history`, `exam_history`, `module_progress` tables

### Seed admin user (optional, for testing)
- [ ] In **SQL Editor → New Query**, run:
```sql
INSERT INTO users (username, password_hash, role, name, created_at)
VALUES (
  'teacher',
  '$2a$10$4I5Rz1cAF.RKHdVdHmP/IezLlKG5zzq/5.XT6f7vC3Ys7EWa4SH7e', -- bcrypt hash of "aakar2026"
  'teacher',
  'Teacher',
  NOW()
);
```

- [ ] Verify user exists: **Table Editor → users table** should show the teacher row

---

## ✅ Phase 3: Vercel Deployment (10 min)

### Create Vercel project
- [ ] Go to [vercel.com](https://vercel.com) → **Dashboard**
- [ ] Click **Add New → Project**
- [ ] Import from Git → select your `aakar-hindi` repository
- [ ] Click **Import**

### Configure Environment Variables
- [ ] In Vercel dashboard, go to your project → **Settings → Environment Variables**
- [ ] Add the following (from Phase 2 step 3):

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key | Production, Preview, Development |
| `JWT_SECRET` | `f55c484c4b986d9801cd0fbbaa08ef079a627721e05675acc7ccd6b7247ad9a2` | Production, Preview, Development |

- [ ] After each addition, click **Save**

### Deploy
- [ ] Click **Deploy** button (bottom of project settings)
- [ ] Wait for build to complete (~2-3 min)
- [ ] Vercel will show a success message with your live URL:
  ```
  https://aakar-hindi.vercel.app
  ```

---

## ✅ Phase 4: Verify Live Site (5 min)

### Test login
- [ ] Go to `https://aakar-hindi.vercel.app/login`
- [ ] Enter:
  - Username: `teacher`
  - Password: `aakar2026`
- [ ] Click **Sign In**
- [ ] Should redirect to **Teacher Dashboard** with empty student list

### Test student account
- [ ] In Teacher Dashboard → **Students → Add Student**
- [ ] Fill in:
  - Name: Test Student
  - Username: `test`
  - Password: `password123`
  - Track: PSLE
  - Grade: P5
- [ ] Click **Add Student**
- [ ] Log out (top-right menu → **Logout**)
- [ ] Log in as `test` / `password123`
- [ ] Should see **Student Dashboard** with progress stats

### Test quiz flow
- [ ] Click any track (PSLE)
- [ ] Click **Choose Your Level → Foundational → Start Practice**
- [ ] Answer a few questions
- [ ] Click **Submit**
- [ ] Should see score and return to dashboard

---

## ✅ Phase 5: Ongoing Maintenance

### Adding more students
- [ ] Teacher logs in
- [ ] **Students → Add Student**
- [ ] Enter details
- [ ] No redeploy needed — updates happen instantly

### Updating content (questions, lessons)
- [ ] Edit files in `data/` directory
- [ ] Push to GitHub:
  ```bash
  git add data/
  git commit -m "Update grammar questions"
  git push
  ```
- [ ] Vercel auto-deploys (~2 min)

### Custom domain (optional)
- [ ] In Vercel dashboard → **Settings → Domains**
- [ ] Add your domain (e.g., `hindi.aakar-tuition.sg`)
- [ ] Follow DNS setup instructions

---

## 🚨 Troubleshooting

### "Invalid username or password" even with correct credentials
- [ ] Check Supabase: **Table Editor → users** — is the teacher row there?
- [ ] Verify password hash matches (or re-insert with correct hash)

### "supabaseUrl is required" error on Vercel
- [ ] Check Vercel **Settings → Environment Variables**
- [ ] Ensure `NEXT_PUBLIC_SUPABASE_URL` is set for all three environments
- [ ] Redeploy (click **Deploy** button) after adding vars

### Page loads but shows "missing required error components"
- [ ] Check Vercel **Deployments** tab — is there a build error?
- [ ] Check browser console (F12) for errors
- [ ] Check Vercel **Function Logs** for API errors

### Supabase connection times out
- [ ] Verify service role key is correct (long string, not truncated)
- [ ] Check Supabase project is not paused (free tier pauses after 1 week inactivity)

---

## 📋 Summary of Credentials to Keep Safe

Once deployed, you will have:

| Item | Where to Store |
|---|---|
| GitHub repo URL | Bookmark |
| Vercel project URL | Bookmark |
| Supabase project URL | Note (public) |
| Supabase service role key | **KEEP PRIVATE** — never commit or share |
| Teacher username/password | Share with teacher only |
| JWT_SECRET | Already in Vercel env vars (safe) |

---

## ✨ You're live!

Your Aakar Hindi platform is now running on Vercel with persistent Supabase database. Students can log in and practice anytime, anywhere. Teacher can manage students and track progress in real-time.

For detailed guidance on daily usage, see [TEACHER_GUIDE.md](./TEACHER_GUIDE.md).
