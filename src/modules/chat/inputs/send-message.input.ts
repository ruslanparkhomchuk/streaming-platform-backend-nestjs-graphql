import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

@InputType()
export class SendMessageInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	public text: string;

	@Field(() => String)
	@IsUUID("4")
	@IsNotEmpty()
	public streamId: string;
}
