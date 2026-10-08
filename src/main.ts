import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import RedisStore from "connect-redis";
import cookieParser from "cookie-parser";
import session from "express-session";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { Logger } from "nestjs-pino";

import { CoreModule } from "./core/core.module";
import { RedisService } from "./core/redis/redis.service";
import { ms, type StringValue } from "./shared/utils/ms.util";
import { parseBoolean } from "./shared/utils/parse-boolean.util";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(CoreModule, {
		rawBody: true,
		bufferLogs: true,
	});

	const config = app.get(ConfigService);
	const redis = app.get(RedisService);

	app.set("trust proxy", true);

	app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));
	app.use(
		session({
			secret: config.getOrThrow<string>("SESSION_SECRET"),
			name: config.getOrThrow<string>("SESSION_NAME"),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>("SESSION_DOMAIN"),
				maxAge: ms(config.getOrThrow<StringValue>("SESSION_MAX_AGE")),
				httpOnly: parseBoolean(
					config.getOrThrow<StringValue>("SESSION_HTTP_ONLY"),
				),
				secure: parseBoolean(
					config.getOrThrow<StringValue>("SESSION_SECURE"),
				),
				sameSite: "lax",
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>("SESSION_FOLDER"),
			}),
		}),
	);
	app.use(
		config.getOrThrow<string>("GRAPHQL_PREFIX"),
		graphqlUploadExpress(),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	app.useLogger(app.get(Logger));

	app.enableCors({
		origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
		credentials: true,
		exposedHeaders: ["set-cookie"],
	});

	await app.listen(config.getOrThrow<number>("APPLICATION_PORT"));
}
bootstrap();
