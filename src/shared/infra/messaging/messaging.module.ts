import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AttendancePublisherService } from "./attendance-publisher.service";
import { ClassOfferingConsumerService } from "./class-offering-consumer.service";
import { EnrollmentConsumerService } from "@shared/infra/messaging/enrollment-consumer.service";
import { RabbitMQService } from "./rabbitmq.service";

@Module({
  imports: [ConfigModule],
  providers: [
    RabbitMQService,
    AttendancePublisherService,
    ClassOfferingConsumerService,
    EnrollmentConsumerService,
  ],
  exports: [
    RabbitMQService,
    AttendancePublisherService,
    ClassOfferingConsumerService,
    EnrollmentConsumerService,
  ],
})
export class MessagingModule {}
