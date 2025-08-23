import type {
	OrganizationRow,
	OrganizationUpdate,
	SupabaseInstance,
	Tables,
} from "../types";
import { BaseService } from "./base.service";
import type { RoleService } from "./role.service";

export class OrganizationService extends BaseService<"organization"> {
	private readonly roleService: RoleService;

	constructor(supabase: SupabaseInstance, roleService: RoleService) {
		super(supabase, "organization");
		this.roleService = roleService;
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
			await this.handleDomainVerification(organization.id, organization.domain);
			organization.slug = organization.domain;
		}

		return this.update(organization.id, organization);
	}

	private async handleDomainVerification(
		organizationId: string,
		domain: string,
	): Promise<void> {
		const { error: organizationError } = await this.supabase
			.from("domain_verification")
			.update({
				verification_date: null,
				verification_status: "pending",
				verification_token: crypto.randomUUID(),
				updated_at: new Date().toISOString(),
			})
			.eq("domain", domain)
			.eq("organization_id", organizationId);

		if (organizationError) {
			throw organizationError;
		}
	}
}
