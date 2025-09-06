import { Button } from "@optima/ui/components/button";
import { Input } from "@optima/ui/components/inputs";

export default function Page() {
	return (
		<div className="flex items-center justify-center flex-1">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold">Hello World (dashboard)</h1>
				<Button size="sm">Button</Button>
				<Input />
			</div>
		</div>
	);
}
