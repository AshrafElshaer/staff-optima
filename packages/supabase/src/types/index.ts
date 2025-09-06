import type { SupabaseClient } from "@supabase/supabase-js";
import type {
	Database,
	Enums,
	Tables,
	TablesInsert,
	TablesUpdate,
} from "./database";

export type { Database, Tables, TablesInsert, TablesUpdate, Enums };

export type SupabaseInstance = SupabaseClient<Database>;

// // Tables

export type UserRow = Tables<"user">;
export type UserUpdate = TablesUpdate<"user">;
export type UserInsert = TablesInsert<"user">;

export type OrganizationRow = Tables<"organization">;
export type OrganizationUpdate = TablesUpdate<"organization">;

export type DomainVerificationRow = Tables<"domain_verification">;
export type DomainVerificationUpdate = TablesUpdate<"domain_verification">;
export type DomainVerificationInsert = TablesInsert<"domain_verification">;

export type MembershipRow = Tables<"member">;
export type MembershipUpdate = TablesUpdate<"member">;
export type MembershipInsert = TablesInsert<"member">;

export type RoleRow = Tables<"role">;
export type RoleUpdate = TablesUpdate<"role">;
export type RoleInsert = TablesInsert<"role">;

export type Department = Tables<"team">;
export type DepartmentUpdate = TablesUpdate<"team">;
export type DepartmentInsert = TablesInsert<"team">;

// export type WorkspaceMember = Tables<"member">;
// export type Project = Tables<"projects">;
// export type ProjectMember = Tables<"project_members">;
// export type ProjectTaskColumn = Tables<"project_task_columns">;
// export type ProjectActivity = Tables<"project_activities">;

// // Enums
// export type ProjectStatus = Enums<"project_status">;
// export type ProjectPriority = Enums<"project_priority">;
// export type ProjectVisibility = Enums<"project_visibility">;
// export type ProjectActivityType = Enums<"project_activity_type">;

// export const PROJECT_STATUS: {
// 	[key in ProjectStatus]: ProjectStatus;
// } = {
// 	backlog: "backlog",
// 	on_hold: "on_hold",
// 	planning: "planning",
// 	in_progress: "in_progress",
// 	completed: "completed",
// 	archived: "archived",
// };

// export const PROJECT_PRIORITY: {
// 	[key in ProjectPriority]: ProjectPriority;
// } = {
// 	low: "low",
// 	medium: "medium",
// 	high: "high",
// 	critical: "critical",
// };

// export const PROJECT_VISIBILITY: {
// 	[key in ProjectVisibility]: ProjectVisibility;
// } = {
// 	public: "public",
// 	private: "private",
// 	internal: "internal",
// };

// export const PROJECT_ACTIVITY_TYPE: {
// 	[key in ProjectActivityType]: ProjectActivityType;
// } = {
// 	project_created: "project_created",
// 	project_updated: "project_updated",
// 	project_archived: "project_archived",
// 	project_unarchived: "project_unarchived",
// 	custom_field_updated: "custom_field_updated",
// 	setting_updated: "setting_updated",
// 	activity_log_exported: "activity_log_exported",
// 	project_deleted: "project_deleted",
// 	member_added: "member_added",
// 	member_removed: "member_removed",
// 	member_role_changed: "member_role_changed",
// 	column_created: "column_created",
// 	column_updated: "column_updated",
// 	column_deleted: "column_deleted",
// 	column_position_changed: "column_position_changed",
// 	label_created: "label_created",
// 	label_updated: "label_updated",
// 	label_deleted: "label_deleted",
// };
// export type StorageBuckets = "avatars";
// export type UploadFileOptions = {
// 	bucket: StorageBuckets;
// 	file: File;
// 	filePath: string;
// 	isUpsert?: boolean;
// };
