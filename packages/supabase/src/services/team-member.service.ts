import { createTableFilters } from "../lib/query-builder";
import type { DepartmentMember, SupabaseInstance } from "../types";
import { BaseService } from "./base.service";

export class TeamMemberService extends BaseService<"teamMember"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "teamMember");
	}

	private readonly teamMemberFilters = createTableFilters<"teamMember">();

	async getTeamMembers(teamId: string): Promise<DepartmentMember[]> {
		return this.find({
			filters: [this.teamMemberFilters.eq("teamId", teamId)],
		});
	}
}
