import {
	createTableFilters,
	type FilterCondition,
	type FilterGroup,
	Sort,
} from "../lib/query-builder";
import type { Department, DepartmentInsert, SupabaseInstance } from "../types";
import type { Tables } from "../types/database";
import { BaseService } from "./base.service";

export class DepartmentService extends BaseService<"team"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "team");
	}

	/**
	 * Pre-configured filter factory for the team table
	 * Eliminates need to specify generics every time
	 */
	private readonly Filters = createTableFilters<"team">();

	/**
	 * Pre-configured sort factory for the team table
	 */
	private readonly teamSort = {
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
			? [this.teamSort[options.sortOrder || "asc"](options.sortBy)]
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
			? [this.teamSort[options.sortOrder || "asc"](options.sortBy)]
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
		return this.create(department);
	}
}
