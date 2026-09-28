import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/core/prisma/prisma.service";

import { LivekitService } from "../libs/livekit/livekit.service";

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
	) {}

	public async receiveWebhookLivekit(body: string, authorization: string) {
		const event = this.livekitService.receiver.receive(
			body,
			authorization,
			true,
		);

		const ingressId = event.ingressInfo?.ingressId;

		if (!ingressId) {
			return;
		}

		if (event.event === "ingress_started") {
			await this.prismaService.stream.update({
				where: {
					ingressId,
				},
				data: {
					isLive: true,
				},
			});
		}
		if (event.event === "ingress_ended") {
			await this.prismaService.stream.update({
				where: {
					ingressId,
				},
				data: {
					isLive: false,
				},
			});
		}
	}
}
