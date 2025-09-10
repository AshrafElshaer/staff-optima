/** biome-ignore-all lint/suspicious/noExplicitAny: because we need to use any to avoid type errors */
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
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

	createBaseQuery() {
		return this.supabase.from(this.tableName);
	}

	/**
	 * Find by ID
	 */
	protected async findById<TReturn = Row<T>>(
		id: string,
		select?: string,
	): Promise<TReturn> {
		const result = (await this.supabase
			.from(this.tableName)
			.select(select || "*")
			.eq("id" as any, id)
			.single()) as PostgrestSingleResponse<TReturn>;

		if (result.error) {
			throw result.error;
		}

		return result.data;
	}
	/**
	 * Find all records with simple match
	 */
	protected async findAll<TReturn = Row<T>[]>(
		query: Record<string, unknown>,
		select?: string,
	): Promise<TReturn[]> {
		const result = await this.createBaseQuery()
			.select(select || "*")
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
		const result = (await this.createBaseQuery()
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

	protected async getCount(query: Record<string, unknown>): Promise<number> {
		const { count, error } = await this.supabase
			.from(this.tableName)
			.select("*", { count: "exact", head: true })
			.match(query);

		if (error) {
			throw error;
		}

		return count ?? 0;
	}
}
