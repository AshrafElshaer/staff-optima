import type {
	RoleInsert,
	RoleRow,
	RoleUpdate,
	SupabaseInstance,
} from "../types";
import { BaseService } from "./base.service";

export class RoleService extends BaseService<"role"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "role");
	}

	async getById(id: string): Promise<RoleRow> {
		return this.findById(id);
	}

	async getByOrganization(organizationId: string): Promise<RoleRow[]> {
		const { data, error } = await this.supabase
			.from(this.tableName)
			.select()
			.eq("organizationId", organizationId);

		if (error) {
			throw error;
		}

		return data;
	}

	async createRole(role: RoleInsert): Promise<RoleRow> {
		return this.create({
			...role,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
	}

	async updateRole(role: RoleUpdate & { id: string }): Promise<RoleRow> {
		if (!role.id) {
			throw new Error("Role ID is required");
		}

		return this.update(role.id, {
			...role,
			updatedAt: new Date().toISOString(),
		});
	}

	async deleteRole(id: string): Promise<RoleRow> {
		return this.delete(id);
	}

	async updatePermissions(id: string, permissions: string): Promise<RoleRow> {
		return this.update(id, {
			permissions,
			updatedAt: new Date().toISOString(),
		});
	}
}
