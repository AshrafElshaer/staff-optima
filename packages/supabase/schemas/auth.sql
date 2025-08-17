

create table "user" (
    "id" uuid not null primary key default gen_random_uuid(),
    "name" text not null,
    "email" text not null unique,
    "emailVerified" boolean not null,
    "image" text,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "phoneNumber" text unique,
    "phoneNumberVerified" boolean,
    "stripeCustomerId" text,
    "jobTitle" text
);

create table "session" (
    "id" uuid not null primary key default gen_random_uuid(),
    "expiresAt" timestamp not null,
    "token" text not null unique,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid not null references "user" ("id") on delete cascade,
    "activeOrganizationId" text,
    "activeTeamId" text
);

create table "account" (
    "id" uuid not null primary key default gen_random_uuid(),
    "accountId" text not null,
    "providerId" text not null,
    "userId" uuid not null references "user" ("id") on delete cascade,
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

create table "verification" (
    "id" uuid not null primary key default gen_random_uuid(),
    "identifier" text not null,
    "value" text not null,
    "expiresAt" timestamp with time zone not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


create table "organization" (
    "id" uuid not null primary key default gen_random_uuid(),
    "name" text not null,
    "slug" text not null unique,
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

create table "role" (
    "id" uuid primary key default gen_random_uuid(),
    "organizationId" uuid not null references "organization" ("id") on delete cascade,
    "name" text not null,
    "permissions" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);

create table "member" (
    "id" uuid not null primary key default gen_random_uuid(),
    "organizationId" uuid not null references "organization" ("id") on delete cascade,
    "userId" uuid not null references "user" ("id") on delete cascade,
    "role" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "roleId" uuid references "role" ("id") on delete set null
);

create table "invitation" (
    "id" uuid not null primary key default gen_random_uuid(),
    "organizationId" uuid not null references "organization" ("id") on delete cascade,
    "email" text not null,
    "role" text,
    "teamId" text,
    "status" text not null,
    "expiresAt" timestamp with time zone not null,
    "inviterId" uuid not null references "user" ("id") on delete cascade
);

create table "team" (
    "id" uuid not null primary key default gen_random_uuid(),
    "name" text not null,
    "organizationId" uuid not null references "organization" ("id") on delete cascade,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);

create table "teamMember" (
    "id" uuid not null primary key default gen_random_uuid(),
    "teamId" uuid not null references "team" ("id") on delete cascade,
    "userId" uuid not null references "user" ("id") on delete cascade,
    "createdAt" timestamp with time zone not null default now()
);


create table "subscription" (
    "id" uuid not null primary key default gen_random_uuid(),
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


create type domain_verification_status_enum as enum ('pending', 'verified', 'failed');

create table domain_verification (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references organization(id) on delete cascade,
    domain text not null,
    verification_token text not null,
    verification_status domain_verification_status_enum not null default 'pending',
    verification_date timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);