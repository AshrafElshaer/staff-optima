create table "public"."account" (
    "id" uuid not null default gen_random_uuid(),
    "accountId" text not null,
    "providerId" text not null,
    "userId" uuid not null,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    "scope" text,
    "password" text,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


create table "public"."invitation" (
    "id" uuid not null default gen_random_uuid(),
    "organizationId" uuid not null,
    "email" text not null,
    "role" text,
    "teamId" text,
    "status" text not null,
    "expiresAt" timestamp with time zone not null,
    "inviterId" uuid not null
);


create table "public"."jwks" (
    "id" uuid not null default gen_random_uuid(),
    "publicKey" text not null,
    "privateKey" text not null,
    "createdAt" timestamp with time zone not null default now()
);


create table "public"."member" (
    "id" uuid not null default gen_random_uuid(),
    "organizationId" uuid not null,
    "userId" uuid not null,
    "role" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "roleId" uuid
);


create table "public"."organization" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "slug" text not null,
    "logo" text,
    "createdAt" timestamp with time zone not null default now(),
    "metadata" text,
    "domain" text not null,
    "isDomainVerified" boolean,
    "industry" text not null,
    "profile" text,
    "address1" text,
    "address2" text,
    "city" text,
    "state" text,
    "zipCode" text,
    "country" text not null,
    "timezone" text not null,
    "employeeCount" text
);


create table "public"."role" (
    "id" uuid not null default gen_random_uuid(),
    "organizationId" uuid not null,
    "name" text not null,
    "permissions" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


create table "public"."session" (
    "id" uuid not null default gen_random_uuid(),
    "expiresAt" timestamp without time zone not null,
    "token" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid not null,
    "activeOrganizationId" text,
    "activeTeamId" text
);


create table "public"."subscription" (
    "id" uuid not null default gen_random_uuid(),
    "plan" text not null,
    "referenceId" uuid not null,
    "stripeCustomerId" text,
    "stripeSubscriptionId" text,
    "status" text not null,
    "periodStart" timestamp with time zone,
    "periodEnd" timestamp with time zone,
    "cancelAtPeriodEnd" boolean,
    "seats" integer
);


create table "public"."team" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "organizationId" uuid not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


create table "public"."teamMember" (
    "id" uuid not null default gen_random_uuid(),
    "teamId" uuid not null,
    "userId" uuid not null,
    "createdAt" timestamp with time zone not null default now()
);


create table "public"."user" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "emailVerified" boolean not null,
    "image" text,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "phoneNumber" text,
    "phoneNumberVerified" boolean,
    "stripeCustomerId" text,
    "jobTitle" text
);


create table "public"."verification" (
    "id" uuid not null default gen_random_uuid(),
    "identifier" text not null,
    "value" text not null,
    "expiresAt" timestamp with time zone not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX account_pkey ON public.account USING btree (id);

CREATE UNIQUE INDEX invitation_pkey ON public.invitation USING btree (id);

CREATE UNIQUE INDEX jwks_pkey ON public.jwks USING btree (id);

CREATE UNIQUE INDEX member_pkey ON public.member USING btree (id);

CREATE UNIQUE INDEX organization_pkey ON public.organization USING btree (id);

CREATE UNIQUE INDEX organization_slug_key ON public.organization USING btree (slug);

CREATE UNIQUE INDEX role_pkey ON public.role USING btree (id);

CREATE UNIQUE INDEX session_pkey ON public.session USING btree (id);

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);

CREATE UNIQUE INDEX subscription_pkey ON public.subscription USING btree (id);

CREATE UNIQUE INDEX "teamMember_pkey" ON public."teamMember" USING btree (id);

CREATE UNIQUE INDEX team_pkey ON public.team USING btree (id);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX "user_phoneNumber_key" ON public."user" USING btree ("phoneNumber");

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);

CREATE UNIQUE INDEX verification_pkey ON public.verification USING btree (id);

alter table "public"."account" add constraint "account_pkey" PRIMARY KEY using index "account_pkey";

alter table "public"."invitation" add constraint "invitation_pkey" PRIMARY KEY using index "invitation_pkey";

alter table "public"."jwks" add constraint "jwks_pkey" PRIMARY KEY using index "jwks_pkey";

alter table "public"."member" add constraint "member_pkey" PRIMARY KEY using index "member_pkey";

alter table "public"."organization" add constraint "organization_pkey" PRIMARY KEY using index "organization_pkey";

alter table "public"."role" add constraint "role_pkey" PRIMARY KEY using index "role_pkey";

alter table "public"."session" add constraint "session_pkey" PRIMARY KEY using index "session_pkey";

alter table "public"."subscription" add constraint "subscription_pkey" PRIMARY KEY using index "subscription_pkey";

alter table "public"."team" add constraint "team_pkey" PRIMARY KEY using index "team_pkey";

alter table "public"."teamMember" add constraint "teamMember_pkey" PRIMARY KEY using index "teamMember_pkey";

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."verification" add constraint "verification_pkey" PRIMARY KEY using index "verification_pkey";

alter table "public"."account" add constraint "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."account" validate constraint "account_userId_fkey";

alter table "public"."invitation" add constraint "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."invitation" validate constraint "invitation_inviterId_fkey";

alter table "public"."invitation" add constraint "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES organization(id) ON DELETE CASCADE not valid;

alter table "public"."invitation" validate constraint "invitation_organizationId_fkey";

alter table "public"."member" add constraint "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES organization(id) ON DELETE CASCADE not valid;

alter table "public"."member" validate constraint "member_organizationId_fkey";

alter table "public"."member" add constraint "member_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES role(id) ON DELETE SET NULL not valid;

alter table "public"."member" validate constraint "member_roleId_fkey";

alter table "public"."member" add constraint "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."member" validate constraint "member_userId_fkey";

alter table "public"."organization" add constraint "organization_slug_key" UNIQUE using index "organization_slug_key";

alter table "public"."role" add constraint "role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES organization(id) ON DELETE CASCADE not valid;

alter table "public"."role" validate constraint "role_organizationId_fkey";

alter table "public"."session" add constraint "session_token_key" UNIQUE using index "session_token_key";

alter table "public"."session" add constraint "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."session" validate constraint "session_userId_fkey";

alter table "public"."team" add constraint "team_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES organization(id) ON DELETE CASCADE not valid;

alter table "public"."team" validate constraint "team_organizationId_fkey";

alter table "public"."teamMember" add constraint "teamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES team(id) ON DELETE CASCADE not valid;

alter table "public"."teamMember" validate constraint "teamMember_teamId_fkey";

alter table "public"."teamMember" add constraint "teamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."teamMember" validate constraint "teamMember_userId_fkey";

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";

alter table "public"."user" add constraint "user_phoneNumber_key" UNIQUE using index "user_phoneNumber_key";

grant delete on table "public"."account" to "anon";

grant insert on table "public"."account" to "anon";

grant references on table "public"."account" to "anon";

grant select on table "public"."account" to "anon";

grant trigger on table "public"."account" to "anon";

grant truncate on table "public"."account" to "anon";

grant update on table "public"."account" to "anon";

grant delete on table "public"."account" to "authenticated";

grant insert on table "public"."account" to "authenticated";

grant references on table "public"."account" to "authenticated";

grant select on table "public"."account" to "authenticated";

grant trigger on table "public"."account" to "authenticated";

grant truncate on table "public"."account" to "authenticated";

grant update on table "public"."account" to "authenticated";

grant delete on table "public"."account" to "service_role";

grant insert on table "public"."account" to "service_role";

grant references on table "public"."account" to "service_role";

grant select on table "public"."account" to "service_role";

grant trigger on table "public"."account" to "service_role";

grant truncate on table "public"."account" to "service_role";

grant update on table "public"."account" to "service_role";

grant delete on table "public"."invitation" to "anon";

grant insert on table "public"."invitation" to "anon";

grant references on table "public"."invitation" to "anon";

grant select on table "public"."invitation" to "anon";

grant trigger on table "public"."invitation" to "anon";

grant truncate on table "public"."invitation" to "anon";

grant update on table "public"."invitation" to "anon";

grant delete on table "public"."invitation" to "authenticated";

grant insert on table "public"."invitation" to "authenticated";

grant references on table "public"."invitation" to "authenticated";

grant select on table "public"."invitation" to "authenticated";

grant trigger on table "public"."invitation" to "authenticated";

grant truncate on table "public"."invitation" to "authenticated";

grant update on table "public"."invitation" to "authenticated";

grant delete on table "public"."invitation" to "service_role";

grant insert on table "public"."invitation" to "service_role";

grant references on table "public"."invitation" to "service_role";

grant select on table "public"."invitation" to "service_role";

grant trigger on table "public"."invitation" to "service_role";

grant truncate on table "public"."invitation" to "service_role";

grant update on table "public"."invitation" to "service_role";

grant delete on table "public"."jwks" to "anon";

grant insert on table "public"."jwks" to "anon";

grant references on table "public"."jwks" to "anon";

grant select on table "public"."jwks" to "anon";

grant trigger on table "public"."jwks" to "anon";

grant truncate on table "public"."jwks" to "anon";

grant update on table "public"."jwks" to "anon";

grant delete on table "public"."jwks" to "authenticated";

grant insert on table "public"."jwks" to "authenticated";

grant references on table "public"."jwks" to "authenticated";

grant select on table "public"."jwks" to "authenticated";

grant trigger on table "public"."jwks" to "authenticated";

grant truncate on table "public"."jwks" to "authenticated";

grant update on table "public"."jwks" to "authenticated";

grant delete on table "public"."jwks" to "service_role";

grant insert on table "public"."jwks" to "service_role";

grant references on table "public"."jwks" to "service_role";

grant select on table "public"."jwks" to "service_role";

grant trigger on table "public"."jwks" to "service_role";

grant truncate on table "public"."jwks" to "service_role";

grant update on table "public"."jwks" to "service_role";

grant delete on table "public"."member" to "anon";

grant insert on table "public"."member" to "anon";

grant references on table "public"."member" to "anon";

grant select on table "public"."member" to "anon";

grant trigger on table "public"."member" to "anon";

grant truncate on table "public"."member" to "anon";

grant update on table "public"."member" to "anon";

grant delete on table "public"."member" to "authenticated";

grant insert on table "public"."member" to "authenticated";

grant references on table "public"."member" to "authenticated";

grant select on table "public"."member" to "authenticated";

grant trigger on table "public"."member" to "authenticated";

grant truncate on table "public"."member" to "authenticated";

grant update on table "public"."member" to "authenticated";

grant delete on table "public"."member" to "service_role";

grant insert on table "public"."member" to "service_role";

grant references on table "public"."member" to "service_role";

grant select on table "public"."member" to "service_role";

grant trigger on table "public"."member" to "service_role";

grant truncate on table "public"."member" to "service_role";

grant update on table "public"."member" to "service_role";

grant delete on table "public"."organization" to "anon";

grant insert on table "public"."organization" to "anon";

grant references on table "public"."organization" to "anon";

grant select on table "public"."organization" to "anon";

grant trigger on table "public"."organization" to "anon";

grant truncate on table "public"."organization" to "anon";

grant update on table "public"."organization" to "anon";

grant delete on table "public"."organization" to "authenticated";

grant insert on table "public"."organization" to "authenticated";

grant references on table "public"."organization" to "authenticated";

grant select on table "public"."organization" to "authenticated";

grant trigger on table "public"."organization" to "authenticated";

grant truncate on table "public"."organization" to "authenticated";

grant update on table "public"."organization" to "authenticated";

grant delete on table "public"."organization" to "service_role";

grant insert on table "public"."organization" to "service_role";

grant references on table "public"."organization" to "service_role";

grant select on table "public"."organization" to "service_role";

grant trigger on table "public"."organization" to "service_role";

grant truncate on table "public"."organization" to "service_role";

grant update on table "public"."organization" to "service_role";

grant delete on table "public"."role" to "anon";

grant insert on table "public"."role" to "anon";

grant references on table "public"."role" to "anon";

grant select on table "public"."role" to "anon";

grant trigger on table "public"."role" to "anon";

grant truncate on table "public"."role" to "anon";

grant update on table "public"."role" to "anon";

grant delete on table "public"."role" to "authenticated";

grant insert on table "public"."role" to "authenticated";

grant references on table "public"."role" to "authenticated";

grant select on table "public"."role" to "authenticated";

grant trigger on table "public"."role" to "authenticated";

grant truncate on table "public"."role" to "authenticated";

grant update on table "public"."role" to "authenticated";

grant delete on table "public"."role" to "service_role";

grant insert on table "public"."role" to "service_role";

grant references on table "public"."role" to "service_role";

grant select on table "public"."role" to "service_role";

grant trigger on table "public"."role" to "service_role";

grant truncate on table "public"."role" to "service_role";

grant update on table "public"."role" to "service_role";

grant delete on table "public"."session" to "anon";

grant insert on table "public"."session" to "anon";

grant references on table "public"."session" to "anon";

grant select on table "public"."session" to "anon";

grant trigger on table "public"."session" to "anon";

grant truncate on table "public"."session" to "anon";

grant update on table "public"."session" to "anon";

grant delete on table "public"."session" to "authenticated";

grant insert on table "public"."session" to "authenticated";

grant references on table "public"."session" to "authenticated";

grant select on table "public"."session" to "authenticated";

grant trigger on table "public"."session" to "authenticated";

grant truncate on table "public"."session" to "authenticated";

grant update on table "public"."session" to "authenticated";

grant delete on table "public"."session" to "service_role";

grant insert on table "public"."session" to "service_role";

grant references on table "public"."session" to "service_role";

grant select on table "public"."session" to "service_role";

grant trigger on table "public"."session" to "service_role";

grant truncate on table "public"."session" to "service_role";

grant update on table "public"."session" to "service_role";

grant delete on table "public"."subscription" to "anon";

grant insert on table "public"."subscription" to "anon";

grant references on table "public"."subscription" to "anon";

grant select on table "public"."subscription" to "anon";

grant trigger on table "public"."subscription" to "anon";

grant truncate on table "public"."subscription" to "anon";

grant update on table "public"."subscription" to "anon";

grant delete on table "public"."subscription" to "authenticated";

grant insert on table "public"."subscription" to "authenticated";

grant references on table "public"."subscription" to "authenticated";

grant select on table "public"."subscription" to "authenticated";

grant trigger on table "public"."subscription" to "authenticated";

grant truncate on table "public"."subscription" to "authenticated";

grant update on table "public"."subscription" to "authenticated";

grant delete on table "public"."subscription" to "service_role";

grant insert on table "public"."subscription" to "service_role";

grant references on table "public"."subscription" to "service_role";

grant select on table "public"."subscription" to "service_role";

grant trigger on table "public"."subscription" to "service_role";

grant truncate on table "public"."subscription" to "service_role";

grant update on table "public"."subscription" to "service_role";

grant delete on table "public"."team" to "anon";

grant insert on table "public"."team" to "anon";

grant references on table "public"."team" to "anon";

grant select on table "public"."team" to "anon";

grant trigger on table "public"."team" to "anon";

grant truncate on table "public"."team" to "anon";

grant update on table "public"."team" to "anon";

grant delete on table "public"."team" to "authenticated";

grant insert on table "public"."team" to "authenticated";

grant references on table "public"."team" to "authenticated";

grant select on table "public"."team" to "authenticated";

grant trigger on table "public"."team" to "authenticated";

grant truncate on table "public"."team" to "authenticated";

grant update on table "public"."team" to "authenticated";

grant delete on table "public"."team" to "service_role";

grant insert on table "public"."team" to "service_role";

grant references on table "public"."team" to "service_role";

grant select on table "public"."team" to "service_role";

grant trigger on table "public"."team" to "service_role";

grant truncate on table "public"."team" to "service_role";

grant update on table "public"."team" to "service_role";

grant delete on table "public"."teamMember" to "anon";

grant insert on table "public"."teamMember" to "anon";

grant references on table "public"."teamMember" to "anon";

grant select on table "public"."teamMember" to "anon";

grant trigger on table "public"."teamMember" to "anon";

grant truncate on table "public"."teamMember" to "anon";

grant update on table "public"."teamMember" to "anon";

grant delete on table "public"."teamMember" to "authenticated";

grant insert on table "public"."teamMember" to "authenticated";

grant references on table "public"."teamMember" to "authenticated";

grant select on table "public"."teamMember" to "authenticated";

grant trigger on table "public"."teamMember" to "authenticated";

grant truncate on table "public"."teamMember" to "authenticated";

grant update on table "public"."teamMember" to "authenticated";

grant delete on table "public"."teamMember" to "service_role";

grant insert on table "public"."teamMember" to "service_role";

grant references on table "public"."teamMember" to "service_role";

grant select on table "public"."teamMember" to "service_role";

grant trigger on table "public"."teamMember" to "service_role";

grant truncate on table "public"."teamMember" to "service_role";

grant update on table "public"."teamMember" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";

grant delete on table "public"."verification" to "anon";

grant insert on table "public"."verification" to "anon";

grant references on table "public"."verification" to "anon";

grant select on table "public"."verification" to "anon";

grant trigger on table "public"."verification" to "anon";

grant truncate on table "public"."verification" to "anon";

grant update on table "public"."verification" to "anon";

grant delete on table "public"."verification" to "authenticated";

grant insert on table "public"."verification" to "authenticated";

grant references on table "public"."verification" to "authenticated";

grant select on table "public"."verification" to "authenticated";

grant trigger on table "public"."verification" to "authenticated";

grant truncate on table "public"."verification" to "authenticated";

grant update on table "public"."verification" to "authenticated";

grant delete on table "public"."verification" to "service_role";

grant insert on table "public"."verification" to "service_role";

grant references on table "public"."verification" to "service_role";

grant select on table "public"."verification" to "service_role";

grant trigger on table "public"."verification" to "service_role";

grant truncate on table "public"."verification" to "service_role";

grant update on table "public"."verification" to "service_role";


