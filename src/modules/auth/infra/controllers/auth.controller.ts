import { AuthService, type LoginDto } from "@auth/application/services/auth.service";
import {
  CurrentUser,
  type AuthenticatedUser,
} from "@shared/infra/decorators/current-user.decorator";
import { Public } from "@shared/infra/decorators/public.decorator";
import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public() // ← única rota sem autenticação
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get("me")
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return { id: user.sub, email: user.email, permissions: user.permissions };
  }
}
