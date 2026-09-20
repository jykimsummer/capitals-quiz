-- ============================================================
-- 세계 수도 퀴즈 → 「자기주도적학습코칭 완전정복」 업데이트용
-- 처음 만들 때 supabase.sql 을 이미 실행했다면, 이 한 줄만 추가로 실행하면 됩니다.
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run
-- ============================================================

alter table public.attempts
  add column if not exists mode text not null default 'capital-mc';
