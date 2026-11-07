-- Client data check, v2 schema for the London project.
-- Writes come only from the server route (service role). The browser never talks to the database.

create table if not exists public.readiness_responses (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  version          integer not null default 2,
  lang             text not null check (lang in ('en','fr')),
  ref              text check (ref is null or ref ~ '^[a-z0-9-]{1,32}$'),
  first_name       text not null check (char_length(first_name) between 1 and 100),
  email            text not null check (char_length(email) between 3 and 255),
  firm             text check (firm is null or char_length(firm) <= 200),
  team_size        text not null check (team_size in ('solo','2-5','6-9','10-50','50plus')),
  sector           text not null check (sector in ('legal','financial','accounting','insurance','consulting','recruitment','property','other')),
  regulated        text not null check (regulated in ('yes','no','unsure')),
  role             text not null check (role in ('owner','manager','member')),
  tools            text[] not null default '{}',
  answers          jsonb not null,
  score_data       integer not null,
  score_team       integer not null,
  score_rules      integer not null,
  score_knowledge  integer not null,
  score_time       integer not null,
  total            integer not null check (total between 0 and 100),
  level            text not null check (level in ('exposed','careful','covered','ready')),
  flags            jsonb not null default '[]'::jsonb,
  weakest_area     text not null check (weakest_area in ('data','team','rules','knowledge','time')),
  time_inputs      jsonb not null,
  hours_90d        integer not null,
  offer            text not null check (offer in ('personal','training','brain')),
  consent          boolean not null check (consent = true),
  is_test          boolean not null default false,
  emailed_at       timestamptz
);

create index if not exists readiness_responses_created_at_idx on public.readiness_responses (created_at desc);
create index if not exists readiness_responses_ref_idx on public.readiness_responses (ref);

alter table public.readiness_responses enable row level security;
revoke all on public.readiness_responses from anon, authenticated;
grant all on public.readiness_responses to service_role;
-- No policies for anon or authenticated: with RLS on and no grants, the public key can neither read nor write.
