import { createTableFilters } from "../lib/query-builder";
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
	private readonly Filters = createTableFilters<"organization">();

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
		return await this.findOne({
			filters: [this.Filters.eq("id", id)],
			select: build(selectOrganizationWithRoles),
		});
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
