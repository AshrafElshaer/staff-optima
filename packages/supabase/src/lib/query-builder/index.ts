/** biome-ignore-all lint/suspicious/noExplicitAny: default to work*/
/** biome-ignore-all lint/correctness/noUnusedVariables: default to work*/
import type { Database, Tables } from "../../types/database";

export type TableName = keyof Database["public"]["Tables"];
export type Row<T extends TableName> = Tables<T>;

// Filter operation types
export type FilterOperator =
	| "eq"
	| "neq"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "like"
	| "ilike"
	| "in"
	| "is"
	| "not"
	| "or"
	| "and";

export type FilterCondition<T = unknown> = {
	column: string;
	operator: FilterOperator;
	value: T;
};

export type FilterGroup = {
	operator: "and" | "or";
	conditions: (FilterCondition | FilterGroup)[];
};

export type SortConfig = {
	column: string;
	ascending?: boolean;
};

export type PaginationConfig = {
	from?: number;
	to?: number;
	limit?: number;
	offset?: number;
};

export type QueryConfig<T extends TableName> = {
	filters?: FilterGroup | FilterCondition[];
	select?: string;
	sort?: SortConfig[];
	pagination?: PaginationConfig;
	search?: {
		columns: string[];
		term: string;
	};
};

/**
 * Helper function to create common filter conditions
 */
export const Filter = {
	eq: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "eq",
		value,
	}),

	neq: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "neq",
		value,
	}),

	gt: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "gt",
		value,
	}),

	gte: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "gte",
		value,
	}),

	lt: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "lt",
		value,
	}),

	lte: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "lte",
		value,
	}),

	like: (column: string, value: string): FilterCondition<string> => ({
		column,
		operator: "like",
		value,
	}),

	ilike: (column: string, value: string): FilterCondition<string> => ({
		column,
		operator: "ilike",
		value,
	}),

	in: <T>(column: string, values: T[]): FilterCondition<T[]> => ({
		column,
		operator: "in",
		value: values,
	}),

	is: <T>(column: string, value: T): FilterCondition<T> => ({
		column,
		operator: "is",
		value,
	}),

	and: (...conditions: (FilterCondition | FilterGroup)[]): FilterGroup => ({
		operator: "and",
		conditions,
	}),

	or: (...conditions: (FilterCondition | FilterGroup)[]): FilterGroup => ({
		operator: "or",
		conditions,
	}),
};

/**
 * Helper function to create sort configurations
 */
export const Sort = {
	asc: (column: string): SortConfig => ({ column, ascending: true }),
	desc: (column: string): SortConfig => ({ column, ascending: false }),
};

/**
 * Helper function to create pagination configurations
 */
export const Pagination = {
	limit: (limit: number, offset = 0): PaginationConfig => ({ limit, offset }),
	range: (from: number, to: number): PaginationConfig => ({ from, to }),
};

/**
 * Utility functions for building Supabase queries
 */
export const QueryBuilder = {
	/**
	 * Apply filters to a Supabase query
	 */
	applyFilters<T extends TableName>(
		query: any,
		filters: FilterGroup | FilterCondition[],
	): any {
		if (Array.isArray(filters)) {
			return QueryBuilder.applyFilterArray(query, filters);
		}
		return QueryBuilder.applyFilterGroup(query, filters);
	},

	/**
	 * Apply an array of filter conditions
	 */
	applyFilterArray(query: any, filters: FilterCondition[]): any {
		return filters.reduce((q, condition) => {
			return QueryBuilder.applyCondition(q, condition);
		}, query);
	},

	/**
	 * Apply a filter group (recursive)
	 */
	applyFilterGroup(query: any, filterGroup: FilterGroup): any {
		const { operator, conditions } = filterGroup;

		if (operator === "and") {
			return conditions.reduce((q, condition) => {
				if ("column" in condition) {
					return QueryBuilder.applyCondition(q, condition);
				} else {
					return QueryBuilder.applyFilterGroup(q, condition);
				}
			}, query);
		} else {
			// For OR conditions, we need to handle them differently
			// This is a simplified implementation
			return conditions.reduce((q, condition) => {
				if ("column" in condition) {
					return QueryBuilder.applyCondition(q, condition);
				} else {
					return QueryBuilder.applyFilterGroup(q, condition);
				}
			}, query);
		}
	},

	/**
	 * Apply a single filter condition
	 */
	applyCondition(query: any, condition: FilterCondition): any {
		const { column, operator, value } = condition;

		switch (operator) {
			case "eq":
				return query.eq(column, value);
			case "neq":
				return query.neq(column, value);
			case "gt":
				return query.gt(column, value);
			case "gte":
				return query.gte(column, value);
			case "lt":
				return query.lt(column, value);
			case "lte":
				return query.lte(column, value);
			case "like":
				return query.like(column, value as string);
			case "ilike":
				return query.ilike(column, value as string);
			case "in":
				return query.in(column, value as unknown[]);
			case "is":
				return query.is(column, value);
			case "not":
				return query.not(column, "eq", value);
			default:
				throw new Error(`Unsupported filter operator: ${operator}`);
		}
	},

	/**
	 * Apply search across multiple columns
	 */
	applySearch(query: any, search: { columns: string[]; term: string }): any {
		const { columns, term } = search;

		if (columns.length === 0) return query;

		// Create OR conditions for each searchable column
		const searchConditions = columns.map((column) =>
			query.ilike(column, `%${term}%`),
		);

		// For now, just apply the first condition
		// In a real implementation, you'd need to handle OR properly
		return searchConditions[0] || query;
	},

	/**
	 * Apply sorting
	 */
	applySort(query: any, sort: SortConfig[]): any {
		return sort.reduce((q, { column, ascending = true }) => {
			return q.order(column, { ascending });
		}, query);
	},

	/**
	 * Apply pagination
	 */
	applyPagination(query: any, pagination: PaginationConfig): any {
		const { from, to, limit, offset } = pagination;

		if (from !== undefined && to !== undefined) {
			return query.range(from, to);
		} else if (limit !== undefined) {
			let q = query.limit(limit);
			if (offset !== undefined) {
				q = q.range(offset, offset + limit - 1);
			}
			return q;
		}

		return query;
	},

	/**
	 * Apply select fields
	 */
	applySelect(query: any, select: string): any {
		return query.select(select);
	},
};
