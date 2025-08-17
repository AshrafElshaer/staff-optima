export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "12.2.3 (519615d)";
	};
	public: {
		Tables: {
			account: {
				Row: {
					accessToken: string | null;
					accessTokenExpiresAt: string | null;
					accountId: string;
					createdAt: string;
					id: string;
					idToken: string | null;
					password: string | null;
					providerId: string;
					refreshToken: string | null;
					refreshTokenExpiresAt: string | null;
					scope: string | null;
					updatedAt: string;
					userId: string;
				};
				Insert: {
					accessToken?: string | null;
					accessTokenExpiresAt?: string | null;
					accountId: string;
					createdAt?: string;
					id?: string;
					idToken?: string | null;
					password?: string | null;
					providerId: string;
					refreshToken?: string | null;
					refreshTokenExpiresAt?: string | null;
					scope?: string | null;
					updatedAt?: string;
					userId: string;
				};
				Update: {
					accessToken?: string | null;
					accessTokenExpiresAt?: string | null;
					accountId?: string;
					createdAt?: string;
					id?: string;
					idToken?: string | null;
					password?: string | null;
					providerId?: string;
					refreshToken?: string | null;
					refreshTokenExpiresAt?: string | null;
					scope?: string | null;
					updatedAt?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "account_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			invitation: {
				Row: {
					email: string;
					expiresAt: string;
					id: string;
					inviterId: string;
					organizationId: string;
					role: string | null;
					status: string;
					teamId: string | null;
				};
				Insert: {
					email: string;
					expiresAt: string;
					id?: string;
					inviterId: string;
					organizationId: string;
					role?: string | null;
					status: string;
					teamId?: string | null;
				};
				Update: {
					email?: string;
					expiresAt?: string;
					id?: string;
					inviterId?: string;
					organizationId?: string;
					role?: string | null;
					status?: string;
					teamId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "invitation_inviterId_fkey";
						columns: ["inviterId"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "invitation_organizationId_fkey";
						columns: ["organizationId"];
						isOneToOne: false;
						referencedRelation: "organization";
						referencedColumns: ["id"];
					},
				];
			};
			member: {
				Row: {
					createdAt: string;
					id: string;
					organizationId: string;
					role: string;
					roleId: string | null;
					userId: string;
				};
				Insert: {
					createdAt?: string;
					id?: string;
					organizationId: string;
					role: string;
					roleId?: string | null;
					userId: string;
				};
				Update: {
					createdAt?: string;
					id?: string;
					organizationId?: string;
					role?: string;
					roleId?: string | null;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "member_organizationId_fkey";
						columns: ["organizationId"];
						isOneToOne: false;
						referencedRelation: "organization";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "member_roleId_fkey";
						columns: ["roleId"];
						isOneToOne: false;
						referencedRelation: "role";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "member_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			organization: {
				Row: {
					address1: string | null;
					address2: string | null;
					city: string | null;
					country: string;
					createdAt: string;
					domain: string;
					employeeCount: string | null;
					id: string;
					industry: string;
					isDomainVerified: boolean | null;
					logo: string | null;
					metadata: string | null;
					name: string;
					profile: string | null;
					slug: string;
					state: string | null;
					timezone: string;
					zipCode: string | null;
				};
				Insert: {
					address1?: string | null;
					address2?: string | null;
					city?: string | null;
					country: string;
					createdAt?: string;
					domain: string;
					employeeCount?: string | null;
					id?: string;
					industry: string;
					isDomainVerified?: boolean | null;
					logo?: string | null;
					metadata?: string | null;
					name: string;
					profile?: string | null;
					slug: string;
					state?: string | null;
					timezone: string;
					zipCode?: string | null;
				};
				Update: {
					address1?: string | null;
					address2?: string | null;
					city?: string | null;
					country?: string;
					createdAt?: string;
					domain?: string;
					employeeCount?: string | null;
					id?: string;
					industry?: string;
					isDomainVerified?: boolean | null;
					logo?: string | null;
					metadata?: string | null;
					name?: string;
					profile?: string | null;
					slug?: string;
					state?: string | null;
					timezone?: string;
					zipCode?: string | null;
				};
				Relationships: [];
			};
			role: {
				Row: {
					createdAt: string;
					id: string;
					name: string;
					organizationId: string;
					permissions: string;
					updatedAt: string;
				};
				Insert: {
					createdAt?: string;
					id?: string;
					name: string;
					organizationId: string;
					permissions: string;
					updatedAt?: string;
				};
				Update: {
					createdAt?: string;
					id?: string;
					name?: string;
					organizationId?: string;
					permissions?: string;
					updatedAt?: string;
				};
				Relationships: [
					{
						foreignKeyName: "role_organizationId_fkey";
						columns: ["organizationId"];
						isOneToOne: false;
						referencedRelation: "organization";
						referencedColumns: ["id"];
					},
				];
			};
			session: {
				Row: {
					activeOrganizationId: string | null;
					activeTeamId: string | null;
					createdAt: string;
					expiresAt: string;
					id: string;
					ipAddress: string | null;
					token: string;
					updatedAt: string;
					userAgent: string | null;
					userId: string;
				};
				Insert: {
					activeOrganizationId?: string | null;
					activeTeamId?: string | null;
					createdAt?: string;
					expiresAt: string;
					id?: string;
					ipAddress?: string | null;
					token: string;
					updatedAt?: string;
					userAgent?: string | null;
					userId: string;
				};
				Update: {
					activeOrganizationId?: string | null;
					activeTeamId?: string | null;
					createdAt?: string;
					expiresAt?: string;
					id?: string;
					ipAddress?: string | null;
					token?: string;
					updatedAt?: string;
					userAgent?: string | null;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "session_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			subscription: {
				Row: {
					cancelAtPeriodEnd: boolean | null;
					id: string;
					periodEnd: string | null;
					periodStart: string | null;
					plan: string;
					referenceId: string;
					seats: number | null;
					status: string;
					stripeCustomerId: string | null;
					stripeSubscriptionId: string | null;
				};
				Insert: {
					cancelAtPeriodEnd?: boolean | null;
					id?: string;
					periodEnd?: string | null;
					periodStart?: string | null;
					plan: string;
					referenceId: string;
					seats?: number | null;
					status: string;
					stripeCustomerId?: string | null;
					stripeSubscriptionId?: string | null;
				};
				Update: {
					cancelAtPeriodEnd?: boolean | null;
					id?: string;
					periodEnd?: string | null;
					periodStart?: string | null;
					plan?: string;
					referenceId?: string;
					seats?: number | null;
					status?: string;
					stripeCustomerId?: string | null;
					stripeSubscriptionId?: string | null;
				};
				Relationships: [];
			};
			team: {
				Row: {
					createdAt: string;
					id: string;
					name: string;
					organizationId: string;
					updatedAt: string;
				};
				Insert: {
					createdAt?: string;
					id?: string;
					name: string;
					organizationId: string;
					updatedAt?: string;
				};
				Update: {
					createdAt?: string;
					id?: string;
					name?: string;
					organizationId?: string;
					updatedAt?: string;
				};
				Relationships: [
					{
						foreignKeyName: "team_organizationId_fkey";
						columns: ["organizationId"];
						isOneToOne: false;
						referencedRelation: "organization";
						referencedColumns: ["id"];
					},
				];
			};
			teamMember: {
				Row: {
					createdAt: string;
					id: string;
					teamId: string;
					userId: string;
				};
				Insert: {
					createdAt?: string;
					id?: string;
					teamId: string;
					userId: string;
				};
				Update: {
					createdAt?: string;
					id?: string;
					teamId?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "teamMember_teamId_fkey";
						columns: ["teamId"];
						isOneToOne: false;
						referencedRelation: "team";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "teamMember_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			user: {
				Row: {
					createdAt: string;
					email: string;
					emailVerified: boolean;
					id: string;
					image: string | null;
					jobTitle: string | null;
					name: string;
					phoneNumber: string | null;
					phoneNumberVerified: boolean | null;
					stripeCustomerId: string | null;
					updatedAt: string;
				};
				Insert: {
					createdAt?: string;
					email: string;
					emailVerified: boolean;
					id?: string;
					image?: string | null;
					jobTitle?: string | null;
					name: string;
					phoneNumber?: string | null;
					phoneNumberVerified?: boolean | null;
					stripeCustomerId?: string | null;
					updatedAt?: string;
				};
				Update: {
					createdAt?: string;
					email?: string;
					emailVerified?: boolean;
					id?: string;
					image?: string | null;
					jobTitle?: string | null;
					name?: string;
					phoneNumber?: string | null;
					phoneNumberVerified?: boolean | null;
					stripeCustomerId?: string | null;
					updatedAt?: string;
				};
				Relationships: [];
			};
			verification: {
				Row: {
					createdAt: string;
					expiresAt: string;
					id: string;
					identifier: string;
					updatedAt: string;
					value: string;
				};
				Insert: {
					createdAt?: string;
					expiresAt: string;
					id?: string;
					identifier: string;
					updatedAt?: string;
					value: string;
				};
				Update: {
					createdAt?: string;
					expiresAt?: string;
					id?: string;
					identifier?: string;
					updatedAt?: string;
					value?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			current_user_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			current_user_json: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			current_user_role: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			set_current_user: {
				Args: { user_data: Json };
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
