import {
	createLoader,
	createSearchParamsCache,
	parseAsString,
} from "nuqs/server";

export const departmentSearchParamsParser = {
	name: parseAsString.withDefault("").withOptions({
		shallow: false,
		throttleMs: 500,
	}),
};

export const departmentSearchLoader = createLoader(
	departmentSearchParamsParser,
);

export const departmentSearchCache = createSearchParamsCache(
	departmentSearchParamsParser,
);
