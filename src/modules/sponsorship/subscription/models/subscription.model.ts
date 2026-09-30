import { Field, ID, ObjectType } from "@nestjs/graphql";

import { UserModel } from "@/modules/auth/account/models/user.model";
import { PlanModel } from "@/modules/sponsorship/plan/models/plan.model";
import type { SponsorshipSubscription } from "@/prisma/generated";

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
	@Field(() => ID)
	public id: string;

	@Field(() => Date)
	public expiresAt: Date;

	@Field(() => PlanModel, { nullable: true })
	public plan: PlanModel;

	@Field(() => String, { nullable: true })
	public planId: string;

	@Field(() => UserModel, { nullable: true })
	public user: UserModel;

	@Field(() => String, { nullable: true })
	public userId: string;

	@Field(() => UserModel, { nullable: true })
	public channel: UserModel;

	@Field(() => String, { nullable: true })
	public channelId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
