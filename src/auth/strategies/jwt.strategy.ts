import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../common/enums/roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'clave',
    });
  }

  async validate(payload: any) {
    if (!payload.id || !payload.rol) {
      throw new UnauthorizedException('Token inválido');
    }

    // Validar que el rol sea válido
    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(payload.rol)) {
      throw new UnauthorizedException('Rol inválido');
    }

    return { userId: payload.id, rol: payload.rol };
  }
}
