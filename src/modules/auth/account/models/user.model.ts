import { Field, ID, ObjectType } from "@nestjs/graphql";

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

	@Field(() => [SocialLinkModel])
	public socialLinks: SocialLinkModel[];

	@Field(() => StreamModel)
	public stream: StreamModel;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
