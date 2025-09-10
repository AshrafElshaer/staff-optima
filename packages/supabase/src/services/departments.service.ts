import type { Department, DepartmentInsert, SupabaseInstance } from "../types";
import { BaseService } from "./base.service";
import type { TeamMemberService } from "./team-member.service";

export class DepartmentService extends BaseService<"team"> {
	private readonly teamMemberService: TeamMemberService;
	constructor(
		supabase: SupabaseInstance,
		teamMemberService: TeamMemberService,
	) {
		super(supabase, "team");
		this.teamMemberService = teamMemberService;
	}

	async getById(id: string): Promise<Department> {
		return this.findById(id);
	}

	/**
	 * Get all departments (you can add your own filtering)
	 */
	async getAll({
		organizationId,
	}: {
		organizationId: string;
	}): Promise<Department[]> {
		return this.findAll({ select: "*", match: { organizationId } });
	}

	/**
	 * Get departments by organization ID (simple match)
	 */
	async getAllByOrganizationId(
		organizationId: string,
		filters?: {
			name?: string;
		},
	): Promise<Department[]> {
		const query = this.createBaseQuery().select("*").match({ organizationId });
		if (filters?.name) {
			query.ilike("name", `%${filters.name}%`);
		}

		const result = await query;

		if (result.error) {
			throw result.error;
		}

		return result.data || [];
	}

	async create(department: DepartmentInsert): Promise<Department> {
		const team = await super.create(department);
		await this.teamMemberService.create({
			teamId: team.id,
			userId: team.managerId as string,
		});
		return team;
	}
}
