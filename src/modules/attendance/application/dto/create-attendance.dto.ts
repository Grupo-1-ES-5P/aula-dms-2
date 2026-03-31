import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";

export class CreateAttendanceDto {
  studentId: string;
  lessonId: string;
  classOfferingId: string;
  status: AttendanceStatus;
}
