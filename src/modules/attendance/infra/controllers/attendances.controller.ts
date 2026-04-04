import { CreateAttendanceDto } from "@attendance/application/dto/create-attendance.dto";
import { AttendanceService } from "@attendance/application/services/attendance.service";
import { Body, Controller, Get, Post, Query, Param } from "@nestjs/common";
// import { Permission } from "@shared/enums/permission.enum";
// import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { RegisterAttendanceDto } from "@attendance/application/dto/register-attendance.dto";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiOperation, ApiQuery, ApiNotFoundResponse, ApiNoContentResponse } from "@nestjs/swagger";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";
import { AttendanceDto } from "@attendance/application/dto/attendance.dto";

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
  @HateoasList<AttendanceDto>({
    basePath: "/attendances",
    itemLinks: (item) => ({
      self: { href: `/student/${item.studentId}/class-offering/${item.classOfferingId}`, method: "GET" },
      create: { href: "/attendances", method: "POST" },
    }),
  })
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
  @HateoasList<AttendanceDto>({
    basePath: "/attendances",
    itemLinks: (item) => ({
      self: { href: `/class-offering/${item.classOfferingId}`, method: "GET" },
      create: { href: "/attendances", method: "POST" },
    }),
  })
  //@RequirePermissions(Permission.ATTENDANCES_READ)
  async findByClassOffering(@Param("classOfferingId") classOfferingId: string) {
    return this.attendanceService.findByClassOffering(classOfferingId);
  }

  @Post()
  @ApiOperation({summary: "Registrar chamada/presença"})
  //@RequirePermissions(Permission.ATTENDANCES_WRITE)
  async register(@Body() body: CreateAttendanceDto) {
    return this.attendanceService.register(body);
  }
}
