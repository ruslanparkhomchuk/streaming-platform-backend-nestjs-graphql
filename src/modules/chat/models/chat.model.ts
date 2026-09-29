import { Field, ID, ObjectType } from "@nestjs/graphql";

import { UserModel } from "@/modules/auth/account/models/user.model";
import { StreamModel } from "@/modules/stream/models/stream.model";
import type { ChatMessage } from "@/prisma/generated";

@ObjectType()
export class ChatMessageModel implements ChatMessage {
	@Field(() => ID)
	public id: string;

	@Field(() => String)
	public text: string;

	@Field(() => UserModel, { nullable: true })
	public user?: UserModel;

	@Field(() => String, { nullable: true })
	public userId: string;

	@Field(() => StreamModel, { nullable: true })
	public stream?: StreamModel;

	@Field(() => String, { nullable: true })
	public streamId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
