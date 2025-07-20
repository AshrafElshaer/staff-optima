revoke delete on table "public"."jwks" from "anon";

revoke insert on table "public"."jwks" from "anon";

revoke references on table "public"."jwks" from "anon";

revoke select on table "public"."jwks" from "anon";

revoke trigger on table "public"."jwks" from "anon";

revoke truncate on table "public"."jwks" from "anon";

revoke update on table "public"."jwks" from "anon";

revoke delete on table "public"."jwks" from "authenticated";

revoke insert on table "public"."jwks" from "authenticated";

revoke references on table "public"."jwks" from "authenticated";

revoke select on table "public"."jwks" from "authenticated";

revoke trigger on table "public"."jwks" from "authenticated";

revoke truncate on table "public"."jwks" from "authenticated";

revoke update on table "public"."jwks" from "authenticated";

revoke delete on table "public"."jwks" from "service_role";

revoke insert on table "public"."jwks" from "service_role";

revoke references on table "public"."jwks" from "service_role";

revoke select on table "public"."jwks" from "service_role";

revoke trigger on table "public"."jwks" from "service_role";

revoke truncate on table "public"."jwks" from "service_role";

revoke update on table "public"."jwks" from "service_role";

alter table "public"."jwks" drop constraint "jwks_pkey";

drop index if exists "public"."jwks_pkey";

drop table "public"."jwks";


