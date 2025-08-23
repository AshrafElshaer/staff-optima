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

	protected async findOne(query: Record<string, unknown>): Promise<Row<T>> {
		const result = (await this.supabase
			.from(this.tableName)
			.select()
			.match(query)
			.single()) as PostgrestSingleResponse<Row<T>>;

		if (result.error) {
			throw result.error;
		}

		return result.data;
	}

	protected async findById(id: string): Promise<Row<T>> {
		return this.findOne({ id });
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
}
