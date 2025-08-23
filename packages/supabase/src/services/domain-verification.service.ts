import type {
	DomainVerificationRow,
	DomainVerificationUpdate,
	OrganizationRow,
	SupabaseInstance,
} from "../types";
import { BaseService } from "./base.service";

export class DomainVerificationService extends BaseService<"domain_verification"> {
	constructor(supabase: SupabaseInstance) {
		super(supabase, "domain_verification");
	}

	async getById(id: string): Promise<DomainVerificationRow> {
		return this.findById(id);
	}

	async createDomainVerification(organization: {
		id: string;
		slug: string;
	}): Promise<DomainVerificationRow> {
		return this.create({
			organization_id: organization.id,
			domain: organization.slug,
			verification_token: crypto.randomUUID(),
		});
	}

	async updateDomainVerification(
		domainVerification: DomainVerificationUpdate & {
			organization_id: string;
		},
	): Promise<DomainVerificationRow> {
		return this.updateBy(
			"organization_id",
			domainVerification.organization_id,
			domainVerification,
		);
	}

	async deleteDomainVerification(id: string): Promise<DomainVerificationRow> {
		return this.delete(id);
	}

	async isDomainVerified(domain: string): Promise<boolean> {
		const { data, error } = await this.supabase
			.from("organization")
			.select("isDomainVerified")
			.eq("domain", domain)
			.single();

		if (error) {
			throw error;
		}

		return data?.isDomainVerified ?? false;
	}

	async getByOrganizationId(
		organizationId: string,
	): Promise<DomainVerificationRow> {
		const { data, error } = await this.supabase
			.from("domain_verification")
			.select("*")
			.eq("organization_id", organizationId)
			.single();

		if (error) {
			throw error;
		}

		return data;
	}
}
