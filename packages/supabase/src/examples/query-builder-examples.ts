/**
 * QueryBuilder Usage Examples
 *
 * This file demonstrates how to use the new QueryBuilder system for
 * effective, maintainable, and scalable Supabase queries.
 */

import type { FilterCondition, FilterGroup } from "../lib/query-builder";
import {
	createTableFilters,
	Filter,
	Pagination,
	Sort,
} from "../lib/query-builder";

// ============================================================================
// TABLE-SPECIFIC FILTER INSTANCES
// ============================================================================

export const tableFilterExamples = {
	// Create table-specific filter instances
	teamFilters: createTableFilters<"team">(),
	userFilters: createTableFilters<"user">(),
	departmentFilters: createTableFilters<"team">(),

	// Usage examples with type safety
	basicUsage: () => {
		const teamFilters = createTableFilters<"team">();

		// All these are type-safe for the team table
		const filters = [
			teamFilters.eq("organizationId", "org-123"),
			teamFilters.gte("createdAt", "2024-01-01"),
			teamFilters.ilike("name", "%marketing%"),
		];

		return filters;
	},

	// Complex filtering with table-specific filters
	complexFiltering: () => {
		const teamFilters = createTableFilters<"team">();

		return teamFilters.and(
			teamFilters.eq("organizationId", "org-123"),
			teamFilters.or(
				teamFilters.gte("createdAt", "2024-01-01"),
				teamFilters.lte("updatedAt", "2024-12-31"),
			),
		);
	},

	// Multiple table filtering
	multiTableFiltering: () => {
		const teamFilters = createTableFilters<"team">();
		const userFilters = createTableFilters<"user">();

		// Each filter instance is type-safe for its specific table
		const teamConditions = [
			teamFilters.eq("organizationId", "org-123"),
			teamFilters.gte("createdAt", "2024-01-01"),
		];

		const userConditions = [
			userFilters.eq("id", "123"),
			userFilters.eq("emailVerified", true),
		];

		return { teamConditions, userConditions };
	},
};

// ============================================================================
// BASIC FILTERING EXAMPLES
// ============================================================================

export const basicFilteringExamples = {
	// Simple equality filter (typesafe for team table)
	simpleEq: () => [Filter.eq<"team", string>("organizationId", "org-123")],

	// Multiple conditions (AND by default) - using only team table columns
	multipleConditions: () => [
		Filter.eq<"team", string>("organizationId", "org-123"),
		Filter.gte<"team", string>("createdAt", "2024-01-01"),
	],

	// Using IN operator for multiple values
	inOperator: () => [
		Filter.eq<"team", string>("organizationId", "org-123"),
		Filter.in<"team", string>("id", ["dept-1", "dept-2", "dept-3"]),
	],

	// Text search with ILIKE
	textSearch: () => [
		Filter.eq<"team", string>("organizationId", "org-123"),
		Filter.ilike<"team">("name", "%marketing%"),
	],

	// Date range filtering
	dateRange: () => [
		Filter.eq<"team", string>("organizationId", "org-123"),
		Filter.gte<"team", string>("createdAt", "2024-01-01"),
		Filter.lt<"team", string>("createdAt", "2024-12-31"),
	],
};

// ============================================================================
// COMPLEX FILTERING WITH GROUPS
// ============================================================================

export const complexFilteringExamples = {
	// OR conditions within AND group (using team table columns)
	orWithinAnd: (): FilterGroup<"team"> =>
		Filter.and<"team">(
			Filter.eq<"team", string>("organizationId", "org-123"),
			Filter.or<"team">(
				Filter.gte<"team", string>("createdAt", "2024-01-01"),
				Filter.lte<"team", string>("updatedAt", "2024-12-31"),
			),
			Filter.gte<"team", string>("createdAt", "2024-01-01"),
		),

	// Nested groups for complex logic (using team table columns)
	nestedGroups: (): FilterGroup<"team"> =>
		Filter.and<"team">(
			Filter.eq<"team", string>("organizationId", "org-123"),
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
		),

	// Search with multiple criteria (using team table columns)
	searchWithCriteria: (searchTerm: string): FilterGroup<"team"> =>
		Filter.and<"team">(
			Filter.eq<"team", string>("organizationId", "org-123"),
			Filter.or<"team">(Filter.ilike<"team">("name", `%${searchTerm}%`)),
		),
};

// ============================================================================
// SORTING EXAMPLES
// ============================================================================

export const sortingExamples = {
	// Single column sort (typesafe for team table)
	singleColumn: () => [Sort.asc<"team">("name")],

	// Multiple column sort (typesafe for team table)
	multipleColumns: () => [
		Sort.desc<"team">("createdAt"),
		Sort.asc<"team">("name"),
	],

	// Dynamic sorting (typesafe for team table)
	dynamicSort: (
		column: "name" | "createdAt" | "updatedAt",
		order: "asc" | "desc",
	) => [Sort[order]<"team">(column)],
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
	constructor(private departmentService: any) {} // biome-ignore lint/suspicious/noExplicitAny: examples need any for demonstration

	// Example 1: Basic department listing with table-specific filters
	async getDepartmentsForOrganization(organizationId: string) {
		const teamFilters = createTableFilters<"team">();

		return this.departmentService.searchDepartments({
			filters: [teamFilters.eq("organizationId", organizationId)],
			limit: 20,
			sortBy: "name",
			sortOrder: "asc",
		});
	}

	// Example 2: Search departments with text search using table-specific filters
	async searchDepartments(organizationId: string, searchTerm: string) {
		const teamFilters = createTableFilters<"team">();

		return this.departmentService.searchDepartments({
			filters: [teamFilters.eq("organizationId", organizationId)],
			search: { columns: ["name"], term: searchTerm },
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

	// Example 4: Complex filtering with table-specific filters
	async getDepartmentsWithComplexFilters(organizationId: string) {
		const teamFilters = createTableFilters<"team">();

		const filters = teamFilters.and(
			teamFilters.eq("organizationId", organizationId),
			teamFilters.or(
				teamFilters.and(
					teamFilters.gte("createdAt", "2024-01-01"),
					teamFilters.lte("createdAt", "2024-06-30"),
				),
				teamFilters.and(
					teamFilters.gte("updatedAt", "2024-07-01"),
					teamFilters.lte("updatedAt", "2024-12-31"),
				),
			),
			teamFilters.gte("createdAt", "2024-01-01"),
		);

		return this.departmentService.searchDepartmentsAdvanced(filters);
	}

	// Example 5: Get department statistics using table-specific filters
	async getDepartmentStats(organizationId: string) {
		const teamFilters = createTableFilters<"team">();

		const [total, recent] = await Promise.all([
			this.departmentService.count([
				teamFilters.eq("organizationId", organizationId),
			]),
			this.departmentService.find({
				filters: [
					teamFilters.eq("organizationId", organizationId),
					teamFilters.gte("createdAt", "2024-01-01"),
				],
			}),
		]);

		return { total, recent: recent.length };
	}
}

// ============================================================================
// ADVANCED QUERY BUILDER USAGE
// ============================================================================

export class AdvancedQueryExamples {
	constructor(private queryBuilder: any) {} // biome-ignore lint/suspicious/noExplicitAny: examples need any for demonstration

	// Example 1: Building queries programmatically with table-specific filters
	async buildDynamicQuery(filters: Record<string, any>) {
		// biome-ignore lint/suspicious/noExplicitAny: examples need any for demonstration
		const teamFilters = createTableFilters<"team">();
		const filterConditions: FilterCondition<"team">[] = [];

		// Add organization filter
		if (filters.organizationId) {
			filterConditions.push(
				teamFilters.eq("organizationId", filters.organizationId),
			);
		}

		// Add date range filter
		if (filters.startDate && filters.endDate) {
			filterConditions.push(teamFilters.gte("createdAt", filters.startDate));
			filterConditions.push(teamFilters.lt("createdAt", filters.endDate));
		}

		// Add text search
		if (filters.searchTerm) {
			return this.queryBuilder
				.applyFilters(filterConditions)
				.applySearch({
					columns: ["name"],
					term: filters.searchTerm,
				})
				.applySort([Sort.desc<"team">("createdAt")])
				.applyPagination(Pagination.limit(filters.limit || 20))
				.execute();
		}

		return this.queryBuilder
			.applyFilters(filterConditions)
			.applySort([Sort.desc<"team">("createdAt")])
			.applyPagination(Pagination.limit(filters.limit || 20))
			.execute();
	}

	// Example 2: Chaining multiple operations with table-specific filters
	async chainOperations(organizationId: string) {
		const teamFilters = createTableFilters<"team">();

		return this.queryBuilder
			.applyFilters([
				teamFilters.eq("organizationId", organizationId),
				teamFilters.gte("createdAt", "2024-01-01"),
			])
			.applySearch({
				columns: ["name"],
				term: "marketing",
			})
			.applySort([Sort.asc<"team">("name")])
			.applyPagination(Pagination.limit(10))
			.execute();
	}

	// Example 3: Getting count and data separately with table-specific filters
	async getDataWithCount(organizationId: string) {
		const teamFilters = createTableFilters<"team">();
		const filters = [teamFilters.eq("organizationId", organizationId)];

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
	// Helper to create common filter patterns with table-specific filters
	createCommonFilters: (
		organizationId: string,
		options: {
			searchTerm?: string;
			dateRange?: { start: string; end: string };
		},
	) => {
		const teamFilters = createTableFilters<"team">();
		const filters: FilterCondition<"team">[] = [
			teamFilters.eq("organizationId", organizationId),
		];

		if (options.dateRange) {
			filters.push(teamFilters.gte("createdAt", options.dateRange.start));
			filters.push(teamFilters.lt("createdAt", options.dateRange.end));
		}

		return filters;
	},

	// Helper to create pagination config
	createPagination: (page: number, limit: number) =>
		Pagination.limit(limit, (page - 1) * limit),

	// Helper to create sort config (typesafe for team table)
	createSort: (
		column: "name" | "createdAt" | "updatedAt",
		order: "asc" | "desc" = "asc",
	) => Sort[order]<"team">(column),
};

// ============================================================================
// TYPE-SAFE QUERY BUILDERS
// ============================================================================

export type DepartmentFilters = {
	organizationId: string;
	searchTerm?: string;
	createdAfter?: string;
	createdBefore?: string;
	updatedAfter?: string;
	updatedBefore?: string;
};

export const createDepartmentFilters = (
	filters: DepartmentFilters,
): FilterCondition<"team">[] => {
	const teamFilters = createTableFilters<"team">();
	const conditions: FilterCondition<"team">[] = [
		teamFilters.eq("organizationId", filters.organizationId),
	];

	if (filters.createdAfter) {
		conditions.push(teamFilters.gte("createdAt", filters.createdAfter));
	}

	if (filters.createdBefore) {
		conditions.push(teamFilters.lt("createdAt", filters.createdBefore));
	}

	if (filters.updatedAfter) {
		conditions.push(teamFilters.gte("updatedAt", filters.updatedAfter));
	}

	if (filters.updatedBefore) {
		conditions.push(teamFilters.lt("updatedAt", filters.updatedBefore));
	}

	return conditions;
};
