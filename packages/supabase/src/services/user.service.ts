import type {
	SupabaseInstance,
	UserInsert,
	UserRow,
	UserUpdate,
} from "../types";
import { BaseService } from "./base.service";

export class UserService extends BaseService<"user"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "user");
	}

	async getById(id: string): Promise<UserRow> {
		return this.findById(id);
	}

	async createUser(user: UserInsert): Promise<UserRow> {
		return this.create(user);
	}

	async updateUser(user: UserUpdate & { id: string }): Promise<UserRow> {
		return this.update(user.id, user);
	}

	async deleteUser(id: string): Promise<UserRow> {
		return this.delete(id);
	}
}
