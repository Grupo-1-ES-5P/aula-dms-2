import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

export const ATTENDANCE_EXCHANGE = 'attendance.exchange';
export const ATTENDANCE_REGISTERED_ROUTING_KEY = 'attendance.registered';

export interface AttendanceRegisteredEvent {
  attendanceId: string;
  studentId: string;
  classOfferingId: string;
  timestamp: Date;
}

@Injectable()
export class AttendancePublisherService implements OnModuleInit {
  private readonly logger = new Logger(AttendancePublisherService.name);

  constructor(private readonly rabbitmqService: RabbitMQService) {}

  async onModuleInit() {
    await this.initializeExchange();
  }

  private async initializeExchange() {
    try {
      await this.rabbitmqService.declareExchange(ATTENDANCE_EXCHANGE, 'topic');
      this.logger.log('Attendance exchange initialized');
    } catch (error) {
      this.logger.error('Failed to initialize attendance exchange', error);
    }
  }

  async publishAttendanceRegistered(event: AttendanceRegisteredEvent): Promise<void> {
    try {
      await this.rabbitmqService.publishMessage(
        ATTENDANCE_EXCHANGE,
        ATTENDANCE_REGISTERED_ROUTING_KEY,
        event,
      );
      this.logger.log(
        `Attendance registered event published for student: ${event.studentId}`,
      );
    } catch (error) {
      this.logger.error('Failed to publish attendance registered event', error);
      throw error;
    }
  }
}
