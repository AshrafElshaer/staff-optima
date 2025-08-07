import { cn } from "@optima/ui/lib/utils";
import { type DropzoneOptions, useDropzone } from "react-dropzone";

export type { DropzoneOptions };

export type DropZoneProps = {
	children?: React.ReactNode;
	config?: DropzoneOptions;
} & React.HTMLAttributes<HTMLDivElement>;

export function FileDropZone({
	children,
	config,
	className,
	...props
}: DropZoneProps) {
	const { getRootProps, getInputProps } = useDropzone(config);

	return (
		<section
			className={cn(
				" border border-dashed rounded-md grid relative group cursor-pointer",
				className,
			)}
			{...props}
		>
			<div
				{...getRootProps({ className: "dropzone" })}
				className="w-full h-full"
			>
				<input {...getInputProps()} />
				{children ?? (
					<p>Drag 'n' drop some files here, or click to select files</p>
				)}
			</div>
		</section>
	);
}
