-- ============================================================
-- 세계 수도 퀴즈 : Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 전체 붙여넣고 Run
-- ============================================================

-- 1) 응답 테이블
create table if not exists public.attempts (
  id          bigint generated always as identity primary key,
  section     text        not null,   -- 분반
  student_id  text        not null,   -- 학번
  name        text        not null,   -- 이름
  week        integer     not null,   -- 주차
  score       integer     not null,   -- 맞힌 개수
  total       integer     not null,   -- 문항 수
  wrong       jsonb       not null default '[]'::jsonb,  -- [{country, answer, chosen}]
  answers     jsonb       not null default '{}'::jsonb,  -- {country: chosen}
  created_at  timestamptz not null default now()
);
create index if not exists attempts_student_idx on public.attempts (student_id, week, created_at);

-- 2) 관리자 설정 (익명 접근 불가)
create table if not exists public.app_config (
  key   text primary key,
  value text not null
);
-- ▼ 교수자용 화면 비밀번호. 원하는 값으로 바꾸세요.
insert into public.app_config (key, value) values ('admin_password', 'jeonghwa2026')
  on conflict (key) do update set value = excluded.value;

-- 3) RLS : 익명은 insert만 가능, select는 아래 RPC로만
alter table public.attempts   enable row level security;
alter table public.app_config enable row level security;

drop policy if exists "anon can insert attempts" on public.attempts;
create policy "anon can insert attempts"
  on public.attempts for insert to anon with check (true);

-- 4) 학생 본인 이력 조회 (학번 + 이름 일치 시에만)
create or replace function public.get_history(p_student_id text, p_name text)
returns setof public.attempts
language sql security definer set search_path = public as $$
  select * from public.attempts
  where student_id = p_student_id
    and replace(name, ' ', '') = replace(p_name, ' ', '')
  order by created_at;
$$;
grant execute on function public.get_history(text, text) to anon;

-- 5) 교수자 전체 조회 (비밀번호 일치 시)
create or replace function public.admin_attempts(p_password text)
returns setof public.attempts
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.app_config
                 where key = 'admin_password' and value = p_password) then
    raise exception 'wrong password' using errcode = '28000';
  end if;
  return query select * from public.attempts order by section, student_id, week, created_at;
end;
$$;
grant execute on function public.admin_attempts(text) to anon;
