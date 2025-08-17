alter table "public"."role" alter column "permissions" set data type jsonb using "permissions"::jsonb;


