import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";

import { UserModel } from "@/modules/auth/account/models/user.model";
import { type Notification, NotificationType } from "@/prisma/generated";

registerEnumType(NotificationType, {
	name: "NotificationType",
});

@ObjectType()
export class NotificationModel implements Notification {
	@Field(() => ID)
	public id: string;

	@Field(() => String)
	public message: string;

	@Field(() => NotificationType)
	public type: NotificationType;

	@Field(() => Boolean)
	public isRead: boolean;

	@Field(() => UserModel, { nullable: true })
	public user: UserModel;

	@Field(() => String, { nullable: true })
	public userId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
