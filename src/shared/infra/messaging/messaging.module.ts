import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { AttendancePublisherService } from './attendance-publisher.service';

@Module({
  imports: [ConfigModule],
  providers: [RabbitMQService, AttendancePublisherService],
  exports: [RabbitMQService, AttendancePublisherService],
})
export class MessagingModule {}
