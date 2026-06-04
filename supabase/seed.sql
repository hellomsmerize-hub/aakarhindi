-- =============================================================
-- Aakar Hindi — Seed Data
-- =============================================================
-- BEFORE RUNNING THIS FILE:
--
-- Generate bcrypt hashes for passwords by running this in a terminal:
--
--   node -e "const b=require('bcryptjs'); Promise.all(['aakar2026','student123'].map(p=>b.hash(p,10))).then(h=>h.forEach(console.log))"
--
-- The first hash is for the teacher account (password: aakar2026)
-- The second hash is for the student accounts (password: student123)
--
-- Replace the PLACEHOLDER values below with the real hashes before running.
-- =============================================================

-- Teacher account
insert into public.users (id, username, password_hash, name, role, track, grade)
values (
  'a0000000-0000-0000-0000-000000000001',
  'teacher',
  -- REPLACE THIS with the hash of 'aakar2026'
  '$2b$10$REPLACE_WITH_HASH_OF_aakar2026_RUN_NODE_COMMAND_ABOVE',
  'Aakar Teacher',
  'teacher',
  null,
  null
);

-- Student 1: PSLE track, Primary 5
insert into public.users (id, username, password_hash, name, role, track, grade)
values (
  'b0000000-0000-0000-0000-000000000001',
  'priya_p5',
  -- REPLACE THIS with the hash of 'student123'
  '$2b$10$REPLACE_WITH_HASH_OF_student123_RUN_NODE_COMMAND_ABOVE',
  'Priya Sharma',
  'student',
  'psle',
  'P5'
);

-- Student 2: PSLE track, Primary 6
insert into public.users (id, username, password_hash, name, role, track, grade)
values (
  'b0000000-0000-0000-0000-000000000002',
  'arjun_p6',
  -- REPLACE THIS with the hash of 'student123'
  '$2b$10$REPLACE_WITH_HASH_OF_student123_RUN_NODE_COMMAND_ABOVE',
  'Arjun Patel',
  'student',
  'psle',
  'P6'
);

-- Student 3: O-Level track, Secondary 3
insert into public.users (id, username, password_hash, name, role, track, grade)
values (
  'b0000000-0000-0000-0000-000000000003',
  'meera_s3',
  -- REPLACE THIS with the hash of 'student123'
  '$2b$10$REPLACE_WITH_HASH_OF_student123_RUN_NODE_COMMAND_ABOVE',
  'Meera Krishnan',
  'student',
  'olevel',
  'Sec 3'
);

-- Progress rows for all users
insert into public.progress (user_id, questions_attempted, avg_score, papers_completed, streak_days, last_active)
values
  -- Teacher has no progress stats
  ('a0000000-0000-0000-0000-000000000001', 0, 0, 0, 0, current_date),
  -- Priya P5: active student with decent progress
  ('b0000000-0000-0000-0000-000000000001', 120, 72.50, 3, 5, current_date),
  -- Arjun P6: strong student preparing for PSLE
  ('b0000000-0000-0000-0000-000000000002', 245, 84.00, 7, 12, current_date),
  -- Meera S3: newer student, less activity
  ('b0000000-0000-0000-0000-000000000003', 60, 65.00, 1, 2, current_date - 1);

-- Sample quiz history for Priya (P5)
insert into public.quiz_history (user_id, module, topic, score, total, time_taken_seconds)
values
  ('b0000000-0000-0000-0000-000000000001', 'grammar', 'tenses', 8, 10, 420),
  ('b0000000-0000-0000-0000-000000000001', 'grammar', 'gender', 7, 10, 380),
  ('b0000000-0000-0000-0000-000000000001', 'vocabulary', 'synonyms', 9, 10, 300),
  ('b0000000-0000-0000-0000-000000000001', 'comprehension', 'passage-reading', 6, 10, 900);

-- Sample quiz history for Arjun (P6)
insert into public.quiz_history (user_id, module, topic, score, total, time_taken_seconds)
values
  ('b0000000-0000-0000-0000-000000000002', 'grammar', 'tenses', 10, 10, 310),
  ('b0000000-0000-0000-0000-000000000002', 'grammar', 'gender', 9, 10, 290),
  ('b0000000-0000-0000-0000-000000000002', 'vocabulary', 'synonyms', 10, 10, 260),
  ('b0000000-0000-0000-0000-000000000002', 'vocabulary', 'antonyms', 8, 10, 340),
  ('b0000000-0000-0000-0000-000000000002', 'comprehension', 'passage-reading', 9, 10, 780),
  ('b0000000-0000-0000-0000-000000000002', 'writing', 'letter-writing', 7, 10, 1200);

-- Sample quiz history for Meera (Sec 3)
insert into public.quiz_history (user_id, module, topic, score, total, time_taken_seconds)
values
  ('b0000000-0000-0000-0000-000000000003', 'grammar', 'tenses', 6, 10, 490),
  ('b0000000-0000-0000-0000-000000000003', 'vocabulary', 'idioms', 5, 10, 520);

-- Sample module progress for Priya
insert into public.module_progress (user_id, module, topic, completed, score, attempts)
values
  ('b0000000-0000-0000-0000-000000000001', 'grammar', 'tenses', true, 80, 1),
  ('b0000000-0000-0000-0000-000000000001', 'grammar', 'gender', true, 70, 1),
  ('b0000000-0000-0000-0000-000000000001', 'vocabulary', 'synonyms', true, 90, 1),
  ('b0000000-0000-0000-0000-000000000001', 'comprehension', 'passage-reading', true, 60, 1);

-- Sample module progress for Arjun
insert into public.module_progress (user_id, module, topic, completed, score, attempts)
values
  ('b0000000-0000-0000-0000-000000000002', 'grammar', 'tenses', true, 100, 1),
  ('b0000000-0000-0000-0000-000000000002', 'grammar', 'gender', true, 90, 1),
  ('b0000000-0000-0000-0000-000000000002', 'vocabulary', 'synonyms', true, 100, 1),
  ('b0000000-0000-0000-0000-000000000002', 'vocabulary', 'antonyms', true, 80, 1),
  ('b0000000-0000-0000-0000-000000000002', 'comprehension', 'passage-reading', true, 90, 1),
  ('b0000000-0000-0000-0000-000000000002', 'writing', 'letter-writing', true, 70, 1);

-- Sample module progress for Meera
insert into public.module_progress (user_id, module, topic, completed, score, attempts)
values
  ('b0000000-0000-0000-0000-000000000003', 'grammar', 'tenses', true, 60, 1),
  ('b0000000-0000-0000-0000-000000000003', 'vocabulary', 'idioms', true, 50, 1);

-- Sample exam history for Arjun (MCQ-only paper, no OE)
insert into public.exam_history (user_id, paper_id, score, max_score, time_taken_seconds, answers_json, oe_flagged)
values
  (
    'b0000000-0000-0000-0000-000000000002',
    'psle-2023-paper1',
    38,
    50,
    2700,
    '{"q1":2,"q2":0,"q3":1,"q4":3,"q5":1}',
    false
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'psle-2022-paper1',
    42,
    50,
    2580,
    '{"q1":0,"q2":2,"q3":3,"q4":1,"q5":0}',
    false
  );

-- Sample exam history for Priya (paper with OE section pending marking)
insert into public.exam_history (user_id, paper_id, score, max_score, time_taken_seconds, answers_json, oe_flagged, oe_score)
values
  (
    'b0000000-0000-0000-0000-000000000001',
    'psle-2023-paper2',
    22,
    30,
    3600,
    '{"q1":1,"q2":0,"q3":2,"oe1":"राम एक अच्छा लड़का है।"}',
    true,
    null
  );
