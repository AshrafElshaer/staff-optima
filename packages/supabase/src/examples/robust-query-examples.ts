/**
 * Robust Query System Examples
 *
 * This file demonstrates how to use the new robust, generic query system
 * that eliminates the need to define custom methods in each service.
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: examples need any for demonstration */

import { createServerClient } from "../clients/server";
import type { FilterCondition, FilterGroup } from "../lib/query-builder";
import { Filter, Sort } from "../lib/query-builder";
import { DepartmentService } from "../services";

// ============================================================================
// GENERIC SERVICE USAGE EXAMPLES
// ============================================================================

export class GenericServiceExamples {
	constructor(private departmentService: any) {}

	// ============================================================================
	// BASIC QUERIES - No custom methods needed!
	// ============================================================================

	/**
	 * Example 1: Find by single field
	 */
	async getDepartmentsByOrganization(organizationId: string) {
		// Uses generic findBy method - no custom method needed!
		return this.departmentService.findBy("organizationId", organizationId);
	}

	/**
	 * Example 2: Find with multiple filters
	 */
	async getRecentDepartments(organizationId: string) {
		// Uses generic find method - no custom method needed!
		return this.departmentService.find({
			filters: [
				Filter.eq<"team", string>("organizationId", organizationId),
				Filter.gte<"team", string>("createdAt", "2024-01-01"),
			],
		});
	}

	/**
	 * Example 3: Find with complex filters
	 */
	async getDepartmentsWithComplexFilters(organizationId: string) {
		const complexFilters: FilterGroup<"team"> = Filter.and<"team">(
			Filter.eq<"team", string>("organizationId", organizationId),
			Filter.or<"team">(
				Filter.and<"team">(
					Filter.gte<"team", string>("createdAt", "2024-01-01"),
					Filter.lte<"team", string>("createdAt", "2024-06-30"),
				),
				Filter.and<"team">(
					Filter.gte<"team", string>("updatedAt", "2024-07-01"),
					Filter.lte<"team", string>("updatedAt", "2024-12-31"),
				),
			),
		);

		// Uses generic find method - no custom method needed!
		return this.departmentService.find({
			filters: complexFilters,
		});
	}

	/**
	 * Example 4: Search with text search
	 */
	async searchDepartments(organizationId: string, searchTerm: string) {
		// Uses generic searchText method - no custom method needed!
		return this.departmentService.searchText(["name"], searchTerm, {
			filters: [Filter.eq<"team", string>("organizationId", organizationId)],
		});
	}

	/**
	 * Example 5: Advanced search with all options
	 */
	async advancedSearch(organizationId: string, searchTerm: string) {
		// Uses generic search method - no custom method needed!
		return this.departmentService.search({
			filters: [
				Filter.eq<"team", string>("organizationId", organizationId),
				Filter.gte<"team", string>("createdAt", "2024-01-01"),
			],
			search: {
				columns: ["name"],
				term: searchTerm,
			},
			sort: [Sort.asc<"team">("name")],
			pagination: { limit: 20 },
		});
	}

	/**
	 * Example 6: Paginated search
	 */
	async getPaginatedDepartments(
		organizationId: string,
		page: number,
		limit: number,
	) {
		// Uses generic searchPaginated method - no custom method needed!
		return this.departmentService.searchPaginated({
			filters: [Filter.eq<"team", string>("organizationId", organizationId)],
			page,
			limit,
			sort: [Sort.desc<"team">("createdAt")],
		});
	}

	/**
	 * Example 7: Find by multiple fields (using team table columns)
	 */
	async getDepartmentsByFields(organizationId: string, name: string) {
		// Uses generic findByFields method - no custom method needed!
		return this.departmentService.findByFields({
			organizationId,
			name,
		});
	}

	/**
	 * Example 8: Find by IN operator (using team table columns)
	 */
	async getDepartmentsByIds(organizationId: string, departmentIds: string[]) {
		// Uses generic findByIn method - no custom method needed!
		return this.departmentService.findByIn("id", departmentIds, {
			filters: [Filter.eq<"team", string>("organizationId", organizationId)],
		});
	}

	/**
	 * Example 9: Count with filters (using team table columns)
	 */
	async getDepartmentCount(organizationId: string, createdAfter?: string) {
		const filters: FilterCondition<"team">[] = [
			Filter.eq<"team", string>("organizationId", organizationId),
		];

		if (createdAfter) {
			filters.push(Filter.gte<"team", string>("createdAt", createdAfter));
		}

		// Uses generic count method - no custom method needed!
		return this.departmentService.count(filters);
	}

	/**
	 * Example 10: Find one record
	 */
	async getDepartmentByName(organizationId: string, name: string) {
		// Uses generic findOne method - no custom method needed!
		return this.departmentService.findOne({
			filters: [
				Filter.eq<"team", string>("organizationId", organizationId),
				Filter.eq<"team", string>("name", name),
			],
		});
	}

	// ============================================================================
	// REAL-WORLD USAGE PATTERNS
	// ============================================================================

	/**
	 * Dashboard data loading
	 */
	async loadDashboardData(organizationId: string) {
		const [departments, totalCount, recentCount] = await Promise.all([
			// Get recent departments
			this.departmentService.search({
				filters: [Filter.eq<"team", string>("organizationId", organizationId)],
				sort: [Sort.desc<"team">("createdAt")],
				pagination: { limit: 10 },
			}),
			// Get total count
			this.departmentService.count([
				Filter.eq<"team", string>("organizationId", organizationId),
			]),
			// Get recent count (created in last 30 days)
			this.departmentService.count([
				Filter.eq<"team", string>("organizationId", organizationId),
				Filter.gte<"team", string>("createdAt", "2024-01-01"),
			]),
		]);

		return {
			departments,
			stats: {
				total: totalCount,
				recent: recentCount,
				older: totalCount - recentCount,
			},
		};
	}

	/**
	 * Search with filters from UI
	 */
	async searchWithUIFilters(
		organizationId: string,
		uiFilters: {
			searchTerm?: string;
			createdAfter?: string;
			sortBy?: "name" | "createdAt" | "updatedAt";
			sortOrder?: "asc" | "desc";
			page?: number;
			limit?: number;
		},
	) {
		const filters: FilterCondition<"team">[] = [
			Filter.eq<"team", string>("organizationId", organizationId),
		];

		if (uiFilters.createdAfter) {
			filters.push(
				Filter.gte<"team", string>("createdAt", uiFilters.createdAfter),
			);
		}

		const sort = uiFilters.sortBy
			? [Sort[uiFilters.sortOrder || "asc"]<"team">(uiFilters.sortBy)]
			: undefined;

		if (uiFilters.page && uiFilters.limit) {
			// Use paginated search
			return this.departmentService.searchPaginated({
				filters,
				search: uiFilters.searchTerm
					? {
							columns: ["name"],
							term: uiFilters.searchTerm,
						}
					: undefined,
				sort,
				page: uiFilters.page,
				limit: uiFilters.limit,
			});
		} else {
			// Use regular search
			return this.departmentService.search({
				filters,
				search: uiFilters.searchTerm
					? {
							columns: ["name"],
							term: uiFilters.searchTerm,
						}
					: undefined,
				sort,
				pagination: uiFilters.limit ? { limit: uiFilters.limit } : undefined,
			});
		}
	}

	/**
	 * Analytics queries
	 */
	async getAnalyticsData(organizationId: string) {
		const [totalDepartments, recentDepartments, updatedDepartments] =
			await Promise.all([
				// Total count
				this.departmentService.count([
					Filter.eq<"team", string>("organizationId", organizationId),
				]),
				// Recent departments (last 30 days)
				this.departmentService.count([
					Filter.eq<"team", string>("organizationId", organizationId),
					Filter.gte<"team", string>(
						"createdAt",
						new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
					),
				]),
				// Updated departments (last 30 days)
				this.departmentService.count([
					Filter.eq<"team", string>("organizationId", organizationId),
					Filter.gte<"team", string>(
						"updatedAt",
						new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
					),
				]),
			]);

		return {
			total: totalDepartments,
			recent: recentDepartments,
			updated: updatedDepartments,
		};
	}
}

// ============================================================================
// UTILITY FUNCTIONS FOR COMMON PATTERNS
// ============================================================================

export const QueryHelpers = {
	/**
	 * Create common organization filters
	 */
	createOrgFilters: (
		organizationId: string,
		additionalFilters: FilterCondition<"team">[] = [],
	) => [
		Filter.eq<"team", string>("organizationId", organizationId),
		...additionalFilters,
	],

	/**
	 * Create date range filters (typesafe for team table)
	 */
	createDateRangeFilters: (startDate: string, endDate: string) => [
		Filter.gte<"team", string>("createdAt", startDate),
		Filter.lt<"team", string>("createdAt", endDate),
	],

	/**
	 * Create search configuration (typesafe for team table)
	 */
	createSearchConfig: (
		columns: ("name" | "createdAt" | "updatedAt" | "organizationId" | "id")[],
		term: string,
	) => ({
		columns,
		term,
	}),

	/**
	 * Create sort configuration (typesafe for team table)
	 */
	createSortConfig: (
		column: "name" | "createdAt" | "updatedAt",
		order: "asc" | "desc" = "asc",
	) => [Sort[order]<"team">(column)],

	/**
	 * Create pagination configuration
	 */
	createPaginationConfig: (page: number, limit: number) => ({
		page,
		limit,
	}),
};

// ============================================================================
// TYPE-SAFE QUERY BUILDERS
// ============================================================================

export type DepartmentQueryOptions = {
	organizationId: string;
	searchTerm?: string;
	sortBy?: "name" | "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
	dateRange?: {
		start: string;
		end: string;
	};
};

export const createDepartmentQuery = (options: DepartmentQueryOptions) => {
	const filters: FilterCondition<"team">[] = [
		Filter.eq<"team", string>("organizationId", options.organizationId),
	];

	// Add date range filter
	if (options.dateRange) {
		filters.push(
			Filter.gte<"team", string>("createdAt", options.dateRange.start),
		);
		filters.push(Filter.lt<"team", string>("createdAt", options.dateRange.end));
	}

	const sort = options.sortBy
		? [Sort[options.sortOrder || "asc"]<"team">(options.sortBy)]
		: undefined;

	const search = options.searchTerm
		? {
				columns: ["name"] as (
					| "name"
					| "createdAt"
					| "updatedAt"
					| "organizationId"
					| "id"
				)[],
				term: options.searchTerm,
			}
		: undefined;

	return {
		filters,
		search,
		sort,
		pagination:
			options.page && options.limit
				? { page: options.page, limit: options.limit }
				: options.limit
					? { limit: options.limit }
					: undefined,
	};
};

// ============================================================================
// USAGE EXAMPLES WITH THE NEW SYSTEM
// ============================================================================
const supabase = await createServerClient();
export const usageExamples = {
	/**
	 * Simple department listing
	 */
	async getDepartments(organizationId: string) {
		const departmentService = new DepartmentService(supabase);
		return departmentService.findBy("organizationId", organizationId);
	},

	/**
	 * Search with filters
	 */
	async searchDepartments(
		organizationId: string,
		searchTerm: string,
		status?: string,
	) {
		const departmentService = new DepartmentService(supabase);
		const queryOptions = createDepartmentQuery({
			organizationId,
			searchTerm,
		});

		return departmentService.search(queryOptions);
	},

	/**
	 * Paginated results
	 */
	async getPaginatedDepartments(
		organizationId: string,
		page: number,
		limit: number,
	) {
		const departmentService = new DepartmentService(supabase);
		return departmentService.searchPaginated({
			filters: [Filter.eq("organizationId", organizationId)],
			page,
			limit,
		});
	},

	/**
	 * Complex analytics query
	 */
	async getDepartmentAnalytics(organizationId: string) {
		const departmentService = new DepartmentService(supabase);

		const [total, recent, updated] = await Promise.all([
			departmentService.count([
				Filter.eq<"team", string>("organizationId", organizationId),
			]),
			departmentService.count([
				Filter.eq<"team", string>("organizationId", organizationId),
				Filter.gte<"team", string>("createdAt", "2024-01-01"),
			]),
			departmentService.find({
				filters: [
					Filter.eq<"team", string>("organizationId", organizationId),
					Filter.gte<"team", string>(
						"createdAt",
						new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
					),
				],
			}),
		]);

		return { total, recent, updated };
	},
};
