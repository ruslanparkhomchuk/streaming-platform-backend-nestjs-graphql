import type { ThrottlerModuleOptions } from "@nestjs/throttler";

export function getThrottlerConfig(): ThrottlerModuleOptions {
	return [
		{
			ttl: 60_000,
			limit: 120,
		},
	];
}
