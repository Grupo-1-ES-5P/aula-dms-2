import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "@shared/infra/decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // se a rota não tem @RequirePermissions, qualquer usuário autenticado pode acessar
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasPermission = required.every((p) => user?.permissions?.includes(p));
    if (!hasPermission) throw new ForbiddenException("Insufficient permissions");

    return true;
  }
}
