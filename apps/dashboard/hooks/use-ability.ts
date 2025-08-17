import { useAbility as useCaslAbility } from "@casl/react";
import { AbilityContext } from "@/lib/auth/abilities";

export const useAbility = () => {
	const ability = useCaslAbility(AbilityContext);
	if (!ability) {
		throw new Error(
			"useAbility must be used within an AbilityContext.Provider",
		);
	}
	return ability;
};
