import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { Evento } from '../entities/evento.entity';
import { Discoteca } from '../entities/discoteca.entity';
import { Colectivo } from '../entities/colectivo.entity';
import { Personal } from '../entities/personal.entity';
import { ColectivoAdministrador } from '../entities/colectivo-administrador.entity';
import { PersonalDiscoteca } from '../entities/personal-discoteca.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evento,
      Discoteca,
      Colectivo,
      Personal,
      ColectivoAdministrador,
      PersonalDiscoteca,
    ]),
    AuthModule,
  ],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}
