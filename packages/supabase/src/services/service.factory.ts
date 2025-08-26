import type { SupabaseInstance } from "../types";
import { DomainService } from "./domain.service";
import { MembershipService } from "./membership.service";
import { OrganizationService } from "./organization.service";
import { RoleService } from "./role.service";
import { UserService } from "./user.service";

export class ServiceFactory {
	private static instance: ServiceFactory;
	private readonly supabase: SupabaseInstance;
	private services: Map<
		string,
		| OrganizationService
		| RoleService
		| UserService
		| MembershipService
		| DomainService
	>;

	private constructor(supabase: SupabaseInstance) {
		this.supabase = supabase;
		this.services = new Map();
	}

	static getInstance(supabase: SupabaseInstance): ServiceFactory {
		if (!ServiceFactory.instance) {
			ServiceFactory.instance = new ServiceFactory(supabase);
		}
		return ServiceFactory.instance;
	}

	getOrganizationService(): OrganizationService {
		const key = "organization";
		let service = this.services.get(key) as OrganizationService;
		if (!service) {
			service = new OrganizationService(
				this.supabase,
				this.getRoleService(),
				this.getDomainService(),
			);
			this.services.set(key, service);
		}
		return service;
	}

	getRoleService(): RoleService {
		const key = "role";
		let service = this.services.get(key) as RoleService;
		if (!service) {
			service = new RoleService(this.supabase);
			this.services.set(key, service);
		}
		return service;
	}

	getUserService(): UserService {
		const key = "user";
		let service = this.services.get(key) as UserService;
		if (!service) {
			service = new UserService(this.supabase);
			this.services.set(key, service);
		}
		return service;
	}

	getMembershipService(): MembershipService {
		const key = "membership";
		let service = this.services.get(key) as MembershipService;
		if (!service) {
			service = new MembershipService(this.supabase);
			this.services.set(key, service);
		}
		return service;
	}

	getDomainService(): DomainService {
		const key = "domain";
		let service = this.services.get(key) as DomainService;
		if (!service) {
			service = new DomainService(this.supabase);
			this.services.set(key, service);
		}
		return service;
	}
}
