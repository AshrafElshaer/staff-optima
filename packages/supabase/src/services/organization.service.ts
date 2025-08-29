import type {
	OrganizationRow,
	OrganizationUpdate,
	SupabaseInstance,
	Tables,
} from "../types";
import { BaseService } from "./base.service";
import type { DomainService } from "./domain.service";
import type { RoleService } from "./role.service";

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

	async getOrganizationWithRoles(
		id: string,
	): Promise<OrganizationRow & { roles: Tables<"role">[] }> {
		const organization = await this.getById(id);
		const roles = await this.roleService.getByOrganization(id);
		return { ...organization, roles };
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
