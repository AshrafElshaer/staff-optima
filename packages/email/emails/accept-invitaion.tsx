import {
	Body,
	Button,
	Container,
	Font,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
// biome-ignore lint/correctness/noUnusedImports: needed for react
import React from "react";
import { colors } from "../components/colors";
import Logo from "../components/logo";

export const AcceptInvitationEmail = (props: {
	invitedByUsername: string;
	workspaceName: string;
	inviteLink: string;
}) => {
	const { invitedByUsername, workspaceName, inviteLink } = props;

	return (
		<Html>
			<Tailwind>
				<head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
					<Font
						fontFamily="Geist"
						fallbackFontFamily="Helvetica"
						webFont={{
							url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
							format: "woff2",
						}}
						fontWeight={400}
						fontStyle="normal"
					/>
					<Font
						fontFamily="Geist"
						fallbackFontFamily="Helvetica"
						webFont={{
							url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
							format: "woff2",
						}}
						fontWeight={500}
						fontStyle="normal"
					/>
				</head>
				<Preview>You've been invited to join {workspaceName}</Preview>
				<Body
					className={`bg-[${colors.lightTheme.background}] dark:bg-[${colors.darkTheme.background}] py-8`}
				>
					<Container className="w-[448px] rounded-lg border bg-transparent p-8 py-16 mx-auto shadow">
						<Logo />
						<Text
							className={`text-base text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}]`}
						>
							Hi there,
						</Text>

						<Heading
							className={`text-[24px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] w-full text-center font-semibold`}
						>
							You're Invited!
						</Heading>

						<Text
							className={`text-[16px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}]`}
						>
							You have been invited to join <strong>{workspaceName}</strong>.
							<br />
							By <strong>{invitedByUsername}</strong>
							<br />
							By accepting this invitation, you'll gain access to shared
							resources, collaborate with team members, and contribute to
							exciting projects.
						</Text>

						<Text
							className={`text-[16px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}]`}
						>
							Click the button below to accept your invitation and get started:
						</Text>

						<Section className="text-center my-[32px]">
							<Button
								href={inviteLink}
								className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
							>
								Accept Invitation
							</Button>
						</Section>

						<Text
							className={`text-[14px] text-[${colors.lightTheme.mutedForeground}] dark:text-[${colors.darkTheme.mutedForeground}]`}
						>
							If the button above doesn't work, you can copy and paste this link
							into your browser:
						</Text>
						<Text className="text-[14px] text-blue-600 break-all">
							{inviteLink}
						</Text>

						<Section className="mt-[16px] text-center">
							<Text
								className={`text-base text-[${colors.lightTheme.mutedForeground}] dark:text-[${colors.darkTheme.mutedForeground}]`}
							>
								Best regards,
							</Text>
							<Text
								className={`text-[14px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] mt-2`}
							>
								The {workspaceName} Team
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

AcceptInvitationEmail.PreviewProps = {
	organizationName: "TechCorp Solutions",
	acceptUrl: "https://app.techcorp.com/invitations/accept?token=abc123xyz",
};

export default AcceptInvitationEmail;
