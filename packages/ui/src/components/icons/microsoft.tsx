import type { ComponentPropsWithoutRef } from "react";

export function Microsoft(props: ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={256}
			height={256}
			viewBox="0 0 256 256"
			{...props}
		>
			<title>Microsoft</title>
			<path fill="#f1511b" d="M121.666 121.666H0V0h121.666z" />
			<path fill="#80cc28" d="M256 121.666H134.335V0H256z" />
			<path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z" />
			<path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z" />
		</svg>
	);
}
