import { createContextualCan } from "@casl/react";
import { createContext } from "react";
import type { AppAbility } from "./abilities";

export const AbilityContext = createContext<AppAbility>({} as AppAbility);

export const Can = createContextualCan(AbilityContext.Consumer);
