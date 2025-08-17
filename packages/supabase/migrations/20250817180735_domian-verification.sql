create type "public"."domain_verification_status_enum" as enum ('pending', 'verified', 'failed');


  create table "public"."domain_verification" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "domain" text not null,
    "verification_token" text not null,
    "verification_status" domain_verification_status_enum not null default 'pending'::domain_verification_status_enum,
    "verification_date" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


CREATE UNIQUE INDEX domain_verification_pkey ON public.domain_verification USING btree (id);

alter table "public"."domain_verification" add constraint "domain_verification_pkey" PRIMARY KEY using index "domain_verification_pkey";

alter table "public"."domain_verification" add constraint "domain_verification_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE not valid;

alter table "public"."domain_verification" validate constraint "domain_verification_organization_id_fkey";

grant delete on table "public"."domain_verification" to "anon";

grant insert on table "public"."domain_verification" to "anon";

grant references on table "public"."domain_verification" to "anon";

grant select on table "public"."domain_verification" to "anon";

grant trigger on table "public"."domain_verification" to "anon";

grant truncate on table "public"."domain_verification" to "anon";

grant update on table "public"."domain_verification" to "anon";

grant delete on table "public"."domain_verification" to "authenticated";

grant insert on table "public"."domain_verification" to "authenticated";

grant references on table "public"."domain_verification" to "authenticated";

grant select on table "public"."domain_verification" to "authenticated";

grant trigger on table "public"."domain_verification" to "authenticated";

grant truncate on table "public"."domain_verification" to "authenticated";

grant update on table "public"."domain_verification" to "authenticated";

grant delete on table "public"."domain_verification" to "service_role";

grant insert on table "public"."domain_verification" to "service_role";

grant references on table "public"."domain_verification" to "service_role";

grant select on table "public"."domain_verification" to "service_role";

grant trigger on table "public"."domain_verification" to "service_role";

grant truncate on table "public"."domain_verification" to "service_role";

grant update on table "public"."domain_verification" to "service_role";


