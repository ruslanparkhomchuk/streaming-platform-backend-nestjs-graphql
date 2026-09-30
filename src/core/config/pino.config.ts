import { ConfigService } from "@nestjs/config";
import type { Params } from "nestjs-pino";

import { isDev } from "@/shared/utils/is-dev.util";

export function getPinoConfig(configService: ConfigService): Params {
	const dev = isDev(configService);

	return {
		pinoHttp: {
			level: dev ? "debug" : "info",
			transport: dev
				? {
						target: "pino-pretty",
						options: {
							singleLine: true,
							translateTime: "SYS:HH:MM:ss",
							ignore: "pid,hostname",
						},
					}
				: undefined,
			redact: [
				"req.headers.cookie",
				"req.headers.authorization",
				'req.headers["stripe-signature"]',
				'res.headers["set-cookie"]',
			],
			autoLogging: {
				ignore: req => req.url?.startsWith("/webhook") ?? false,
			},
		},
	};
}
