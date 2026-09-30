import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Action, Command, Ctx, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";

import { PrismaService } from "@/core/prisma/prisma.service";
import { type SponsorshipPlan, TokenType, type User } from "@/prisma/generated";
import type { SessionMetadata } from "@/shared/types/session-metadata.types";

import { BUTTONS } from "./telegram.buttons";
import { MESSAGES } from "./telegram.messages";

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string;

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {
		super(configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN"));
		this._token = configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN");
	}

	@Start()
	public async onStart(@Ctx() ctx: Context): Promise<void> {
		const chatId = ctx.chat?.id.toString();
		if (!chatId) {
			return;
		}

		const text =
			ctx.message && "text" in ctx.message ? ctx.message.text : "";
		const token = text.split(" ")[1];

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenType.TELEGRAM_AUTH,
				},
			});

			if (!authToken || !authToken.userId) {
				await ctx.replyWithHTML(MESSAGES.invalidToken);
				return;
			}

			const hasExpired = new Date(authToken.expiresIn) < new Date();

			if (hasExpired) {
				await ctx.replyWithHTML(MESSAGES.invalidToken);
				return;
			}

			await this.connectTelegram(authToken.userId, chatId);

			await this.prismaService.token.delete({
				where: {
					id: authToken.id,
				},
			});

			await ctx.replyWithHTML(
				MESSAGES.authSuccess,
				BUTTONS.authSuccess(),
			);
			return;
		}

		const user = await this.findUserByChatId(chatId);

		if (user) {
			await this.onMe(ctx);
			return;
		}

		await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile());
	}

	@Command("me")
	@Action("me")
	public async onMe(@Ctx() ctx: Context): Promise<void> {
		const chatId = ctx.chat?.id.toString();

		if (!chatId) {
			return;
		}

		const user = await this.findUserByChatId(chatId);

		if (!user) {
			await ctx.reply(MESSAGES.notLinked);
			return;
		}

		const followersCount = await this.prismaService.follow.count({
			where: {
				followingId: user.id,
			},
		});

		await ctx.replyWithHTML(
			MESSAGES.profile(user, followersCount),
			BUTTONS.profile(),
		);
	}

	@Command("follows")
	@Action("follows")
	public async onFollows(@Ctx() ctx: Context): Promise<void> {
		const chatId = ctx.chat?.id.toString();

		if (!chatId) {
			return;
		}

		const user = await this.findUserByChatId(chatId);

		if (!user) {
			await ctx.replyWithHTML(MESSAGES.notLinked);
			return;
		}

		const follows = await this.prismaService.follow.findMany({
			where: {
				followerId: user.id,
			},
			include: {
				following: true,
			},
		});

		if (follows.length) {
			const followsList = follows
				.map(follow => MESSAGES.follows(follow.following))
				.join("\n");

			await ctx.replyWithHTML(MESSAGES.followsList(followsList));
		} else {
			await ctx.replyWithHTML(MESSAGES.noFollows);
		}
	}

	public async sendPasswordResetToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata,
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.resetPassword(token, metadata),
			{ parse_mode: "HTML" },
		);
	}

	public async sendAccountDeactivationToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata,
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.deactivate(token, metadata),
			{ parse_mode: "HTML" },
		);
	}

	public async sendAccountDeletion(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted(), {
			parse_mode: "HTML",
		});
	}

	public async sendStreamStart(chatId: string, channel: User) {
		await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), {
			parse_mode: "HTML",
		});
	}

	public async sendNewFollowing(chatId: string, follower: User) {
		const user = await this.findUserByChatId(chatId);

		if (!user) {
			return;
		}

		await this.telegram.sendMessage(
			chatId,
			MESSAGES.newFollowing(follower, user.followers.length),
			{ parse_mode: "HTML" },
		);
	}

	public async sendNewSponsorship(
		chatId: string,
		plan: SponsorshipPlan,
		sponsor: User,
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.newSponsorship(plan, sponsor),
			{ parse_mode: "HTML" },
		);
	}

	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.$transaction([
			this.prismaService.user.updateMany({
				where: { telegramId: chatId, NOT: { id: userId } },
				data: { telegramId: null },
			}),
			this.prismaService.user.update({
				where: { id: userId },
				data: { telegramId: chatId },
			}),
		]);
	}

	private async findUserByChatId(chatId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				telegramId: chatId,
			},
			include: {
				followers: true,
				followings: true,
			},
		});

		return user;
	}
}
