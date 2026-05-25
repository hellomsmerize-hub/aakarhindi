-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  name text not null,
  role text not null check (role in ('student', 'teacher')),
  track text check (track in ('psle', 'olevel')),
  grade text, -- P3/P4/P5/P6/Sec 1/Sec 2/Sec 3/Sec 4
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PROGRESS table (one row per user, upserted on each activity)
create table public.progress (
  user_id uuid primary key references public.users(id) on delete cascade,
  questions_attempted integer default 0,
  avg_score numeric(5,2) default 0,
  papers_completed integer default 0,
  streak_days integer default 0,
  last_active date default current_date,
  updated_at timestamptz default now()
);

-- QUIZ_HISTORY table
create table public.quiz_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  module text not null check (module in ('grammar','vocabulary','comprehension','writing')),
  topic text not null,
  score integer not null,
  total integer not null,
  time_taken_seconds integer not null,
  created_at timestamptz default now()
);

-- EXAM_HISTORY table
create table public.exam_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  paper_id text not null,
  score integer not null,
  max_score integer not null,
  time_taken_seconds integer not null,
  answers_json jsonb not null default '{}',
  oe_flagged boolean default false,
  oe_score integer, -- teacher enters this later
  oe_marked_at timestamptz,
  created_at timestamptz default now()
);

-- MODULE_PROGRESS table
create table public.module_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  module text not null check (module in ('grammar','vocabulary','comprehension','writing')),
  topic text not null,
  completed boolean default false,
  score integer,
  attempts integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, module, topic)
);

-- Indexes
create index idx_quiz_history_user on public.quiz_history(user_id);
create index idx_quiz_history_created on public.quiz_history(created_at desc);
create index idx_exam_history_user on public.exam_history(user_id);
create index idx_module_progress_user on public.module_progress(user_id);

-- RLS: disable for now (we use service role in API routes)
alter table public.users disable row level security;
alter table public.progress disable row level security;
alter table public.quiz_history disable row level security;
alter table public.exam_history disable row level security;
alter table public.module_progress disable row level security;

-- Function to update streak
create or replace function update_streak(p_user_id uuid)
returns void as $$
declare
  v_last_active date;
  v_current_streak integer;
begin
  select last_active, streak_days into v_last_active, v_current_streak
  from public.progress where user_id = p_user_id;

  if v_last_active = current_date - 1 then
    -- Consecutive day
    update public.progress
      set streak_days = v_current_streak + 1,
          last_active = current_date,
          updated_at = now()
      where user_id = p_user_id;
  elsif v_last_active < current_date - 1 then
    -- Streak broken
    update public.progress
      set streak_days = 1,
          last_active = current_date,
          updated_at = now()
      where user_id = p_user_id;
  else
    -- Same day, just update timestamp
    update public.progress
      set last_active = current_date,
          updated_at = now()
      where user_id = p_user_id;
  end if;
end;
$$ language plpgsql;

-- Function to increment papers_completed
create or replace function increment_papers_completed(p_user_id uuid)
returns void as $$
begin
  insert into public.progress (user_id, papers_completed, updated_at)
    values (p_user_id, 1, now())
    on conflict (user_id)
    do update set
      papers_completed = public.progress.papers_completed + 1,
      updated_at = now();
end;
$$ language plpgsql;
