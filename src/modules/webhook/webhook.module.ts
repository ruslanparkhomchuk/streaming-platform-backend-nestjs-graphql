import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
	RequestMethod,
} from "@nestjs/common";

import { RawBodyMiddleware } from "@/shared/middlewares/raw-body.middleware";

import { NotificationModule } from "../notification/notification.module";

import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";

@Module({
	imports: [NotificationModule],
	controllers: [WebhookController],
	providers: [WebhookService],
})
export class WebhookModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RawBodyMiddleware)
			.forRoutes({ path: "webhook/livekit", method: RequestMethod.POST });
	}
}
