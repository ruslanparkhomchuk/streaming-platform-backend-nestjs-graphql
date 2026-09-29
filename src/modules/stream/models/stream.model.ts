import { Field, ID, ObjectType } from "@nestjs/graphql";

import { UserModel } from "@/modules/auth/account/models/user.model";
import { CategoryModel } from "@/modules/category/models/category.model";
import type { Stream } from "@/prisma/generated";

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	public id: string;

	@Field(() => String)
	public title: string;

	@Field(() => String, { nullable: true })
	public thumbnailUrl: string;

	@Field(() => String, { nullable: true })
	public ingressId: string;

	@Field(() => String, { nullable: true })
	public serverUrl: string;

	public streamKey: string;

	@Field(() => Boolean)
	public isLive: boolean;

	@Field(() => UserModel, { nullable: true })
	public user: UserModel;

	@Field(() => String, { nullable: true })
	public userId: string;

	@Field(() => CategoryModel, { nullable: true })
	public category: CategoryModel;

	@Field(() => String, { nullable: true })
	public categoryId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
