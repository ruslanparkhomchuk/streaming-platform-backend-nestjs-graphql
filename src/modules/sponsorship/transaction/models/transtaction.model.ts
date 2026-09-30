import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";

import { UserModel } from "@/modules/auth/account/models/user.model";
import { type Transaction, TransactionStatus } from "@/prisma/generated";

registerEnumType(TransactionStatus, {
	name: "TransactionStatus",
});

@ObjectType()
export class TransactionModel implements Transaction {
	@Field(() => ID)
	public id: string;

	@Field(() => Number)
	public amount: number;

	@Field(() => String)
	public currency: string;

	@Field(() => String, { nullable: true })
	public stripeSubscriptionId: string;

	@Field(() => TransactionStatus)
	public status: TransactionStatus;

	@Field(() => UserModel, { nullable: true })
	public user: UserModel;

	@Field(() => String, { nullable: true })
	public userId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
