import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Permission } from "@shared/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiOperation, ApiQuery, ApiNotFoundResponse, ApiNoContentResponse } from "@nestjs/swagger";

@ApiTags("attendances")
@ApiBearerAuth()
@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: "Listar presenças por turma ou por aluno e turma" })
  @ApiQuery({ name: "class_offering_id", required: true, type: String })
  @ApiQuery({ name: "student_id", required: false, type: String })
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
  @ApiOperation({summary: "Registrar chamada/presença"})
  //@RequirePermissions(Permission.ATTENDANCES_WRITE)
  async register(
    @Body() body: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ) {
    return this.attendanceService.register(body);
  }
}
