import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser, JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // Fail-fast: no permitimos arrancar sin secret real.
      throw new Error(
        'JWT_SECRET no está configurado. Define la variable de entorno antes de iniciar el servidor.',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload?.userId || !payload?.rol) {
      throw new UnauthorizedException('Token inválido');
    }
    return {
      userId: payload.userId,
      rol: payload.rol,
      clienteId: payload.clienteId,
      personalId: payload.personalId,
    };
  }
}
