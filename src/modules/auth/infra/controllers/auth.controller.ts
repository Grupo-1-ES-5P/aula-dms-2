import { AuthService, type LoginDto } from "@auth/application/services/auth.service";
import { Public } from "@shared/infra/decorators/public.decorator";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public() // ← única rota sem autenticação
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
