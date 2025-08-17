-- Store current user JSON in session
create or replace function public.set_current_user(user_data jsonb)
returns void
language sql
as $$
  select set_config('better_auth.user', user_data::text, true);
$$;

-- Get entire user object
create or replace function public.current_user_json()
returns jsonb
language sql stable
as $$
  select current_setting('better_auth.user', true)::jsonb;
$$;

-- Helper: current user id
create or replace function public.current_user_id()
returns uuid
language sql stable
as $$
  select ((current_setting('better_auth.user', true)::jsonb)->>'id')::uuid;
$$;

-- Helper: current user role
create or replace function public.current_user_role()
returns text
language sql stable
as $$
  select (current_setting('better_auth.user', true)::jsonb)->>'role';
$$;
