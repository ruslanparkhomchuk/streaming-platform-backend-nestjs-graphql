import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@InputType()
export class ChangeChatSettingsInput {
	@Field(() => Boolean)
	@IsBoolean()
	public isChatEnabled: boolean;

	@Field(() => Boolean, { nullable: true })
	@IsBoolean()
	@IsOptional()
	public isChatFollowersOnly: boolean;

	@Field(() => Boolean, { nullable: true })
	@IsBoolean()
	@IsOptional()
	public isChatPremiumFollowersOnly: boolean;
}
