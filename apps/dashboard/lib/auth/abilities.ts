import {
	createMongoAbility,
	type ForcedSubject,
	type MongoAbility,
	type RawRuleOf,
} from "@casl/ability";
import type { Permission } from "./permissions";
import { permissions } from "./permissions";

// Extract literal types directly from the permissions array
export type Actions = Permission["action"];
export type Subjects = Permission["subject"];

// Create arrays for runtime use
export const actions = [
	...new Set(permissions.map((p) => p.action.toLowerCase())),
] as const;
export const subjects = [
	...new Set(permissions.map((p) => p.subject.toLowerCase())),
] as const;

export type Abilities = [
	Actions,
	Subjects | ForcedSubject<Exclude<Subjects, "all">>,
];

export type AppAbility = MongoAbility<Abilities>;

export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
	createMongoAbility<AppAbility>(rules);

// Helper type to get all possible subjects except 'all'
export type SubjectType = Exclude<Subjects, "all">;

// Helper type to get all possible actions
export type ActionType = Actions;
