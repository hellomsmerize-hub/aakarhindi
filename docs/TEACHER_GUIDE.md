# Teacher Guide — Daily Use

Welcome to the Aakar Hindi teacher dashboard. This guide covers everything you need to manage students and track their progress. No technical knowledge is required for day-to-day use.

---

## Logging In

1. Open your browser and go to your school's Aakar Hindi URL (e.g. `https://aakar-hindi.vercel.app`).
2. Enter your teacher username and password.
3. Click **Login**. You will land on the Teacher Dashboard.

If you forget your password, contact whoever set up the system — password resets require accessing the Supabase dashboard (see SETUP.md).

---

## Teacher Dashboard Overview

The dashboard shows:

- **Total students** enrolled
- **Active this week** — students who have practised in the last 7 days
- **Papers pending OE marking** — exam papers waiting for your score on open-ended sections
- A **student list** sorted by name, with quick stats (last active, average score, streak)

---

## Viewing All Students

Click **Students** in the top navigation bar. You will see a table with:

| Column | What it means |
|--------|--------------|
| Name | Student's display name |
| Username | Login username |
| Grade | e.g. P5, Sec 3 |
| Last Active | Last day they used the platform |
| Avg Score | Average quiz score across all attempts |
| Papers Done | Number of exam papers completed |
| Streak | Consecutive days of practice |

Click any student name to open their full profile.

---

## Student Profile

A student's profile has three tabs:

### Overview tab
- Summary stats (same as the table, but in more detail)
- A module-by-module breakdown: Grammar, Vocabulary, Comprehension, Writing
- Which topics have been completed and at what score

### Quizzes tab
- Full history of quiz attempts, newest first
- Module, topic, score, and time taken for each attempt

### Exams tab
- All submitted exam papers
- Papers with open-ended (OE) sections show either "Pending marking" or the score you entered
- Click any paper to view the student's answers and enter your OE mark

---

## Adding a New Student

1. Go to **Students → Add Student** (button in the top right of the Students page).
2. Fill in the form:
   - **Full Name** — student's name as it will appear in the dashboard
   - **Username** — the login name the student will type (lowercase, no spaces; e.g. `ravi_p5`)
   - **Password** — a temporary password; the student should memorise it (minimum 6 characters)
   - **Grade** — select from the dropdown (P3, P4, P5, P6, Sec 1, Sec 2, Sec 3, Sec 4)
3. Click **Add Student**.
4. The student can log in immediately using the username and password you set.

> **Tip:** Give the student a printed slip with their username and password when you enrol them.

---

## Resetting a Student Password

If a student forgets their password:

1. Go to **Students → click the student's name**.
2. Click the **Reset Password** button (top right of the profile page).
3. Enter a new password (minimum 6 characters).
4. Click **Save**. The student can log in with the new password immediately.

The old password stops working as soon as you save the new one.

---

## Marking Open-Ended Exam Answers

When a student submits an exam paper that includes a writing or open-ended (OE) section, the system automatically marks the MCQ and fill-in-the-blank questions. The OE questions require your judgement.

**To mark a pending paper:**

1. From the Teacher Dashboard, look for the **"Papers pending OE marking"** count. Click it, or navigate to the student's profile manually.
2. In the student's **Exams tab**, papers with "Pending marking" in orange need your attention.
3. Click the paper.
4. Scroll down to the **Open-Ended section**. You will see:
   - The question prompt
   - The student's written answer
   - An input box for your score
5. Enter the score for each OE question.
6. Click **Save marks**.
7. The student's total exam score and dashboard update immediately.

**Marking guidance:**
- Each OE question shows the maximum marks available.
- Use your professional judgement based on accuracy, grammar, and completeness.
- You can enter a score of 0 if the answer is missing or completely incorrect.
- You can update the score later if needed — just revisit the paper and enter a new value.

---

## What the System Does Automatically

You do NOT need to do any of the following — the system handles them:

- **Auto-marking MCQ and fill-in-the-blank questions** — instant, no teacher input needed.
- **Calculating average scores** — updates after every quiz or exam submission.
- **Updating streak counters** — a student's streak increments automatically if they practise on consecutive days.
- **Progress bar updates** — module completion bars reflect the latest quiz results in real time.
- **Track assignment** — when you enter a grade, the system automatically places the student in the PSLE (P3–P6) or O-Level (Sec 1–4) content track.

---

## Frequently Asked Questions

**Can a student change their own password?**
Not currently. Password resets must be done by the teacher.

**Can I delete a student?**
Not from the UI currently. Contact the system administrator to remove a student from the Supabase database.

**What if a student accidentally submits an incomplete exam?**
The system records whatever answers were saved at submission. You can view the submitted answers in the Exams tab. There is currently no way to re-open a submitted paper for the student.

**Can two students have the same username?**
No. The system enforces unique usernames. If you try to add a student with an existing username, you will see a "Username already taken" error.

**What does "Track: PSLE" vs "Track: O-Level" mean?**
It controls which content the student sees:
- **PSLE** — students in P3, P4, P5, P6 see PSLE-level grammar, vocabulary, comprehension, and writing content.
- **O-Level** — students in Sec 1, Sec 2, Sec 3, Sec 4 see O-Level Hindi content.

The track is set automatically based on the grade you select when adding the student.

**A student says they can't log in. What do I do?**
1. Confirm you are using the correct URL.
2. Ask the student to check their username for typos (all lowercase).
3. Reset their password (instructions above) and provide the new one.

---

## Contact & Support

For technical issues (the site is down, pages won't load, database errors), contact your system administrator or refer to the DEPLOYMENT.md troubleshooting section.

For content issues (wrong answers, missing questions), refer to CONTENT_GUIDE.md.
