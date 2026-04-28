import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PublishAttendanceMessageDto {
  @ApiProperty({
    example:
      '{"studentId":"83cb77a8-0f87-4f0b-8adf-70a7ffde58f3","lessonId":"8baf97f3-510f-4ce7-9710-cf93debefcad","classOfferingId":"705d0e42-18d1-46b3-81cb-eb03da0af595","status":"present"}',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
