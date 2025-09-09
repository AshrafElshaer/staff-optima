import type {
	DepartmentMember,
	DepartmentMemberInsert,
	SupabaseInstance,
} from "../types";
import { BaseService } from "./base.service";

export class TeamMemberService extends BaseService<"teamMember"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "teamMember");
	}

	async getTeamMembers(teamId: string): Promise<DepartmentMember[]> {
		return this.findAll({ teamId });
	}

	async create(teamMember: DepartmentMemberInsert): Promise<DepartmentMember> {
		return super.create(teamMember);
	}
}
