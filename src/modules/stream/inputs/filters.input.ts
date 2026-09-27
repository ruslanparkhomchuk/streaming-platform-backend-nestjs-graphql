import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

@InputType()
export class FiltersInput {
	@Field(() => Int, { nullable: true })
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	public take?: number;

	@Field(() => Int, { nullable: true })
	@IsInt()
	@Min(0)
	@IsOptional()
	public skip?: number;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	public searchTerm?: string;
}
