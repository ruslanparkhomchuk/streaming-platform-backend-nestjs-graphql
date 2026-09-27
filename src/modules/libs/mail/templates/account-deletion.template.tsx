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
import { Html } from "@react-email/html"
import * as React from "react";

interface AccountDeletionTemplateProps {
	domain: string;
}

export function AccountDeletionTemplate({
	domain,
}: AccountDeletionTemplateProps) {
	const registerLink = `${domain}/account/create`;

	return (
		<Html>
			<Head />
			<Preview>Account deleted</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center">
						<Heading className="text-3xl text-black font-bold">
							Your account has been fully deleted
						</Heading>
						<Text className="text-base text-black mt-2">
							Your account has been completely removed from the
							Streaming Platform database. All your data and
							information have been permanently deleted.
						</Text>
					</Section>

					<Section className="bg-white text-black text-center rounded-lg shadow-md p-6 mb-4">
						<Text>
							You will no longer receive notifications in Telegram
							or by email.
						</Text>
						<Text>
							If you ever want to come back to the platform, you
							can sign up using the link below:
						</Text>
						<Link
							href={registerLink}
							className="inline-flex justify-center items-center rounded-full mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2"
						>
							Sign up for Streaming Platform
						</Link>
					</Section>

					<Section className="text-center text-black">
						<Text>
							Thanks for being with us! We'll always be glad to see
							you back on the platform.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}