import { CreateUserDto } from "@users/application/dto/user.dto";
import { UserService } from "@users/application/services/user.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async a() {
    return "ok";
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
