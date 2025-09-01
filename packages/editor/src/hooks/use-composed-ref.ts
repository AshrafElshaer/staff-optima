import { type MutableRefObject, type Ref, useCallback } from "react";

/**
 * A utility hook that composes multiple refs into a single ref callback.
 * This is useful when you need to pass a ref to both a parent component and use it internally.
 *
 * @param refs - Array of refs to compose together
 * @returns A ref callback that will set all provided refs
 */
export function useComposedRef<T>(
	...refs: (Ref<T> | undefined)[]
): (node: T | null) => void {
	return useCallback(
		(node: T | null) => {
			for (const ref of refs) {
				if (ref) {
					if (typeof ref === "function") {
						ref(node);
					} else {
						// Handle MutableRefObject
						(ref as MutableRefObject<T | null>).current = node;
					}
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs,
	);
}
