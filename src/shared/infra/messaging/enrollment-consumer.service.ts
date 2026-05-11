import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

export const ENROLLMENT_CREATED_QUEUE = "attendance.enrollment.created.queue";
export const ENROLLMENT_CANCELED_QUEUE = "attendance.enrollment.canceled.queue";

export const ENROLLMENT_CREATED_EXCHANGE = "enrollment.created.exchange";
export const ENROLLMENT_CANCELED_EXCHANGE = "enrollment.canceled.exchange";

export const ENROLLMENT_CREATED_ROUTING_KEY = "enrollment.created";
export const ENROLLMENT_CANCELED_ROUTING_KEY = "enrollment.canceled";

//Interface do evento recebido
export interface EnrollmentEvent {
    enrollmentId: string,
    studentId: string,
    classOfferingId: string,
    status: "active" | "inactive",
    enrolledAt: string,
    canceledAt: string,
    createdAt: string,
    updatedAt: string,
}

//Consumer Service
@Injectable()
export class EnrollmentConsumerService implements OnModuleInit {
  private readonly logger = new Logger(EnrollmentConsumerService.name);

  constructor(private readonly rabbitmqService: RabbitMQService) {}

  async onModuleInit(): Promise<void> {
    await this.initializeQueues();
    await this.startConsuming();
  }

  private async initializeQueues(): Promise<void> {
    try {
      await this.rabbitmqService.declareExchange(
        ENROLLMENT_CREATED_EXCHANGE,
        "direct",
      );
      await this.rabbitmqService.declareQueue(ENROLLMENT_CREATED_QUEUE);
      await this.rabbitmqService.bindQueue(
        ENROLLMENT_CREATED_QUEUE,
        ENROLLMENT_CREATED_EXCHANGE,
        ENROLLMENT_CREATED_ROUTING_KEY,
      );

      await this.rabbitmqService.declareExchange(
        ENROLLMENT_CANCELED_EXCHANGE,
        "direct",
      );
      await this.rabbitmqService.declareQueue(ENROLLMENT_CANCELED_QUEUE);
      await this.rabbitmqService.bindQueue(
        ENROLLMENT_CANCELED_QUEUE,
        ENROLLMENT_CANCELED_EXCHANGE,
        ENROLLMENT_CANCELED_ROUTING_KEY,
      );

      this.logger.log("filas de enrollment inicializadas com sucesso");
    } catch (error) {
      this.logger.error("falha ao inicializar as filas de enrollment", error);
    }
  }

  private async startConsuming(): Promise<void> {
    await this.rabbitmqService.consumeMessage(
      ENROLLMENT_CREATED_QUEUE,
      (msg) => this.handleCreated(msg),
    );

    await this.rabbitmqService.consumeMessage(
      ENROLLMENT_CANCELED_QUEUE,
      (msg) => this.handleCanceled(msg),
    );
  }

  private async handleCreated(msg: any): Promise<void> {
    const event: EnrollmentEvent = JSON.parse(msg.content.toString());
    this.logger.log(`Class offering created: ${event.classOfferingId}`);
  }

  private async handleCanceled(msg: any): Promise<void> {
    const event: EnrollmentEvent = JSON.parse(msg.content.toString());
    this.logger.log(`Class offering canceled: ${event.classOfferingId}`);
  }
}
