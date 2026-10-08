import type { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

import { isDev } from "@/shared/utils/is-dev.util";
import { parseBoolean } from "@/shared/utils/parse-boolean.util";

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>("MAIL_HOST"),
			port: configService.getOrThrow<number>("MAIL_PORT"),
			secure: parseBoolean(
				configService.getOrThrow<string>("MAIL_SECURE"),
			),
			auth: isDev(configService)
				? undefined
				: {
						user: configService.getOrThrow<string>("MAIL_LOGIN"),
						pass: configService.getOrThrow<string>("MAIL_PASSWORD"),
					},
		},
		defaults: {
			from: `"Streaming Platform" <${configService.getOrThrow<string>("MAIL_FROM")}>`,
		},
	};
}
