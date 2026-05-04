import { ConsumeQueueDto } from "@attendance/application/dto/consume-queue.dto";
import { ConsumedMessageDto } from "@attendance/application/dto/consumed-message.dto";
import { PublishAttendanceMessageDto } from "@attendance/application/dto/publish-attendance-message.dto";
import {
  ATTENDANCE_CONSUMER_BINDINGS,
  ATTENDANCE_CONSUMER_QUEUE_NAMES,
  ATTENDANCE_REGISTERED_EXCHANGE,
  ATTENDANCE_REGISTERED_ROUTING_KEY,
} from "@attendance/infra/rabbitmq/attendance-messaging.constants";
import { RabbitMQService } from "@attendance/infra/rabbitmq/rabbitmq.service";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class AttendanceMessagingService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async createAttendanceConsumerQueues(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    for (const binding of ATTENDANCE_CONSUMER_BINDINGS) {
      await channel.assertQueue(binding.queueName, { durable: true });
      await channel.bindQueue(
        binding.queueName,
        binding.exchangeName,
        binding.routingKey,
      );
    }
  }

  async setupAttendanceTopology(): Promise<void> {
    await this.createAttendanceConsumerQueues();
  }

  async publishAttendanceRegistered(
    dto: PublishAttendanceMessageDto,
  ): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    channel.publish(
      ATTENDANCE_REGISTERED_EXCHANGE,
      ATTENDANCE_REGISTERED_ROUTING_KEY,
      Buffer.from(dto.content),
      { persistent: true },
    );
  }

  async consumeFromQueue(query: ConsumeQueueDto): Promise<ConsumedMessageDto> {
    const channel = this.rabbitMQService.getChannel();

    await channel.assertQueue(query.queue, { durable: true });
    const msg = await channel.get(query.queue, { noAck: false });

    if (!msg) {
      throw new NotFoundException("No messages in queue");
    }

    channel.ack(msg);
    return ConsumedMessageDto.from(query.queue, msg.content.toString());
  }

  getAvailableQueues(): string[] {
    return [...ATTENDANCE_CONSUMER_QUEUE_NAMES];
  }
}
