-- extensões
create extension if not exists pgcrypto;

-- enums
do $$ begin
  create type user_role as enum ('funcionario', 'rh', 'lider', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type cycle_status as enum ('draft', 'open', 'closed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type email_type as enum ('monthly_reminder', 'monthly_summary', 'quarterly_summary');
exception
  when duplicate_object then null;
end $$;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- departments
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  role user_role not null default 'funcionario',
  department_id uuid references public.departments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- survey cycles
create table if not exists public.survey_cycles (
  id uuid primary key default gen_random_uuid(),
  mes int not null check (mes between 1 and 12),
  ano int not null check (ano between 2020 and 2100),
  status cycle_status not null default 'draft',
  created_at timestamptz not null default now(),
  unique (mes, ano)
);

-- survey responses
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.survey_cycles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,

  satisfacao int not null check (satisfacao between 1 and 5),
  stress int not null check (stress between 1 and 5),
  comunicacao int not null check (comunicacao between 1 and 5),
  relacao_chefia int not null check (relacao_chefia between 1 and 5),
  equilibrio_vida_trabalho int not null check (equilibrio_vida_trabalho between 1 and 5),
  carga_trabalho int not null check (carga_trabalho between 1 and 5),
  recomendaria_empresa int not null check (recomendaria_empresa between 1 and 5),

  comentario text,
  reclamacao text,
  sugestao text,

  created_at timestamptz not null default now(),
  unique (cycle_id, user_id)
);

create index if not exists idx_survey_responses_cycle_id on public.survey_responses(cycle_id);
create index if not exists idx_survey_responses_user_id on public.survey_responses(user_id);
create index if not exists idx_survey_responses_department_id on public.survey_responses(department_id);

-- email settings
create table if not exists public.email_settings (
  id uuid primary key default gen_random_uuid(),
  tipo_email email_type not null,
  destinatarios text[] not null default '{}',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tipo_email)
);

create trigger trg_email_settings_updated_at
before update on public.email_settings
for each row
execute function public.set_updated_at();

-- quarterly reports
create table if not exists public.quarterly_reports (
  id uuid primary key default gen_random_uuid(),
  quarter int not null check (quarter between 1 and 4),
  year int not null check (year between 2020 and 2100),
  resumo_ia text,
  dados_agregados_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (quarter, year)
);

-- opcional e útil para config geral
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  ceo_email text,
  company_name text not null default 'Vida Saudável',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_app_settings_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

-- função para criar profile automaticamente após signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'funcionario')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RLS
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.survey_cycles enable row level security;
alter table public.survey_responses enable row level security;
alter table public.email_settings enable row level security;
alter table public.quarterly_reports enable row level security;
alter table public.app_settings enable row level security;

-- helpers
create or replace function public.current_user_role()
returns user_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_department()
returns uuid
language sql
stable
as $$
  select department_id from public.profiles where id = auth.uid()
$$;

-- departments policies
drop policy if exists "departments readable by authenticated" on public.departments;
create policy "departments readable by authenticated"
on public.departments
for select
to authenticated
using (true);

drop policy if exists "departments writable by admin and rh" on public.departments;
create policy "departments writable by admin and rh"
on public.departments
for all
to authenticated
using (public.current_user_role() in ('admin', 'rh'))
with check (public.current_user_role() in ('admin', 'rh'));

-- profiles policies
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.current_user_role() in ('admin', 'rh')
  or (
    public.current_user_role() = 'lider'
    and department_id = public.current_user_department()
  )
);

drop policy if exists "users update own profile basic" on public.profiles;
create policy "users update own profile basic"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.current_user_role() in ('admin', 'rh'))
with check (id = auth.uid() or public.current_user_role() in ('admin', 'rh'));

-- survey_cycles policies
drop policy if exists "survey cycles readable by authenticated" on public.survey_cycles;
create policy "survey cycles readable by authenticated"
on public.survey_cycles
for select
to authenticated
using (true);

drop policy if exists "survey cycles writable by admin and rh" on public.survey_cycles;
create policy "survey cycles writable by admin and rh"
on public.survey_cycles
for all
to authenticated
using (public.current_user_role() in ('admin', 'rh'))
with check (public.current_user_role() in ('admin', 'rh'));

-- survey_responses policies
drop policy if exists "employee inserts own response" on public.survey_responses;
create policy "employee inserts own response"
on public.survey_responses
for insert
to authenticated
with check (
  user_id = auth.uid()
);

drop policy if exists "employee reads own response" on public.survey_responses;
create policy "employee reads own response"
on public.survey_responses
for select
to authenticated
using (
  user_id = auth.uid()
  or public.current_user_role() in ('admin', 'rh')
  or (
    public.current_user_role() = 'lider'
    and department_id = public.current_user_department()
  )
);

drop policy if exists "employee updates own response" on public.survey_responses;
create policy "employee updates own response"
on public.survey_responses
for update
to authenticated
using (
  user_id = auth.uid()
  or public.current_user_role() in ('admin', 'rh')
)
with check (
  user_id = auth.uid()
  or public.current_user_role() in ('admin', 'rh')
);

-- email settings policies
drop policy if exists "email settings admin rh" on public.email_settings;
create policy "email settings admin rh"
on public.email_settings
for all
to authenticated
using (public.current_user_role() in ('admin', 'rh'))
with check (public.current_user_role() in ('admin', 'rh'));

-- quarterly reports policies
drop policy if exists "quarterly reports readable by leader rh admin" on public.quarterly_reports;
create policy "quarterly reports readable by leader rh admin"
on public.quarterly_reports
for select
to authenticated
using (public.current_user_role() in ('lider', 'rh', 'admin'));

drop policy if exists "quarterly reports writable by admin rh" on public.quarterly_reports;
create policy "quarterly reports writable by admin rh"
on public.quarterly_reports
for all
to authenticated
using (public.current_user_role() in ('admin', 'rh'))
with check (public.current_user_role() in ('admin', 'rh'));

-- app settings policies
drop policy if exists "app settings admin rh" on public.app_settings;
create policy "app settings admin rh"
on public.app_settings
for all
to authenticated
using (public.current_user_role() in ('admin', 'rh'))
with check (public.current_user_role() in ('admin', 'rh'));