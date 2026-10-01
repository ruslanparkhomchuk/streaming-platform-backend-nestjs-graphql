import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { NotificationModule } from "../notification/notification.module";

import { CronService } from "./cron.service";

@Module({
	imports: [ScheduleModule.forRoot(), NotificationModule],
	providers: [CronService],
})
export class CronModule {}
