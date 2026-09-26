import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import type { User } from "@/prisma/generated";
import { Authorization } from "@/shared/decorators/auth.decorator";
import { Authorized } from "@/shared/decorators/authorized.decorator";
import { UserAgent } from "@/shared/decorators/user-agent.decorator";
import type { GqlContext } from "@/shared/types/gql-context.type";

import { AuthModel } from "../account/models/auth.model";

import { AccountDeactivationService } from "./account-deactivation.service";
import { AccountDeactivationInput } from "./inputs/account-deactivation.input";

@Resolver("AccountDeactivation")
export class AccountDeactivationResolver {
	public constructor(
		private readonly accountDeactivationService: AccountDeactivationService,
	) {}

	@Authorization()
	@Mutation(() => AuthModel, { name: "deactivateAccount" })
	public async deactivate(
		@Context() { req }: GqlContext,
		@Args("data") input: AccountDeactivationInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string,
	) {
		return this.accountDeactivationService.deactivate(
			req,
			input,
			user,
			userAgent,
		);
	}
}
