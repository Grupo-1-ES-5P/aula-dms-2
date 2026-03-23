import { AuthService } from "@auth/application/services/auth.service";
import { AuthController } from "@auth/infra/controllers/auth.controller";
import { JwtAuthGuard } from "@auth/infra/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/infra/guards/permissions.guard";
import { UsersModule } from "@users/users.module";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true, // JwtService disponível em qualquer módulo
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },     // 1º roda
    { provide: APP_GUARD, useClass: PermissionsGuard }, // 2º roda
  ],
})
export class AuthModule {}
