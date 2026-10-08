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

interface AccountDeactivationTemplateProps {
	token: string;
	metadata: SessionMetadata;
}

export function AccountDeactivationTemplate({
	token,
	metadata,
}: AccountDeactivationTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Account Deactivation</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Deactivate account
						</Heading>
						<Text className="text-black text-base mt-2">
							You've started the process of deactivating your
							account on <b>Streaming Platform</b>.
						</Text>
					</Section>

					<Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
						<Heading
							as="h2"
							className="text-2xl text-black font-semibold"
						>
							Confirmation code:
						</Heading>
						<Heading
							as="h3"
							className="text-3xl text-black font-semibold"
						>
							{token}
						</Heading>
						<Text className="text-black">
							This code is valid for 5 minutes.
						</Text>
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
