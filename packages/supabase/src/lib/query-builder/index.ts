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

export type FilterCondition<
	TTable extends TableName = TableName,
	TValue = unknown,
> = {
	column: keyof Tables<TTable>;
	operator: FilterOperator;
	value: TValue;
};

export type FilterGroup<TTable extends TableName = TableName> = {
	operator: "and" | "or";
	conditions: (FilterCondition<TTable> | FilterGroup<TTable>)[];
};

export type SortConfig<TTable extends TableName = TableName> = {
	column: keyof Tables<TTable>;
	ascending?: boolean;
};

export type PaginationConfig = {
	from?: number;
	to?: number;
	limit?: number;
	offset?: number;
};

export type QueryConfig<T extends TableName> = {
	filters?: FilterGroup<T> | FilterCondition<T>[];
	select?: string;
	sort?: SortConfig<T>[];
	pagination?: PaginationConfig;
	search?: {
		columns: (keyof Tables<T>)[];
		term: string;
	};
};

/**
 * Helper function to create common filter conditions
 */
export const Filter = {
	eq: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "eq",
		value,
	}),

	neq: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "neq",
		value,
	}),

	gt: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "gt",
		value,
	}),

	gte: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "gte",
		value,
	}),

	lt: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "lt",
		value,
	}),

	lte: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "lte",
		value,
	}),

	like: <TTable extends TableName>(
		column: keyof Tables<TTable>,
		value: string,
	): FilterCondition<TTable, string> => ({
		column,
		operator: "like",
		value,
	}),

	ilike: <TTable extends TableName>(
		column: keyof Tables<TTable>,
		value: string,
	): FilterCondition<TTable, string> => ({
		column,
		operator: "ilike",
		value,
	}),

	in: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		values: T[],
	): FilterCondition<TTable, T[]> => ({
		column,
		operator: "in",
		value: values,
	}),

	is: <TTable extends TableName, T>(
		column: keyof Tables<TTable>,
		value: T,
	): FilterCondition<TTable, T> => ({
		column,
		operator: "is",
		value,
	}),

	and: <TTable extends TableName>(
		...conditions: (FilterCondition<TTable> | FilterGroup<TTable>)[]
	): FilterGroup<TTable> => ({
		operator: "and",
		conditions,
	}),

	or: <TTable extends TableName>(
		...conditions: (FilterCondition<TTable> | FilterGroup<TTable>)[]
	): FilterGroup<TTable> => ({
		operator: "or",
		conditions,
	}),
};

/**
 * Creates a table-specific filter instance with all filter methods
 */
export const createTableFilters = <TTable extends TableName>() => ({
	eq: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.eq<TTable, T>(column, value),
	neq: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.neq<TTable, T>(column, value),
	gt: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.gt<TTable, T>(column, value),
	gte: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.gte<TTable, T>(column, value),
	lt: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.lt<TTable, T>(column, value),
	lte: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.lte<TTable, T>(column, value),
	like: (column: keyof Tables<TTable>, value: string) =>
		Filter.like<TTable>(column, value),
	ilike: (column: keyof Tables<TTable>, value: string) =>
		Filter.ilike<TTable>(column, value),
	in: <T>(column: keyof Tables<TTable>, values: T[]) =>
		Filter.in<TTable, T>(column, values),
	is: <T>(column: keyof Tables<TTable>, value: T) =>
		Filter.is<TTable, T>(column, value),
	and: (...conditions: (FilterCondition<TTable> | FilterGroup<TTable>)[]) =>
		Filter.and<TTable>(...conditions),
	or: (...conditions: (FilterCondition<TTable> | FilterGroup<TTable>)[]) =>
		Filter.or<TTable>(...conditions),
});

/**
 * Helper function to create sort configurations
 */
export const Sort = {
	asc: <TTable extends TableName>(
		column: keyof Tables<TTable>,
	): SortConfig<TTable> => ({ column, ascending: true }),
	desc: <TTable extends TableName>(
		column: keyof Tables<TTable>,
	): SortConfig<TTable> => ({ column, ascending: false }),
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
		filters: FilterGroup<T> | FilterCondition<T>[],
	): any {
		if (Array.isArray(filters)) {
			return QueryBuilder.applyFilterArray(query, filters);
		}
		return QueryBuilder.applyFilterGroup(query, filters);
	},

	/**
	 * Apply an array of filter conditions
	 */
	applyFilterArray<T extends TableName>(
		query: any,
		filters: FilterCondition<T>[],
	): any {
		return filters.reduce((q, condition) => {
			return QueryBuilder.applyCondition(q, condition);
		}, query);
	},

	/**
	 * Apply a filter group (recursive)
	 */
	applyFilterGroup<T extends TableName>(
		query: any,
		filterGroup: FilterGroup<T>,
	): any {
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
	applyCondition<T extends TableName>(
		query: any,
		condition: FilterCondition<T>,
	): any {
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
	applySearch<T extends TableName>(
		query: any,
		search: { columns: (keyof Tables<T>)[]; term: string },
	): any {
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
	applySort<T extends TableName>(query: any, sort: SortConfig<T>[]): any {
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
	applySelect<T extends TableName>(query: any, select: keyof Tables<T>): any {
		return query.select(select);
	},
};
