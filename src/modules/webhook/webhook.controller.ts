import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException,
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";

import { WebhookService } from "./webhook.service";

@SkipThrottle()
@Controller("webhook")
export class WebhookController {
	public constructor(private readonly webhookService: WebhookService) {}

	@Post("livekit")
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookLivekit(
		@Body() body: string,
		@Headers("Authorization") authorization: string,
	) {
		if (!authorization) {
			throw new UnauthorizedException("Missing authorization header");
		}

		return this.webhookService.receiveWebhookLivekit(body, authorization);
	}

	@Post("stripe")
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookStripe(
		@RawBody() rawBody: Buffer,
		@Headers("stripe-signature") sig: string,
	) {
		if (!sig) {
			throw new UnauthorizedException("Missing Stripe signature header");
		}

		const event = this.webhookService.constructStripeEvent(rawBody, sig);

		await this.webhookService.receiveWebhookStripe(event);
	}
}
