import {
	Filter,
	type FilterCondition,
	type FilterGroup,
	Sort,
} from "../lib/query-builder";
import type { Department, DepartmentInsert, SupabaseInstance } from "../types";
import { BaseService } from "./base.service";

export class DepartmentService extends BaseService<"team"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "team");
	}

	async getById(id: string): Promise<Department> {
		return this.findById(id);
	}

	// ============================================================================
	// CONVENIENCE METHODS - Using generic BaseService methods
	// ============================================================================

	/**
	 * Get departments by organization ID
	 */
	async getAllByOrganizationId(organizationId: string): Promise<Department[]> {
		return this.findBy("organizationId", organizationId);
	}

	/**
	 * Get active departments only
	 */
	async getActiveDepartments(organizationId: string): Promise<Department[]> {
		return this.find({
			filters: [
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			],
		});
	}

	/**
	 * Get departments by multiple statuses
	 */
	async getDepartmentsByStatuses(
		organizationId: string,
		statuses: string[],
	): Promise<Department[]> {
		return this.find({
			filters: [
				Filter.eq("organizationId", organizationId),
				Filter.in("status", statuses),
			],
		});
	}

	/**
	 * Search departments with text search
	 */
	async searchDepartments(
		organizationId: string,
		searchTerm: string,
		options?: {
			status?: string;
			sortBy?: string;
			sortOrder?: "asc" | "desc";
			limit?: number;
		},
	): Promise<Department[]> {
		const filters: FilterCondition[] = [
			Filter.eq("organizationId", organizationId),
		];

		if (options?.status) {
			filters.push(Filter.eq("status", options.status));
		}

		const sort = options?.sortBy
			? [Sort[options.sortOrder || "asc"](options.sortBy)]
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
			status?: string;
			sortBy?: string;
			sortOrder?: "asc" | "desc";
		},
	): Promise<{
		data: Department[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const filters: FilterCondition[] = [
			Filter.eq("organizationId", organizationId),
		];

		if (options?.status) {
			filters.push(Filter.eq("status", options.status));
		}

		const sort = options?.sortBy
			? [Sort[options.sortOrder || "asc"](options.sortBy)]
			: undefined;

		return this.searchPaginated({
			filters,
			search: options?.searchTerm
				? {
						columns: ["name", "description"],
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
	async getDepartmentCount(
		organizationId: string,
		status?: string,
	): Promise<number> {
		const filters: FilterCondition[] = [
			Filter.eq("organizationId", organizationId),
		];

		if (status) {
			filters.push(Filter.eq("status", status));
		}

		return this.count(filters);
	}

	/**
	 * Search departments with complex filters
	 */
	async searchDepartmentsAdvanced(
		filters: FilterGroup | FilterCondition[],
	): Promise<Department[]> {
		return this.find({ filters });
	}

	async create(department: DepartmentInsert): Promise<Department> {
		return this.create(department);
	}
}
