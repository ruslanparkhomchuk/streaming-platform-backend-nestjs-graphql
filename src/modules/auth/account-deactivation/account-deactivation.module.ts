import { Module } from "@nestjs/common";

import { AccountDeactivationResolver } from "./account-deactivation.resolver";
import { AccountDeactivationService } from "./account-deactivation.service";

@Module({
	providers: [AccountDeactivationResolver, AccountDeactivationService],
})
export class AccountDeactivationModule {}
