import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class SocialLinkInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public title: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public url: string;
}

@InputType()
export class SocialLinkOrderInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public id: string;

	@Field(() => Int)
	@IsInt()
	@IsNotEmpty()
	public position: number;
}
