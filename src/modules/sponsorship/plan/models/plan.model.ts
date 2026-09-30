import { Field, ID, ObjectType } from "@nestjs/graphql";

import { UserModel } from "@/modules/auth/account/models/user.model";
import type { SponsorshipPlan } from "@/prisma/generated";

@ObjectType()
export class PlanModel implements SponsorshipPlan {
	@Field(() => ID)
	public id: string;

	@Field(() => String)
	public title: string;

	@Field(() => String, { nullable: true })
	public description: string;

	@Field(() => Number)
	public price: number;

	@Field(() => String)
	public stripeProductId: string;

	@Field(() => String)
	public stripePlanId: string;

	@Field(() => UserModel, { nullable: true })
	public channel: UserModel;

	@Field(() => String, { nullable: true })
	public channelId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
