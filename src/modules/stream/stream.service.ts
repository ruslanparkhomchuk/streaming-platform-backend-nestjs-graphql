import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { Request } from "express";
import type { FileUpload } from "graphql-upload/processRequest.mjs";
import { AccessToken } from "livekit-server-sdk";
import sharp from "sharp";

import { PrismaService } from "@/core/prisma/prisma.service";
import type { Prisma, User } from "@/prisma/generated";

import { StorageService } from "../libs/storage/storage.service";

import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input";
import { FiltersInput } from "./inputs/filters.input";
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input";

@Injectable()
export class StreamService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
	) {}

	public async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input;

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined;

		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false,
				},
				...whereClause,
			},
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return streams;
	}

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false,
				},
			},
		});

		const count = Math.min(4, total);
		const randomIndexes = new Set<number>();

		while (randomIndexes.size < count) {
			const randomIndex = Math.floor(Math.random() * total);

			randomIndexes.add(randomIndex);
		}

		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false,
				},
			},
			include: {
				user: true,
			},
			take: total,
			skip: 0,
		});

		return Array.from(randomIndexes).map(index => streams[index]);
	}

	public async changeInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input;

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				title,
			},
		});

		return true;
	}

	public async changeThumbnail(user: User, file: FileUpload) {
		const stream = await this.findByUserId(user);

		if (!stream) {
			throw new NotFoundException("Stream not found");
		}
		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl);
		}

		const { createReadStream, filename } = file;

		const chunks: Buffer[] = [];

		for await (const chunk of createReadStream()) {
			chunks.push(chunk as Buffer);
		}

		const buffer = Buffer.concat(chunks);

		const fileName = `streams/${user.username}.webp`;

		if (filename && filename.toLowerCase().endsWith(".gif")) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				"image/webp",
			);
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1280, 720)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				"image/webp",
			);
		}

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				thumbnailUrl: fileName,
			},
		});

		return true;
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user);

		if (!stream) {
			throw new NotFoundException("Stream not found");
		}
		if (!stream.thumbnailUrl) {
			return true;
		}

		await this.storageService.remove(stream.thumbnailUrl);

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				thumbnailUrl: null,
			},
		});

		return true;
	}

	public async generateToken(req: Request, input: GenerateStreamTokenInput) {
		const { channelId } = input;

		let self: { id: string; username: string };

		const user = req.session.userId
			? await this.prismaService.user.findUnique({
					where: { id: req.session.userId },
				})
			: null;

		if (user) {
			self = { id: user.id, username: user.username };
		} else {
			self = {
				id: randomUUID(),
				username: `Viewer ${Math.floor(Math.random() * 100000)}`,
			};
		}

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
			},
		});

		if (!channel) {
			throw new NotFoundException("Channel not found");
		}

		const isHost = self.id === channel.id;

		const token = new AccessToken(
			this.configService.getOrThrow<string>("LIVEKIT_API_KEY"),
			this.configService.getOrThrow<string>("LIVEKIT_API_SECRET"),
			{
				identity: isHost ? `Host-${self.id}` : self.id,
				name: self.username,
			},
		);

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false,
		});

		return { token: token.toJwt() };
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: {
				userId: user.id,
			},
		});

		if (!stream) {
			throw new NotFoundException("Stream not found");
		}

		return stream;
	}

	private findBySearchTermFilter(
		searchTerm: string,
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: "insensitive",
					},
				},
				{
					user: {
						username: {
							contains: searchTerm,
							mode: "insensitive",
						},
					},
				},
			],
		};
	}
}
