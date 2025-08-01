import type { SVGProps } from "react";

export function FolderFill(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={20}
			height={20}
			viewBox="0 0 20 20"
			aria-label="Folder"
			{...props}
		>
			<title>Folder</title>
			<path
				fill="currentColor"
				d="M18.405 4.799c-.111-.44-.655-.799-1.21-.799h-6.814c-.554 0-1.33-.318-1.722-.707l-.596-.588C7.671 2.316 6.896 2 6.342 2H3.087c-.555 0-1.059.447-1.12.994L1.675 6h16.931zM19.412 7H.588a.58.58 0 0 0-.577.635l.923 9.669A.77.77 0 0 0 1.7 18h16.6a.77.77 0 0 0 .766-.696l.923-9.669A.58.58 0 0 0 19.412 7"
			/>
		</svg>
	);
}
