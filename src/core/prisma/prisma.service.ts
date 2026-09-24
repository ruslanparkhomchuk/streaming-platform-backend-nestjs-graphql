import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma-generated";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	public constructor(configService: ConfigService) {
		const adapter = new PrismaPg({
			connectionString: configService.getOrThrow<string>("POSTGRES_URI"),
		});

		super({ adapter });
	}

	public async onModuleInit() {
		await this.$connect();
	}

	public async onModuleDestroy() {
		await this.$disconnect();
	}
}
