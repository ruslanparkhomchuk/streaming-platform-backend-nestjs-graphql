import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class ChangeStreamInfoInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public title: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	public categoryId?: string;
}
