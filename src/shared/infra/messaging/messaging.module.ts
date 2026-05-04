import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AttendancePublisherService } from "./attendance-publisher.service";
import { ClassOfferingConsumerService } from "./class-offering-consumer.service";
import { RabbitMQService } from "./rabbitmq.service";

@Module({
  imports: [ConfigModule],
  providers: [
    RabbitMQService,
    AttendancePublisherService,
    ClassOfferingConsumerService,
  ],
  exports: [
    RabbitMQService,
    AttendancePublisherService,
    ClassOfferingConsumerService,
  ],
})
export class MessagingModule {}
