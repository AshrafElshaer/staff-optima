/**
 * Robust Query System Examples
 *
 * This file demonstrates how to use the new robust, generic query system
 * that eliminates the need to define custom methods in each service.
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

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
	async getActiveDepartments(organizationId: string) {
		// Uses generic find method - no custom method needed!
		return this.departmentService.find({
			filters: [
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			],
		});
	}

	/**
	 * Example 3: Find with complex filters
	 */
	async getDepartmentsWithComplexFilters(organizationId: string) {
		const complexFilters: FilterGroup = Filter.and(
			Filter.eq("organizationId", organizationId),
			Filter.or(
				Filter.and(Filter.eq("status", "active"), Filter.gte("memberCount", 5)),
				Filter.and(Filter.eq("status", "pending"), Filter.lt("memberCount", 3)),
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
		return this.departmentService.searchText(
			["name", "description"],
			searchTerm,
			{
				filters: [Filter.eq("organizationId", organizationId)],
			},
		);
	}

	/**
	 * Example 5: Advanced search with all options
	 */
	async advancedSearch(organizationId: string, searchTerm: string) {
		// Uses generic search method - no custom method needed!
		return this.departmentService.search({
			filters: [
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			],
			search: {
				columns: ["name", "description"],
				term: searchTerm,
			},
			sort: [Sort.asc("name")],
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
			filters: [Filter.eq("organizationId", organizationId)],
			page,
			limit,
			sort: [Sort.desc("createdAt")],
		});
	}

	/**
	 * Example 7: Find by multiple fields
	 */
	async getDepartmentsByFields(organizationId: string, status: string) {
		// Uses generic findByFields method - no custom method needed!
		return this.departmentService.findByFields({
			organizationId,
			status,
		});
	}

	/**
	 * Example 8: Find by IN operator
	 */
	async getDepartmentsByStatuses(organizationId: string, statuses: string[]) {
		// Uses generic findByIn method - no custom method needed!
		return this.departmentService.findByIn("status", statuses, {
			filters: [Filter.eq("organizationId", organizationId)],
		});
	}

	/**
	 * Example 9: Count with filters
	 */
	async getDepartmentCount(organizationId: string, status?: string) {
		const filters: FilterCondition[] = [
			Filter.eq("organizationId", organizationId),
		];

		if (status) {
			filters.push(Filter.eq("status", status));
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
				Filter.eq("organizationId", organizationId),
				Filter.eq("name", name),
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
		const [departments, totalCount, activeCount] = await Promise.all([
			// Get recent departments
			this.departmentService.search({
				filters: [Filter.eq("organizationId", organizationId)],
				sort: [Sort.desc("createdAt")],
				pagination: { limit: 10 },
			}),
			// Get total count
			this.departmentService.count([
				Filter.eq("organizationId", organizationId),
			]),
			// Get active count
			this.departmentService.count([
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			]),
		]);

		return {
			departments,
			stats: {
				total: totalCount,
				active: activeCount,
				inactive: totalCount - activeCount,
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
			status?: string;
			sortBy?: string;
			sortOrder?: "asc" | "desc";
			page?: number;
			limit?: number;
		},
	) {
		const filters: FilterCondition[] = [
			Filter.eq("organizationId", organizationId),
		];

		if (uiFilters.status) {
			filters.push(Filter.eq("status", uiFilters.status));
		}

		const sort = uiFilters.sortBy
			? [Sort[uiFilters.sortOrder || "asc"](uiFilters.sortBy)]
			: undefined;

		if (uiFilters.page && uiFilters.limit) {
			// Use paginated search
			return this.departmentService.searchPaginated({
				filters,
				search: uiFilters.searchTerm
					? {
							columns: ["name", "description"],
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
							columns: ["name", "description"],
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
		const [
			totalDepartments,
			activeDepartments,
			pendingDepartments,
			recentDepartments,
		] = await Promise.all([
			// Total count
			this.departmentService.count([
				Filter.eq("organizationId", organizationId),
			]),
			// Active count
			this.departmentService.count([
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			]),
			// Pending count
			this.departmentService.count([
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "pending"),
			]),
			// Recent departments (last 30 days)
			this.departmentService.find({
				filters: [
					Filter.eq("organizationId", organizationId),
					Filter.gte(
						"createdAt",
						new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
					),
				],
				sort: [Sort.desc("createdAt")],
			}),
		]);

		return {
			total: totalDepartments,
			active: activeDepartments,
			pending: pendingDepartments,
			recent: recentDepartments.length,
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
		additionalFilters: FilterCondition[] = [],
	) => [Filter.eq("organizationId", organizationId), ...additionalFilters],

	/**
	 * Create status filters
	 */
	createStatusFilters: (status: string | string[]) => {
		if (Array.isArray(status)) {
			return Filter.in("status", status);
		}
		return Filter.eq("status", status);
	},

	/**
	 * Create date range filters
	 */
	createDateRangeFilters: (startDate: string, endDate: string) => [
		Filter.gte("createdAt", startDate),
		Filter.lt("createdAt", endDate),
	],

	/**
	 * Create search configuration
	 */
	createSearchConfig: (columns: string[], term: string) => ({
		columns,
		term,
	}),

	/**
	 * Create sort configuration
	 */
	createSortConfig: (column: string, order: "asc" | "desc" = "asc") => [
		Sort[order](column),
	],

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
	status?: string | string[];
	searchTerm?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
	dateRange?: {
		start: string;
		end: string;
	};
};

export const createDepartmentQuery = (options: DepartmentQueryOptions) => {
	const filters: FilterCondition[] = [
		Filter.eq("organizationId", options.organizationId),
	];

	// Add status filter
	if (options.status) {
		if (Array.isArray(options.status)) {
			filters.push(Filter.in("status", options.status));
		} else {
			filters.push(Filter.eq("status", options.status));
		}
	}

	// Add date range filter
	if (options.dateRange) {
		filters.push(Filter.gte("createdAt", options.dateRange.start));
		filters.push(Filter.lt("createdAt", options.dateRange.end));
	}

	const sort = options.sortBy
		? [Sort[options.sortOrder || "asc"](options.sortBy)]
		: undefined;

	const search = options.searchTerm
		? {
				columns: ["name", "description"],
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
			status,
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

		const [total, active, recent] = await Promise.all([
			departmentService.count([Filter.eq("organizationId", organizationId)]),
			departmentService.count([
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			]),
			departmentService.find({
				filters: [
					Filter.eq("organizationId", organizationId),
					Filter.gte(
						"createdAt",
						new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
					),
				],
			}),
		]);

		return { total, active, recentCount: recent.length };
	},
};
