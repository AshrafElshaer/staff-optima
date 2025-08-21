import type { FieldValues, UseFormReturn } from "react-hook-form";

export function getDirtyFields<T extends FieldValues>(
	form: UseFormReturn<T>,
	values: T,
): T {
	const dirtyFields = Object.keys(form.formState.dirtyFields).map((key) => ({
		[key]: values[key as keyof typeof values],
	}));

	const payload = {
		...(typeof values === "object" &&
		values !== null &&
		"id" in values &&
		values.id !== undefined
			? { id: values.id }
			: {}),
		...Object.assign({}, ...dirtyFields),
	};
	return payload;
}
