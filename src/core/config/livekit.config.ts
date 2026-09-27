import { ConfigService } from "@nestjs/config";

import type { TypeLiveKitOptions } from "@/modules/libs/livekit/types/livekit.types";

export function getLiveKitConfig(
	configService: ConfigService,
): TypeLiveKitOptions {
	return {
		apiUrl: configService.getOrThrow<string>("LIVEKIT_API_URL"),
		apiKey: configService.getOrThrow<string>("LIVEKIT_API_KEY"),
		apiSecret: configService.getOrThrow<string>("LIVEKIT_API_SECRET"),
	};
}
