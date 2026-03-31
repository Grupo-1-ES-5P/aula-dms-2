import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class CreateAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsNotEmpty()
  classOfferingId: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}
