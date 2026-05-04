import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceMessagingService } from "@attendance/application/services/attendance-messaging.service";
import { ATTENDANCE_REPOSITORY } from "@attendance/domain/repositories/attendance-repository.interface";
import { AttendanceMessagingController } from "@attendance/infra/controllers/attendance-messaging.controller";
import { AttendancesController } from "@attendance/infra/controllers/attendances.controller";
import { RabbitMQService } from "@attendance/infra/rabbitmq/rabbitmq.service";
import { DrizzleAttendanceRepository } from "@attendance/infra/repositories/drizzle-attendance.repository";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule, ConfigModule],
  controllers: [AttendancesController, AttendanceMessagingController],
  providers: [
    AttendanceService,
    AttendanceMessagingService,
    RabbitMQService,
    DrizzleAttendanceRepository,
    {
      provide: ATTENDANCE_REPOSITORY,
      useExisting: DrizzleAttendanceRepository,
    },
  ],
})
export class AttendanceModule {}
