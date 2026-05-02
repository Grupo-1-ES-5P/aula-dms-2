import { Module } from "@nestjs/common";
import { DrizzleService } from "./infra/database/drizzle.service";
import { MessagingModule } from "./infra/messaging/messaging.module";

@Module({
  imports: [MessagingModule],
  providers: [DrizzleService],
  exports: [DrizzleService, MessagingModule],
})
export class SharedModule {}
