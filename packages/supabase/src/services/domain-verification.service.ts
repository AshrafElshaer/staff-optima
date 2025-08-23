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
		domainVerification: DomainVerificationUpdate & { id: string },
	): Promise<DomainVerificationRow> {
		return this.update(domainVerification.id, domainVerification);
	}

	async deleteDomainVerification(id: string): Promise<DomainVerificationRow> {
		return this.delete(id);
	}
}
