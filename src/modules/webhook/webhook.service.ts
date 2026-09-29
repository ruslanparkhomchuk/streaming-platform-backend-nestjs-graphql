import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/core/prisma/prisma.service";

import { LivekitService } from "../libs/livekit/livekit.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
		private readonly notificationService: NotificationService,
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
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId,
				},
				data: {
					isLive: true,
				},
				include: {
					user: true,
				},
			});

			const channel = stream.user;

			if (!channel) {
				return;
			}

			const followers = await this.prismaService.follow.findMany({
				where: {
					followingId: channel.id,
					follower: {
						isDeactivated: false,
					},
				},
				include: {
					follower: {
						include: {
							notificationSettings: true,
						},
					},
				},
			});

			for (const follow of followers) {
				const follower = follow.follower;

				if (follower.notificationSettings?.siteNotifications) {
					await this.notificationService.createStreamStart(
						follower.id,
						channel,
					);
				}
			}
		}
		if (event.event === "ingress_ended") {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId,
				},
				data: {
					isLive: false,
				},
			});

			await this.prismaService.chatMessage.deleteMany({
				where: {
					streamId: stream.id,
				},
			});
		}
	}
}
