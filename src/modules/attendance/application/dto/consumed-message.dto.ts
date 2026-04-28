import { ApiProperty } from "@nestjs/swagger";

export class ConsumedMessageDto {
  @ApiProperty({
    example:
      '{"studentId":"83cb77a8-0f87-4f0b-8adf-70a7ffde58f3","lessonId":"8baf97f3-510f-4ce7-9710-cf93debefcad","classOfferingId":"705d0e42-18d1-46b3-81cb-eb03da0af595","status":"present"}',
  })
  content: string;

  @ApiProperty({ example: "attendance.academic-students.created.queue" })
  queue: string;

  static from(queue: string, content: string): ConsumedMessageDto {
    const dto = new ConsumedMessageDto();
    dto.content = content;
    dto.queue = queue;
    return dto;
  }
}
