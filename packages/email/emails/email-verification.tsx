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
import * as React from "react";
import { colors } from "../components/colors";
import Logo from "../components/logo";

export function ChangeEmailConfirmationEmail({
	user,
	newEmail,
	url,
	token,
}: Readonly<{
	user: string;
	newEmail: string;
	url: string;
	token: string;
}>) {
	const confirmationUrl = `${url}?token=${token}`;

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
				<Preview>Confirm Your Email Address Change for Unified Space</Preview>
				<Body
					className={`bg-[${colors.lightTheme.background}] dark:bg-[${colors.darkTheme.background}] py-8`}
				>
					<Container
						className={
							"w-[448px] rounded-lg border bg-transparent p-8 py-16 mx-auto shadow"
						}
					>
						<Logo />
						<Text
							className={`text-base text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}]`}
						>
							Hello {user},
						</Text>

						<Heading
							className={`text-[20px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] font-semibold mb-4`}
						>
							Confirm Your Email Address Change
						</Heading>

						<Text
							className={`text-[14px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] mb-4`}
						>
							You've requested to change your email address to:
						</Text>

						<Text
							className={`text-[16px] font-semibold text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] w-full text-center bg-[${colors.lightTheme.muted}] dark:bg-[${colors.darkTheme.muted}] p-3 rounded-md mb-6`}
						>
							{newEmail}
						</Text>

						<Text
							className={`text-[14px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] mb-6`}
						>
							To complete this change, please click the button below to confirm
							your new email address:
						</Text>

						<Section className="text-center mb-6">
							<Button
								href={confirmationUrl}
								className={`box-border bg-[${colors.lightTheme.primary}] text-[${colors.lightTheme.primaryForeground}] px-6 py-3 rounded-md text-[14px] font-medium no-underline`}
							>
								Confirm Email Change
							</Button>
						</Section>

						<Text
							className={`text-[14px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] mb-4`}
						>
							This confirmation link will expire in 24 hours for security
							purposes.
						</Text>

						<Text
							className={`text-[14px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}]`}
						>
							If you didn't request this email change, please ignore this
							message or contact our support team immediately to secure your
							account.
						</Text>

						<Section className="mt-[16px] text-center">
							<Text
								className={`text-base text-[${colors.lightTheme.mutedForeground}] dark:text-[${colors.darkTheme.mutedForeground}]`}
							>
								Enchanted regards,
							</Text>
							<Text
								className={`text-[14px] text-[${colors.lightTheme.foreground}] dark:text-[${colors.darkTheme.foreground}] mt-2`}
							>
								The Unified Space Team
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

ChangeEmailConfirmationEmail.PreviewProps = {
	user: "John Doe",
	newEmail: "john.doe@example.com",
	url: "https://app.unifiedspace.com/confirm-email-change",
	token: "abc123def456ghi789",
};

export default ChangeEmailConfirmationEmail;
