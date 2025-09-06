/**
 * QueryBuilder Usage Examples
 *
 * This file demonstrates how to use the new QueryBuilder system for
 * effective, maintainable, and scalable Supabase queries.
 */

import type { FilterCondition, FilterGroup } from "../lib/query-builder";
import { Filter, Pagination, Sort } from "../lib/query-builder";

// ============================================================================
// BASIC FILTERING EXAMPLES
// ============================================================================

export const basicFilteringExamples = {
	// Simple equality filter
	simpleEq: () => [Filter.eq("organizationId", "org-123")],

	// Multiple conditions (AND by default)
	multipleConditions: () => [
		Filter.eq("organizationId", "org-123"),
		Filter.eq("status", "active"),
		Filter.gte("createdAt", "2024-01-01"),
	],

	// Using IN operator for multiple values
	inOperator: () => [
		Filter.eq("organizationId", "org-123"),
		Filter.in("status", ["active", "pending", "draft"]),
	],

	// Text search with ILIKE
	textSearch: () => [
		Filter.eq("organizationId", "org-123"),
		Filter.ilike("name", "%marketing%"),
	],

	// Date range filtering
	dateRange: () => [
		Filter.eq("organizationId", "org-123"),
		Filter.gte("createdAt", "2024-01-01"),
		Filter.lt("createdAt", "2024-12-31"),
	],
};

// ============================================================================
// COMPLEX FILTERING WITH GROUPS
// ============================================================================

export const complexFilteringExamples = {
	// OR conditions within AND group
	orWithinAnd: (): FilterGroup =>
		Filter.and(
			Filter.eq("organizationId", "org-123"),
			Filter.or(Filter.eq("status", "active"), Filter.eq("status", "pending")),
			Filter.gte("createdAt", "2024-01-01"),
		),

	// Nested groups for complex logic
	nestedGroups: (): FilterGroup =>
		Filter.and(
			Filter.eq("organizationId", "org-123"),
			Filter.or(
				Filter.and(Filter.eq("status", "active"), Filter.gte("memberCount", 5)),
				Filter.and(Filter.eq("status", "pending"), Filter.lt("memberCount", 3)),
			),
		),

	// Search with multiple criteria
	searchWithCriteria: (searchTerm: string): FilterGroup =>
		Filter.and(
			Filter.eq("organizationId", "org-123"),
			Filter.or(
				Filter.ilike("name", `%${searchTerm}%`),
				Filter.ilike("description", `%${searchTerm}%`),
				Filter.ilike("tags", `%${searchTerm}%`),
			),
		),
};

// ============================================================================
// SORTING EXAMPLES
// ============================================================================

export const sortingExamples = {
	// Single column sort
	singleColumn: () => [Sort.asc("name")],

	// Multiple column sort
	multipleColumns: () => [Sort.desc("createdAt"), Sort.asc("name")],

	// Dynamic sorting
	dynamicSort: (column: string, order: "asc" | "desc") => [Sort[order](column)],
};

// ============================================================================
// PAGINATION EXAMPLES
// ============================================================================

export const paginationExamples = {
	// Simple limit
	simpleLimit: () => Pagination.limit(10),

	// Limit with offset
	limitWithOffset: () => Pagination.limit(10, 20),

	// Range-based pagination
	rangeBased: () => Pagination.range(0, 9),

	// Page-based pagination helper
	pageBased: (page: number, limit: number) =>
		Pagination.limit(limit, (page - 1) * limit),
};

// ============================================================================
// REAL-WORLD USAGE EXAMPLES
// ============================================================================

export class DepartmentQueryExamples {
	constructor(private departmentService: any) {}

	// Example 1: Basic department listing with filters
	async getDepartmentsForOrganization(organizationId: string) {
		return this.departmentService.searchDepartments({
			organizationId,
			limit: 20,
			sortBy: "name",
			sortOrder: "asc",
		});
	}

	// Example 2: Search departments with text search
	async searchDepartments(organizationId: string, searchTerm: string) {
		return this.departmentService.searchDepartments({
			organizationId,
			searchTerm,
			limit: 10,
		});
	}

	// Example 3: Get active departments with pagination
	async getActiveDepartmentsPaginated(organizationId: string, page: number) {
		return this.departmentService.getDepartmentsPaginated({
			organizationId,
			page,
			limit: 10,
			status: "active",
		});
	}

	// Example 4: Complex filtering with custom filters
	async getDepartmentsWithComplexFilters(organizationId: string) {
		const filters = Filter.and(
			Filter.eq("organizationId", organizationId),
			Filter.or(
				Filter.and(Filter.eq("status", "active"), Filter.gte("memberCount", 3)),
				Filter.and(Filter.eq("status", "pending"), Filter.lt("memberCount", 5)),
			),
			Filter.gte("createdAt", "2024-01-01"),
		);

		return this.departmentService.searchDepartmentsAdvanced(filters);
	}

	// Example 5: Get department statistics
	async getDepartmentStats(organizationId: string) {
		const [total, active, pending] = await Promise.all([
			this.departmentService.getDepartmentCount(organizationId),
			this.departmentService.getDepartmentCount(organizationId, "active"),
			this.departmentService.getDepartmentCount(organizationId, "pending"),
		]);

		return { total, active, pending };
	}
}

// ============================================================================
// ADVANCED QUERY BUILDER USAGE
// ============================================================================

export class AdvancedQueryExamples {
	constructor(private queryBuilder: any) {}

	// Example 1: Building queries programmatically
	async buildDynamicQuery(filters: Record<string, any>) {
		const filterConditions: FilterCondition[] = [];

		// Add organization filter
		if (filters.organizationId) {
			filterConditions.push(
				Filter.eq("organizationId", filters.organizationId),
			);
		}

		// Add status filter
		if (filters.status) {
			if (Array.isArray(filters.status)) {
				filterConditions.push(Filter.in("status", filters.status));
			} else {
				filterConditions.push(Filter.eq("status", filters.status));
			}
		}

		// Add date range filter
		if (filters.startDate && filters.endDate) {
			filterConditions.push(Filter.gte("createdAt", filters.startDate));
			filterConditions.push(Filter.lt("createdAt", filters.endDate));
		}

		// Add text search
		if (filters.searchTerm) {
			return this.queryBuilder
				.applyFilters(filterConditions)
				.applySearch({
					columns: ["name", "description"],
					term: filters.searchTerm,
				})
				.applySort([Sort.desc("createdAt")])
				.applyPagination(Pagination.limit(filters.limit || 20))
				.execute();
		}

		return this.queryBuilder
			.applyFilters(filterConditions)
			.applySort([Sort.desc("createdAt")])
			.applyPagination(Pagination.limit(filters.limit || 20))
			.execute();
	}

	// Example 2: Chaining multiple operations
	async chainOperations(organizationId: string) {
		return this.queryBuilder
			.applyFilters([
				Filter.eq("organizationId", organizationId),
				Filter.eq("status", "active"),
			])
			.applySearch({
				columns: ["name"],
				term: "marketing",
			})
			.applySort([Sort.asc("name")])
			.applyPagination(Pagination.limit(10))
			.execute();
	}

	// Example 3: Getting count and data separately
	async getDataWithCount(organizationId: string) {
		const filters = [Filter.eq("organizationId", organizationId)];

		const [data, count] = await Promise.all([
			this.queryBuilder
				.applyFilters(filters)
				.applyPagination(Pagination.limit(20))
				.execute(),
			this.queryBuilder.applyFilters(filters).executeCount(),
		]);

		return { data, count };
	}
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const queryUtils = {
	// Helper to create common filter patterns
	createCommonFilters: (
		organizationId: string,
		options: {
			status?: string | string[];
			searchTerm?: string;
			dateRange?: { start: string; end: string };
		},
	) => {
		const filters: FilterCondition[] = [
			Filter.eq("organizationId", organizationId),
		];

		if (options.status) {
			if (Array.isArray(options.status)) {
				filters.push(Filter.in("status", options.status));
			} else {
				filters.push(Filter.eq("status", options.status));
			}
		}

		if (options.dateRange) {
			filters.push(Filter.gte("createdAt", options.dateRange.start));
			filters.push(Filter.lt("createdAt", options.dateRange.end));
		}

		return filters;
	},

	// Helper to create pagination config
	createPagination: (page: number, limit: number) =>
		Pagination.limit(limit, (page - 1) * limit),

	// Helper to create sort config
	createSort: (column: string, order: "asc" | "desc" = "asc") =>
		Sort[order](column),
};

// ============================================================================
// TYPE-SAFE QUERY BUILDERS
// ============================================================================

export type DepartmentFilters = {
	organizationId: string;
	status?: "active" | "pending" | "inactive";
	searchTerm?: string;
	memberCountMin?: number;
	memberCountMax?: number;
	createdAfter?: string;
	createdBefore?: string;
};

export const createDepartmentFilters = (
	filters: DepartmentFilters,
): FilterCondition[] => {
	const conditions: FilterCondition[] = [
		Filter.eq("organizationId", filters.organizationId),
	];

	if (filters.status) {
		conditions.push(Filter.eq("status", filters.status));
	}

	if (filters.memberCountMin !== undefined) {
		conditions.push(Filter.gte("memberCount", filters.memberCountMin));
	}

	if (filters.memberCountMax !== undefined) {
		conditions.push(Filter.lte("memberCount", filters.memberCountMax));
	}

	if (filters.createdAfter) {
		conditions.push(Filter.gte("createdAt", filters.createdAfter));
	}

	if (filters.createdBefore) {
		conditions.push(Filter.lt("createdAt", filters.createdBefore));
	}

	return conditions;
};
