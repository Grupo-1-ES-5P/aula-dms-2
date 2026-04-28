import { ConsumeQueueDto } from "@attendance/application/dto/consume-queue.dto";
import { ConsumedMessageDto } from "@attendance/application/dto/consumed-message.dto";
import { PublishAttendanceMessageDto } from "@attendance/application/dto/publish-attendance-message.dto";
import { AttendanceMessagingService } from "@attendance/application/services/attendance-messaging.service";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@shared/infra/decorators/public.decorator";

@ApiTags("attendance-messaging")
@Controller("attendance/messaging")
export class AttendanceMessagingController {
  constructor(
    private readonly attendanceMessagingService: AttendanceMessagingService,
  ) {}

  @Post("queues")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      "Criar/assegurar as filas consumidoras do attendance e fazer os bindings",
  })
  async createConsumerQueues(): Promise<void> {
    return this.attendanceMessagingService.createAttendanceConsumerQueues();
  }

  @Post("setup")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar filas e bindings do módulo attendance" })
  async setup(): Promise<void> {
    return this.attendanceMessagingService.setupAttendanceTopology();
  }

  @Post("publish")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Publicar mensagem em attendance.registered.exchange",
  })
  async publish(@Body() body: PublishAttendanceMessageDto): Promise<void> {
    return this.attendanceMessagingService.publishAttendanceRegistered(body);
  }

  @Get("consume")
  @Public()
  @ApiOperation({
    summary: "Consumir a próxima mensagem de uma fila do módulo attendance",
  })
  async consume(@Query() query: ConsumeQueueDto): Promise<ConsumedMessageDto> {
    return this.attendanceMessagingService.consumeFromQueue(query);
  }

  @Get("queues")
  @Public()
  @ApiOperation({
    summary: "Listar filas consumidoras disponíveis no módulo attendance",
  })
  getAvailableQueues(): string[] {
    return this.attendanceMessagingService.getAvailableQueues();
  }
}
