import { createSerializer, parseAsString, parseAsStringEnum } from "nuqs";

export const authSearchParams = {
	email: parseAsString.withDefault(""),
	activeTab: parseAsStringEnum(["sign-in", "verify-otp"]).withDefault(
		"sign-in",
	),
	redirectUrl: parseAsString.withDefault("/"),
};

export const authSearchParamsSerializer = createSerializer(authSearchParams);
