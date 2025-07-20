import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
	secondaryfill?: string;
	strokewidth?: number;
	title?: string;
};

export function Blockchain({ title = "Blockchain", ...props }: IconProps) {
	return (
		<svg
			height="24"
			width="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>{title}</title>
			<g fill="currentColor" strokeLinecap="butt" strokeLinejoin="miter">
				<polyline
					fill="none"
					points="2 4 7 6.5 12 4"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
				/>
				<polyline
					fill="none"
					points="12 4 17 6.5 22 4"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
				/>
				<polyline
					fill="none"
					points="7 13 12 15.5 17 13"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
				/>
				<polygon
					fill="none"
					points="12 4 7 1.5 2 4 2 10.5 7 13 12 10.5 12 4"
					stroke="currentColor"
					strokeLinecap="square"
					strokeMiterlimit="10"
					strokeWidth="2"
				/>
				<polygon
					fill="none"
					points="22 4 17 1.5 12 4 12 10.5 17 13 22 10.5 22 4"
					stroke="currentColor"
					strokeLinecap="square"
					strokeMiterlimit="10"
					strokeWidth="2"
				/>
				<polygon
					fill="none"
					points="17 13 12 10.5 7 13 7 19.5 12 22 17 19.5 17 13"
					stroke="currentColor"
					strokeLinecap="square"
					strokeMiterlimit="10"
					strokeWidth="2"
				/>
				<line
					fill="none"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
					x1="7"
					x2="7"
					y1="6.5"
					y2="13"
				/>
				<line
					fill="none"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
					x1="17"
					x2="17"
					y1="6.5"
					y2="13"
				/>
				<line
					fill="none"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
					x1="12"
					x2="12"
					y1="15.5"
					y2="22"
				/>
			</g>
		</svg>
	);
}
