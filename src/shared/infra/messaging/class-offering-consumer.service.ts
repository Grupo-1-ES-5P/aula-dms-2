import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

// ── Constantes de exchange, fila e routing key ──────────────────────────────
// O attendance é CONSUMIDOR dessas exchanges (criadas pelo class-offering).
// Cada fila pertence ao attendance: "attendance.class-offering.<evento>.queue"

export const CLASS_OFFERING_CREATED_EXCHANGE =
  "class-offering.created.exchange";
export const CLASS_OFFERING_UPDATED_EXCHANGE =
  "class-offering.updated.exchange";
export const CLASS_OFFERING_CANCELED_EXCHANGE =
  "class-offering.canceled.exchange";

export const CLASS_OFFERING_CREATED_QUEUE =
  "attendance.class-offering.created.queue";
export const CLASS_OFFERING_UPDATED_QUEUE =
  "attendance.class-offering.updated.queue";
export const CLASS_OFFERING_CANCELED_QUEUE =
  "attendance.class-offering.canceled.queue";

export const CLASS_OFFERING_CREATED_ROUTING_KEY = "class-offering.created";
export const CLASS_OFFERING_UPDATED_ROUTING_KEY = "class-offering.updated";
export const CLASS_OFFERING_CANCELED_ROUTING_KEY = "class-offering.canceled";

//Interface do evento recebido
export interface ClassOfferingEvent {
  classOfferingId: string;
  subjectId: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  timestamp: string;
}

//Consumer Service
@Injectable()
export class ClassOfferingConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ClassOfferingConsumerService.name);

  constructor(private readonly rabbitmqService: RabbitMQService) {}

  async onModuleInit(): Promise<void> {
    await this.initializeQueues();
    await this.startConsuming();
  }

  private async initializeQueues(): Promise<void> {
    try {
      // created
      await this.rabbitmqService.declareExchange(
        CLASS_OFFERING_CREATED_EXCHANGE,
        "direct",
      );
      await this.rabbitmqService.declareQueue(CLASS_OFFERING_CREATED_QUEUE);
      await this.rabbitmqService.bindQueue(
        CLASS_OFFERING_CREATED_QUEUE,
        CLASS_OFFERING_CREATED_EXCHANGE,
        CLASS_OFFERING_CREATED_ROUTING_KEY,
      );

      // updated
      await this.rabbitmqService.declareExchange(
        CLASS_OFFERING_UPDATED_EXCHANGE,
        "direct",
      );
      await this.rabbitmqService.declareQueue(CLASS_OFFERING_UPDATED_QUEUE);
      await this.rabbitmqService.bindQueue(
        CLASS_OFFERING_UPDATED_QUEUE,
        CLASS_OFFERING_UPDATED_EXCHANGE,
        CLASS_OFFERING_UPDATED_ROUTING_KEY,
      );

      // canceled
      await this.rabbitmqService.declareExchange(
        CLASS_OFFERING_CANCELED_EXCHANGE,
        "direct",
      );
      await this.rabbitmqService.declareQueue(CLASS_OFFERING_CANCELED_QUEUE);
      await this.rabbitmqService.bindQueue(
        CLASS_OFFERING_CANCELED_QUEUE,
        CLASS_OFFERING_CANCELED_EXCHANGE,
        CLASS_OFFERING_CANCELED_ROUTING_KEY,
      );

      this.logger.log("Class-offering queues initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize class-offering queues", error);
    }
  }

  private async startConsuming(): Promise<void> {
    await this.rabbitmqService.consumeMessage(
      CLASS_OFFERING_CREATED_QUEUE,
      (msg) => this.handleCreated(msg),
    );

    await this.rabbitmqService.consumeMessage(
      CLASS_OFFERING_UPDATED_QUEUE,
      (msg) => this.handleUpdated(msg),
    );

    await this.rabbitmqService.consumeMessage(
      CLASS_OFFERING_CANCELED_QUEUE,
      (msg) => this.handleCanceled(msg),
    );
  }

  //Handlers

  private async handleCreated(msg: any): Promise<void> {
    const event: ClassOfferingEvent = JSON.parse(msg.content.toString());
    this.logger.log(`Class offering created: ${event.classOfferingId}`);
  }

  private async handleUpdated(msg: any): Promise<void> {
    const event: ClassOfferingEvent = JSON.parse(msg.content.toString());
    this.logger.log(`Class offering updated: ${event.classOfferingId}`);

    //atualizar os dados locais do class-offering (datas, status e tal).
  }

  private async handleCanceled(msg: any): Promise<void> {
    const event: ClassOfferingEvent = JSON.parse(msg.content.toString());
    this.logger.log(`Class offering canceled: ${event.classOfferingId}`);

    //reagir ao cancelamento, ex: marcar presenças relacionadas, bloquear novos registros para esse classOfferingId, e pa
  }
}
