import {
	createTableFilters,
	type FilterCondition,
	type FilterGroup,
	Sort,
} from "../lib/query-builder";
import type { Department, DepartmentInsert, SupabaseInstance } from "../types";
import type { Tables } from "../types/database";
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

	/**
	 * Pre-configured filter factory for the team table
	 * Eliminates need to specify generics every time
	 */
	Filters = createTableFilters<"team">();

	/**
	 * Pre-configured sort factory for the team table
	 */
	TeamSort = {
		asc: (column: keyof Tables<"team">) => Sort.asc<"team">(column),
		desc: (column: keyof Tables<"team">) => Sort.desc<"team">(column),
	};

	async getById(id: string): Promise<Department> {
		return this.findById(id);
	}

	// ============================================================================
	// CONVENIENCE METHODS - Using optimized filter factory
	// ============================================================================

	/**
	 * Get departments by organization ID
	 */
	async getAllByOrganizationId(organizationId: string): Promise<Department[]> {
		return this.findBy("organizationId", organizationId);
	}

	/**
	 * Get departments by name search
	 */
	async searchDepartmentsByName(
		organizationId: string,
		searchTerm: string,
		options?: {
			sortBy?: "name" | "createdAt" | "updatedAt";
			sortOrder?: "asc" | "desc";
			limit?: number;
		},
	): Promise<Department[]> {
		const filters: FilterCondition<"team">[] = [
			this.Filters.eq("organizationId", organizationId),
		];

		const sort = options?.sortBy
			? [this.TeamSort[options.sortOrder || "asc"](options.sortBy)]
			: undefined;

		return this.search({
			filters,
			search: {
				columns: ["name"],
				term: searchTerm,
			},
			sort,
			pagination: options?.limit ? { limit: options.limit } : undefined,
		});
	}

	/**
	 * Get departments with pagination
	 */
	async getDepartmentsPaginated(
		organizationId: string,

		page: number,
		limit: number,
		options?: {
			searchTerm?: string;
			sortBy?: "name" | "createdAt" | "updatedAt";
			sortOrder?: "asc" | "desc";
		},
	): Promise<{
		data: Department[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const filters: FilterCondition<"team">[] = [
			this.Filters.eq("organizationId", organizationId),
		];

		const sort = options?.sortBy
			? [this.TeamSort[options.sortOrder || "asc"](options.sortBy)]
			: undefined;

		return this.searchPaginated({
			filters,
			search: options?.searchTerm
				? {
						columns: ["name"],
						term: options.searchTerm,
					}
				: undefined,
			sort,
			page,
			limit,
		});
	}

	/**
	 * Get department count
	 */
	async getDepartmentCount(organizationId: string): Promise<number> {
		const filters: FilterCondition<"team">[] = [
			this.Filters.eq("organizationId", organizationId),
		];

		return this.count(filters);
	}

	/**
	 * Search departments with complex filters
	 */
	async searchDepartmentsAdvanced(
		filters: FilterGroup<"team"> | FilterCondition<"team">[],
	): Promise<Department[]> {
		return this.find({ filters });
	}

	/**
	 * Get departments created after a specific date
	 */
	async getDepartmentsCreatedAfter(
		organizationId: string,
		date: string,
	): Promise<Department[]> {
		const filters: FilterCondition<"team">[] = [
			this.Filters.eq("organizationId", organizationId),
			this.Filters.gte("createdAt", date),
		];

		return this.find({ filters });
	}

	/**
	 * Get departments updated after a specific date
	 */
	async getDepartmentsUpdatedAfter(
		organizationId: string,
		date: string,
	): Promise<Department[]> {
		const filters: FilterCondition<"team">[] = [
			this.Filters.eq("organizationId", organizationId),
			this.Filters.gte("updatedAt", date),
		];

		return this.find({ filters });
	}

	/**
	 * Get departments by multiple IDs
	 */
	async getDepartmentsByIds(
		organizationId: string,
		departmentIds: string[],
	): Promise<Department[]> {
		const filters: FilterCondition<"team">[] = [
			this.Filters.eq("organizationId", organizationId),
			this.Filters.in("id", departmentIds),
		];

		return this.find({ filters });
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
