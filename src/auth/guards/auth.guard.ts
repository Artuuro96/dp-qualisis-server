import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AcmaClient } from 'src/client/acma.client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly acmaClient: AcmaClient,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    let token;
    try {
      token = request.get('authorization').replace('Bearer', '').trim();
    } catch (error) {
      throw new UnauthorizedException('No token found');
    }

    await this.acmaClient.authRequest(token);

    const user = await this.jwtService.decode(token);
    request.user = user;

    return true;
  }
}
