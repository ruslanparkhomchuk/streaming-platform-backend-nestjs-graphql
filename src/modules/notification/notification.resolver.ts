import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

import type { User } from "@/prisma/generated";
import { Authorization } from "@/shared/decorators/auth.decorator";
import { Authorized } from "@/shared/decorators/authorized.decorator";

import { ChangeNotificationsSettingsInput } from "./inputs/change-notification-settings.input";
import { ChangeNotificationsSettingsResponse } from "./models/notification-settings.model";
import { NotificationModel } from "./models/notification.model";
import { NotificationService } from "./notification.service";

@Resolver("Notification")
export class NotificationResolver {
	public constructor(
		private readonly notificationService: NotificationService,
	) {}

	@Authorization()
	@Query(() => Int, { name: "findNotificationsUnreadCount" })
	public async findUnreadCount(@Authorized() user: User) {
		return this.notificationService.findUnreadCount(user);
	}

	@Authorization()
	@Query(() => [NotificationModel], { name: "findNotificationsByUser" })
	public async findByUser(@Authorized() user: User) {
		return this.notificationService.findByUser(user);
	}

	@Authorization()
	@Mutation(() => ChangeNotificationsSettingsResponse, {
		name: "changeNotificationsSettings",
	})
	public async changeSettings(
		@Authorized() user: User,
		@Args("data") input: ChangeNotificationsSettingsInput,
	) {
		return this.notificationService.changeSettings(user, input);
	}
}
