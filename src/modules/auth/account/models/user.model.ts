import { Field, ID, ObjectType } from "@nestjs/graphql";

import { FollowModel } from "@/modules/follow/models/follow.model";
import { NotificationSettingsModel } from "@/modules/notification/models/notification-settings.model";
import { NotificationModel } from "@/modules/notification/models/notification.model";
import { PlanModel } from "@/modules/sponsorship/plan/models/plan.model";
import { SubscriptionModel } from "@/modules/sponsorship/subscription/models/subscription.model";
import { StreamModel } from "@/modules/stream/models/stream.model";
import type { User } from "@/prisma/generated";

import { SocialLinkModel } from "../../profile/models/social-link.model";

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	public id: string;

	public email: string;

	public password: string;

	@Field(() => String)
	public username: string;

	@Field(() => String)
	public displayName: string;

	@Field(() => String, { nullable: true })
	public avatar: string;

	@Field(() => String, { nullable: true })
	public bio: string;

	public telegramId: string;

	@Field(() => Boolean)
	public isVerified: boolean;

	@Field(() => Boolean)
	public isEmailVerified: boolean;

	@Field(() => Boolean)
	public isTotpEnabled: boolean;

	public totpSecret: string;

	@Field(() => Boolean)
	public isDeactivated: boolean;

	@Field(() => Date, { nullable: true })
	public deactivatedAt: Date;

	@Field(() => [SocialLinkModel], { nullable: true })
	public socialLinks: SocialLinkModel[];

	@Field(() => StreamModel, { nullable: true })
	public stream: StreamModel;

	@Field(() => [NotificationModel], { nullable: true })
	public notifications: NotificationModel[];

	@Field(() => NotificationSettingsModel, { nullable: true })
	public notificationSettings: NotificationSettingsModel;

	@Field(() => [FollowModel], { nullable: true })
	public followers: FollowModel[];

	@Field(() => [FollowModel], { nullable: true })
	public followings: FollowModel[];

	@Field(() => [PlanModel], { nullable: true })
	public sponsorshipPlans: PlanModel[];

	@Field(() => [SubscriptionModel], { nullable: true })
	public sponsorshipSubscriptions: SubscriptionModel[];

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
