"use server";
import { resolveTxt } from "node:dns/promises";
import { DnsVerificationEmail } from "@optima/email";
import { domainVerificationSchema } from "@optima/supabase/validations/organization.validations";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { authActionClient } from "@/lib/safe-action";

export const verifyDomainAction = authActionClient
	.inputSchema(z.object({ domainVerification: domainVerificationSchema }))
	.metadata({
		name: "verify-domain",
	})
	.action(async ({ ctx, parsedInput }) => {
		const { services } = ctx;
		const { domainVerification } = parsedInput;
		const domainVerificationService = services.getDomainVerificationService();
		const organizationService = services.getOrganizationService();

		let records: string[][] | null = null;
		try {
			records = await resolveTxt(
				`staffoptima_verification.${domainVerification.domain}`,
			);
		} catch {
			await domainVerificationService.updateDomainVerification({
				organization_id: domainVerification.organization_id,
				verification_status: "failed",
			});
			throw new Error(
				"Unable to verify domain. Please check your DNS settings and try again.",
			);
		}

		const isValid = records
			.flat()
			.includes(domainVerification.verification_token ?? "");

		if (!isValid) {
			await domainVerificationService.updateDomainVerification({
				organization_id: domainVerification.organization_id,
				verification_status: "failed",
			});
			await organizationService.updateOrganization({
				id: domainVerification.organization_id,
				isDomainVerified: false,
			});

			throw new Error("Invalid verification token");
		}

		const updatedDomainVerification =
			await domainVerificationService.updateDomainVerification({
				organization_id: domainVerification.organization_id,
				verification_status: "verified",
				verification_date: new Date().toISOString(),
			});

		await organizationService.updateOrganization({
			id: domainVerification.organization_id,
			isDomainVerified: true,
		});

		revalidatePath("/company");
		return updatedDomainVerification;
	});

export const sendDomainVerificationEmailAction = authActionClient
	.inputSchema(
		z.object({
			domainVerification: domainVerificationSchema,
			sendTo: z.email(),
		}),
	)
	.metadata({
		name: "send-domain-verification-email",
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session, resend } = ctx;
		const { domainVerification, sendTo } = parsedInput;

		const { error } = await resend.emails.send({
			from: "Staff Optima <support@www.staffoptima.co>",
			to: sendTo,
			subject: "Domain Verification",
			react: DnsVerificationEmail({
				records: [domainVerification],
				organizationDomain: domainVerification.domain,
				sentBy: `${session.user.name} <${session.user.email}>`,
			}),
		});

		if (error) {
			console.error(error);
			throw new Error("Failed to send domain verification email");
		}
	});
