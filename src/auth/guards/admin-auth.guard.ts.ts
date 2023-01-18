// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // if (request?.user?.role !== 'ADMIN') throw new UnauthorizedException();
    return request;
  }
}
