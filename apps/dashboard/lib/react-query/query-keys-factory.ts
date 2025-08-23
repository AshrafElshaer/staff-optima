export const queryKeysFactory = {
	organization: {
		byId: (id: string) => ["organization", id],
	},
	domainVerification: {
		byOrganizationId: (organizationId: string) => [
			"domain-verification",
			organizationId,
		],
	},
};
