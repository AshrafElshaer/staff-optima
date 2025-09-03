import { DataList as DataListPrimitive } from "@radix-ui/themes";

export function DataList({
	...props
}: React.ComponentProps<typeof DataListPrimitive.Root>) {
	return <DataListPrimitive.Root {...props} />;
}

export function DataListItem({
	...props
}: React.ComponentProps<typeof DataListPrimitive.Item>) {
	return <DataListPrimitive.Item {...props} />;
}

export function DataListLabel({
	...props
}: React.ComponentProps<typeof DataListPrimitive.Label>) {
	return <DataListPrimitive.Label {...props} />;
}

export function DataListValue({
	...props
}: React.ComponentProps<typeof DataListPrimitive.Value>) {
	return <DataListPrimitive.Value {...props} />;
}
