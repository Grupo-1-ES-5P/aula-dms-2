import { ATTENDANCE_CONSUMER_QUEUE_NAMES } from "@attendance/infra/rabbitmq/attendance-messaging.constants";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export class ConsumeQueueDto {
  @ApiProperty({
    enum: ATTENDANCE_CONSUMER_QUEUE_NAMES,
    example: ATTENDANCE_CONSUMER_QUEUE_NAMES[0],
  })
  @IsIn(ATTENDANCE_CONSUMER_QUEUE_NAMES)
  queue: (typeof ATTENDANCE_CONSUMER_QUEUE_NAMES)[number];
}
