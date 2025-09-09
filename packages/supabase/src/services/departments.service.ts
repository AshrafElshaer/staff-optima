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

	// ============================================================================
	// BASIC CRUD METHODS - Build your own filtering logic
	// ============================================================================

	/**
	 * Get all departments (you can add your own filtering)
	 */
	async getAll(): Promise<Department[]> {
		const result = await this.supabase.from(this.tableName).select("*");

		if (result.error) {
			throw result.error;
		}

		return result.data || [];
	}

	/**
	 * Get departments by organization ID (simple match)
	 */
	async getAllByOrganizationId(organizationId: string): Promise<Department[]> {
		return this.findAll({ organizationId });
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
