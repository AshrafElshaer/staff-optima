import { build, type InferSelect, many, select } from "../lib/select-builder";
import type {
	OrganizationRow,
	OrganizationUpdate,
	SupabaseInstance,
} from "../types";
import { BaseService } from "./base.service";
import type { DomainService } from "./domain.service";
import type { RoleService } from "./role.service";

const selectOrganizationWithRoles = select({
	table: "organization",
	fields: ["*"],
	relations: [
		many("roles", select({ table: "role", fields: ["*"] }), {
			foreignFrom: "organization",
			foreignKey: "organizationId",
			nullable: false,
		}),
	],
});

type OrganizationWithRoles = InferSelect<typeof selectOrganizationWithRoles>;

export class OrganizationService extends BaseService<"organization"> {
	private readonly roleService: RoleService;
	private readonly domainService: DomainService;

	constructor(
		supabase: SupabaseInstance,
		roleService: RoleService,
		domainService: DomainService,
	) {
		super(supabase, "organization");
		this.roleService = roleService;
		this.domainService = domainService;
	}

	async getById(id: string): Promise<OrganizationRow> {
		return this.findById(id);
	}

	async getOrganizationWithRoles(id: string): Promise<OrganizationWithRoles> {
		const result = await this.supabase
			.from(this.tableName)
			.select(`
				*,
				roles:role(*)
			`)
			.eq("id", id)
			.single();

		if (result.error) {
			throw result.error;
		}

		return result.data as OrganizationWithRoles;
	}

	async updateOrganization(
		organization: OrganizationUpdate & { id: string },
	): Promise<OrganizationRow> {
		if (!organization.id) {
			throw new Error("Organization ID is required");
		}

		// Handle domain verification if domain is being updated
		if (organization.domain) {
			await this.recreateDomainVerification(organization.id);
			organization.slug = organization.domain;
			organization.isDomainVerified = false;
		}

		return this.update(organization.id, organization);
	}

	private async recreateDomainVerification(
		organizationId: string,
	): Promise<void> {
		const domainVerification = await this.domainService.updateVerification({
			organization_id: organizationId,
			verification_status: "pending",
			verification_token: crypto.randomUUID(),
			updated_at: new Date().toISOString(),
		});
		if (!domainVerification) {
			throw new Error("Failed to recreate domain verification");
		}
	}
}
