import { CreateAttendanceDto } from "@attendance/application/dto/create-attendance.dto";
import { AttendanceService } from "@attendance/application/services/attendance.service";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
// import { Permission } from "@shared/enums/permission.enum";
// import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  // @RequirePermissions(Permission.ATTENDANCES_READ)
  async findAll(
    @Query("class_offering_id") classOfferingId: string,
    @Query("student_id") studentId?: string,
  ) {
    if (studentId) {
      return this.attendanceService.findByStudentAndClassOffering(
        studentId,
        classOfferingId,
      );
    }
    return this.attendanceService.findByClassOffering(classOfferingId);
  }

  @Post()
  // @RequirePermissions(Permission.ATTENDANCES_WRITE)
  async register(@Body() body: CreateAttendanceDto) {
    return this.attendanceService.register(body);
  }
}
