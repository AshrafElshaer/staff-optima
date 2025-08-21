import { buttonVariants } from "@optima/ui/components/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@optima/ui/components/form";
import { Input, type InputProps } from "@optima/ui/components/inputs/input";
import {
	InputWithAddOn,
	type InputWithAddOnProps,
} from "@optima/ui/components/inputs/input-with-add-on";
import {
	type CountryCode,
	type E164Number,
	PhoneInput,
} from "@optima/ui/components/inputs/phone-number-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@optima/ui/components/select";
import { CountrySelector } from "@optima/ui/components/selectors/country-selector";
import { TimezoneSelector } from "@optima/ui/components/selectors/timezone-selector";
import type { SelectProps } from "@radix-ui/react-select";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";

type BaseFormProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	isOptional?: boolean;
	helperText?: string;
};

type FormInputProps<T extends FieldValues> = BaseFormProps<T> &
	Omit<InputProps, "name">;

type FormSelectProps<T extends FieldValues> = BaseFormProps<T> &
	Omit<SelectProps, "name" | "onValueChange"> & {
		options: { label: string; value: string }[];
		placeholder?: string;
	};

export function FormInput<T extends FieldValues>({
	name,
	label,
	isOptional,
	helperText,
	...props
}: FormInputProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-2 w-full">
					<FormLabel htmlFor={name}>
						{label}
						{isOptional && (
							<span className="text-muted-foreground text-sm">
								( Optional )
							</span>
						)}
						{helperText && <FormDescription>{helperText}</FormDescription>}
					</FormLabel>
					<FormControl>
						<Input id={name} placeholder="John Doe" {...field} {...props} />
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
	isOptional,
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
					<FormLabel htmlFor={name}>
						{label}
						{isOptional && (
							<span className="text-muted-foreground text-sm">
								( Optional )
							</span>
						)}
					</FormLabel>
					<FormControl className="w-full">
						<PhoneInput
							className="w-full"
							id={name}
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

export function FormAddOnInput<T extends FieldValues>({
	label,
	name,
	isOptional,
	addOn,
	addOnDirection,
	wrapperClassName,
	...props
}: FormInputProps<T> & InputWithAddOnProps) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel htmlFor={name}>
						{label}
						{isOptional && (
							<span className="text-muted-foreground text-sm">
								( Optional )
							</span>
						)}
					</FormLabel>
					<FormControl>
						<InputWithAddOn
							id={name}
							addOn={addOn}
							addOnDirection={addOnDirection}
							wrapperClassName={wrapperClassName}
							{...field}
							{...props}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function FormSelect<T extends FieldValues>({
	label,
	name,
	isOptional,
	options,
	placeholder,
	...props
}: FormSelectProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel htmlFor={name}>
						{label}
						{isOptional && (
							<span className="text-muted-foreground text-sm">
								( Optional )
							</span>
						)}
					</FormLabel>
					<FormControl>
						<Select
							value={field.value ?? undefined}
							onValueChange={field.onChange}
							{...props}
						>
							<SelectTrigger
								className={buttonVariants({
									variant: "secondary",
									className: "w-full !justify-between",
								})}
							>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent>
								{options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function FormCountrySelector<T extends FieldValues>({
	label,
	name,
	isOptional,
}: FormInputProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel htmlFor={name}>
						{label}
						{isOptional && (
							<span className="text-muted-foreground text-sm">
								( Optional )
							</span>
						)}
					</FormLabel>
					<FormControl>
						<CountrySelector
							value={field.value ?? null}
							setValue={(value) => {
								field.onChange(value);
								formContext.clearErrors(name);
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function FormTimezoneSelector<T extends FieldValues>({
	label,
	name,
	isOptional,
}: FormInputProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel htmlFor={name}>
						{label}
						{isOptional && (
							<span className="text-muted-foreground text-sm">
								( Optional )
							</span>
						)}
					</FormLabel>
					<FormControl>
						<TimezoneSelector
							value={field.value}
							onValueChange={(value) => {
								field.onChange(value);
								formContext.clearErrors(name);
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
