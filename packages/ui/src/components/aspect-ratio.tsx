"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

import type * as React from "react";

function AspectRatio({
	...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
	return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
