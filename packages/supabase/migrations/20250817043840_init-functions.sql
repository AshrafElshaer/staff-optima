set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.current_user_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select ((current_setting('better_auth.user', true)::jsonb)->>'id')::uuid;
$function$
;

CREATE OR REPLACE FUNCTION public.current_user_json()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select current_setting('better_auth.user', true)::jsonb;
$function$
;

CREATE OR REPLACE FUNCTION public.current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select (current_setting('better_auth.user', true)::jsonb)->>'role';
$function$
;

CREATE OR REPLACE FUNCTION public.set_current_user(user_data jsonb)
 RETURNS void
 LANGUAGE sql
AS $function$
  select set_config('better_auth.user', user_data::text, true);
$function$
;

drop policy "Anyone can delete an avatar." on "storage"."objects";

drop policy "Anyone can update an avatar." on "storage"."objects";

drop policy "Anyone can upload an avatar." on "storage"."objects";

drop policy "Avatar images are publicly accessible." on "storage"."objects";


