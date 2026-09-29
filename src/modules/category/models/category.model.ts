import { Field, ID, ObjectType } from "@nestjs/graphql";

import { StreamModel } from "@/modules/stream/models/stream.model";
import type { Category } from "@/prisma/generated";

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	public id: string;

	@Field(() => String)
	public title: string;

	@Field(() => String)
	public slug: string;

	@Field(() => String, { nullable: true })
	public description: string;

	@Field(() => String)
	public thumbnailUrl: string;

	@Field(() => [StreamModel], { nullable: true })
	public streams: StreamModel[];

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
