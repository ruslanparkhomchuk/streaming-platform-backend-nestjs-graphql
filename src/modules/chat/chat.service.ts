import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/core/prisma/prisma.service";
import type { User } from "@/prisma/generated";

import { ChangeChatSettingsInput } from "./inputs/change-chat-settings.input";
import { SendMessageInput } from "./inputs/send-message.input";

@Injectable()
export class ChatService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findByStream(streamId: string) {
		const messages = await this.prismaService.chatMessage.findMany({
			where: {
				streamId,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				user: true,
			},
			take: 100,
		});

		return messages;
	}

	public async sendMessage(userId: string, input: SendMessageInput) {
		const { text, streamId } = input;

		const stream = await this.prismaService.stream.findUnique({
			where: {
				id: streamId,
			},
		});

		if (!stream) {
			throw new NotFoundException("Stream not found");
		}
		if (!stream.isLive) {
			throw new BadRequestException("The stream is not live");
		}
		if (!stream.isChatEnabled) {
			throw new BadRequestException("Chat is disabled for this stream");
		}

		const message = await this.prismaService.chatMessage.create({
			data: {
				text,
				user: {
					connect: {
						id: userId,
					},
				},
				stream: {
					connect: {
						id: stream.id,
					},
				},
			},
			include: {
				stream: true,
				user: true,
			},
		});

		return message;
	}

	public async changeSettings(user: User, input: ChangeChatSettingsInput) {
		const {
			isChatEnabled,
			isChatFollowersOnly,
			isChatPremiumFollowersOnly,
		} = input;

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				isChatEnabled,
				isChatFollowersOnly,
				isChatPremiumFollowersOnly,
			},
		});

		return true;
	}
}
