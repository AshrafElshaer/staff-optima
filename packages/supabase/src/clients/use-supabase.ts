"use client";
import type { SupabaseInstance } from "../types";
import { createBrowserClient } from "./browser";

export function useSupabase(): SupabaseInstance {
	return createBrowserClient();
}
