import { useContext } from "react";
import { AbilityContext } from "@/lib/auth/abilities";

export const useAbility = () => {
	const ability = useContext(AbilityContext);
	return ability;
};
