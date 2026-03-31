import { CreateAttendanceDto } from "@attendance/application/dto/create-attendance.dto";
import { AttendanceService } from "@attendance/application/services/attendance.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get("student/:studentId/class-offering/:classOfferingId")
  //@RequirePermissions(Permission.ATTENDANCES_READ)
  async findByStudent(
    @Param("studentId") studentId: string,
    @Param("classOfferingId") classOfferingId: string,
  ) {
    return this.attendanceService.findByStudentAndClassOffering(
      studentId,
      classOfferingId,
    );
  }

  @Get("class-offering/:classOfferingId")
  //@RequirePermissions(Permission.ATTENDANCES_READ)
  async findByClassOffering(@Param("classOfferingId") classOfferingId: string) {
    return this.attendanceService.findByClassOffering(classOfferingId);
  }

  @Post()
  //@RequirePermissions(Permission.ATTENDANCES_WRITE)
  async register(@Body() body: CreateAttendanceDto) {
    return this.attendanceService.register(body);
  }
}
