import { UserService } from "@users/application/services/user.service";
import { USER_REPOSITORY } from "@users/domain/repositories/user-repository.interface";
import { DrizzleUserRepository } from "@users/infra/repositories/drizzle-user.repository";
import { Module } from "@nestjs/common";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
  providers: [
    UserService,
    DrizzleUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: DrizzleUserRepository,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
