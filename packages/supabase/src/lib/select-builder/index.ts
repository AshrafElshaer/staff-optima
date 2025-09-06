/* eslint-disable  @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: default by creator */

import type { Database, Tables } from "../../types/database";

// --- Basic utility types ---

type IsNullable<T> = null extends T ? true : undefined extends T ? true : false;

type TableName = keyof Database["public"]["Tables"];

type TableRelationships<TTable extends TableName> =
	Database["public"]["Tables"][TTable]["Relationships"][number];

type TableForeignKeyName<TTable extends TableName> =
	TableRelationships<TTable>["foreignKeyName"];

type TableRelationshipColumn<
	TTable extends TableName,
	TForeignKey extends Readonly<TableForeignKeyName<TTable>>,
> = Extract<
	TableRelationships<TTable>,
	{ foreignKeyName: TForeignKey }
>["columns"][0];

type FieldsOf<T extends Readonly<TableName>> = keyof Tables<T> | "*";

type ForeignKeysOf<T extends Readonly<TableName>> =
	Database["public"]["Tables"][T]["Relationships"][number]["foreignKeyName"];

// --- Relation type structures ---

type SelectDefinition<
	TTable extends Readonly<TableName>,
	TFields extends ReadonlyArray<FieldsOf<TTable>>,
	TRelations extends ReadonlyArray<AnyRelation>,
> = {
	table: TTable;
	fields: TFields;
	relations: TRelations;
};

type OneRelation<
	TName extends Readonly<string>,
	TForeignFrom extends Readonly<string>,
	TForeignKey extends Readonly<string>,
	TNullable extends Readonly<boolean>,
	TTable extends Readonly<TableName>,
	TFields extends ReadonlyArray<FieldsOf<TTable>>,
	TRelations extends ReadonlyArray<AnyRelation> = [],
> = {
	kind: "one";
	name: TName;
	table: TTable;
	fields: TFields;
	relations: TRelations;
	foreignFrom: TForeignFrom;
	foreignKey: TForeignKey;
	nullable: TNullable;
};

type ManyRelation<
	TName extends Readonly<string>,
	TForeignFrom extends Readonly<string>,
	TForeignKey extends Readonly<string>,
	TNullable extends Readonly<boolean>,
	TTable extends Readonly<TableName>,
	TFields extends ReadonlyArray<FieldsOf<TTable>>,
	TRelations extends ReadonlyArray<AnyRelation> = [],
> = {
	kind: "many";
	name: TName;
	table: TTable;
	fields: TFields;
	relations: TRelations;
	foreignFrom: TForeignFrom;
	foreignKey: TForeignKey;
	nullable: TNullable;
};

type Relation<
	TName extends Readonly<string>,
	TForeignFrom extends Readonly<string>,
	TForeignKey extends Readonly<string>,
	TNullable extends Readonly<boolean>,
	TTable extends Readonly<TableName>,
	TFields extends ReadonlyArray<FieldsOf<TTable>>,
	TRelations extends ReadonlyArray<AnyRelation>,
> =
	| OneRelation<
			TName,
			TForeignFrom,
			TForeignKey,
			TNullable,
			TTable,
			TFields,
			TRelations
	  >
	| ManyRelation<
			TName,
			TForeignFrom,
			TForeignKey,
			TNullable,
			TTable,
			TFields,
			TRelations
	  >;

type AnyRelation = Relation<
	string,
	string,
	string,
	boolean,
	TableName,
	any,
	[] | ReadonlyArray<AnyRelation>
>;

type ForeignDefinition<
	TForeignFrom extends Readonly<TableName>,
	TForeignKey extends Readonly<ForeignKeysOf<TForeignFrom> | "inner">,
> = {
	foreignFrom: TForeignFrom;
	foreignKey: TForeignKey;
	by: TForeignKey extends ForeignKeysOf<TForeignFrom>
		? TableRelationshipColumn<TForeignFrom, TForeignKey>
		: undefined;
	nullable: TForeignKey extends ForeignKeysOf<TForeignFrom>
		? IsNullable<
				Tables<TForeignFrom>[TableRelationshipColumn<
					TForeignFrom,
					TForeignKey
				> extends keyof Tables<TForeignFrom>
					? TableRelationshipColumn<TForeignFrom, TForeignKey>
					: never]
			>
		: TForeignKey extends "inner" | undefined
			? false
			: true;
};

// --- Inference utilities ---

type InferFields<
	TTable extends Readonly<TableName>,
	TFields extends ReadonlyArray<FieldsOf<TTable>>,
> = TFields extends readonly ["*"]
	? { [K in keyof Tables<TTable>]: Tables<TTable>[K] }
	: TFields extends readonly (keyof Tables<TTable>)[]
		? { [K in keyof Pick<Tables<TTable>, TFields[number]>]: Tables<TTable>[K] }
		: never;

type InferRelation<TRelation extends AnyRelation> =
	TRelation extends OneRelation<
		infer _Name,
		infer _ForeignFrom,
		infer _ForeignKey,
		infer _TNullable,
		infer _Table,
		infer _Fields,
		infer _Relations
	>
		? _ForeignKey extends "inner"
			? InferFields<_Table, _Fields> & InferRelations<_Relations>
			: _TNullable extends false
				? InferFields<_Table, _Fields> & InferRelations<_Relations>
				: _TNullable extends true
					? (InferFields<_Table, _Fields> & InferRelations<_Relations>) | null
					: never
		: TRelation extends ManyRelation<
					infer _Name,
					infer _ForeignFrom,
					infer _ForeignKey,
					infer _TNullable,
					infer _Table,
					infer _Fields,
					infer _Relations
				>
			? Array<InferFields<_Table, _Fields> & InferRelations<_Relations>>
			: never;

type InferRelations<TRelations extends ReadonlyArray<AnyRelation>> =
	TRelations extends readonly [infer R extends AnyRelation]
		? { [K in R["name"]]: InferRelation<R> }
		: TRelations extends readonly [
					infer R extends AnyRelation,
					...infer Rest extends AnyRelation[],
				]
			? { [K in R["name"]]: InferRelation<R> } & InferRelations<Rest>
			: {};

type InferSelect<TSelect extends SelectDefinition<any, any, any>> =
	TSelect extends SelectDefinition<
		infer TTable,
		infer TFields,
		infer TRelations
	>
		? TRelations extends [] | undefined
			? InferFields<TTable, TFields>
			: InferFields<TTable, TFields> & InferRelations<TRelations>
		: never;

// --- Builder functions ---

function select<
	const TTable extends TableName,
	const TFields extends ReadonlyArray<FieldsOf<TTable>>,
	const TRelations extends ReadonlyArray<AnyRelation> = [],
>(def: {
	table: TTable;
	fields: TFields;
	relations?: TRelations;
}): SelectDefinition<TTable, TFields, TRelations> {
	return {
		table: def.table,
		fields: def.fields,
		relations: (def.relations ?? []) as TRelations,
	};
}

function one<
	const TName extends string,
	const TTable extends TableName,
	const TFields extends ReadonlyArray<FieldsOf<TTable>>,
	const TRelations extends ReadonlyArray<AnyRelation>,
>(
	name: TName,
	def: {
		table: TTable;
		fields: TFields;
		relations?: TRelations;
	},
): OneRelation<TName, "", "", false, TTable, TFields, TRelations>;
function one<
	const TName extends string,
	const TTable extends TableName,
	const TFields extends ReadonlyArray<FieldsOf<TTable>>,
	const TRelations extends ReadonlyArray<AnyRelation>,
	const TForeignFrom extends string,
	const TForeignKey extends string,
	const TNullable extends boolean,
>(
	name: TName,
	def: {
		table: TTable;
		fields: TFields;
		relations?: TRelations;
	},
	options: {
		foreignFrom: TForeignFrom;
		foreignKey: TForeignKey;
		nullable: TNullable;
	},
): OneRelation<
	TName,
	TForeignFrom,
	TForeignKey,
	TNullable,
	TTable,
	TFields,
	TRelations
>;
function one(
	name: any,
	def: any,
	options?: {
		foreignFrom: any;
		foreignKey: any;
		nullable: any;
	},
): any {
	return {
		...def,
		relations: def.relations ?? [],
		foreignFrom: options?.foreignFrom ?? "",
		foreignKey: options?.foreignKey ?? "",
		nullable: options?.nullable ?? false,
		kind: "one",
		name,
	};
}

function many<
	const TName extends string,
	const TTable extends TableName,
	const TFields extends ReadonlyArray<FieldsOf<TTable>>,
	const TRelations extends ReadonlyArray<AnyRelation>,
>(
	name: TName,
	def: {
		table: TTable;
		fields: TFields;
		relations?: TRelations;
	},
): ManyRelation<TName, "", "", false, TTable, TFields, TRelations>;
function many<
	const TName extends string,
	const TTable extends TableName,
	const TFields extends ReadonlyArray<FieldsOf<TTable>>,
	const TRelations extends ReadonlyArray<AnyRelation>,
	const TForeignFrom extends string,
	const TForeignKey extends string,
	const TNullable extends boolean,
>(
	name: TName,
	def: {
		table: TTable;
		fields: TFields;
		relations?: TRelations;
	},
	options: {
		foreignFrom: TForeignFrom;
		foreignKey: TForeignKey;
		nullable: TNullable;
	},
): ManyRelation<
	TName,
	TForeignFrom,
	TForeignKey,
	TNullable,
	TTable,
	TFields,
	TRelations
>;
function many(
	name: any,
	def: any,
	options?: {
		foreignFrom: any;
		foreignKey: any;
		nullable: any;
	},
): any {
	return {
		...def,
		relations: def.relations ?? [],
		foreignFrom: options?.foreignFrom ?? "",
		foreignKey: options?.foreignKey ?? "",
		nullable: options?.nullable ?? false,
		kind: "many",
		name,
	};
}

function ref<
	const TForeignFrom extends TableName,
	const TForeignKey extends "inner",
>(
	from: TForeignFrom,
	key: TForeignKey,
): ForeignDefinition<TForeignFrom, TForeignKey>;
function ref<
	const TForeignFrom extends TableName,
	const TForeignKey extends ForeignKeysOf<TForeignFrom>,
	const TBy extends TableRelationshipColumn<TForeignFrom, TForeignKey>,
>(
	from: TForeignFrom,
	key: TForeignKey,
	by: TBy,
): ForeignDefinition<TForeignFrom, TForeignKey>;
function ref(from: any, key: any, by?: any): any {
	if (key === "inner")
		return { foreignFrom: from, foreignKey: key, by: undefined } as const;
	return { foreignFrom: from, foreignKey: key, by } as const;
}

function merge<
	const TTable extends Readonly<TableName>,
	const TFields1 extends ReadonlyArray<FieldsOf<TTable>>,
	const TRelations1 extends ReadonlyArray<AnyRelation>,
	const TFields2 extends ReadonlyArray<FieldsOf<TTable>> = [],
	const TRelations2 extends ReadonlyArray<AnyRelation> = [],
>(
	base: SelectDefinition<TTable, TFields1, TRelations1>,
	extras: {
		fields?: TFields2;
		relations?: TRelations2;
	},
): SelectDefinition<
	TTable,
	[...TFields2, ...TFields1],
	[...TRelations2, ...TRelations1]
> {
	return {
		table: base.table,
		fields: [...base.fields, ...(extras.fields ?? [])],
		relations: [...(base.relations ?? []), ...(extras.relations ?? [])],
	} as any;
}

function buildRelations(relations: readonly AnyRelation[] = []): string {
	return relations
		.map((relation) => {
			const foreignBy =
				relation.foreignKey && relation.foreignKey !== ""
					? `!${relation.foreignKey}`
					: "";

			const nested = buildRelations(relation.relations ?? []);

			const fields =
				relation.fields.length === 1
					? `${relation.fields[0]}`
					: `${relation.fields.join(", ")}`;

			return `${relation.name}:${relation.table}${foreignBy}(${fields}${
				nested ? `, ${nested}` : ""
			})`;
		})
		.join(", ");
}

function build<const TSelect extends SelectDefinition<any, any, any>>(
	def: TSelect,
): Build<typeof def> {
	const fieldStr = `${def.fields.join(", ")}`;

	const relationStr = buildRelations(def.relations);

	const result = [fieldStr, relationStr].filter(Boolean).join(", ");

	return result as any;
}

type DepthCounter = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
];
type Decrement<D extends number> = D extends keyof DepthCounter
	? DepthCounter[D]
	: never;

// --- Recursive stringify of select definition with depth limit ---

type Build<
	T extends Readonly<SelectDefinition<any, any, any>>,
	MaxDepth extends number = 8,
> = MaxDepth extends never
	? ""
	: JoinFields<T["table"], T["fields"], T["relations"], MaxDepth>;

type JoinFields<
	Table extends Readonly<TableName>,
	Fields extends ReadonlyArray<FieldsOf<Table>>,
	Relations extends ReadonlyArray<AnyRelation>,
	Depth extends number,
> = Depth extends never
	? ""
	: Relations extends readonly []
		? FieldsToString<Table, Fields>
		: Relations extends readonly [infer R extends AnyRelation]
			? `${FieldsToString<Table, Fields>}, ${RelationToString<R, Depth>}`
			: Relations extends readonly [
						infer R extends AnyRelation,
						...infer Rest extends AnyRelation[],
					]
				? `${FieldsToString<Table, Fields>}, ${RelationToString<R, Depth>}, ${RelationsToString<Rest, Decrement<Depth>>}`
				: never;

type FieldsToString<
	Table extends Readonly<TableName>,
	Fields extends ReadonlyArray<FieldsOf<Table>>,
> = Fields extends readonly []
	? ""
	: Fields extends readonly [infer F extends string]
		? F
		: Fields extends readonly [
					infer F extends string,
					...infer Rest extends ReadonlyArray<FieldsOf<Table>>,
				]
			? Rest extends readonly string[]
				? `${F}, ${FieldsToString<Table, Rest>}`
				: never
			: never;

type RelationsToString<
	Relations extends ReadonlyArray<AnyRelation>,
	Depth extends number,
> = Depth extends never | 0
	? ""
	: Relations extends readonly []
		? ""
		: Relations extends readonly [infer R extends AnyRelation]
			? RelationToString<R, Depth>
			: Relations extends readonly [
						infer R extends AnyRelation,
						...infer Rest extends AnyRelation[],
					]
				? `${RelationToString<R, Depth>}, ${RelationsToString<Rest, Decrement<Depth>>}`
				: never;

type RelationToString<
	R extends Readonly<AnyRelation>,
	Depth extends number,
> = R extends OneRelation<
	infer Name,
	infer TForeignFrom,
	infer TForeignKey,
	infer TNullable,
	infer Table,
	infer Fields,
	infer Relations
>
	? TForeignKey extends ""
		? `${Name}:${Table}(${Build<SelectDefinition<Table, Fields, Relations>, Decrement<Depth>>})`
		: `${Name}:${Table}!${TForeignKey}(${Build<SelectDefinition<Table, Fields, Relations>, Decrement<Depth>>})`
	: R extends ManyRelation<
				infer Name,
				infer TForeignFrom,
				infer TForeignKey,
				infer TNullable,
				infer Table,
				infer Fields,
				infer Relations
			>
		? TForeignKey extends ""
			? `${Name}:${Table}(${Build<SelectDefinition<Table, Fields, Relations>, Decrement<Depth>>})`
			: `${Name}:${Table}!${TForeignKey}(${Build<SelectDefinition<Table, Fields, Relations>, Decrement<Depth>>})`
		: never;

export { select, merge, one, many, ref, build };
export type { InferSelect, Build };
