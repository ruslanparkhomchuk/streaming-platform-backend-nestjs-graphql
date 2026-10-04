import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verify } from "argon2";
import type { Request } from "express";

import { PrismaService } from "@/core/prisma/prisma.service";
import { RedisService } from "@/core/redis/redis.service";
import { TelegramService } from "@/modules/libs/telegram/telegram.service";
import { TokenType, type User } from "@/prisma/generated";
import { generateToken } from "@/shared/utils/generate-token.util";
import { getSessionMetadata } from "@/shared/utils/session-metadata.util";
import { destroySession } from "@/shared/utils/session.util";

import { MailService } from "../../libs/mail/mail.service";

import { AccountDeactivationInput } from "./inputs/account-deactivation.input";

@Injectable()
export class AccountDeactivationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
		private readonly telegramService: TelegramService,
	) {}

	public async deactivate(
		req: Request,
		input: AccountDeactivationInput,
		user: User,
		userAgent: string,
	) {
		const { email, password, pin } = input;

		if (user.email !== email) {
			throw new BadRequestException("Invalid email");
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new BadRequestException("Invalid password");
		}

		if (!pin) {
			await this.sendAccountDeactivationToken(req, user, userAgent);

			return { message: "A confirmation code is required" };
		}

		await this.validateAccountDeactivationToken(req, pin);

		return { user };
	}

	private async validateAccountDeactivationToken(
		req: Request,
		token: string,
	) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.ACCOUNT_DEACTIVATION,
			},
		});

		if (!existingToken) {
			throw new NotFoundException("Token not found");
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException("Token has expired");
		}
		if (!existingToken.userId) {
			throw new NotFoundException("Token not found");
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId,
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date(),
			},
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.ACCOUNT_DEACTIVATION,
			},
		});

		await this.clearSessions(user.id);

		return destroySession(req, this.configService);
	}

	private async sendAccountDeactivationToken(
		req: Request,
		user: User,
		userAgent: string,
	) {
		const accountDeactivationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.ACCOUNT_DEACTIVATION,
			false,
		);

		const metadata = getSessionMetadata(req, userAgent);

		await this.mailService.sendAccountDeactivationToken(
			user.email,
			accountDeactivationToken.token,
			metadata,
		);

		if (
			accountDeactivationToken.user?.notificationSettings
				?.telegramNotifications &&
			accountDeactivationToken.user.telegramId
		) {
			await this.telegramService.sendAccountDeactivationToken(
				accountDeactivationToken.user.telegramId,
				accountDeactivationToken.token,
				metadata,
			);
		}

		return true;
	}

	private async clearSessions(userId: string) {
		const prefix = this.configService.getOrThrow<string>("SESSION_FOLDER");

		const keys = await this.redisService.keys(`${prefix}*`);

		for (const key of keys) {
			const sessionData = await this.redisService.get(key);

			if (!sessionData) {
				continue;
			}

			try {
				const session = JSON.parse(sessionData) as { userId?: string };

				if (session.userId === userId) {
					await this.redisService.del(key);
				}
			} catch {
				continue;
			}
		}
	}
}
