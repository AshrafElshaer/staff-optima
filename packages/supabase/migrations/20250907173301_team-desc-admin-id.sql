alter table "public"."team" add column "description" text;

alter table "public"."team" add column "managerId" uuid;

alter table "public"."team" add constraint "team_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "user"(id) ON DELETE SET NULL not valid;

alter table "public"."team" validate constraint "team_managerId_fkey";


