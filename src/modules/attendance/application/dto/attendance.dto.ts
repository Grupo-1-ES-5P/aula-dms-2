import type { Attendance } from "@attendance/domain/models/attendance.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AttendanceDto {
    @ApiProperty({example: "Ana Luiza"})
    @IsString()
    @IsNotEmpty()
    studentId: string;

    @ApiProperty({example: "3"})
    @IsString()
    @IsNotEmpty()
    lessonId: string;

    @ApiProperty({example: "34"})
    @IsString()
    @IsNotEmpty()
    classOfferingId: string;

    @ApiProperty({example: "present"})
    @IsString()
    @IsNotEmpty()
    status: string;

    private constructor(
        studentId: string,
        lessonId: string,
        classOfferingId: string,
        status: string,
    ) {
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.classOfferingId = classOfferingId;
        this.status = status;
    }
  


  public static from(attendance: Attendance | null): AttendanceDto | null {
    if (!attendance) return null;
    return new AttendanceDto(
      attendance.studentId,
      attendance.lessonId,
      attendance.classOfferingId,
      attendance.status,
    );
  }
}
