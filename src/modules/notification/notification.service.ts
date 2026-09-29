import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/core/prisma/prisma.service";
import { NotificationType, TokenType, type User } from "@/prisma/generated";
import { escapeHtml } from "@/shared/utils/escape-html.util";
import { generateToken } from "@/shared/utils/generate-token.util";

import { ChangeNotificationsSettingsInput } from "./inputs/change-notification-settings.input";

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				isRead: false,
				userId: user.id,
			},
		});

		return count;
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id,
			},
			data: {
				isRead: true,
			},
		});

		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return notifications;
	}

	public async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>Don't miss it!</b>
				<p>Join the stream on the channel <a href='/${escapeHtml(channel.username)}' className='font-semibold'>${escapeHtml(channel.displayName)}</a>.</p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You have a new follower!</b>
				<p>It's user <a href='/${escapeHtml(follower.username)}' className='font-semibold'>${escapeHtml(follower.displayName)}</a>.</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationsSettingsInput,
	) {
		const { siteNotifications, telegramNotifications } = input;

		const notificationSettings =
			await this.prismaService.notificationSettings.update({
				where: {
					userId: user.id,
				},
				data: {
					siteNotifications,
					telegramNotifications,
				},
				include: {
					user: true,
				},
			});

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH,
			);

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token,
			};
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id,
				},
				data: {
					telegramId: null,
				},
			});

			return { notificationSettings };
		}

		return { notificationSettings };
	}
}
