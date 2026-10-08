import {
	Body,
	Head,
	Heading,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react";

import type { SessionMetadata } from "@/shared/types/session-metadata.types";

interface PasswordRecoveryTemplateProps {
	domain: string;
	token: string;
	metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata,
}: PasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/account/recovery/${token}`;

	return (
		<Html>
			<Head />
			<Preview>Password Recovery</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Password reset
						</Heading>
						<Text className="text-black text-base mt-2">
							You requested a password reset for your account.
						</Text>
						<Text className="text-black text-base mt-2">
							To create a new password, click the link below:
						</Text>
						<Link
							href={resetLink}
							className="inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2"
						>
							Reset password
						</Link>
					</Section>

					<Section className="bg-gray-100 rounded-lg p-6 mb-6">
						<Heading
							as="h2"
							className="text-xl font-semibold text-[#18B9AE]"
						>
							Request details:
						</Heading>
						<ul className="list-disc list-inside text-black mt-2">
							<li>
								Location: {metadata.location.country},{" "}
								{metadata.location.city}
							</li>
							<li>Operating system: {metadata.device.os}</li>
							<li>Browser: {metadata.device.browser}</li>
							<li>IP address: {metadata.ip}</li>
						</ul>
						<Text className="text-gray-600 mt-2">
							If you didn't request this, please ignore this
							email.
						</Text>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-gray-600">
							If you have any questions or run into any problems,
							feel free to contact our support team at{" "}
							<Link
								href="mailto:help@streamingplatform.site"
								className="text-[#18b9ae] underline"
							>
								help@streamingplatform.site
							</Link>
							.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}
