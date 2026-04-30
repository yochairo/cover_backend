import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificacionesService } from './verificaciones.service';
import { VerificacionesController } from './verificaciones.controller';
import { VerificacionIdentidad } from '../entities/verificacion-identidad.entity';
import { Persona } from '../entities/persona.entity';
import { Personal } from '../entities/personal.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([VerificacionIdentidad, Persona, Personal]), AuthModule],
  controllers: [VerificacionesController],
  providers: [VerificacionesService],
})
export class VerificacionesModule {}
