import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any;
  private channel: any;
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly rabbitmqUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost';
    this.logger.log(`RabbitMQ URL: ${this.rabbitmqUrl}`);
  }

  async onModuleInit() {
    this.logger.log('Starting RabbitMQ connection...');
    this.connect().catch((error) => {
      this.logger.error(`Failed to connect to RabbitMQ on startup: ${error}`);
    });
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      this.logger.log(`Connecting to RabbitMQ at ${this.rabbitmqUrl}`);
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      this.logger.log('✅ Connected to RabbitMQ');
    } catch (error) {
      this.logger.error(`❌ Failed to connect to RabbitMQ: ${error}`);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async declareExchange(exchangeName: string, type: string = 'topic') {
    try {
      await this.waitForChannel();
      await this.channel.assertExchange(exchangeName, type, { durable: true });
      this.logger.log(`✅ Exchange "${exchangeName}" declared successfully`);
    } catch (error) {
      this.logger.error(`Failed to declare exchange "${exchangeName}"`, error);
      throw error;
    }
  }

  private async waitForChannel(maxAttempts: number = 30) {
    let attempts = 0;
    while (!this.channel && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available');
    }
  }

  async declareQueue(queueName: string, options = {}) {
    try {
      await this.waitForChannel();
      const result = await this.channel.assertQueue(queueName, { durable: true, ...options });
      this.logger.log(`✅ Queue "${queueName}" declared successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to declare queue "${queueName}"`, error);
      throw error;
    }
  }

  async bindQueue(queueName: string, exchangeName: string, routingKey: string) {
      await this.waitForChannel();
    try {
      await this.channel.bindQueue(queueName, exchangeName, routingKey);
      this.logger.log(`✅ Queue "${queueName}" bound to exchange "${exchangeName}" with routing key "${routingKey}"`);
    } catch (error) {
      this.logger.error(`Failed to bind queue "${queueName}"`, error);
      throw error;
    }
  }

  async publishMessage(exchangeName: string, routingKey: string, message: any) {
      await this.waitForChannel();
    try {
      const buffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(exchangeName, routingKey, buffer, { persistent: true });
      this.logger.debug(`📨 Message published to exchange "${exchangeName}" with routing key "${routingKey}"`);
    } catch (error) {
      this.logger.error('Failed to publish message', error);
      throw error;
    }
  }

  async consumeMessage(queueName: string, onMessage: (msg: any) => Promise<void>) {
      await this.waitForChannel();
    try {
      await this.channel.consume(queueName, async (msg: any) => {
        if (msg) {
          try {
            await onMessage(msg);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error('Error processing message', error);
            this.channel.nack(msg, false, true);
          }
        }
      });
      this.logger.log(`Consuming messages from queue "${queueName}"`);
    } catch (error) {
      this.logger.error(`Failed to consume messages from queue "${queueName}"`, error);
      throw error;
    }
  }

  private async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }

  getChannel(): any {
    return this.channel;
  }
}
