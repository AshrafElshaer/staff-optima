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
import { Textarea } from "@optima/ui/components/textarea";
import type { SelectProps } from "@radix-ui/react-select";
import type { TextAreaProps } from "@radix-ui/themes";
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

type FormTextareaProps<T extends FieldValues> = BaseFormProps<T> &
	Omit<TextAreaProps, "name">;

type FormFieldWrapperProps<T extends FieldValues> = BaseFormProps<T> & {
	children: React.ReactNode;
};

function Label({
	name,
	label,
	isOptional,
	helperText,
}: {
	name: string;
	label: string | undefined;
	isOptional: boolean | undefined;
	helperText: string | undefined;
}) {
	if (!label) return null;
	return (
		<FormLabel htmlFor={name}>
			{label}
			{isOptional && (
				<span className="text-muted-foreground text-sm">( Optional )</span>
			)}
			{helperText && <FormDescription>{helperText}</FormDescription>}
		</FormLabel>
	);
}

export function FormFieldWrapper<T extends FieldValues>({
	name,
	label,
	isOptional,
	helperText,
	children,
}: FormFieldWrapperProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-2 w-full">
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
					<FormControl>{children}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

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
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
					<FormControl>
						<Input id={name} placeholder="John Doe" {...field} {...props} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function FormTextarea<T extends FieldValues>({
	name,
	label,
	isOptional,
	helperText,
	...props
}: FormTextareaProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-2 w-full">
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
					<FormControl>
						<Textarea id={name} placeholder="John Doe" {...field} {...props} />
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
	helperText,
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
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
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
	helperText,
	...props
}: FormInputProps<T> & InputWithAddOnProps) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					{label && (
						<Label
							name={name}
							label={label}
							isOptional={isOptional}
							helperText={helperText}
						/>
					)}
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
	helperText,
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
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
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
	helperText,
}: FormInputProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
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
	helperText,
}: FormInputProps<T>) {
	const formContext = useFormContext<T>();
	return (
		<FormField
			control={formContext.control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<Label
						name={name}
						label={label}
						isOptional={isOptional}
						helperText={helperText}
					/>
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
