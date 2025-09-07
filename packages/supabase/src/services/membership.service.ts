import { createTableFilters } from "../lib/query-builder";
import type {
	DepartmentMember,
	MembershipInsert,
	MembershipRow,
	MembershipUpdate,
	SupabaseInstance,
} from "../types";
import { BaseService } from "./base.service";

export class MembershipService extends BaseService<"member"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "member");
	}

	private readonly memberFilters = createTableFilters<"member">();
	private readonly departmentMemberFilters = createTableFilters<"teamMember">();

	async getById(id: string): Promise<MembershipRow> {
		return this.findById(id);
	}

	async createMembership(membership: MembershipInsert): Promise<MembershipRow> {
		return this.create(membership);
	}

	async updateMembership(
		membership: MembershipUpdate & { userId: string },
	): Promise<MembershipRow> {
		if (!membership.userId) {
			throw new Error("User ID is required");
		}
		return this.updateBy("userId", membership.userId, membership);
	}

	async deleteMembership(id: string): Promise<MembershipRow> {
		return this.delete(id);
	}
}
