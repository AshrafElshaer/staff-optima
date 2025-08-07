import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@optima/ui/components/form";
import { Input, type InputProps } from "@optima/ui/components/inputs/input";
import {
	type CountryCode,
	type E164Number,
	PhoneInput,
} from "@optima/ui/components/inputs/phone-number-input";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
	name: Path<T>;
	label: string;
} & Omit<InputProps, "name">;

export function FormInput<T extends FieldValues>({
	name,
	label,
	...props
}: FormInputProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-2 w-full">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input placeholder="John Doe" {...field} {...props} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function FormPhoneInput<T extends FieldValues>({
	label,
	name,
	countryCode,
	...props
}: FormInputProps<T> & {
	countryCode?: CountryCode;
}) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-2 w-full">
					<FormLabel>{label}</FormLabel>
					<FormControl className="w-full">
						<PhoneInput
							className="w-full"
							// @ts-expect-error
							value={
								typeof field.value === "string"
									? (field.value as E164Number)
									: ""
							}
							placeholder="+1234567890"
							defaultCountry={countryCode}
							{...props}
							onChange={(value) => field.onChange(value ?? "")}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
