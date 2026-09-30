import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type Stripe from "stripe";

import { PrismaService } from "@/core/prisma/prisma.service";
import { TransactionStatus } from "@/prisma/generated";

import { LivekitService } from "../libs/livekit/livekit.service";
import { StripeService } from "../libs/stripe/stripe.service";
import { TelegramService } from "../libs/telegram/telegram.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class WebhookService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
		private readonly stripeService: StripeService,
		private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService,
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

				if (
					follower.notificationSettings?.telegramNotifications &&
					follower.telegramId
				) {
					await this.telegramService.sendStreamStart(
						follower.telegramId,
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

	public async receiveWebhookStripe(event: Stripe.Event) {
		if (event.type === "checkout.session.completed") {
			const session = event.data.object;

			const planId = session.metadata?.planId;
			const userId = session.metadata?.userId;
			const channelId = session.metadata?.channelId;

			if (!planId || !userId || !channelId) {
				return;
			}

			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 30);

			const sponsorshipSubscription =
				await this.prismaService.sponsorshipSubscription.create({
					data: {
						expiresAt,
						planId,
						userId,
						channelId,
					},
					include: {
						plan: true,
						user: true,
						channel: {
							include: {
								notificationSettings: true,
							},
						},
					},
				});

			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
					status: TransactionStatus.PENDING,
				},
				data: {
					status: TransactionStatus.SUCCESS,
				},
			});

			const { plan, user, channel } = sponsorshipSubscription;

			if (!plan || !user || !channel) {
				return;
			}

			if (channel.notificationSettings?.siteNotifications) {
				await this.notificationService.createNewSponsorship(
					channel.id,
					plan,
					user,
				);
			}

			if (
				channel.notificationSettings?.telegramNotifications &&
				channel.telegramId
			) {
				await this.telegramService.sendNewSponsorship(
					channel.telegramId,
					plan,
					user,
				);
			}
		}

		if (event.type === "checkout.session.expired") {
			const session = event.data.object;

			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
				},
				data: {
					status: TransactionStatus.EXPIRED,
				},
			});
		}

		if (event.type === "checkout.session.async_payment_failed") {
			const session = event.data.object;

			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
				},
				data: {
					status: TransactionStatus.FAILED,
				},
			});
		}
	}

	public constructStripeEvent(
		payload: string | Buffer,
		signature: string,
	): Stripe.Event {
		return this.stripeService.webhooks.constructEvent(
			payload,
			signature,
			this.configService.getOrThrow<string>("STRIPE_WEBHOOK_SECRET"),
		);
	}
}
