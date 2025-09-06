/** biome-ignore-all lint/suspicious/noExplicitAny: because we need to use any to avoid type errors */
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
	Filter,
	type FilterCondition,
	type FilterGroup,
	type PaginationConfig,
	QueryBuilder,
	type QueryConfig,
	type SortConfig,
} from "../lib/query-builder";
import type { SupabaseInstance } from "../types";
import type {
	Database,
	Tables,
	TablesInsert,
	TablesUpdate,
} from "../types/database";

export type TableName = keyof Database["public"]["Tables"];
type Row<T extends TableName> = Tables<T>;
type Insert<T extends TableName> = TablesInsert<T>;
type Update<T extends TableName> = TablesUpdate<T>;

export abstract class BaseService<T extends TableName> {
	protected readonly supabase: SupabaseInstance;
	protected readonly tableName: T;

	constructor(supabase: SupabaseInstance, tableName: T) {
		this.supabase = supabase;
		this.tableName = tableName;
	}

	// protected async findOne<TReturn = Row<T>>(
	// 	query: Record<string, unknown>,
	// 	select?: string,
	// ): Promise<TReturn> {
	// 	const result = (await this.supabase
	// 		.from(this.tableName)
	// 		.select(select)
	// 		.match(query)
	// 		.single()) as PostgrestSingleResponse<TReturn>;

	// 	if (result.error) {
	// 		throw result.error;
	// 	}

	// 	return result.data;
	// }

	/**
	 * Generic find one method with filters
	 */
	async findOne<TReturn = Row<T>>(options: {
		filters: FilterGroup<T> | FilterCondition<T>[];
		select?: string;
	}): Promise<TReturn> {
		return this.findOneWithConfig<TReturn>({
			filters: options.filters,
			select: options.select || "*",
		});
	}

	protected async findById<TReturn = Row<T>>(
		id: string,
		select?: string,
	): Promise<TReturn> {
		return this.findOne<TReturn>({
			filters: [Filter.eq<T, string>("id", id)],
			select,
		});
	}
	protected async findAll<TReturn = Row<T>[]>(
		query: Record<string, unknown>,
		select?: string,
	): Promise<TReturn[]> {
		const result = await this.supabase
			.from(this.tableName)
			.select(select)
			.match(query);

		if (result.error) {
			throw result.error;
		}

		return result.data as TReturn[];
	}

	protected async updateBy(
		key: keyof Row<T>,
		value: string | number | symbol,
		data: Update<T>,
	): Promise<Row<T>> {
		const result = (await this.supabase
			.from(this.tableName)
			.update(data as any)
			.eq(key as string, value as any)
			.select()
			.single()) as PostgrestSingleResponse<Row<T>>;

		if (result.error) {
			throw result.error;
		}

		return result.data;
	}

	protected async update(id: string, data: Update<T>): Promise<Row<T>> {
		return this.updateBy("id", id, data);
	}

	protected async create(data: Insert<T>): Promise<Row<T>> {
		const result = (await this.supabase
			.from(this.tableName)
			.insert(data as any)
			.select()
			.single()) as PostgrestSingleResponse<Row<T>>;

		if (result.error) {
			throw result.error;
		}

		return result.data;
	}

	protected async delete(id: string): Promise<Row<T>> {
		const { data, error } = await this.supabase
			.from(this.tableName)
			.delete()
			.eq("id", id as any)
			.select()
			.single();

		if (error) {
			throw error;
		}

		return data as Row<T>;
	}

	/**
	 * Create a base query for advanced querying
	 */
	protected createBaseQuery() {
		return this.supabase.from(this.tableName);
	}

	/**
	 * Find records with advanced filtering, sorting, and pagination
	 */
	protected async findWithConfig<TReturn = Row<T>[]>(
		config: QueryConfig<T>,
	): Promise<TReturn[]> {
		let query: any = this.createBaseQuery();

		// Always apply select first (required for Supabase queries)
		query = QueryBuilder.applySelect(
			query,
			(config.select || "*") as keyof Tables<T>,
		);

		// Apply filters
		if (config.filters) {
			query = QueryBuilder.applyFilters(query, config.filters);
		}

		// Apply search
		if (config.search) {
			query = QueryBuilder.applySearch(query, config.search);
		}

		// Apply sorting
		if (config.sort) {
			query = QueryBuilder.applySort(query, config.sort);
		}

		// Apply pagination
		if (config.pagination) {
			query = QueryBuilder.applyPagination(query, config.pagination);
		}

		const { data, error } = await query;

		if (error) {
			throw error;
		}

		return (data || []) as TReturn[];
	}

	/**
	 * Find a single record with advanced filtering
	 */
	protected async findOneWithConfig<TReturn = Row<T>>(
		config: Omit<QueryConfig<T>, "pagination">,
	): Promise<TReturn> {
		let query: any = this.createBaseQuery();

		// Always apply select first (required for Supabase queries)
		query = QueryBuilder.applySelect(
			query,
			(config.select || "*") as keyof Tables<T>,
		);

		// Apply filters
		if (config.filters) {
			query = QueryBuilder.applyFilters(query, config.filters);
		}

		// Apply search
		if (config.search) {
			query = QueryBuilder.applySearch(query, config.search);
		}

		// Apply sorting
		if (config.sort) {
			query = QueryBuilder.applySort(query, config.sort);
		}

		const { data, error } = await query.single();

		if (error) {
			throw error;
		}

		return data as TReturn;
	}

	/**
	 * Count records with filters
	 */
	protected async countWithFilters(
		filters?: FilterGroup<T> | FilterCondition<T>[],
	): Promise<number> {
		let query: any = this.createBaseQuery();

		// Apply select first
		query = query.select("*");

		if (filters) {
			query = QueryBuilder.applyFilters(query, filters);
		}

		const { count, error } = await query.select("*", {
			count: "exact",
			head: true,
		});

		if (error) {
			throw error;
		}

		return count || 0;
	}

	/**
	 * Find records with simple filters (backward compatibility)
	 */
	protected async findAllWithFilters<TReturn = Row<T>[]>(
		filters: FilterGroup<T> | FilterCondition<T>[],
		select?: string,
	): Promise<TReturn[]> {
		return this.findWithConfig<TReturn>({
			filters,
			select: select || "*",
		});
	}

	// ============================================================================
	// GENERIC QUERY METHODS - No need to define in each service
	// ============================================================================

	/**
	 * Generic search method with filters, sorting, pagination, and search
	 */
	async search<TReturn = Row<T>[]>(options: {
		filters?: FilterGroup<T> | FilterCondition<T>[];
		search?: {
			columns: (keyof Tables<T>)[];
			term: string;
		};
		sort?: SortConfig<T>[];
		pagination?: PaginationConfig;
		select?: string;
	}): Promise<TReturn[]> {
		return this.findWithConfig<TReturn>({
			filters: options.filters,
			search: options.search,
			sort: options.sort,
			pagination: options.pagination,
			select: options.select || "*",
		});
	}

	/**
	 * Generic find method with filters only
	 */
	async find<TReturn = Row<T>[]>(options: {
		filters: FilterGroup<T> | FilterCondition<T>[];
		select?: string;
	}): Promise<TReturn[]> {
		return this.findWithConfig<TReturn>({
			filters: options.filters,
			select: options.select || "*",
		});
	}

	/**
	 * Generic count method with filters
	 */
	async count(
		filters?: FilterGroup<T> | FilterCondition<T>[],
	): Promise<number> {
		return this.countWithFilters(filters);
	}

	/**
	 * Generic paginated search method
	 */
	async searchPaginated<TReturn = Row<T>[]>(options: {
		filters?: FilterGroup<T> | FilterCondition<T>[];
		search?: {
			columns: (keyof Tables<T>)[];
			term: string;
		};
		sort?: SortConfig<T>[];
		page: number;
		limit: number;
		select?: string;
	}): Promise<{
		data: TReturn[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const offset = (options.page - 1) * options.limit;

		const queryConfig: QueryConfig<T> = {
			filters: options.filters,
			search: options.search,
			sort: options.sort,
			pagination: { limit: options.limit, offset },
			select: options.select || "*",
		};

		const [data, total] = await Promise.all([
			this.findWithConfig<TReturn[]>(queryConfig),
			this.countWithFilters(options.filters),
		]);

		return {
			data: data as TReturn[],
			total,
			page: options.page,
			limit: options.limit,
			totalPages: Math.ceil(total / options.limit),
		};
	}

	/**
	 * Generic method to find by a single field
	 */
	async findBy<TReturn = Row<T>[]>(
		field: keyof Row<T>,
		value: unknown,
		options?: {
			select?: string;
			sort?: SortConfig<T>[];
			limit?: number;
		},
	): Promise<TReturn[]> {
		const filters: FilterCondition<T>[] = [
			Filter.eq<T, unknown>(field as keyof Tables<T>, value),
		];

		return this.findWithConfig<TReturn>({
			filters,
			select: options?.select || "*",
			sort: options?.sort,
			pagination: options?.limit ? { limit: options.limit } : undefined,
		});
	}

	/**
	 * Generic method to find by multiple fields
	 */
	async findByFields<TReturn = Row<T>[]>(
		fields: Record<keyof Row<T>, unknown>,
		options?: {
			select?: string;
			sort?: SortConfig<T>[];
			limit?: number;
		},
	): Promise<TReturn[]> {
		const filters: FilterCondition<T>[] = Object.entries(fields).map(
			([key, value]) => Filter.eq<T, unknown>(key as keyof Tables<T>, value),
		);

		return this.findWithConfig<TReturn>({
			filters,
			select: options?.select || "*",
			sort: options?.sort,
			pagination: options?.limit ? { limit: options.limit } : undefined,
		});
	}

	/**
	 * Generic method to find by field with IN operator
	 */
	async findByIn<TReturn = Row<T>[]>(
		field: keyof Row<T>,
		values: unknown[],
		options?: {
			select?: string;
			sort?: SortConfig<T>[];
			limit?: number;
		},
	): Promise<TReturn[]> {
		const filters: FilterCondition<T>[] = [
			Filter.in<T, unknown>(field as keyof Tables<T>, values),
		];

		return this.findWithConfig<TReturn>({
			filters,
			select: options?.select || "*",
			sort: options?.sort,
			pagination: options?.limit ? { limit: options.limit } : undefined,
		});
	}

	/**
	 * Generic method to search by text across multiple columns
	 */
	async searchText<TReturn = Row<T>[]>(
		columns: (keyof Row<T>)[],
		term: string,
		options?: {
			filters?: FilterGroup<T> | FilterCondition<T>[];
			select?: string;
			sort?: SortConfig<T>[];
			limit?: number;
		},
	): Promise<TReturn[]> {
		return this.findWithConfig<TReturn>({
			filters: options?.filters,
			search: {
				columns: columns as (keyof Tables<T>)[],
				term,
			},
			select: options?.select || "*",
			sort: options?.sort,
			pagination: options?.limit ? { limit: options.limit } : undefined,
		});
	}
}
