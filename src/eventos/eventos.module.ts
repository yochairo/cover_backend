// src/eventos/eventos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { Evento } from '../entities/evento.entity';
import { Discoteca } from '../entities/discoteca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evento, Discoteca])],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}